import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Phone,
  User,
  ShoppingCart,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProduct(id);
      setProduct(res.data.data);
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item) => item._id === product._id);

    let newCart;
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      newCart = existingCart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new product to cart
      newCart = [
        ...existingCart,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          images: product.images,
          quantity: quantity,
        },
      ];
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(newCart));

    alert(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/products')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Products
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
            {product.images && product.images.length > 0 ? (
              <img
                src={`http://localhost:5000${product.images[0]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <ShoppingCart className="h-24 w-24" />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-24">
                  <img
                    src={`http://localhost:5000${img}`}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="badge bg-primary-100 text-primary-800 mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-primary-600">
              ₹{product.price}
            </span>
            <span className="text-gray-500">per {product.unit}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
            <p className="text-gray-600">
              {product.quantity} {product.unit} available
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {product.location.city}, {product.location.state}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                {product.farmer?.name}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                {product.farmer?.phone}
              </div>
            </div>
          </div>

          {user?.role !== 'farmer' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-gray-700">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="input w-24"
                />
                <span className="text-gray-500">{product.unit}</span>
              </div>
            </div>
          )}

          {user?.role !== 'farmer' && (
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
