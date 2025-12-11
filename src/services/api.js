const BASE_URL = 'https://www.ttelgo.com/api';
const TTELGO_API = 'https://ttelgo.com/api';

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
