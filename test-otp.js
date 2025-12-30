/**
 * Test script for OTP API
 * Run this with: node test-otp.js
 * 
 * This script helps debug OTP request issues by:
 * 1. Testing the API endpoint
 * 2. Logging all request/response details
 * 3. Checking for common issues
 */

const fetch = require('node-fetch'); // You may need to install: npm install node-fetch

const TTELGO_API = 'https://ttelgo.com/api';

async function testOTPRequest() {
  const testData = {
    email: "abdulqayumsabir41@gmail.com",
    phone: "+93781203310",
    purpose: "LOGIN"
  };

  console.log('='.repeat(60));
  console.log('Testing OTP Request API');
  console.log('='.repeat(60));
  console.log('\nRequest Data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');

  try {
    console.log('Sending POST request to:', `${TTELGO_API}/auth/otp/request`);
    console.log('Request Headers:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    console.log('\n');

    const response = await fetch(`${TTELGO_API}/auth/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log('\n');

    const responseText = await response.text();
    console.log('Response Body (raw):');
    console.log(responseText);
    console.log('\n');

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Response Body (parsed):');
      console.log(JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError.message);
      console.log('Response is not valid JSON');
    }

    console.log('\n');
    console.log('='.repeat(60));
    
    if (response.ok) {
      console.log('✅ Request was successful!');
      console.log('Check your email and phone for the OTP.');
    } else {
      console.log('❌ Request failed with status:', response.status);
      console.log('Error details:', responseData);
      
      // Common error checks
      if (response.status === 400) {
        console.log('\n⚠️  Possible issues:');
        console.log('  - Invalid email format');
        console.log('  - Invalid phone number format');
        console.log('  - Missing required fields');
      } else if (response.status === 401 || response.status === 403) {
        console.log('\n⚠️  Possible issues:');
        console.log('  - Authentication required');
        console.log('  - Invalid API credentials');
      } else if (response.status === 429) {
        console.log('\n⚠️  Possible issues:');
        console.log('  - Too many requests (rate limiting)');
        console.log('  - Wait a few minutes before trying again');
      } else if (response.status === 500) {
        console.log('\n⚠️  Possible issues:');
        console.log('  - Server error');
        console.log('  - Contact API support');
      }
    }
    
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error('  Message:', error.message);
    console.error('  Stack:', error.stack);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('\n⚠️  Network error:');
      console.log('  - Check your internet connection');
      console.log('  - Verify the API endpoint is correct');
    }
  }
}

// Run the test
testOTPRequest();

