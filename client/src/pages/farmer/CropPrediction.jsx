import { useState, useEffect } from 'react';
import { getPrediction } from '../../services/predictionService';
import {
  Sprout,
  CloudSun,
  Droplets,
  Thermometer,
  Loader2,
  BarChart3,
  MapPin,
  Crosshair,
} from 'lucide-react';

const CropPrediction = () => {
  const [formData, setFormData] = useState({
    soilType: 'loamy',
    season: 'summer',
    irrigation: 'drip',
    location: '',
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    ph: 6.5,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const soilTypes = ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky'];
  const seasons = ['summer', 'winter', 'monsoon', 'spring', 'autumn'];
  const irrigationTypes = ['drip', 'sprinkler', 'flood', 'rainfed'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get city name from coordinates
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key'}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              const city = data[0].name;
              setFormData((prev) => ({ ...prev, location: city }));
            } else {
              // Fallback: use coordinates as location
              setFormData((prev) => ({ 
                ...prev, 
                location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` 
              }));
            }
          } else {
            // Fallback: use coordinates as location
            setFormData((prev) => ({ 
              ...prev, 
              location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` 
            }));
          }
        } catch (err) {
          setLocationError('Failed to get location name. Please enter manually.');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access or enter manually.');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable. Please enter manually.');
            break;
          case err.TIMEOUT:
            setLocationError('Location request timed out. Please try again or enter manually.');
            break;
          default:
            setLocationError('An error occurred while getting location. Please enter manually.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await getPrediction(formData);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Sprout className="h-8 w-8 mr-3 text-primary-600" />
          AI Crop Prediction
        </h1>
        <p className="text-gray-600 mt-2">
          Get intelligent crop recommendations based on your soil conditions, weather, and location
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Prediction Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Enter Farm Details
          </h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Soil Type</label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="input"
                >
                  {soilTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Season</label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="input"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Irrigation Type</label>
                <select
                  name="irrigation"
                  value={formData.irrigation}
                  onChange={handleChange}
                  className="input"
                >
                  {irrigationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Location (City)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Delhi, Mumbai"
                    className="input pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors disabled:opacity-50"
                    title="Use my current location"
                  >
                    {locationLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Crosshair className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {locationError && (
                  <p className="mt-1 text-sm text-red-600">{locationError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Click the target icon to auto-detect your location
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Soil Nutrients (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nitrogen (N)</label>
                  <input
                    type="number"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleChange}
                    min="0"
                    max="200"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phosphorus (P)</label>
                  <input
                    type="number"
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleChange}
                    min="0"
                    max="150"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Potassium (K)</label>
                  <input
                    type="number"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleChange}
                    min="0"
                    max="150"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">pH Level</label>
                  <input
                    type="number"
                    name="ph"
                    value={formData.ph}
                    onChange={handleChange}
                    min="4"
                    max="9"
                    step="0.1"
                    className="input"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Get Crop Prediction'
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Weather Info */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CloudSun className="h-5 w-5 mr-2" />
                  Current Weather at {formData.location}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Thermometer className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{result.weather.temperature}°C</p>
                    <p className="text-sm text-blue-100">Temperature</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{result.weather.humidity}%</p>
                    <p className="text-sm text-blue-100">Humidity</p>
                  </div>
                  <div className="text-center">
                    <CloudSun className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{result.weather.rainfall}mm</p>
                    <p className="text-sm text-blue-100">Est. Rainfall</p>
                  </div>
                </div>
              </div>

              {/* Predictions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-primary-600" />
                  Top Recommended Crops
                </h3>
                <div className="space-y-4">
                  {result.predictions.map((prediction, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-gray-900 capitalize">
                          {prediction.crop}
                        </h4>
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="flex-grow bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getConfidenceColor(
                                  prediction.confidence
                                )}`}
                                style={{ width: `${prediction.confidence}%` }}
                              />
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-700">
                              {prediction.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <Sprout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Ready to Predict
              </h3>
              <p className="text-gray-600 mt-2">
                Fill in your farm details and click "Get Crop Prediction" to see AI-powered recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropPrediction;
