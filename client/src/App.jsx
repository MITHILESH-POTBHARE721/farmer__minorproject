import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Chatbot from './components/Chatbot/Chatbot';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Equipment from './pages/Equipment';
import EquipmentDetail from './pages/EquipmentDetail';
import Schemes from './pages/Schemes';

// Protected Pages - Farmer
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyProducts from './pages/farmer/MyProducts';
import AddProduct from './pages/farmer/AddProduct';
import EditProduct from './pages/farmer/EditProduct';
import MyEquipment from './pages/farmer/MyEquipment';
import AddEquipment from './pages/farmer/AddEquipment';
import EditEquipment from './pages/farmer/EditEquipment';
import CropPrediction from './pages/farmer/CropPrediction';
import RentalRequests from './pages/farmer/RentalRequests';
import MySales from './pages/farmer/MySales';

// Protected Pages - Buyer
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import Cart from './pages/buyer/Cart';
import MyOrders from './pages/buyer/MyOrders';

// Protected Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSchemes from './pages/admin/ManageSchemes';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
 return (
   <AuthProvider>
     <Router>
       <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />
              <Route path="/schemes" element={<Schemes />} />

              {/* Farmer Routes */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <MyProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products/add"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/equipment"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <MyEquipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/equipment/add"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <AddEquipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/equipment/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <EditEquipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/prediction"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <CropPrediction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/rentals"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <RentalRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/sales"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                    <MySales />
                  </ProtectedRoute>
                }
              />

              {/* Buyer Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['buyer', 'admin']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/cart"
                element={
                  <ProtectedRoute allowedRoles={['buyer', 'admin']}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/orders"
                element={
                  <ProtectedRoute allowedRoles={['buyer', 'admin']}>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/schemes"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageSchemes />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
     </Router>
   </AuthProvider>
  );
}

export default App;
