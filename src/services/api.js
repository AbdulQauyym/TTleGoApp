const BASE_URL = 'https://www.ttelgo.com/api';
const TTELGO_API = 'https://ttelgo.com/api';
// Note: Both BASE_URL and TTELGO_API point to the same API, use TTELGO_API for consistency
const ESIM_GO_API = 'https://api.esim-go.com/v2.4';

// TTelgo Mobile App API Key
const TTELGO_API_KEY = 'ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0';

// eSIM Go API Key - should be stored in environment variables in production
// For now, this should be configured in your app settings
// To get your API key:
// 1. Log into https://sso.esim-go.com/login
// 2. Navigate to Account Settings -> API Details
// 3. Copy your API key and replace the value below
const ESIM_GO_API_KEY = 'gSAXaGtFYQ3yKoda4A8kwksYBq1E4ZO14XmquhN_';

// Helper function to validate API key
const validateAPIKey = () => {
  if (!ESIM_GO_API_KEY || ESIM_GO_API_KEY === 'YOUR_ESIM_GO_API_KEY') {
    throw new Error('eSIM Go API key is not configured. Please set your API key in src/services/api.js');
  }
};

/**
 * Fetch countries from the local bundles API
 * Returns an array of countries in the format: [{ name: string, price: string, flag: string }, ...]
 */
