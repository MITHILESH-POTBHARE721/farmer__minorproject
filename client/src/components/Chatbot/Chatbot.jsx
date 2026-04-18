import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, Sprout, ShoppingCart, Tractor, FileText, BarChart3, Home } from 'lucide-react';

const Chatbot = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  const role = user?.role || 'guest';

  // Welcome message based on user role
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages = {
        farmer: "Hello Farmer! 👋 I'm your SmartAgri assistant. I can help you with:\n\n• Listing your products\n• Renting out equipment\n• Crop predictions\n• Checking government schemes\n• Viewing your sales\n\nWhat would you like to do today?",
        buyer: "Hello User! 👋 I'm your SmartAgri assistant. I can help you with:\n\n• Finding fresh produce\n• Browsing equipment rentals\n• Tracking your orders\n• Exploring government schemes\n\nWhat are you looking for today?",
        guest: "Welcome to SmartAgri! 👋 I'm here to help you.\n\n• Farmers can sell products & rent equipment\n• Buyers can purchase fresh produce\n• Everyone can explore government schemes\n\nPlease login or register to get started!"
      };

      setMessages([
        {
          id: 1,
          type: 'bot',
          text: welcomeMessages[role] || welcomeMessages.guest
        }
      ]);
    }
  }, [isOpen, role, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = {
    farmer: [
      { label: 'Add Product', icon: Sprout, path: '/farmer/products/add', description: 'List your farm produce' },
      { label: 'Add Equipment', icon: Tractor, path: '/farmer/equipment/add', description: 'Rent out your equipment' },
      { label: 'Crop Prediction', icon: BarChart3, path: '/farmer/prediction', description: 'Get AI crop recommendations' },
      { label: 'View Sales', icon: ShoppingCart, path: '/farmer/sales', description: 'Check your earnings' },
      { label: 'My Products', icon: Sprout, path: '/farmer/products', description: 'Manage your listings' },
      { label: 'Schemes', icon: FileText, path: '/schemes', description: 'Government benefits' },
    ],
    buyer: [
      { label: 'Browse Products', icon: Sprout, path: '/products', description: 'Fresh farm produce' },
      { label: 'Equipment Rental', icon: Tractor, path: '/equipment', description: 'Rent farming tools' },
      { label: 'My Orders', icon: ShoppingCart, path: '/buyer/orders', description: 'Track your purchases' },
      { label: 'My Cart', icon: ShoppingCart, path: '/buyer/cart', description: 'View your cart' },
      { label: 'Schemes', icon: FileText, path: '/schemes', description: 'Government benefits' },
      { label: 'Home', icon: Home, path: '/', description: 'Go to homepage' },
    ],
    guest: [
      { label: 'Login', icon: User, path: '/login', description: 'Access your account' },
      { label: 'Register', icon: User, path: '/register', description: 'Create new account' },
      { label: 'Browse Products', icon: Sprout, path: '/products', description: 'View marketplace' },
      { label: 'Equipment', icon: Tractor, path: '/equipment', description: 'View rentals' },
      { label: 'Schemes', icon: FileText, path: '/schemes', description: 'Government schemes' },
      { label: 'Home', icon: Home, path: '/', description: 'Go to homepage' },
    ]
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowQuickActions(false);

    // Generate bot response
    setTimeout(() => {
      const response = generateResponse(inputMessage.toLowerCase());
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        actions: response.actions
      }]);
    }, 500);
  };

  const generateResponse = (message) => {
    const responses = {
      farmer: {
        keywords: {
          'sell': { text: 'To sell your products, click "Add Product" below or go to My Products page.', actions: ['Add Product', 'My Products'] },
          'product': { text: 'You can add new products or manage existing ones from your dashboard.', actions: ['Add Product', 'My Products'] },
          'equipment': { text: 'Rent out your farming equipment to earn extra income!', actions: ['Add Equipment', 'My Equipment'] },
          'rent': { text: 'List your equipment for rent and earn when it\'s not in use.', actions: ['Add Equipment'] },
          'crop': { text: 'Get AI-powered crop recommendations based on your soil and weather!', actions: ['Crop Prediction'] },
          'predict': { text: 'Our ML model can suggest the best crops for your farm.', actions: ['Crop Prediction'] },
          'sale': { text: 'View your sales and earnings in the My Sales section.', actions: ['View Sales'] },
          'order': { text: 'Check your sales and order status here.', actions: ['View Sales'] },
          'scheme': { text: 'Explore government schemes and subsidies available for farmers.', actions: ['Schemes'] },
          'government': { text: 'Find subsidies, loans, and benefits from the government.', actions: ['Schemes'] },
          'help': { text: 'I can help you with:\n• Adding products\n• Renting equipment\n• Crop predictions\n• Viewing sales\n• Finding schemes\n\nWhat do you need?', actions: ['Add Product', 'Add Equipment', 'Crop Prediction'] },
        }
      },
      buyer: {
        keywords: {
          'buy': { text: 'Browse fresh produce directly from farmers!', actions: ['Browse Products'] },
          'product': { text: 'Find fresh fruits, vegetables, grains and more from local farmers.', actions: ['Browse Products'] },
          'equipment': { text: 'Rent farming equipment for your needs.', actions: ['Equipment Rental'] },
          'rent': { text: 'Find tractors, harvesters, and tools for rent.', actions: ['Equipment Rental'] },
          'order': { text: 'View your order history and track current orders.', actions: ['My Orders'] },
          'cart': { text: 'Check items in your shopping cart.', actions: ['My Cart'] },
          'scheme': { text: 'Explore schemes and benefits available.', actions: ['Schemes'] },
          'help': { text: 'I can help you with:\n• Finding products\n• Renting equipment\n• Tracking orders\n• Viewing your cart\n\nWhat do you need?', actions: ['Browse Products', 'Equipment Rental', 'My Orders'] },
        }
      },
      guest: {
        keywords: {
          'login': { text: 'Please login to access all features.', actions: ['Login'] },
          'register': { text: 'Create an account to start buying or selling!', actions: ['Register'] },
          'product': { text: 'Browse our marketplace (login required to purchase).', actions: ['Browse Products'] },
          'equipment': { text: 'View available equipment rentals.', actions: ['Equipment'] },
          'help': { text: 'Please login or register to get full access to SmartAgri features!', actions: ['Login', 'Register'] },
        }
      }
    };

    const userResponses = responses[role] || responses.guest;
    
    for (const [keyword, response] of Object.entries(userResponses.keywords)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // Default response
    const defaultResponses = {
      farmer: { text: 'I am not sure about that. Try asking about selling products, renting equipment, crop predictions, or government schemes.', actions: ['Add Product', 'Crop Prediction', 'Schemes'] },
      buyer: { text: 'I am not sure about that. Try asking about buying products, renting equipment, or your orders.', actions: ['Browse Products', 'My Orders'] },
      guest: { text: 'Please login or register to access more features!', actions: ['Login', 'Register'] }
    };

    return defaultResponses[role] || defaultResponses.guest;
  };

  const handleQuickAction = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-primary-600 p-4 flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">SmartAgri Assistant</h3>
              <p className="text-primary-100 text-xs">
                {isAuthenticated ? `Helping ${role}` : 'Welcome Guest'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary-100' : 'bg-gray-100'}`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-primary-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl whitespace-pre-line ${
                      message.type === 'user' 
                        ? 'bg-primary-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {message.actions && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-10">
                    {message.actions.map((actionLabel) => {
                      const action = quickActions[role].find(a => a.label === actionLabel);
                      if (!action) return null;
                      const Icon = action.icon;
                      return (
                        <button
                          key={actionLabel}
                          onClick={() => handleQuickAction(action.path)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors"
                        >
                          <Icon className="h-3 w-3" />
                          <span>{actionLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Grid */}
          {showQuickActions && (
            <div className="p-4 bg-gray-50 border-t">
              <p className="text-xs text-gray-500 mb-3">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions[role]?.slice(0, 4).map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.path)}
                      className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
                    >
                      <Icon className="h-4 w-4 text-primary-600" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{action.label}</p>
                        <p className="text-[10px] text-gray-500">{action.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
