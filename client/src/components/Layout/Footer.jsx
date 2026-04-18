import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Sprout className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">SmartAgri</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Empowering farmers with technology. AI-driven crop predictions,
              marketplace, equipment rentals, and government schemes - all in one
              platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-primary-400 transition-colors">
                  Equipment Rental
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-primary-400 transition-colors">
                  Government Schemes
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/farmer/prediction" className="hover:text-primary-400 transition-colors">
                  Crop Prediction
                </Link>
              </li>
              <li>
                <span className="hover:text-primary-400 transition-colors cursor-pointer">
                  Sell Products
                </span>
              </li>
              <li>
                <span className="hover:text-primary-400 transition-colors cursor-pointer">
                  Rent Equipment
                </span>
              </li>
              <li>
                <span className="hover:text-primary-400 transition-colors cursor-pointer">
                  Buy Crops
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary-400" />
                <span>mithileshpotbhare721829@gcoea.ac.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary-400" />
                <span>+91 7218196543</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5" />
                <span>At. Post. Tah. Parseoni,<br />Dist. Nagpur</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SmartAgri. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
