from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load the model
model = None
feature_names = None

def load_model():
    global model, feature_names
    try:
        model = joblib.load('model/crop_model.pkl')
        feature_names = joblib.load('model/feature_names.pkl')
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Please run train_model.py first to train the model.")

# Soil type adjustments (multipliers for N, P, K, pH)
SOIL_ADJUSTMENTS = {
    'clay': {'N': 1.0, 'P': 0.9, 'K': 1.1, 'ph': 1.0},
    'sandy': {'N': 0.8, 'P': 0.7, 'K': 0.6, 'ph': 0.95},
    'loamy': {'N': 1.1, 'P': 1.0, 'K': 1.0, 'ph': 1.0},
    'silty': {'N': 1.0, 'P': 1.0, 'K': 0.9, 'ph': 1.05},
    'peaty': {'N': 0.9, 'P': 0.8, 'K': 0.7, 'ph': 0.85},
    'chalky': {'N': 0.7, 'P': 0.9, 'K': 0.8, 'ph': 1.15},
}

# Season adjustments for temperature
SEASON_ADJUSTMENTS = {
    'summer': {'temp_offset': 5, 'rainfall_offset': -20},
    'winter': {'temp_offset': -5, 'rainfall_offset': -10},
    'monsoon': {'temp_offset': 0, 'rainfall_offset': 100},
    'spring': {'temp_offset': 2, 'rainfall_offset': 10},
    'autumn': {'temp_offset': -2, 'rainfall_offset': -5},
}

def get_weather_data(location):
    """Fetch weather data from OpenWeatherMap API"""
    api_key = os.getenv('OPENWEATHER_API_KEY')
    
    if not api_key or api_key == 'your_openweather_api_key_here':
        # Return default/mock data if no API key
        print("No OpenWeather API key found, using default values")
        return {
            'temperature': 25.0,
            'humidity': 65.0,
            'rainfall': 100.0  # mm (approximate annual/seasonal)
        }
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if response.status_code == 200:
            # Estimate rainfall (OpenWeather free tier doesn't provide forecast rainfall)
            # Using humidity as a proxy indicator
            humidity = data['main']['humidity']
            estimated_rainfall = max(20, humidity * 1.5)  # Rough estimation
            
            return {
                'temperature': data['main']['temp'],
                'humidity': humidity,
                'rainfall': estimated_rainfall
            }
        else:
            print(f"Weather API error: {data.get('message', 'Unknown error')}")
            return {
                'temperature': 25.0,
                'humidity': 65.0,
                'rainfall': 100.0
            }
    except Exception as e:
        print(f"Error fetching weather: {e}")
        return {
            'temperature': 25.0,
            'humidity': 65.0,
            'rainfall': 100.0
        }

def adjust_input_for_conditions(base_input, soil_type, season, irrigation):
    """Adjust input features based on soil type, season, and irrigation"""
    adjusted = base_input.copy()
    
    # Apply soil adjustments
    if soil_type.lower() in SOIL_ADJUSTMENTS:
        soil_adj = SOIL_ADJUSTMENTS[soil_type.lower()]
        adjusted['N'] *= soil_adj['N']
        adjusted['P'] *= soil_adj['P']
        adjusted['K'] *= soil_adj['K']
        adjusted['ph'] *= soil_adj['ph']
    
    # Apply season adjustments
    if season.lower() in SEASON_ADJUSTMENTS:
        season_adj = SEASON_ADJUSTMENTS[season.lower()]
        adjusted['temperature'] += season_adj['temp_offset']
        adjusted['rainfall'] += season_adj['rainfall_offset']
    
    # Apply irrigation adjustment
    if irrigation.lower() == 'drip':
        adjusted['rainfall'] *= 0.8  # Less water needed
    elif irrigation.lower() == 'sprinkler':
        adjusted['rainfall'] *= 0.9
    elif irrigation.lower() == 'flood':
        adjusted['rainfall'] *= 1.2  # More water
    
    # Ensure values are within reasonable bounds
    adjusted['N'] = np.clip(adjusted['N'], 0, 200)
    adjusted['P'] = np.clip(adjusted['P'], 0, 150)
    adjusted['K'] = np.clip(adjusted['K'], 0, 150)
    adjusted['temperature'] = np.clip(adjusted['temperature'], 0, 50)
    adjusted['humidity'] = np.clip(adjusted['humidity'], 0, 100)
    adjusted['ph'] = np.clip(adjusted['ph'], 4, 9)
    adjusted['rainfall'] = np.clip(adjusted['rainfall'], 0, 500)
    
    return adjusted

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Make crop prediction"""
    if model is None:
        return jsonify({
            'success': False,
            'message': 'Model not loaded. Please train the model first.'
        }), 500
    
    try:
        data = request.json
        
        # Get input parameters
        soil_type = data.get('soil_type', 'loamy')
        season = data.get('season', 'summer')
        irrigation = data.get('irrigation', 'drip')
        location = data.get('location', '')
        
        # Get base nutrient values
        base_input = {
            'N': float(data.get('nitrogen', 50)),
            'P': float(data.get('phosphorus', 50)),
            'K': float(data.get('potassium', 50)),
            'ph': float(data.get('ph', 6.5)),
            'temperature': 25.0,
            'humidity': 65.0,
            'rainfall': 100.0
        }
        
        # Get weather data for location
        weather = get_weather_data(location)
        base_input['temperature'] = weather['temperature']
        base_input['humidity'] = weather['humidity']
        base_input['rainfall'] = weather['rainfall']
        
        # Adjust inputs based on conditions
        adjusted_input = adjust_input_for_conditions(
            base_input, soil_type, season, irrigation
        )
        
        # Prepare features for prediction
        features = np.array([[
            adjusted_input['N'],
            adjusted_input['P'],
            adjusted_input['K'],
            adjusted_input['temperature'],
            adjusted_input['humidity'],
            adjusted_input['ph'],
            adjusted_input['rainfall']
        ]])
        
        # Get prediction probabilities
        probabilities = model.predict_proba(features)[0]
        
        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]
        predictions = []
        
        for idx in top_indices:
            crop = model.classes_[idx]
            confidence = float(probabilities[idx])
            predictions.append({
                'crop': crop,
                'confidence': round(confidence * 100, 2)
            })
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'weather': {
                'temperature': round(weather['temperature'], 2),
                'humidity': round(weather['humidity'], 2),
                'rainfall': round(weather['rainfall'], 2)
            },
            'input_features': adjusted_input
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Prediction error: {str(e)}'
        }), 500

@app.route('/crops', methods=['GET'])
def get_crops():
    """Get list of all crops the model can predict"""
    if model is None:
        return jsonify({
            'success': False,
            'message': 'Model not loaded'
        }), 500
    
    return jsonify({
        'success': True,
        'crops': list(model.classes_)
    })

if __name__ == '__main__':
    load_model()
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
