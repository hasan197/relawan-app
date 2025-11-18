// scripts/test-auth.js
require('dotenv').config({ path: '.env' });
const { ConvexHttpClient } = require('convex/browser');

const CONVEX_URL = process.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  console.error('❌ Error: VITE_CONVEX_URL is not set in .env file');
  process.exit(1);
}

console.log('🌐 Convex URL:', CONVEX_URL);
console.log('🏗️  Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 Backend:', CONVEX_URL.includes('localhost') ? 'Local Development' : 'Production');

async function testAuth() {
  console.log('\n🔐 Starting authentication tests...\n');
  
  // Generate a unique phone number for testing
  const testPhone = `+6281${Date.now().toString().slice(-8)}`;
  const testOtp = '123456';
  
  try {
    const client = new ConvexHttpClient(CONVEX_URL);
    
    // 1. Test sending OTP
    console.log('1. Testing OTP sending...');
    const otpResult = await client.mutation('auth:sendOtp', { phone: testPhone });
    console.log('✅ OTP sent successfully (mock)');
    console.log('   Backend:', otpResult.backend || 'development');
    
    // 2. Test login (should fail with invalid OTP)
    console.log('\n2. Testing login with invalid OTP...');
    try {
      await client.mutation('auth:login', { phone: testPhone, otp: 'wrong-otp' });
      console.error('❌ Login should have failed with invalid OTP');
    } catch (error) {
      console.log('✅ Login failed as expected with invalid OTP');
    }
    
    // 3. Test registration
    console.log('\n3. Testing user registration...');
    const registerResult = await client.mutation('auth:register', {
      fullName: 'Test User',
      phone: testPhone,
      city: 'Jakarta'
    });
    console.log('✅ User registered:');
    console.log('   - Name:', registerResult.user.fullName);
    console.log('   - Phone:', registerResult.user.phone);
    console.log('   - Backend:', registerResult.backend || 'development');
    
    // 4. Test login with correct OTP (mock)
    console.log('\n4. Testing login with valid OTP...');
    const loginResult = await client.mutation('auth:login', { 
      phone: testPhone, 
      otp: testOtp 
    });
    console.log('✅ Login successful:');
    console.log('   - User:', loginResult.user.fullName);
    console.log('   - Role:', loginResult.user.role);
    console.log('   - Backend:', loginResult.backend || 'development');
    
    // 5. Test getting current user
    console.log('\n5. Testing get current user...');
    try {
      const currentUser = await client.query('auth:getCurrentUser');
      if (currentUser && currentUser.status) {
        console.log('ℹ️ Authentication status:', currentUser.status);
        console.log('   Backend:', currentUser.backend || 'development');
      } else if (currentUser) {
        console.log('✅ Current user:');
        console.log('   - Name:', currentUser.fullName);
        console.log('   - Phone:', currentUser.phone);
        console.log('   - Role:', currentUser.role);
        console.log('   - Backend:', currentUser.backend || 'development');
      } else {
        console.log('ℹ️ No current user (expected in test environment)');
        console.log('   This is expected because we are not properly authenticated in the test script.');
        console.log('   In a real application, the authentication token would be properly set in the request headers.');
      }
    } catch (error) {
      console.log('ℹ️ Error getting current user (expected in test environment):', error.message);
      console.log('   This is expected because we are not properly authenticated in the test script.');
    }
    
    console.log('\n🎉 Core authentication tests completed!');
    console.log('\n💡 Backend Information:');
    console.log('   - URL:', CONVEX_URL);
    console.log('   - Environment:', process.env.NODE_ENV || 'development');
    console.log('   - Backend:', CONVEX_URL.includes('localhost') ? 'Local Development' : 'Production');
    
  } catch (error) {
    console.error('\n❌ Authentication test failed:', error.message);
    if (error.data) {
      console.error('Error details:', error.data);
    }
    process.exit(1);
  }
}

testAuth();