export const fetchCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/plans/bundles/local`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to the expected format
    if (data && Array.isArray(data.bundles)) {
      const countriesMap = new Map();
      
      data.bundles.forEach(bundle => {
        if (bundle.countries && Array.isArray(bundle.countries) && bundle.countries.length > 0) {
          const country = bundle.countries[0]; // Take first country from bundle
          const countryName = country.name;
          const isoCode = (country.iso || '').toLowerCase();
          
          // Extract price from bundle if available
          const price = bundle.price 
            ? `From $${bundle.price}` 
            : bundle.newPrice 
            ? `From $${bundle.newPrice}` 
            : 'Price on request';
          
          // Add country if not already in the map (avoid duplicates)
          if (!countriesMap.has(countryName)) {
            countriesMap.set(countryName, {
              name: countryName,
              price: price,
              flag: isoCode || 'us'
            });
          }
        }
      });
      
      // Convert map to array and sort
      const countriesList = Array.from(countriesMap.values());
      countriesList.sort((a, b) => a.name.localeCompare(b.name));
      
      return countriesList;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

/**
 * Fetch regional packages from the regional bundles API
 * Returns an array of regional packages
 */
export const fetchRegionalPackages = async () => {
  try {
    const response = await fetch(`${BASE_URL}/plans/bundles/regional`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to the expected format
    if (data && Array.isArray(data.bundles)) {
      return data.bundles.map((bundle, index) => {
        // Extract countries from bundle
        const countries = bundle.countries && Array.isArray(bundle.countries)
          ? bundle.countries.map(country => ({
              name: country.name || '',
              flag: (country.iso || '').toLowerCase() || 'us'
            }))
          : [];
        
        // Map bundle to regional package format
        return {
          id: bundle.id || index + 1,
          planName: bundle.name || bundle.planName || `Regional Plan ${index + 1}`,
          icon: bundle.icon || '🌍',
          price: bundle.price || bundle.newPrice || '0',
          data: bundle.data || bundle.dataAmount || '1 GB',
          validity: bundle.validity || bundle.duration || '7 days',
          countries: countries,
          countryCount: countries.length
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching regional packages:', error);
    throw error;
  }
};

/**
 * Fetch country-specific plans
 * @param {string} countryFlag - ISO country code (e.g., 'us', 'gb')
 * @returns {Promise<Array>} Array of data plans
 */
export const fetchCountryPlans = async (countryFlag) => {
  try {
    // Convert country flag to uppercase for API (e.g., 'gb' -> 'GB')
    const countryIso = countryFlag.toUpperCase();
    
    const response = await fetch(`https://ttelgo.com/api/plans/bundles/country?countryIso=${countryIso}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to the expected format
    if (data && Array.isArray(data.bundles)) {
      return data.bundles.map((bundle, index) => {
        // Convert dataAmount from MB to GB format
        let dataText;
        if (bundle.unlimited || bundle.dataAmount === -1) {
          dataText = 'Unlimited';
        } else if (bundle.dataAmount) {
          // Convert MB to GB (divide by 1000)
          const dataInGB = bundle.dataAmount / 1000;
          // Format: if whole number, show without decimals, otherwise show 1 decimal
          dataText = dataInGB % 1 === 0 
            ? `${dataInGB} GB` 
            : `${dataInGB.toFixed(1)} GB`;
        } else {
          dataText = '1 GB'; // Default fallback
        }
        
        // Format duration as "X Days"
        const durationText = bundle.duration 
          ? `${bundle.duration} ${bundle.duration === 1 ? 'Day' : 'Days'}`
          : '30 Days'; // Default fallback
        
        // Format price as string (round to 2 decimals)
        const priceText = bundle.price 
          ? bundle.price.toFixed(2)
          : '0';
        
        return {
          id: bundle.id || index + 1,
          data: dataText,
          duration: durationText,
          oldPrice: null, // API doesn't provide oldPrice
          newPrice: priceText,
          bundleName: bundle.name // Include bundle name for fetching details
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching country plans:', error);
    throw error;
  }
};

/**
 * Fetch all bundles from the main bundles API
 * @returns {Promise<Array>} Array of bundle objects with names
 */
export const fetchAllBundles = async () => {
  try {
    const response = await fetch(`${TTELGO_API}/plans/bundles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Return array of bundles with their names
    if (data && Array.isArray(data.bundles)) {
      return data.bundles.map(bundle => ({
        name: bundle.name,
        description: bundle.description,
        countries: bundle.countries,
        dataAmount: bundle.dataAmount,
        duration: bundle.duration,
        price: bundle.price,
        unlimited: bundle.unlimited,
        autostart: bundle.autostart,
        roamingEnabled: bundle.roamingEnabled,
        imageUrl: bundle.imageUrl,
        group: bundle.group,
        billingType: bundle.billingType,
        potentialSpeeds: bundle.potentialSpeeds
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching all bundles:', error);
    throw error;
  }
};

/**
 * Fetch plan details by bundle name
 * @param {string} bundleName - Bundle name (e.g., 'esim_1GB_7D_GB_V2')
 * @returns {Promise<Object>} Plan details object
 */
export const fetchPlanDetails = async (bundleName) => {
  try {
    if (!bundleName) {
      throw new Error('Bundle name is required');
    }

    const response = await fetch(`${TTELGO_API}/plans/bundles/${bundleName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const bundle = await response.json();
    
    // Transform API response to the expected format
    if (bundle) {
      // Convert dataAmount from MB to GB format
      let dataText;
      if (bundle.unlimited || bundle.dataAmount === -1) {
        dataText = 'Unlimited';
      } else if (bundle.dataAmount) {
        // Convert MB to GB (divide by 1000)
        const dataInGB = bundle.dataAmount / 1000;
        // Format: if whole number, show without decimals, otherwise show 1 decimal
        dataText = dataInGB % 1 === 0 
          ? `${dataInGB} GB` 
          : `${dataInGB.toFixed(1)} GB`;
      } else {
        dataText = '1 GB'; // Default fallback
      }
      
      // Format duration as "X Days"
      const durationText = bundle.duration 
        ? `${bundle.duration} ${bundle.duration === 1 ? 'Day' : 'Days'}`
        : '30 Days'; // Default fallback
      
      // Determine speed based on potentialSpeeds or default
      const speed = bundle.potentialSpeeds 
        ? bundle.potentialSpeeds 
        : '5G / LTE'; // Default
      
      // Determine service type
      const service = bundle.unlimited 
        ? 'Unlimited Data' 
        : 'Data Only';
      
      // Network - could be extracted from description or use default
      const network = bundle.description 
        ? bundle.description.split(', ').pop() || 'Multiple Networks'
        : 'Multiple Networks';
      
      // Activation message
      const activation = bundle.autostart 
        ? 'Plan starts automatically when connected to network, or after 60 days'
        : 'Manual activation required';
      
      // Add-on availability
      const addOnAvailable = bundle.group && bundle.group.length > 0 
        ? 'Yes' 
        : 'No';
      
      // Coverage message
      const coverage = 'Coverage may not include overseas territories under the jurisdiction of the specified country (or countries) please contact customer support to confirm before purchasing';
      
      // Provider - could be extracted from group or use default
      const provider = bundle.group && bundle.group.length > 0 
        ? bundle.group[0] 
        : 'Standard Provider';
      
      return {
        plan: dataText,
        validity: durationText,
        speed: speed,
        service: service,
        network: network,
        activation: activation,
        addOnAvailable: addOnAvailable,
        coverage: coverage,
        provider: provider,
        price: bundle.price ? bundle.price.toFixed(2) : '0',
        description: bundle.description || '',
        billingType: bundle.billingType || 'FixedCost',
        roamingEnabled: bundle.roamingEnabled || false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching plan details:', error);
    throw error;
  }
};

/**
 * Create an order using eSIM Go API v2.4
 * Reference: https://docs.esim-go.com/api/v2_4/operations/orders/post/
 * @param {Object} orderData - Order data containing bundle name, quantity, etc.
 * @param {string} orderData.bundleName - Bundle name (item)
 * @param {number} orderData.quantity - Quantity (default: 1)
 * @param {boolean} orderData.assign - Assign to new eSIM (default: true)
 * @param {string} orderData.iccid - Optional ICCID if assigning to existing eSIM
 * @param {string} orderData.type - Order type: "transaction" (default) or "validate" for testing
 * @returns {Promise<Object>} Order response object
 */
export const createESIMOrder = async (orderData) => {
  try {
    validateAPIKey();
    
    // Validate required fields
    if (!orderData || !orderData.bundleName) {
      throw new Error('Bundle name is required to create an order');
    }
    
    // According to eSIM Go API v2.4 documentation:
    // POST /v2.4/orders
    // Request body can be either:
    // 1. Direct format: { type, assign, quantity, item }
    // 2. OrderItems format: { orderItems: [{ type, quantity, item, assign }] }
    // We'll try the direct format first (as per official docs)
    const requestBody = {
      type: orderData.type || 'transaction', // 'transaction' or 'validate'
      quantity: orderData.quantity || 1,
      item: orderData.bundleName.trim(), // Bundle name (trim whitespace)
      assign: orderData.assign !== false, // Default true, assign to new eSIM
    };
    
    // Add optional ICCID if provided
    if (orderData.iccid) {
      requestBody.iccid = orderData.iccid;
    }
    
    // Validate required fields
    if (!requestBody.item || !requestBody.item.trim()) {
      throw new Error('Bundle name (item) is required and must be a non-empty string');
    }
    if (!requestBody.type || !['transaction', 'validate'].includes(requestBody.type)) {
      throw new Error('Type must be either "transaction" or "validate"');
    }
    if (!requestBody.quantity || requestBody.quantity < 1) {
      throw new Error('Quantity must be >= 1');
    }
    
    console.log('Creating eSIM Go order:');
    console.log('URL:', `${ESIM_GO_API}/orders`);
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    console.log('API Key (first 10 chars):', ESIM_GO_API_KEY ? ESIM_GO_API_KEY.substring(0, 10) + '...' : 'NOT SET');
    
    // Try direct format first (as per official documentation)
    let response = await fetch(`${ESIM_GO_API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ESIM_GO_API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // If direct format fails with 400, try orderItems format as fallback
    if (!response.ok && response.status === 400) {
      const errorText = await response.text();
      console.warn('Direct format failed, trying orderItems format...');
      console.warn('Error:', errorText);
      
      // Try orderItems format
      const orderItemsBody = {
        orderItems: [{
          type: requestBody.type,
          quantity: requestBody.quantity,
          item: requestBody.item,
          assign: requestBody.assign,
          ...(requestBody.iccid && { iccid: requestBody.iccid })
        }]
      };
      
      console.log('Trying orderItems format:', JSON.stringify(orderItemsBody, null, 2));
      
      response = await fetch(`${ESIM_GO_API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': ESIM_GO_API_KEY,
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderItemsBody),
      });
      
      console.log('orderItems format response status:', response.status);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
        console.error('Parsed error data:', errorData);
      } catch (e) {
        console.error('Could not parse error response as JSON:', e);
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const errorMessage = errorData.message || 
                          errorData.error || 
                          errorData.errorMessage || 
                          errorData.detail ||
                          `HTTP error! status: ${response.status}`;
      
      // Provide more helpful error messages
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your eSIM Go API key in src/services/api.js');
      }
      
      if (response.status === 400) {
        // Log the full request for debugging
        console.error('Bad Request - Last request body was:', JSON.stringify(requestBody, null, 2));
        throw new Error(`Bad Request: ${errorMessage}. Please check your order data.`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('eSIM Go order created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating eSIM order:', error);
    throw error;
  }
};

/**
 * Apply a bundle to an eSIM using eSIM Go API v2.4
 * Reference: https://docs.esim-go.com/api/v2_4/operations/esimsiccidbundles/post/
 * @param {string} iccid - eSIM ICCID
 * @param {string} bundleName - Bundle name to apply
 * @returns {Promise<Object>} Bundle application response
 */
export const applyBundleToESIM = async (iccid, bundleName) => {
  try {
    validateAPIKey();
    
    if (!iccid || !bundleName) {
      throw new Error('ICCID and bundle name are required');
    }

    console.log('Applying bundle to eSIM:', { iccid, bundleName });

    const response = await fetch(`${ESIM_GO_API}/esims/${iccid}/bundles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ESIM_GO_API_KEY,
      },
      body: JSON.stringify({
        bundleName: bundleName,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const errorMessage = errorData.message || errorData.error || errorData.errorMessage || `HTTP error! status: ${response.status}`;
      
      // Provide more helpful error messages
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your eSIM Go API key in src/services/api.js');
      }
      
      if (response.status === 400) {
        throw new Error(`Bad Request: ${errorMessage}. Please check the bundle name and ICCID.`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Bundle applied successfully:', data);
    return data;
  } catch (error) {
    console.error('Error applying bundle to eSIM:', error);
    throw error;
  }
};

/**
 * Get order details from eSIM Go API v2.4
 * Reference: https://docs.esim-go.com/api/v2_4/operations/ordersreference/get/
 * @param {string} orderReference - Order reference ID (from order response)
 * @returns {Promise<Object>} Order details
 */
export const getOrderDetails = async (orderReference) => {
  try {
    validateAPIKey();
    
    if (!orderReference) {
      throw new Error('Order reference is required');
    }

    console.log('Fetching order details for reference:', orderReference);

    const response = await fetch(`${ESIM_GO_API}/orders/${orderReference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ESIM_GO_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const errorMessage = errorData.message || errorData.error || errorData.errorMessage || `HTTP error! status: ${response.status}`;
      
      // Provide more helpful error messages
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your eSIM Go API key in src/services/api.js');
      }
      
      if (response.status === 404) {
        throw new Error(`Order not found: ${orderReference}. Please check the order reference.`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Order details fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email address
 * @param {string} userData.password - User password
 * @param {string} userData.confirmPassword - Password confirmation (optional, for validation)
 * @param {string} userData.name - User name (optional)
 * @param {string} userData.phone - User phone number (optional)
 * @returns {Promise<Object>} Registration response object
 */
export const registerUser = async (userData) => {
  try {
    // Validate required fields
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password length
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validate password confirmation if provided
    if (userData.confirmPassword && userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    console.log('Registering user with email:', userData.email);

    // Try multiple possible endpoints for user registration
    // Common patterns: /user, /api/user, /api/auth/register, /api/auth/signup, /api/users
    const possibleEndpoints = [
      'https://ttelgo.com/user',                    // User-specified endpoint
      `${TTELGO_API}/user`,                        // API pattern: /api/user
      `${TTELGO_API}/auth/register`,               // Auth register pattern
      `${TTELGO_API}/auth/signup`,                 // Auth signup pattern
      `${TTELGO_API}/users`,                       // Plural users
      `${TTELGO_API}/user/register`,               // User register pattern
    ];

    let response;
    let lastError;
    let successfulEndpoint = null;

    // Try each endpoint until we find one that works (not 404 or 405)
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Include API key if available (some endpoints require it)
            ...(TTELGO_API_KEY && { 'X-API-Key': TTELGO_API_KEY }),
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            name: userData.name || '',
            phone: userData.phone || '',
          }),
        });

        console.log(`Response status for ${endpoint}:`, response.status);

        // If we get a successful response (200-299), use this endpoint
        if (response.ok) {
          successfulEndpoint = endpoint;
          console.log(`✅ Successfully connected to endpoint: ${endpoint}`);
          break;
        }

        // If we get 404 or 405, try next endpoint
        if (response.status === 404 || response.status === 405) {
          console.log(`${response.status} error on ${endpoint}, trying next...`);
          lastError = new Error(`Endpoint not found or method not allowed: ${endpoint}`);
          continue;
        }

        // For other status codes (400, 401, 403, 500, etc.), use this endpoint
        // as it exists but may have validation/auth errors
        successfulEndpoint = endpoint;
        console.log(`Endpoint exists but returned ${response.status}, using it for error handling`);
        break;
      } catch (error) {
        console.log(`Network error on ${endpoint}:`, error.message);
        lastError = error;
        continue;
      }
    }

    // If all endpoints returned 404/405, throw a helpful error
    if (!successfulEndpoint && (response?.status === 404 || response?.status === 405)) {
      throw new Error(
        `User registration endpoint not found. Tried: ${possibleEndpoints.join(', ')}. ` +
        `Please verify the correct endpoint with your API documentation.`
      );
    }

    if (!response) {
      throw lastError || new Error('Failed to get response from server');
    }

    console.log(`Signup API Response Status (${successfulEndpoint || 'unknown endpoint'}):`, response.status);
    console.log('Signup API Response Headers:', Object.fromEntries(response.headers.entries()));

    // Get response text first to see what we're getting
    const responseText = await response.text();
    console.log('Signup API Response Body (raw):', responseText);

    // Check if response is HTML (error page)
    if (responseText.trim().startsWith('<html>') || responseText.trim().startsWith('<!DOCTYPE')) {
      // Extract error message from HTML if possible
      const statusMatch = responseText.match(/<title>(\d+\s+[^<]+)<\/title>/i);
      const statusText = statusMatch ? statusMatch[1] : `HTTP ${response.status}`;
      
      if (response.status === 405) {
        throw new Error(`Method Not Allowed (405). The endpoint may require a different HTTP method or the URL may be incorrect. Please verify the API endpoint: ${successfulEndpoint || 'unknown'}`);
      }
      
      throw new Error(`Server returned HTML error page: ${statusText}. Endpoint tried: ${successfulEndpoint || 'unknown'}. Please check the API endpoint configuration.`);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      // If response is not JSON, check if it's a success message
      if (response.ok && responseText.trim() === '') {
        // Empty response on success
        return {
          success: true,
          message: 'User registered successfully',
          data: { email: userData.email }
        };
      }
      
      // If we got a non-200 status with non-JSON, it's an error
      if (!response.ok) {
        throw new Error(`Server returned non-JSON response (Status ${response.status}): ${responseText.substring(0, 200)}`);
      }
      
      throw new Error(`Invalid response format: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok) {
      // Handle error responses
      const errorMessage = responseData.message || responseData.error || `Registration failed: ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('User registered successfully:', responseData);
    return {
      success: true,
      message: responseData.message || 'User registered successfully',
      data: responseData
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error(`Failed to register user: ${error.message || error}`);
  }
};

/**
 * Request OTP for authentication
 * @param {Object} otpData - OTP request data containing email, phone, and purpose
 * @param {string} otpData.email - User email address
 * @param {string} otpData.phone - User phone number (with country code, e.g., "+93781203310")
 * @param {string} otpData.purpose - Purpose of OTP (e.g., "LOGIN", "SIGNUP", "RESET_PASSWORD")
 * @returns {Promise<Object>} OTP response object
 */
export const requestOTP = async (otpData) => {
  try {
    // Validate required fields
    if (!otpData.email || !otpData.phone || !otpData.purpose) {
      throw new Error('Email, phone, and purpose are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(otpData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate phone format (should start with +)
    if (!otpData.phone.startsWith('+')) {
      throw new Error('Phone number must include country code (e.g., +93781203310)');
    }

    console.log('Requesting OTP with data:', {
      email: otpData.email,
      phone: otpData.phone,
      purpose: otpData.purpose
    });

    const response = await fetch(`${TTELGO_API}/auth/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: otpData.email,
        phone: otpData.phone,
        purpose: otpData.purpose
      }),
    });

    console.log('OTP API Response Status:', response.status);
    console.log('OTP API Response Headers:', Object.fromEntries(response.headers.entries()));

    // Get response text first to see what we're getting
    const responseText = await response.text();
    console.log('OTP API Response Body (raw):', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
    }

    if (!response.ok) {
      const errorMessage = responseData.message || responseData.error || `HTTP error! status: ${response.status}`;
      console.error('OTP API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        fullResponse: responseData
      });
      throw new Error(errorMessage);
    }

    console.log('OTP Request Successful:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error requesting OTP:', error);
    // Re-throw with more context if it's not already an Error object
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to request OTP: ${error.message || error}`);
  }
};

/**
 * Send invite email to a friend
 * @param {Object} inviteData - Invite data containing email and optional name
 * @param {string} inviteData.email - Friend's email address
 * @param {string} inviteData.name - Friend's name (optional)
 * @returns {Promise<Object>} Invite response object
 */
export const sendInviteEmail = async (inviteData) => {
  try {
    // Validate required fields
    if (!inviteData.email) {
      throw new Error('Email address is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteData.email)) {
      throw new Error('Invalid email format');
    }

    console.log('Sending invite email:', {
      email: inviteData.email,
      name: inviteData.name || 'Friend'
    });

    // Try to use API endpoint if available
    try {
      const response = await fetch(`${TTELGO_API}/invite/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: inviteData.email,
          name: inviteData.name || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Invite email sent successfully:', data);
        return { success: true, message: 'Invite email sent successfully', data };
      } else {
        // If API endpoint doesn't exist, fall through to email client
        throw new Error('API endpoint not available');
      }
    } catch (apiError) {
      // If API call fails, we'll use email client as fallback
      console.log('API endpoint not available, using email client fallback');
      throw apiError;
    }
  } catch (error) {
    console.error('Error sending invite email:', error);
    throw error;
  }
};

/**
 * Get eSIM Install Details (SMDP+ Details) from eSIM Go API
 * This retrieves the SMDP+ address, matching ID, and other details needed to install an eSIM
 * Reference: https://docs.esim-go.com/api/v2_4/operations/esimsassignments/get/
 * 
 * @param {string} reference - Order Reference or Apply Reference
 * @param {Object} options - Optional parameters
 * @param {string} options.additionalFields - Additional fields to include (e.g., 'appleInstallUrl')
 * @param {string} options.format - Response format: 'json' (default), 'csv', or 'zip' (for QR codes)
 * @returns {Promise<Object|Array|Blob>} eSIM install details
 */
export const getESIMInstallDetails = async (reference, options = {}) => {
  try {
    validateAPIKey();
    
    if (!reference) {
      throw new Error('Reference (Order Reference or Apply Reference) is required');
    }

    const { additionalFields, format = 'json' } = options;
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('reference', reference);
    if (additionalFields) {
      params.append('additionalFields', additionalFields);
    }

    // Set Accept header based on format
    const acceptHeaders = {
      'json': 'application/json',
      'csv': 'text/csv',
      'zip': 'application/zip'
    };

    const response = await fetch(`${ESIM_GO_API}/esims/assignments?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': acceptHeaders[format] || 'application/json',
        'X-API-Key': ESIM_GO_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      
      // Provide more helpful error messages
      if (response.status === 400) {
        throw new Error(`Bad Request: ${errorMessage}. Please check your reference format.`);
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your eSIM Go API key in src/services/api.js');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please wait before trying again.');
      } else if (response.status === 503) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(`Service temporarily unavailable. Please try again later${retryAfter ? ` (Retry after ${retryAfter} seconds)` : ''}.`);
      }
      
      throw new Error(errorMessage);
    }

    // Handle different response formats
    if (format === 'zip') {
      // Return blob for ZIP file (contains QR code images)
      const blob = await response.blob();
      return blob;
    } else if (format === 'csv') {
      // Return CSV text
      const text = await response.text();
      return text;
    } else {
      // Return JSON (default)
      const data = await response.json();
      
      // Handle both single object and array responses
      if (Array.isArray(data)) {
        return data;
      } else {
        return data;
      }
    }
  } catch (error) {
    console.error('Error fetching eSIM install details:', error);
    throw error;
  }
};

/**
 * Get eSIM QR Code as ZIP file
 * This is a convenience function that gets the ZIP file containing QR code images
 * 
 * @param {string} reference - Order Reference or Apply Reference
 * @returns {Promise<Blob>} ZIP file containing QR code images in PNG format
 */
export const getESIMQRCode = async (reference) => {
  return getESIMInstallDetails(reference, { format: 'zip' });
};

/**
 * Get eSIM Install URL for direct installation
 * This constructs the installation URL from SMDP+ details
 * 
 * @param {string} reference - Order Reference or Apply Reference
 * @returns {Promise<string>} Installation URL that can be used to install the eSIM
 */
export const getESIMInstallURL = async (reference) => {
  try {
    const details = await getESIMInstallDetails(reference, { 
      format: 'json',
      additionalFields: 'appleInstallUrl' 
    });
    
    // Handle array response (multiple eSIMs)
    const esimData = Array.isArray(details) ? details[0] : details;
    
    if (!esimData) {
      throw new Error('No eSIM data found for the provided reference');
    }

    // Construct installation URL
    // Format: LPA:1$<smdpAddress>$<matchingId>
    const smdpAddress = esimData.smdpAddress || esimData.smdp_address;
    const matchingId = esimData.matchingId || esimData.matching_id;
    
    if (!smdpAddress || !matchingId) {
      throw new Error('SMDP+ address or matching ID not found in response');
    }

    // Return the installation URL in LPA format
    return `LPA:1$${smdpAddress}$${matchingId}`;
  } catch (error) {
    console.error('Error getting eSIM install URL:', error);
    throw error;
  }
};

/**
 * Create a payment intent using TTelgo API
 * @param {Object} paymentData - Payment data containing amount, currency, bundleId, etc.
 * @returns {Promise<Object>} Payment intent response with clientSecret
 */
export const createPaymentIntent = async (paymentData) => {
  try {
    if (!TTELGO_API_KEY) {
      throw new Error('TTelgo API key is not configured');
    }

    console.log('Creating payment intent:', {
      url: `${BASE_URL}/payments/intent`,
      bundleId: paymentData.bundleId,
      amount: paymentData.amount,
    });

    const response = await fetch(`${BASE_URL}/payments/intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TTELGO_API_KEY,
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        bundleId: paymentData.bundleId,
        bundleName: paymentData.bundleName,
        quantity: paymentData.quantity || 1,
        customerEmail: paymentData.customerEmail,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const errorMessage = errorData.message || errorData.error || errorData.errorMessage || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your TTelgo API key in src/services/api.js');
      }
      
      if (response.status === 404) {
        throw new Error(`Not Found: ${errorMessage}. The endpoint may not exist or the bundle ID is invalid.`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Payment intent created successfully:', data);
    // Handle wrapped response structure (if API returns { success: true, data: {...} })
    if (data.data && typeof data.data === 'object') {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Confirm payment after Stripe processing
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Confirmation response with order details
 */
export const confirmPayment = async (paymentIntentId) => {
  try {
    if (!TTELGO_API_KEY) {
      throw new Error('TTelgo API key is not configured');
    }

    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }

    const url = `${BASE_URL}/payments/confirm?paymentIntentId=${paymentIntentId}`;
    console.log('Confirming payment:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TTELGO_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const errorMessage = errorData.message || errorData.error || errorData.errorMessage || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your TTelgo API key in src/services/api.js');
      }
      
      if (response.status === 404) {
        throw new Error(`Not Found: ${errorMessage}. Payment intent ID may be invalid: ${paymentIntentId}`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Payment confirmed successfully:', data);
    // Handle wrapped response structure
    if (data.data && typeof data.data === 'object') {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

/**
 * Activate eSIM after payment is confirmed
 * @param {number|string} orderId - Order ID (numeric)
 * @returns {Promise<Object>} Activation response
 */
export const activateESIMAfterPayment = async (orderId) => {
  try {
    if (!TTELGO_API_KEY) {
      throw new Error('TTelgo API key is not configured');
    }

    const response = await fetch(`${BASE_URL}/esims/activate-after-payment?orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TTELGO_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your TTelgo API key in src/services/api.js');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error activating eSIM after payment:', error);
    throw error;
  }
};

/**
 * Get order details by numeric ID
 * @param {number} orderId - Numeric order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  try {
    if (!TTELGO_API_KEY) {
      throw new Error('TTelgo API key is not configured');
    }

    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TTELGO_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your TTelgo API key in src/services/api.js');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};

/**
 * Get order details by reference (UUID)
 * @param {string} orderReference - Order reference UUID
 * @returns {Promise<Object>} Order details
 */
export const getOrderByReference = async (orderReference) => {
  try {
    if (!TTELGO_API_KEY) {
      throw new Error('TTelgo API key is not configured');
    }

    const response = await fetch(`${BASE_URL}/orders/reference/${orderReference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TTELGO_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your TTelgo API key in src/services/api.js');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order by reference:', error);
    throw error;
  }
};

/**
 * Get eSIM QR code by matching ID
 * @param {string} matchingId - eSIM matching ID
 * @returns {Promise<string>} QR code image URL or base64 data
 */
export const getESIMQRCodeByMatchingId = async (matchingId) => {
  try {
    if (!TTELGO_API_KEY) {
      throw new Error('TTelgo API key is not configured');
    }

    const response = await fetch(`${BASE_URL}/esims/qr/${matchingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TTELGO_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your TTelgo API key in src/services/api.js');
      }
      
      throw new Error(errorMessage);
    }

    // QR code might be returned as image or base64
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('image')) {
      // For React Native, convert blob to base64
      const blob = await response.blob();
      // Return blob URL or convert to base64 if needed
      // In React Native, you can use react-native-fs or similar to handle blobs
      // For now, return the blob (components can handle it)
      return blob;
    } else {
      const data = await response.json();
      return data.qrCode || data.imageUrl || data;
    }
  } catch (error) {
    console.error('Error fetching eSIM QR code:', error);
    throw error;
  }
};

/**
 * Activate bundle using TTelgo API
 * Reference: https://ttelgo.com/api/esims/activate
 * @param {Object} activateData - Activation data
 * @param {string} activateData.bundleName - Bundle name (item)
 * @param {number} activateData.quantity - Quantity (default: 1)
 * @param {boolean} activateData.assign - Assign to new eSIM (default: true)
 * @param {boolean} activateData.allowReassign - Allow reassign (default: false)
 * @param {string} activateData.type - Order type: "transaction" (default) or "validate"
 * @returns {Promise<Object>} Activation response with orderReference
 */
export const activateBundle = async (activateData) => {
  try {
    if (!TTELGO_API_KEY) {
      throw new Error('TTelgo API key is not configured');
    }

    const requestBody = {
      type: activateData.type || 'transaction',
      assign: activateData.assign !== false,
      order: [
        {
          type: 'bundle',
          item: activateData.bundleName,
          quantity: activateData.quantity || 1,
          allowReassign: activateData.allowReassign || false,
        }
      ]
    };

    console.log('Activating bundle with TTelgo API:');
    console.log('URL:', `${TTELGO_API}/esims/activate`);
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    console.log('API Key (first 10 chars):', TTELGO_API_KEY ? TTELGO_API_KEY.substring(0, 10) + '...' : 'NOT SET');

    const response = await fetch(`${TTELGO_API}/esims/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TTELGO_API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const errorMessage = errorData.message || errorData.error || errorData.errorMessage || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your TTelgo API key in src/services/api.js');
      }
      
      if (response.status === 400) {
        throw new Error(`Bad Request: ${errorMessage}. Please check your activation data.`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Bundle activated successfully:', data);
    
    // Handle wrapped response structure
    if (data.data && typeof data.data === 'object') {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error('Error activating bundle:', error);
    throw error;
  }
};

/**
 * Get QR Code by order reference using TTelgo API
 * Reference: https://ttelgo.com/api/esims/qr/{orderReference}
 * @param {string} orderReference - Order reference from activate API
 * @returns {Promise<Blob|Object>} QR code image or data
 */
export const getQRCodeByOrderReference = async (orderReference) => {
  try {
    if (!TTELGO_API_KEY) {
      throw new Error('TTelgo API key is not configured');
    }

    if (!orderReference) {
      throw new Error('Order reference is required');
    }

    console.log('Fetching QR code for order reference:', orderReference);

    const response = await fetch(`${TTELGO_API}/esims/qr/${orderReference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TTELGO_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const errorMessage = errorData.message || errorData.error || errorData.errorMessage || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your TTelgo API key in src/services/api.js');
      }
      
      if (response.status === 404) {
        throw new Error(`QR code not found for order reference: ${orderReference}`);
      }
      
      throw new Error(errorMessage);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('image')) {
      // Return blob for image
      const blob = await response.blob();
      return blob;
    } else if (contentType && contentType.includes('application/json')) {
      // Return JSON data
      const data = await response.json();
      return data;
    } else {
      // Return as text or blob
      const blob = await response.blob();
      return blob;
    }
  } catch (error) {
    console.error('Error fetching QR code:', error);
    throw error;
  }
};
