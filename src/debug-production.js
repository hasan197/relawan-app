// Debug production environment variables and API calls
console.log('=== PRODUCTION DEBUG ===');

// Check environment variables
console.log('Environment Variables:');
console.log('VITE_BACKEND:', import.meta.env.VITE_BACKEND);
console.log('VITE_BACKEND_PROVIDER:', import.meta.env.VITE_BACKEND_PROVIDER);
console.log('VITE_CONVEX_URL:', import.meta.env.VITE_CONVEX_URL);
console.log('NEXT_PUBLIC_CONVEX_URL:', import.meta.env.NEXT_PUBLIC_CONVEX_URL);

// Test backend configuration
import { BACKEND_PROVIDER } from './lib/backendConfig.js';
console.log('BACKEND_PROVIDER:', BACKEND_PROVIDER);

// Test Convex connection
import { routeToConvex } from './lib/convexRouter.js';

async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test muzakki API
    const muzakkiResponse = await routeToConvex('/muzakki?relawan_id=j572pdvbvzfp3p89v846q8wn6h7vpw72');
    console.log('Muzakki API Response:', muzakkiResponse);
    
    // Test donations API
    const donationsResponse = await routeToConvex('/donations?relawan_id=j572pdvbvzfp3p89v846q8wn6h7vpw72');
    console.log('Donations API Response:', donationsResponse);
    
  } catch (error) {
    console.error('Backend connection test failed:', error);
  }
}

// Run test if in browser
if (typeof window !== 'undefined') {
  testBackendConnection();
}

export { testBackendConnection };
