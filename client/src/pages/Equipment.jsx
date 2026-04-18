import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEquipment, deleteEquipment } from '../services/equipmentService';
import { useAuth } from '../context/AuthContext';
import { Search, Tractor, MapPin, Calendar, Loader2, Plus, Edit, Trash2 } from 'lucide-react';

const Equipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    state: '',
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) {
      return;
    }
    try {
      await deleteEquipment(id);
      fetchEquipment();
    } catch (err) {
      alert('Failed to delete equipment');
    }
  };

  const types = ['tractor', 'harvester', 'seeder', 'sprayer', 'tiller', 'tools'];
  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Karnataka'];

  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.state) params.state = filters.state;

      const res = await getEquipment(params);
      setEquipment(res.data.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      state: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Rental</h1>
          <p className="text-gray-600 mt-2">
            Rent farming equipment or list your own for extra income
          </p>
        </div>
        {user?.role === 'farmer' && (
          <Link
            to="/farmer/equipment/add"
            className="mt-4 md:mt-0 btn-primary flex items-center space-x-2 w-fit"
          >
            <Plus className="h-5 w-5" />
            <span>Add Equipment</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : equipment.length === 0 ? (
        <div className="text-center py-12">
          <Tractor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No equipment found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipment.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link to={`/equipment/${item._id}`}>
                <div className="h-48 bg-gray-200 relative">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000${item.images[0]}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Tractor className="h-12 w-12" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 badge bg-secondary-100 text-secondary-800">
                    {item.type}
                  </span>
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/equipment/${item._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location.city}, {item.location.state}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary-600">
                        ₹{item.dailyRate}
                      </span>
                      <span className="text-sm text-gray-500">/day</span>
                    </div>
                    {item.hourlyRate > 0 && (
                      <div className="text-sm text-gray-500">
                        ₹{item.hourlyRate}/hr
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    by {item.owner?.name}
                  </p>
                </Link>
                
                {/* Edit/Delete buttons for farmer's own equipment */}
                {user?.role === 'farmer' && item.owner?._id === user?.id && (
                  <div className="flex space-x-2 mt-3 pt-3 border-t">
                    <button
                      onClick={() => navigate(`/farmer/equipment/edit/${item._id}`)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Equipment;
