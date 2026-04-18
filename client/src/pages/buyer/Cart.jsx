import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderService';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, CreditCard, Banknote } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    const newCart = cart.map((item) =>
      item._id === id ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item._id !== id);
    saveCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Prepare order items
      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      // Create order with default shipping address
      const orderData = {
        items,
        shippingAddress: {
          street: 'To be confirmed',
          city: 'To be confirmed',
          state: 'To be confirmed',
          pincode: '000000',
          phone: '0000000000',
        },
        paymentMethod,
      };

      await createOrder(orderData);

      // Clear cart after successful order
      localStorage.removeItem('cart');
      setCart([]);

      alert('Order placed successfully!');
      navigate('/buyer/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="text-gray-600 mb-4">Add some products to get started</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
              >
                <div className="h-20 w-20 bg-gray-200 rounded-lg flex-shrink-0">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000${item.images[0]}`}
                      alt={item.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">
                    ₹{item.price}/{item.unit}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
              <div className="space-y-2">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'online' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <CreditCard className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Online Payment</p>
                    <p className="text-xs text-gray-500">Pay securely with UPI/Card/NetBanking</p>
                  </div>
                </label>
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'cash_on_delivery' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <Banknote className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive the order</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>{paymentMethod === 'online' ? 'Pay & Place Order' : 'Place Order (Cash on Delivery)'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            <Link
              to="/products"
              className="block text-center mt-4 text-primary-600 hover:text-primary-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
