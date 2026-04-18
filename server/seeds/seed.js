const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Product = require('../models/Product');
const Equipment = require('../models/Equipment');
const GovernmentScheme = require('../models/GovernmentScheme');

// Load real government schemes
const { realGovernmentSchemes } = require('../utils/fetchGovernmentSchemes');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_agriculture');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
    address: {
      street: '123 Admin Street',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
  },
  {
    name: 'Rajesh Kumar',
    email: 'farmer1@example.com',
    password: 'farmer123',
    role: 'farmer',
    phone: '9876543211',
    address: {
      street: '45 Green Farm Road',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141001',
    },
  },
  {
    name: 'Sita Devi',
    email: 'farmer2@example.com',
    password: 'farmer123',
    role: 'farmer',
    phone: '9876543212',
    address: {
      street: '78 Rural Lane',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
    },
  },
  {
    name: 'Amit Singh',
    email: 'buyer1@example.com',
    password: 'buyer123',
    role: 'buyer',
    phone: '9876543213',
    address: {
      street: '89 Market Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
  },
  {
    name: 'Priya Sharma',
    email: 'buyer2@example.com',
    password: 'buyer123',
    role: 'buyer',
    phone: '9876543214',
    address: {
      street: '34 Commercial Area',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
  },
];

const products = [
  {
    name: 'Premium Basmati Rice',
    description: 'High-quality aromatic basmati rice, perfect for biryani and pulao.',
    category: 'grains',
    price: 120,
    quantity: 500,
    unit: 'kg',
    location: {
      state: 'Punjab',
      city: 'Ludhiana',
    },
    isAvailable: true,
  },
  {
    name: 'Organic Wheat',
    description: 'Organically grown wheat, free from pesticides.',
    category: 'grains',
    price: 35,
    quantity: 1000,
    unit: 'kg',
    location: {
      state: 'Punjab',
      city: 'Ludhiana',
    },
    isAvailable: true,
  },
  {
    name: 'Fresh Tomatoes',
    description: 'Farm-fresh red tomatoes, perfect for curries and salads.',
    category: 'vegetables',
    price: 40,
    quantity: 200,
    unit: 'kg',
    location: {
      state: 'Maharashtra',
      city: 'Nashik',
    },
    isAvailable: true,
  },
  {
    name: 'Alphonso Mangoes',
    description: 'Premium Alphonso mangoes from Ratnagiri. Sweet and juicy.',
    category: 'fruits',
    price: 400,
    quantity: 100,
    unit: 'kg',
    location: {
      state: 'Maharashtra',
      city: 'Ratnagiri',
    },
    isAvailable: true,
  },
  {
    name: 'Fresh Potatoes',
    description: 'High-quality potatoes suitable for all cooking purposes.',
    category: 'vegetables',
    price: 25,
    quantity: 500,
    unit: 'kg',
    location: {
      state: 'Uttar Pradesh',
      city: 'Agra',
    },
    isAvailable: true,
  },
  {
    name: 'Organic Chickpeas',
    description: 'Protein-rich organic chickpeas (chana).',
    category: 'grains',
    price: 90,
    quantity: 300,
    unit: 'kg',
    location: {
      state: 'Madhya Pradesh',
      city: 'Indore',
    },
    isAvailable: true,
  },
];

const equipment = [
  {
    name: 'Mahindra 575 DI Tractor',
    description: 'Powerful 45 HP tractor with excellent fuel efficiency.',
    type: 'tractor',
    hourlyRate: 800,
    dailyRate: 2500,
    location: {
      state: 'Punjab',
      city: 'Ludhiana',
    },
    availability: {
      isAvailable: true,
      bookedDates: [],
    },
  },
  {
    name: 'John Deere Harvester',
    description: 'Advanced combine harvester for wheat and rice.',
    type: 'harvester',
    hourlyRate: 2000,
    dailyRate: 8000,
    location: {
      state: 'Punjab',
      city: 'Ludhiana',
    },
    availability: {
      isAvailable: true,
      bookedDates: [],
    },
  },
  {
    name: 'Power Tiller',
    description: 'Compact power tiller suitable for small farms.',
    type: 'tiller',
    hourlyRate: 300,
    dailyRate: 1000,
    location: {
      state: 'Rajasthan',
      city: 'Jaipur',
    },
    availability: {
      isAvailable: true,
      bookedDates: [],
    },
  },
  {
    name: 'Sprayer Pump',
    description: 'Motorized sprayer pump for pesticide application.',
    type: 'sprayer',
    hourlyRate: 150,
    dailyRate: 500,
    location: {
      state: 'Maharashtra',
      city: 'Nashik',
    },
    availability: {
      isAvailable: true,
      bookedDates: [],
    },
  },
];

const schemes = [
  {
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Income support of Rs. 6000 per year in three equal installments to all landholding farmer families.',
    category: 'subsidy',
    eligibility: [
      'Small and marginal farmer families',
      'Landholding farmers',
      'Farmers with cultivable land'
    ],
    benefits: [
      'Rs. 6000 per year direct benefit transfer',
      'Three installments of Rs. 2000 each',
      'Direct transfer to bank account'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://pmkisan.gov.in',
    documentsRequired: [
      'Aadhaar Card',
      'Land Records',
      'Bank Account Details'
    ],
    isActive: true,
  },
  {
    title: 'Kisan Credit Card (KCC)',
    description: 'Provides farmers with timely access to credit for agricultural needs.',
    category: 'loan',
    eligibility: [
      'Individual farmers',
      'Tenant farmers',
      'Self-help groups'
    ],
    benefits: [
      'Short-term credit for cultivation',
      'Interest subvention at 2%',
      'Coverage for post-harvest expenses'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://www.nabard.org',
    documentsRequired: [
      'Identity Proof',
      'Land Documents',
      'Passport Size Photo'
    ],
    isActive: true,
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Comprehensive crop insurance to protect farmers against crop loss.',
    category: 'insurance',
    eligibility: [
      'All farmers growing notified crops',
      'Loanee and non-loanee farmers'
    ],
    benefits: [
      'Insurance coverage for crop loss',
      'Low premium rates',
      'Quick claim settlement'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://pmfby.gov.in',
    documentsRequired: [
      'Land Records',
      'Sowing Certificate',
      'Bank Account Details'
    ],
    isActive: true,
  },
  {
    title: 'Soil Health Card Scheme',
    description: 'Provides farmers with soil health cards containing information on soil nutrients.',
    category: 'other',
    eligibility: [
      'All farmers',
      'Priority to small and marginal farmers'
    ],
    benefits: [
      'Free soil testing',
      'Crop-wise recommendations',
      'Improved soil health management'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://soilhealth.dac.gov.in',
    documentsRequired: [
      'Identity Proof',
      'Land Documents'
    ],
    isActive: true,
  },
  {
    title: 'Agricultural Equipment Subsidy',
    description: 'Subsidy for purchase of agricultural machinery and equipment.',
    category: 'equipment',
    eligibility: [
      'Individual farmers',
      'Farmer cooperatives',
      'Self-help groups'
    ],
    benefits: [
      '40-50% subsidy on equipment',
      'Mechanization support',
      'Improved farm productivity'
    ],
    applicableStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
    applicationLink: 'https://farmmech.gov.in',
    documentsRequired: [
      'Identity Proof',
      'Land Documents',
      'Quotation from dealer'
    ],
    isActive: true,
  },
  {
    title: 'National Mission on Agricultural Extension',
    description: 'Training and extension services for farmers.',
    category: 'training',
    eligibility: [
      'Progressive farmers',
      'Farmers interested in modern techniques'
    ],
    benefits: [
      'Free training programs',
      'Exposure visits',
      'Demonstrations on new technologies'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://extension.gov.in',
    documentsRequired: [
      'Identity Proof',
      'Land Documents'
    ],
    isActive: true,
  },
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Equipment.deleteMany();
    await GovernmentScheme.deleteMany();

    console.log('Data cleared...');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users created`);

    // Get farmer IDs
    const farmers = createdUsers.filter((u) => u.role === 'farmer');
    
    // Create products with farmer references
    const productsWithFarmers = products.map((product, index) => ({
      ...product,
      farmer: farmers[index % farmers.length]._id,
    }));
    const createdProducts = await Product.create(productsWithFarmers);
    console.log(`${createdProducts.length} products created`);

    // Create equipment with farmer references
    const equipmentWithFarmers = equipment.map((equip, index) => ({
      ...equip,
      owner: farmers[index % farmers.length]._id,
    }));
    const createdEquipment = await Equipment.create(equipmentWithFarmers);
    console.log(`${createdEquipment.length} equipment created`);

    // Create schemes using real government data
    const createdSchemes = await GovernmentScheme.create(realGovernmentSchemes);
    console.log(`${createdSchemes.length} real government schemes created`);

    console.log('\nData imported successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Farmer: farmer1@example.com / farmer123');
    console.log('Buyer: buyer1@example.com / buyer123');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Equipment.deleteMany();
    await GovernmentScheme.deleteMany();

    console.log('Data destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Run import or delete based on command
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
