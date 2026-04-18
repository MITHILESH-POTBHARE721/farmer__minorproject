import { useState, useEffect } from 'react';
import { getOrders } from '../../services/orderService';
import { Loader2, Package, CreditCard, Banknote, CheckCircle } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
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
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track your orders and rentals</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-600">Your orders will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">
                    #{order._id.slice(-6)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg">
                          {item.product?.images?.[0] && (
                            <img
                              src={`http://localhost:5000${item.product.images[0]}`}
                              alt={item.product.name}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x ₹{item.price}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">
                        ₹{item.quantity * item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-primary-600">
                    ₹{order.totalAmount}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    {order.paymentMethod === 'online' ? (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Online Payment</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="h-4 w-4" />
                        <span>Cash on Delivery</span>
                      </>
                    )}
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>{order.paymentMethod === 'online' ? 'Paid' : 'Payment Received'}</span>
                      </>
                    ) : (
                      <span>Payment Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
