import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrders } from '../../services/orderService';
import { getRentals } from '../../services/rentalService';
import {
  ShoppingCart,
  Package,
  Tractor,
  TrendingUp,
  Loader2,
  ArrowRight,
} from 'lucide-react';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    rentals: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, rentalsRes] = await Promise.all([
        getOrders(),
        getRentals(),
      ]);

      setStats({
        orders: ordersRes.data.count,
        rentals: rentalsRes.data.count,
      });

      setRecentOrders(ordersRes.data.data.slice(0, 3));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your orders and equipment rentals
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/buyer/orders"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.orders}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </Link>

        <Link
          to="/buyer/cart"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cart</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                View
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
        </Link>

        <Link
          to="/equipment"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Rentals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.rentals}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Tractor className="h-6 w-6 text-white" />
            </div>
          </div>
        </Link>

        <Link
          to="/products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Browse</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                Products
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/products"
              className="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Package className="h-8 w-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-primary-700">
                Buy Products
              </span>
            </Link>
            <Link
              to="/equipment"
              className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Tractor className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-700">
                Rent Equipment
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              to="/buyer/orders"
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No orders yet</p>
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items?.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary-600">
                      ₹{order.totalAmount}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
