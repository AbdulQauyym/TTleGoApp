// API Configuration
// ============================================
// API endpoints for fetching eSIM plans
// Local API: { bundles: [{ countries: [{name, iso}], price, dataAmount, duration }, ...] }
// Regional API: { bundles: [{ countries: [{name, iso, region}], price, dataAmount, duration }, ...] }
// ============================================
const USE_API = true; // Set to false to use default data
const LOCAL_API_URL = 'https://www.ttelgo.com/api/plans/bundles/local';
const REGIONAL_API_URL = 'https://www.ttelgo.com/api/plans/bundles/regional';
const COUNTRY_PLANS_API_URL = 'https://www.ttelgo.com/api/plans/bundles/country';

/**
 * Fetch countries list from API
 * 
 * API Response Format from ttelgo.com:
 * {
 *   bundles: [
 *     {
 *       countries: [{ name: 'Country Name', iso: 'US', region: '...' }],
 *       price: 6.9,
 *       dataAmount: 1000, // in MB
 *       duration: 7 // in days
 *     },
 *     ...
 *   ]
 * }
 * 
 * Transforms to: [{ name: '...', price: 'From $X.XX', flag: 'us' }, ...]
 * 
 * @returns {Promise<Array>} Array of country objects with name, price, and flag
 */
export const fetchCountries = async () => {
  // If API is disabled, throw error to trigger fallback
  if (!USE_API) {
    throw new Error('API is disabled - using default data');
  }

  try {
    const response = await fetch(LOCAL_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to app format
    if (data && Array.isArray(data.bundles)) {
      // Create a map to store unique countries with lowest price
      const countryMap = new Map();
      
      data.bundles.forEach(bundle => {
        if (bundle.countries && Array.isArray(bundle.countries) && bundle.countries.length > 0) {
          const country = bundle.countries[0]; // Take first country from bundle
          const countryName = country.name;
          const isoCode = (country.iso || '').toLowerCase();
          const price = bundle.price || 0;
          
          // If country doesn't exist or this price is lower, add/update it
          if (!countryMap.has(countryName) || countryMap.get(countryName).price > price) {
            countryMap.set(countryName, {
              name: countryName,
              price: price,
              flag: isoCode,
              dataAmount: bundle.dataAmount,
              duration: bundle.duration
            });
          }
        }
      });
      
      // Convert map to array and format prices
      const countries = Array.from(countryMap.values()).map(country => ({
        name: country.name,
        price: `From $${country.price.toFixed(2)}`,
        flag: country.flag,
        dataAmount: country.dataAmount,
        duration: country.duration
      }));
      
      // Sort by country name
      countries.sort((a, b) => a.name.localeCompare(b.name));
      
      return countries;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

/**
 * Fetch regional packages from API
 * 
 * API Response Format from ttelgo.com:
 * {
 *   bundles: [
 *     {
 *       countries: [{ name: 'Country Name', iso: 'US', region: 'North America' }],
 *       price: 6.9,
 *       dataAmount: 1000, // in MB
 *       duration: 7 // in days
 *     },
 *     ...
 *   ]
 * }
 * 
 * Transforms to: [{ id, planName, icon, price, data, validity, countries: [{name, flag}] }, ...]
 * Groups countries by region and creates regional packages
 * 
 * @returns {Promise<Array>} Array of regional package objects
 */
export const fetchRegionalPackages = async () => {
  // If API is disabled, throw error to trigger fallback
  if (!USE_API) {
    throw new Error('API is disabled - using default data');
  }

  try {
    console.log('🌐 Fetching regional packages from:', REGIONAL_API_URL);
    const response = await fetch(REGIONAL_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Regional API response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Regional API raw data received, bundles count:', data?.bundles?.length || 0);
    
    // Transform API response to app format
    if (data && Array.isArray(data.bundles)) {
      console.log('🔄 Processing', data.bundles.length, 'bundles...');
      // Group bundles by region
      const regionMap = new Map();
      
      data.bundles.forEach((bundle, index) => {
        if (bundle.countries && Array.isArray(bundle.countries) && bundle.countries.length > 0) {
          const country = bundle.countries[0];
          const region = country.region || 'Other';
          const isoCode = (country.iso || '').toLowerCase();
          const price = bundle.price || 0;
          const dataAmount = bundle.dataAmount || 1000;
          const duration = bundle.duration || 7;
          
          if (!regionMap.has(region)) {
            regionMap.set(region, {
              region: region,
              countries: [],
              prices: [],
              dataAmount: dataAmount,
              duration: duration
            });
          }
          
          const regionData = regionMap.get(region);
          // Add country if not already in the list
          const countryExists = regionData.countries.some(c => c.name === country.name);
          if (!countryExists) {
            regionData.countries.push({
              name: country.name,
              flag: isoCode
            });
            regionData.prices.push(price);
          }
        }
      });
      
      // Convert to regional packages format
      const regionalPackages = Array.from(regionMap.entries()).map(([region, data], index) => {
        // Get region icon based on region name
        const getRegionIcon = (regionName) => {
          const iconMap = {
            'Africa': '🌍',
            'Europe': '🌍',
            'Asia': '🌏',
            'Middle East': '🕌',
            'North America': '🏝️',
            'South America': '🌎',
            'Oceania': '🌏',
            'Other': '🌎'
          };
          return iconMap[regionName] || '🌍';
        };
        
        // Use actual region name (matching website format)
        // The website uses: Europe, Middle East, North America, Asia, South America, Oceania, Africa
        const getRegionName = (regionName) => {
          // Keep region names as they are, matching the website
          return regionName;
        };
        
        // Calculate minimum price (website shows "From $X.XX/GB")
        const minPrice = data.prices.length > 0 
          ? Math.min(...data.prices).toFixed(2)
          : '0.00';
        
        // Format price as "From $X.XX/GB" to match website
        const formattedPrice = `From $${minPrice}/GB`;
        
        // Format data amount
        const dataGB = data.dataAmount >= 1000 ? `${data.dataAmount / 1000} GB` : `${data.dataAmount} MB`;
        
        return {
          id: index + 1,
          planName: getRegionName(region),
          icon: getRegionIcon(region),
          price: formattedPrice, // Now shows "From $X.XX/GB"
          data: dataGB,
          validity: `${data.duration} days`,
          countries: data.countries.sort((a, b) => a.name.localeCompare(b.name)),
          countryCount: data.countries.length // Add country count for display
        };
      });
      
      // Sort by region name
      regionalPackages.sort((a, b) => a.planName.localeCompare(b.planName));
      
      console.log('✅ Transformed to', regionalPackages.length, 'regional packages');
      console.log('📋 Regional packages:', regionalPackages.map(p => ({ name: p.planName, countries: p.countries.length })));
      
      return regionalPackages;
    }
    
    console.warn('⚠️ No bundles array found in API response');
    return [];
  } catch (error) {
    console.error('❌ Error fetching regional packages:', error);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Fetch data plans for a specific country
 * 
 * API Response Format from ttelgo.com:
 * {
 *   bundles: [
 *     {
 *       name: 'esim_1GB_7D_AX_V2',
 *       description: 'eSIM, 1GB, 7 Days, Aaland Islands, V2',
 *       countries: [{ name: '...', iso: '...' }],
 *       dataAmount: 1000, // in MB, -1 for unlimited
 *       duration: 7, // in days
 *       price: 1.3,
 *       unlimited: false,
 *       imageUrl: '...'
 *     },
 *     ...
 *   ]
 * }
 * 
 * Transforms to: [{ id, data: 'X GB' or 'Unlimited', duration: 'X Days', price: 'X.XX' }, ...]
 * 
 * @param {string} countryIso - ISO code of the country (e.g., 'AX', 'US')
 * @returns {Promise<Array>} Array of plan objects
 */
export const fetchCountryPlans = async (countryIso) => {
  // If API is disabled, throw error to trigger fallback
  if (!USE_API) {
    throw new Error('API is disabled - using default data');
  }

  if (!countryIso) {
    throw new Error('Country ISO code is required');
  }

  try {
    const url = `${COUNTRY_PLANS_API_URL}?countryIso=${countryIso.toUpperCase()}`;
    console.log('🌐 Fetching country plans from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Country plans API response received, bundles count:', data?.bundles?.length || 0);
    
    // Transform API response to app format
    if (data && Array.isArray(data.bundles)) {
      const plans = data.bundles.map((bundle, index) => {
        // Format data amount
        let dataText;
        if (bundle.unlimited || bundle.dataAmount === -1) {
          dataText = 'Unlimited';
        } else if (bundle.dataAmount >= 1000) {
          const gb = bundle.dataAmount / 1000;
          dataText = `${gb} GB`;
        } else {
          dataText = `${bundle.dataAmount} MB`;
        }
        
        // Format duration
        const durationText = bundle.duration === 1 ? '1 Day' : `${bundle.duration} Days`;
        
        // Format price
        const price = bundle.price ? bundle.price.toFixed(2) : '0.00';
        
        return {
          id: index + 1,
          data: dataText,
          duration: durationText,
          oldPrice: null, // API doesn't provide old price, can be enhanced later
          newPrice: price,
          bundleData: bundle // Keep original bundle data for reference
        };
      });
      
      // Sort plans by price (ascending)
      plans.sort((a, b) => parseFloat(a.newPrice) - parseFloat(b.newPrice));
      
      console.log('✅ Transformed to', plans.length, 'plans');
      return plans;
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error fetching country plans:', error);
    throw error;
  }
};

