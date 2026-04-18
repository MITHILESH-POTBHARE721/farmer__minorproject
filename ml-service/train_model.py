import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Create directories if they don't exist
os.makedirs('model', exist_ok=True)
os.makedirs('data', exist_ok=True)

def create_sample_dataset():
    """Create a sample crop recommendation dataset if no dataset exists"""
    
    # Define crop data based on agricultural knowledge
    crops_data = []
    
    # Rice - requires high rainfall, high humidity, clay soil
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(80, 120),
            'P': np.random.randint(40, 60),
            'K': np.random.randint(40, 60),
            'temperature': np.random.uniform(20, 30),
            'humidity': np.random.uniform(80, 100),
            'ph': np.random.uniform(5.5, 7.0),
            'rainfall': np.random.uniform(200, 300),
            'label': 'rice'
        })
    
    # Wheat - requires moderate temperature, low humidity
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(60, 100),
            'P': np.random.randint(30, 50),
            'K': np.random.randint(30, 50),
            'temperature': np.random.uniform(15, 25),
            'humidity': np.random.uniform(40, 60),
            'ph': np.random.uniform(6.0, 7.5),
            'rainfall': np.random.uniform(50, 150),
            'label': 'wheat'
        })
    
    # Maize - warm weather, moderate rainfall
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(70, 110),
            'P': np.random.randint(35, 55),
            'K': np.random.randint(35, 55),
            'temperature': np.random.uniform(18, 28),
            'humidity': np.random.uniform(50, 70),
            'ph': np.random.uniform(5.8, 7.0),
            'rainfall': np.random.uniform(60, 120),
            'label': 'maize'
        })
    
    # Cotton - requires warm climate, moderate rainfall
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(90, 130),
            'P': np.random.randint(30, 50),
            'K': np.random.randint(30, 50),
            'temperature': np.random.uniform(20, 32),
            'humidity': np.random.uniform(60, 80),
            'ph': np.random.uniform(6.0, 7.5),
            'rainfall': np.random.uniform(50, 100),
            'label': 'cotton'
        })
    
    # Sugarcane - high water requirement
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(70, 110),
            'P': np.random.randint(40, 60),
            'K': np.random.randint(40, 60),
            'temperature': np.random.uniform(22, 32),
            'humidity': np.random.uniform(70, 90),
            'ph': np.random.uniform(5.5, 7.5),
            'rainfall': np.random.uniform(150, 250),
            'label': 'sugarcane'
        })
    
    # Groundnut - moderate requirements
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(30, 60),
            'P': np.random.randint(40, 60),
            'K': np.random.randint(20, 40),
            'temperature': np.random.uniform(20, 30),
            'humidity': np.random.uniform(50, 70),
            'ph': np.random.uniform(6.0, 7.5),
            'rainfall': np.random.uniform(40, 100),
            'label': 'groundnut'
        })
    
    # Soybean - moderate temperature, good rainfall
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(40, 70),
            'P': np.random.randint(50, 70),
            'K': np.random.randint(30, 50),
            'temperature': np.random.uniform(18, 26),
            'humidity': np.random.uniform(60, 80),
            'ph': np.random.uniform(6.0, 7.5),
            'rainfall': np.random.uniform(60, 140),
            'label': 'soybean'
        })
    
    # Tomato - warm weather, moderate water
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(80, 120),
            'P': np.random.randint(40, 60),
            'K': np.random.randint(60, 90),
            'temperature': np.random.uniform(18, 28),
            'humidity': np.random.uniform(60, 80),
            'ph': np.random.uniform(5.5, 7.0),
            'rainfall': np.random.uniform(40, 90),
            'label': 'tomato'
        })
    
    # Potato - cool weather
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(80, 120),
            'P': np.random.randint(50, 70),
            'K': np.random.randint(70, 100),
            'temperature': np.random.uniform(10, 22),
            'humidity': np.random.uniform(70, 85),
            'ph': np.random.uniform(5.0, 6.5),
            'rainfall': np.random.uniform(50, 120),
            'label': 'potato'
        })
    
    # Onion - moderate requirements
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(60, 90),
            'P': np.random.randint(40, 60),
            'K': np.random.randint(50, 80),
            'temperature': np.random.uniform(12, 24),
            'humidity': np.random.uniform(60, 75),
            'ph': np.random.uniform(5.8, 7.0),
            'rainfall': np.random.uniform(35, 80),
            'label': 'onion'
        })
    
    # Chickpea - dry climate, low rainfall
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(30, 60),
            'P': np.random.randint(50, 70),
            'K': np.random.randint(40, 60),
            'temperature': np.random.uniform(18, 28),
            'humidity': np.random.uniform(30, 50),
            'ph': np.random.uniform(5.5, 7.5),
            'rainfall': np.random.uniform(30, 70),
            'label': 'chickpea'
        })
    
    # Lentil - cool season, low water
    for _ in range(100):
        crops_data.append({
            'N': np.random.randint(20, 50),
            'P': np.random.randint(50, 70),
            'K': np.random.randint(30, 50),
            'temperature': np.random.uniform(15, 25),
            'humidity': np.random.uniform(40, 60),
            'ph': np.random.uniform(5.5, 7.0),
            'rainfall': np.random.uniform(25, 60),
            'label': 'lentil'
        })
    
    df = pd.DataFrame(crops_data)
    return df

def train_model():
    """Train the Random Forest model"""
    
    # Check if dataset exists
    dataset_path = 'data/crop_recommendation.csv'
    
    if os.path.exists(dataset_path):
        print("Loading existing dataset...")
        df = pd.read_csv(dataset_path)
    else:
        print("Creating sample dataset...")
        df = create_sample_dataset()
        df.to_csv(dataset_path, index=False)
        print(f"Sample dataset saved to {dataset_path}")
    
    print(f"Dataset shape: {df.shape}")
    print(f"Crops: {df['label'].unique()}")
    
    # Prepare features and target
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train the model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    model_path = 'model/crop_model.pkl'
    joblib.dump(model, model_path)
    print(f"\nModel saved to {model_path}")
    
    # Save feature names
    feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    joblib.dump(feature_names, 'model/feature_names.pkl')
    
    return model

if __name__ == '__main__':
    train_model()
