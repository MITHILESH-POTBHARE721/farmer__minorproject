import { useState, useEffect } from 'react';
import { getSchemes, getSchemeCategories } from '../services/schemeService';
import { Search, FileText, ExternalLink, MapPin, Loader2, RefreshCw, Phone, Mail, Globe } from 'lucide-react';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    state: '',
  });

  const states = ['All India', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Karnataka'];

  useEffect(() => {
    fetchCategories();
    fetchSchemes();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await getSchemeCategories();
      setCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.state) params.state = filters.state;

      const res = await getSchemes(params);
      setSchemes(res.data.data);
    } catch (err) {
      console.error('Error fetching schemes:', err);
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
      category: '',
      state: '',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      subsidy: 'bg-green-100 text-green-800',
      loan: 'bg-blue-100 text-blue-800',
      insurance: 'bg-purple-100 text-purple-800',
      training: 'bg-orange-100 text-orange-800',
      equipment: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Government Schemes</h1>
            <p className="text-gray-600 mt-2">
              Explore and apply for various government schemes and subsidies for farmers
            </p>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Real-time data from Government of India
            </p>
          </div>
          <button
            onClick={fetchSchemes}
            disabled={loading}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="search"
              placeholder="Search schemes..."
              value={filters.search}
              onChange={handleFilterChange}
              className="input pl-10"
            />
          </div>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
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

      {/* Schemes Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : schemes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No schemes found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`badge ${getCategoryColor(scheme.category)}`}>
                    {scheme.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {scheme.applicableStates.includes('All India')
                      ? 'All India'
                      : scheme.applicableStates.length + ' States'}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {scheme.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {scheme.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Benefits:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                      {scheme.benefits.length > 2 && (
                        <li>+{scheme.benefits.length - 2} more</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Eligibility:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {scheme.eligibility.slice(0, 2).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                      {scheme.eligibility.length > 2 && (
                        <li>+{scheme.eligibility.length - 2} more</li>
                      )}
                    </ul>
                  </div>

                  {scheme.documentsRequired && scheme.documentsRequired.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Documents Required:</h4>
                      <p className="text-sm text-gray-600">
                        {scheme.documentsRequired.slice(0, 3).join(', ')}
                        {scheme.documentsRequired.length > 3 && ` +${scheme.documentsRequired.length - 3} more`}
                      </p>
                    </div>
                  )}

                  {scheme.contactInfo && (
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Contact Information:</h4>
                      <div className="space-y-1">
                        {scheme.contactInfo.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {scheme.contactInfo.phone}
                          </div>
                        )}
                        {scheme.contactInfo.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {scheme.contactInfo.email}
                          </div>
                        )}
                        {scheme.contactInfo.website && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Globe className="h-3 w-3 mr-1" />
                            Official Website
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {scheme.applicationLink && (
                  <a
                    href={scheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schemes;
