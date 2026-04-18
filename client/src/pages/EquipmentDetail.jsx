import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipmentById } from '../services/equipmentService';
import { createRental } from '../services/rentalService';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Phone,
  User,
  Tractor,
  ArrowLeft,
  Loader2,
  Calendar,
} from 'lucide-react';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentalData, setRentalData] = useState({
    startDate: '',
    endDate: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const res = await getEquipmentById(id);
      setEquipment(res.data.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await createRental({
        equipmentId: id,
        ...rentalData,
      });
      alert('Rental request submitted successfully!');
      navigate('/buyer/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rental request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Equipment not found</h2>
          <button
            onClick={() => navigate('/equipment')}
            className="mt-4 btn-primary"
          >
            Back to Equipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/equipment')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Equipment
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Equipment Images */}
        <div className="space-y-4">
          <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
            {equipment.images && equipment.images.length > 0 ? (
              <img
                src={`http://localhost:5000${equipment.images[0]}`}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Tractor className="h-24 w-24" />
              </div>
            )}
          </div>
        </div>

        {/* Equipment Info */}
        <div className="space-y-6">
          <div>
            <span className="badge bg-secondary-100 text-secondary-800 mb-2">
              {equipment.type}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
            <p className="text-gray-600 mt-2">{equipment.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Daily Rate</p>
              <p className="text-2xl font-bold text-primary-600">
                ₹{equipment.dailyRate}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Hourly Rate</p>
              <p className="text-2xl font-bold text-primary-600">
                ₹{equipment.hourlyRate || 'N/A'}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {equipment.location.city}, {equipment.location.state}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Owner Information</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                {equipment.owner?.name}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                {equipment.owner?.phone}
              </div>
            </div>
          </div>

          {/* Rental Form */}
          {user?.role !== 'farmer' && (
            <form onSubmit={handleRentalSubmit} className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Request Rental
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Date</label>
                    <input
                      type="date"
                      value={rentalData.startDate}
                      onChange={(e) =>
                        setRentalData({ ...rentalData, startDate: e.target.value })
                      }
                      className="input"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <input
                      type="date"
                      value={rentalData.endDate}
                      onChange={(e) =>
                        setRentalData({ ...rentalData, endDate: e.target.value })
                      }
                      className="input"
                      required
                      min={rentalData.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Message (Optional)</label>
                  <textarea
                    value={rentalData.message}
                    onChange={(e) =>
                      setRentalData({ ...rentalData, message: e.target.value })
                    }
                    className="input"
                    rows="3"
                    placeholder="Add any specific requirements..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-3 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    'Request Rental'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
