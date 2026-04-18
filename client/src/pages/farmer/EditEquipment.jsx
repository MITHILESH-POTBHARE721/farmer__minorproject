import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipmentById, updateEquipment } from '../../services/equipmentService';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';

const EditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'tractor',
    hourlyRate: '',
    dailyRate: '',
    location: {
      state: '',
      city: '',
    },
    availability: {
      isAvailable: true,
    },
  });
  const [images, setImages] = useState([]);

  const types = ['tractor', 'harvester', 'seeder', 'sprayer', 'tiller', 'tools', 'other'];
  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Karnataka', 'Delhi'];

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const res = await getEquipmentById(id);
      const equipment = res.data.data;
      setFormData({
        name: equipment.name,
        description: equipment.description || '',
        type: equipment.type,
        hourlyRate: equipment.hourlyRate || '',
        dailyRate: equipment.dailyRate,
        location: equipment.location,
        availability: equipment.availability,
      });
    } catch (err) {
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value },
      });
    } else if (name === 'isAvailable') {
      setFormData({
        ...formData,
        availability: { ...formData.availability, isAvailable: checked },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'location' || key === 'availability') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    images.forEach((image) => {
      data.append('images', image);
    });

    try {
      await updateEquipment(id, data);
      navigate('/farmer/equipment');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update equipment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/farmer/equipment')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Equipment
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Equipment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Equipment Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="input"
            />
          </div>

          <div>
            <label className="label">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Hourly Rate (₹)</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="0"
                className="input"
              />
            </div>
            <div>
              <label className="label">Daily Rate (₹)</label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                required
                min="0"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">State</label>
              <select
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.availability.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Available for rent
            </label>
          </div>

          <div>
            <label className="label">Update Images (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/farmer/equipment')}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Update Equipment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEquipment;
