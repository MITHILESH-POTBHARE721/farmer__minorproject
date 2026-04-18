# Smart Agriculture Platform 🌾

A comprehensive full-stack web application built with MERN stack (MongoDB, Express.js, React, Node.js) and integrated AI/ML crop prediction system to empower farmers.

## Features ✨

### 1. **AI-Powered Crop Prediction**
- Machine Learning model (Random Forest) with 94.58% accuracy
- Considers soil type, season, irrigation, weather, and location
- Provides top 3 crop recommendations with confidence scores
- Real-time weather data integration via OpenWeatherMap API

### 2. **Farmer Marketplace**
- Buy and sell fresh produce directly
- Advanced search and filtering
- Shopping cart functionality
- Multiple payment options (Online & Cash on Delivery)
- Order tracking and management

### 3. **Equipment Rental System**
- Rent farming equipment (tractors, harvesters, tools, etc.)
- List your own equipment for extra income
- Booking calendar and approval system
- Manage rental requests

### 4. **Government Schemes**
- Browse government agriculture schemes
- State-wise filtering
- Eligibility criteria and benefits information
- Direct links to apply

### 5. **Smart Chatbot**
- Role-aware assistant (Farmer/Buyer/Guest)
- Quick navigation help
- Contextual suggestions
- Instant redirect to relevant pages

### 6. **Payment System**
- Online payment gateway integration
- Cash on delivery option
- Payment received confirmation for farmers
- Complete payment history tracking

## Tech Stack 🛠

### Frontend
- **React** (Vite) - UI Library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads

### ML Service
- **Python Flask** - API
- **Scikit-learn** - ML framework
- **Random Forest Classifier** - Model
- **Pandas & NumPy** - Data processing
- **Requests** - API calls

## Project Structure 📁

```
farmermern/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route pages
│   │   ├── context/        # React Context
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   └── public/
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, uploads
│   └── config/             # Database config
├── ml-service/             # Python Flask ML API
│   ├── model/              # Trained models
│   ├── data/               # Training datasets
│   └── app.py              # Flask application
└── .gitignore
```

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd farmermern
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install ML service dependencies
cd ../ml-service
pip install flask flask-cors scikit-learn pandas numpy requests python-dotenv joblib
```

3. **Set up environment variables**

Create `.env` files in each directory:

**Root `.env`:**
```env
# Not needed at root level
```

**Server `server/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-agriculture
JWT_SECRET=your_jwt_secret_here
OPENWEATHER_API_KEY=your_openweathermap_api_key
NODE_ENV=development
```

**Client `client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

**ML Service `ml-service/.env`:**
```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
FLASK_PORT=5001
```

4. **Train the ML model**
```bash
cd ml-service
python train_model.py
```

5. **Seed the database (optional)**
```bash
cd ..
npm run seed
```

### Running the Application

**Option 1: Run all services together (Recommended)**
```bash
npm run dev
```

**Option 2: Run services individually**

Terminal 1 - Server:
```bash
cd server
npm run dev
```

Terminal 2 - Client:
```bash
cd client
npm run dev
```

Terminal 3 - ML Service:
```bash
cd ml-service
python app.py
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:5001

## Demo Credentials 🔑

### Farmer Account
- Email: farmer1@example.com
- Password: farmer123

### Buyer Account
- Email: buyer1@example.com
- Password: buyer123

### Admin Account
- Email: admin@example.com
- Password: admin123

## API Endpoints 📡

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add product (Farmer)
- `PUT /api/products/:id` - Update product (Farmer)
- `DELETE /api/products/:id` - Delete product (Farmer)

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Add equipment (Farmer)
- `PUT /api/equipment/:id` - Update equipment (Farmer)
- `DELETE /api/equipment/:id` - Delete equipment (Farmer)

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order (Buyer)
- `PUT /api/orders/:id/status` - Update status (Farmer)
- `PUT /api/orders/:id/payment-received` - Confirm payment (Farmer)

### ML Prediction
- `POST /api/predictions/predict` - Get crop prediction

## Dataset Information 📊

The ML model is trained on a synthetic crop recommendation dataset with the following features:
- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Temperature
- Humidity
- pH
- Rainfall

Supported crops (12): Rice, Wheat, Maize, Cotton, Sugarcane, Groundnut, Soybean, Tomato, Potato, Onion, Chickpea, Lentil

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License.

## Contact 📧

**Project Creator**: mithileshpotbhare721829@gcoea.ac.in  
**Phone**: +91 7218196543  
**Address**: At. Post. Tah. Parseoni, Dist. Nagpur

## Acknowledgments 🙏

- OpenWeatherMap for weather data API
- Government of India for agricultural scheme data
- Farming community for valuable feedback

---

Made with ❤️ for Indian Farmers
