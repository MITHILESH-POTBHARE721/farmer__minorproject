import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
 const [formData, setFormData] = useState({
    email: '',
   password: '',
  });
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const { login } = useAuth();
 const navigate = useNavigate();

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

   const result = await login(formData.email, formData.password);

    if (result.success) {
     navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Sprout className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">SmartAgri</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
             className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
               name="email"
               type="email"
                autoComplete="email"
               required
                value={formData.email}
                onChange={handleChange}
               className="input mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                 name="password"
                 type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                 required
                  value={formData.password}
                  onChange={handleChange}
                 className="input pr-10"
                  placeholder="Enter your password"
                />
                <button
                 type="button"
                  onClick={() => setShowPassword(!showPassword)}
                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
               type="submit"
                disabled={loading}
               className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo credentials
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600">
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium">Farmer:</span> farmer1@example.com / farmer123
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium">Buyer:</span> buyer1@example.com / buyer123
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-medium">Admin:</span> admin@example.com / admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
