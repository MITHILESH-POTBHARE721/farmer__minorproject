import { Link } from 'react-router-dom';
import {
  Sprout,
  ShoppingCart,
  Tractor,
  FileText,
  BarChart3,
  CloudSun,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'AI Crop Prediction',
      description:
        'Get intelligent crop recommendations based on soil type, weather conditions, and location using our ML-powered system.',
      link: '/farmer/prediction',
      color: 'bg-blue-500',
    },
    {
      icon: ShoppingCart,
      title: 'Farmer Marketplace',
      description:
        'Buy and sell agricultural products directly. Connect with buyers and sellers without intermediaries.',
      link: '/products',
      color: 'bg-green-500',
    },
    {
      icon: Tractor,
      title: 'Equipment Rental',
      description:
        'Rent farming equipment like tractors, harvesters, and tools. Share your equipment when idle to earn extra income.',
      link: '/equipment',
      color: 'bg-orange-500',
    },
    {
      icon: FileText,
      title: 'Government Schemes',
      description:
        'Stay updated with the latest government schemes, subsidies, and benefits available for farmers.',
      link: '/schemes',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                <CloudSun className="h-5 w-5" />
                <span className="text-sm font-medium">AI-Powered Agriculture Platform</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Smart Agriculture for a{' '}
                <span className="text-secondary-300">Brighter Tomorrow</span>
              </h1>
              <p className="text-lg lg:text-xl text-primary-100 mb-8 max-w-xl">
                Empowering farmers with cutting-edge technology. Get AI-driven crop
                predictions, sell your produce, rent equipment, and access government
                schemes - all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border border-primary-500"
                >
                  <span>Explore Marketplace</span>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/90 rounded-xl p-4 text-gray-900">
                      <Sprout className="h-8 w-8 text-primary-600 mb-2" />
                      <p className="text-sm text-gray-600">Recommended Crop</p>
                      <p className="text-lg font-bold">Wheat</p>
                      <p className="text-xs text-green-600">95% confidence</p>
                    </div>
                    <div className="bg-white/90 rounded-xl p-4 text-gray-900">
                      <CloudSun className="h-8 w-8 text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600">Weather</p>
                      <p className="text-lg font-bold">28°C</p>
                      <p className="text-xs text-gray-500">Humidity: 65%</p>
                    </div>
                    <div className="bg-white/90 rounded-xl p-4 text-gray-900 col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Market Price</p>
                          <p className="text-2xl font-bold text-primary-600">₹2,450/q</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Demand</p>
                          <p className="text-lg font-bold text-green-600">High</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools and services to help you
              make informed decisions and maximize your agricultural productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`${feature.color} p-6`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary-600 font-medium text-sm">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with SmartAgri in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description:
                  'Register as a farmer, buyer, or both. Complete your profile with your details.',
              },
              {
                step: '02',
                title: 'Explore Features',
                description:
                  'Access crop predictions, list products, rent equipment, or browse schemes.',
              },
              {
                step: '03',
                title: 'Grow Together',
                description:
                  'Connect with the community, make transactions, and grow your business.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-white text-secondary-700 px-8 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition-colors"
            >
              <span>Join Now - It's Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-secondary-100 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Free Registration</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
