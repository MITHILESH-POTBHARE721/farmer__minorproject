import { Link } from 'react-router-dom';
import { Users, Sprout, ShoppingCart, FileText, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '0', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Farmers', value: '0', icon: Sprout, color: 'bg-green-100 text-green-600' },
    { label: 'Buyers', value: '0', icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
    { label: 'Products Listed', value: '0', icon: BarChart3, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const quickLinks = [
    { title: 'Manage Schemes', path: '/admin/schemes', icon: FileText, description: 'Add/edit government schemes' },
    { title: 'User Management', path: '#', icon: Users, description: 'Manage user accounts' },
    { title: 'Product Moderation', path: '/products', icon: Sprout, description: 'Review product listings' },
    { title: 'Analytics', path: '#', icon: BarChart3, description: 'View platform statistics' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage the Smart Agriculture Platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`p-3 rounded-lg ${link.color === 'bg-blue-100' ? 'bg-blue-100' : 'bg-primary-100'} w-fit mb-4`}>
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
