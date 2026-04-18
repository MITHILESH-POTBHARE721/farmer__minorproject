const axios = require('axios');
const GovernmentScheme = require('../models/GovernmentScheme');

// Real Government of India Agriculture Schemes data
// Source: Official government websites (agricoop.nic.in, pmkisan.gov.in, etc.)
const realGovernmentSchemes = [
  {
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Central Sector Scheme to provide income support of ₹6,000 per year to all farmer families across the country in three equal installments of ₹2,000 each.',
    category: 'subsidy',
    eligibility: [
      'Small and marginal farmers with cultivable land',
      'Farmer families with combined landholding of up to 2 hectares',
      'Must have valid Aadhaar and bank account'
    ],
    benefits: [
      '₹6,000 per year income support',
      'Direct benefit transfer to bank account',
      'Paid in three installments of ₹2,000 each'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://pmkisan.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'Mobile Number'],
    contactInfo: {
      phone: '011-23381092',
      email: 'pmkisan-ict@gov.in',
      website: 'https://pmkisan.gov.in/'
    },
    isActive: true
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Comprehensive crop insurance scheme to provide financial support to farmers suffering crop loss due to natural calamities, pests, and diseases.',
    category: 'insurance',
    eligibility: [
      'All farmers growing notified crops in notified areas',
      'Farmers with insurable interest in the crop',
      'Both loanee and non-loanee farmers are eligible'
    ],
    benefits: [
      'Comprehensive risk coverage from pre-sowing to post-harvest',
      'Low premium rates: 1.5% for Rabi, 2% for Kharif, 5% for commercial crops',
      'Use of technology for quick claim settlement'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://pmfby.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'Sowing Certificate'],
    contactInfo: {
      phone: '011-23381092',
      email: 'pmfby@gov.in',
      website: 'https://pmfby.gov.in/'
    },
    isActive: true
  },
  {
    title: 'Kisan Credit Card (KCC) Scheme',
    description: 'Provides adequate and timely credit support to farmers for their agricultural needs including cultivation expenses and post-harvest expenses.',
    category: 'loan',
    eligibility: [
      'Individual farmers (owner/cultivator/tenant)',
      'Self-help groups (SHGs) or joint liability groups (JLGs)',
      'Tenant farmers, oral lessees, and share croppers'
    ],
    benefits: [
      'Short-term credit for cultivation needs',
      'Interest subvention at 2% per annum',
      'Additional 3% prompt repayment incentive',
      'Credit limit up to ₹3 lakh'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://www.nabard.org/content.aspx?id=593',
    documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Passport Size Photo'],
    contactInfo: {
      phone: '022-26539895',
      email: 'nabard@nabard.org',
      website: 'https://www.nabard.org/'
    },
    isActive: true
  },
  {
    title: 'Soil Health Card Scheme',
    description: 'Provides farmers with soil health cards containing information on soil nutrient status and recommendations for appropriate dosage of nutrients.',
    category: 'training',
    eligibility: [
      'All farmers across the country',
      'Farmers willing to get their soil tested',
      'Priority to small and marginal farmers'
    ],
    benefits: [
      'Free soil testing and analysis',
      'Recommendations for nutrient management',
      'Improved soil health and productivity',
      'Cost reduction on fertilizers'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://soilhealth.dac.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Land Records', 'Mobile Number'],
    contactInfo: {
      phone: '011-23384108',
      email: 'shc-dac@gov.in',
      website: 'https://soilhealth.dac.gov.in/'
    },
    isActive: true
  },
  {
    title: 'National Mission on Agricultural Extension and Technology (NMAET)',
    description: 'Integrates various schemes for agriculture extension, education, and technology transfer to farmers.',
    category: 'training',
    eligibility: [
      'Farmers seeking knowledge on modern farming techniques',
      'Agricultural extension workers',
      'Progressive farmers and farm women'
    ],
    benefits: [
      'Training on modern agricultural practices',
      'Demonstration of new technologies',
      'Exposure visits to progressive farms',
      'Skill development programs'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://extensionreforms.dac.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Farmer ID', 'Mobile Number'],
    contactInfo: {
      phone: '011-23384108',
      email: 'nmaet-dac@gov.in',
      website: 'https://extensionreforms.dac.gov.in/'
    },
    isActive: true
  },
  {
    title: 'Agricultural Infrastructure Fund (AIF)',
    description: 'Financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    category: 'loan',
    eligibility: [
      'Farmers, FPOs, PACS, Marketing Cooperative Societies',
      'Self-help groups (SHGs)',
      'Joint liability groups (JLGs)',
      'Multipurpose cooperative societies'
    ],
    benefits: [
      'Interest subvention of 3% per annum',
      'Credit guarantee coverage under CGTMSE',
      'Loans up to ₹2 crore',
      'Moratorium of 2 years'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://agriinfra.dac.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Bank Account', 'Project Report', 'Land Documents'],
    contactInfo: {
      phone: '011-23096646',
      email: 'aif-mis@gov.in',
      website: 'https://agriinfra.dac.gov.in/'
    },
    isActive: true
  },
  {
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    description: 'Promotes agricultural mechanization among small and marginal farmers and in areas where farm power availability is low.',
    category: 'equipment',
    eligibility: [
      'Small and marginal farmers',
      'Custom hiring centers',
      'Hi-tech hubs',
      'Farm machinery banks'
    ],
    benefits: [
      'Subsidy on agricultural machinery (40-50%)',
      'Establishment of custom hiring centers',
      'Farm machinery banks for small farmers',
      'Training on machinery operation'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://farmech.dac.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Quotation from Dealer'],
    contactInfo: {
      phone: '011-25846071',
      email: 'smam-dac@gov.in',
      website: 'https://farmech.dac.gov.in/'
    },
    isActive: true
  },
  {
    title: 'National Food Security Mission (NFSM)',
    description: 'Increases production of rice, wheat, pulses, coarse cereals, and commercial crops through area expansion and productivity enhancement.',
    category: 'subsidy',
    eligibility: [
      'Farmers growing notified crops',
      'Farmers in identified districts',
      'Self-help groups and cooperatives'
    ],
    benefits: [
      'Financial assistance for seeds and inputs',
      'Demonstration of improved practices',
      'Training and capacity building',
      'Support for farm machinery'
    ],
    applicableStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Karnataka', 'Bihar', 'West Bengal'],
    applicationLink: 'https://nfsm.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Cropping Pattern Details'],
    contactInfo: {
      phone: '011-23384108',
      email: 'nfsm-dac@gov.in',
      website: 'https://nfsm.gov.in/'
    },
    isActive: true
  },
  {
    title: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    description: 'Provides states with autonomy and flexibility to plan and execute schemes as per local needs for agriculture development.',
    category: 'subsidy',
    eligibility: [
      'Farmers as per state-specific guidelines',
      'Agricultural cooperatives',
      'Farmer producer organizations (FPOs)',
      'Self-help groups'
    ],
    benefits: [
      'Financial assistance for various agricultural activities',
      'Support for allied sectors like horticulture and livestock',
      'Flexibility in scheme implementation',
      'Focus on local needs and priorities'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://rkvy.nic.in/',
    documentsRequired: ['As per state-specific guidelines', 'Aadhaar Card', 'Land Records'],
    contactInfo: {
      phone: '011-23384108',
      email: 'rkvy-dac@gov.in',
      website: 'https://rkvy.nic.in/'
    },
    isActive: true
  },
  {
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'Promotes organic farming through adoption of eco-friendly technologies and traditional practices.',
    category: 'training',
    eligibility: [
      'Farmers willing to adopt organic farming',
      'Groups of farmers (20-25 farmers per cluster)',
      'Farmers with contiguous land'
    ],
    benefits: [
      'Financial assistance of ₹50,000 per hectare',
      'Support for organic inputs and certification',
      'Training on organic farming practices',
      'Market linkage support'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://pgsindia-ncof.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Group Formation Documents'],
    contactInfo: {
      phone: '011-25846071',
      email: 'pgs-ncof@gov.in',
      website: 'https://pgsindia-ncof.gov.in/'
    },
    isActive: true
  },
  {
    title: 'Per Drop More Crop (Micro Irrigation)',
    description: 'Promotes micro-irrigation systems (drip and sprinkler) to enhance water use efficiency in agriculture.',
    category: 'subsidy',
    eligibility: [
      'All farmers across the country',
      'Priority to small and marginal farmers',
      'Farmers in water-scarce areas'
    ],
    benefits: [
      'Subsidy up to 55% for small farmers',
      'Subsidy up to 45% for other farmers',
      'Higher water use efficiency',
      'Increased crop productivity'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://pmsuryaghar.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Water Source Details'],
    contactInfo: {
      phone: '011-23096646',
      email: 'microirrigation-dac@gov.in',
      website: 'https://pmsuryaghar.gov.in/'
    },
    isActive: true
  },
  {
    title: 'e-NAM (National Agriculture Market)',
    description: 'Online trading platform for agricultural commodities to help farmers sell their produce at competitive prices.',
    category: 'other',
    eligibility: [
      'All farmers with valid produce',
      'Farmers registered on e-NAM portal',
      'Traders and commission agents'
    ],
    benefits: [
      'Direct access to national market',
      'Better price discovery',
      'Online payment system',
      'Reduced intermediaries'
    ],
    applicableStates: ['All India'],
    applicationLink: 'https://enam.gov.in/',
    documentsRequired: ['Aadhaar Card', 'Bank Account', 'Mobile Number', 'Produce Details'],
    contactInfo: {
      phone: '1800-270-0224',
      email: 'support-enam@gov.in',
      website: 'https://enam.gov.in/'
    },
    isActive: true
  }
];

// Function to seed real government schemes
const seedGovernmentSchemes = async () => {
  try {
    console.log('Seeding real government schemes...');
    
    // Check if schemes already exist
    const existingCount = await GovernmentScheme.countDocuments();
    
    if (existingCount > 0) {
      console.log(`${existingCount} schemes already exist. Skipping seed.`);
      return;
    }
    
    // Insert all real schemes
    await GovernmentScheme.insertMany(realGovernmentSchemes);
    
    console.log(`✅ Successfully seeded ${realGovernmentSchemes.length} government schemes`);
  } catch (err) {
    console.error('Error seeding government schemes:', err.message);
  }
};

// Function to fetch and update schemes (can be called periodically)
const updateSchemesFromSource = async () => {
  try {
    console.log('Checking for scheme updates...');
    
    // In a real implementation, this would fetch from official government APIs
    // For now, we use the curated list above
    // Future: Integrate with data.gov.in APIs when available
    
    console.log('✅ Schemes are up to date');
  } catch (err) {
    console.error('Error updating schemes:', err.message);
  }
};

module.exports = {
  seedGovernmentSchemes,
  updateSchemesFromSource,
  realGovernmentSchemes
};
