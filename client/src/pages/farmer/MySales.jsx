import { useState, useEffect } from 'react';
import { getMySales, confirmPaymentReceived } from '../../services/orderService';
import { Loader2, TrendingUp, Package, DollarSign, RefreshCw, CreditCard, Banknote, CheckCircle, Check } from 'lucide-react';

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmingPayment, setConfirmingPayment] = useState(null);

  useEffect(() => {
    fetchSales();

    // Refresh data when window gains focus
    const handleFocus = () => {
      fetchSales();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchSales = async () => {
    try {
      const res = await getMySales();
      setSales(res.data.data);
      setTotalSales(res.data.totalSales);
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.pending;
  };

  const handleConfirmPayment = async (orderId) => {
    if (!window.confirm('Confirm that you have received the cash payment?')) {
      return;
    }
    setConfirmingPayment(orderId);
    try {
      await confirmPaymentReceived(orderId);
      fetchSales();
      alert('Payment confirmed successfully!');
    } catch (err) {
      alert('Failed to confirm payment');
    } finally {
      setConfirmingPayment(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Sales</h1>
          <p className="text-gray-600 mt-2">Track your sales and earnings</p>
        </div>
        <button
          onClick={fetchSales}
          disabled={loading}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSales}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{sales.length ? Math.round(totalSales / sales.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      {sales.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No sales yet</h3>
          <p className="text-gray-600">Your sales will appear here once orders are placed</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          {item.product?.name} x {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.buyer?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.buyer?.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      {order.paymentMethod === 'online' ? (
                        <>
                          <CreditCard className="h-4 w-4" />
                          <span>Online</span>
                        </>
                      ) : (
                        <>
                          <Banknote className="h-4 w-4" />
                          <span>Cash</span>
                        </>
                      )}
                    </div>
                    <div className={`flex items-center space-x-1 text-xs mt-1 ${
                      order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.paymentStatus === 'completed' ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>{order.paymentMethod === 'online' ? 'Paid' : 'Received'}</span>
                        </>
                      ) : (
                        <span>Pending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.paymentMethod === 'cash_on_delivery' && !order.paymentReceived && (
                      <button
                        onClick={() => handleConfirmPayment(order._id)}
                        disabled={confirmingPayment === order._id}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm disabled:opacity-50"
                      >
                        {confirmingPayment === order._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span>Mark Received</span>
                      </button>
                    )}
                    {order.paymentReceived && (
                      <span className="text-green-600 text-sm flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Received</span>
                      </span>
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

export default MySales;
