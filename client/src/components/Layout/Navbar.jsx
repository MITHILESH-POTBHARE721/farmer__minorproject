import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  Tractor,
  FileText,
  BarChart3,
  Home,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinks = () => {
    const commonLinks = [
      { to: '/', label: 'Home', icon: Home },
      { to: '/products', label: 'Marketplace', icon: ShoppingCart },
      { to: '/equipment', label: 'Equipment', icon: Tractor },
      { to: '/schemes', label: 'Schemes', icon: FileText },
    ];

    if (!isAuthenticated) {
      return commonLinks;
    }

    if (user?.role === 'farmer') {
      return [
        ...commonLinks,
        { to: '/farmer/dashboard', label: 'Dashboard', icon: BarChart3 },
        { to: '/farmer/prediction', label: 'Crop Prediction', icon: Sprout },
      ];
    }

    if (user?.role === 'buyer') {
      return [
        ...commonLinks,
        { to: '/buyer/dashboard', label: 'Dashboard', icon: BarChart3 },
        { to: '/buyer/cart', label: 'Cart', icon: ShoppingCart },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...commonLinks,
        { to: '/admin/dashboard', label: 'Admin', icon: BarChart3 },
      ];
    }

    return commonLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 shadow-lg border-b border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">
                SmartAgri
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 text-white hover:bg-primary-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm text-white font-medium">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, {user?.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 w-full px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 bg-primary-600 text-white rounded-md text-base font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
