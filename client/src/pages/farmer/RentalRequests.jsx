import { useState, useEffect } from 'react';
import { getRentals, updateRentalStatus } from '../../services/rentalService';
import { Loader2, Calendar, CheckCircle, XCircle, User } from 'lucide-react';

const RentalRequests = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await getRentals();
      // Filter only rentals where user is the owner
      setRentals(res.data.data.filter(r => r.owner?._id));
    } catch (err) {
      console.error('Error fetching rentals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateRentalStatus(id, status);
      fetchRentals();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rental Requests</h1>
        <p className="text-gray-600 mt-2">Manage requests for your equipment</p>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No rental requests</h3>
          <p className="text-gray-600">Requests for your equipment will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rentals.map((rental) => (
                <tr key={rental._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rental.equipment?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {rental.equipment?.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rental.renter?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rental.renter?.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{rental.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(rental.status)}`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {rental.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(rental._id, 'approved')}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <CheckCircle className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(rental._id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircle className="h-5 w-5 inline" />
                        </button>
                      </>
                    )}
                    {rental.status === 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(rental._id, 'completed')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RentalRequests;
