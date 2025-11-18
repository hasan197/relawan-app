// Test script for Convex integration
import { ConvexHttpClient } from 'convex/browser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const CONVEX_URL = process.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  console.error('Error: VITE_CONVEX_URL is not set in .env file');
  process.exit(1);
}

async function testConvex() {
  try {
    console.log('Testing Convex connection...');
    
    // Create a client
    const client = new ConvexHttpClient(CONVEX_URL);
    
    // Test a simple query
    console.log('\nTesting database query...');
    const testData = await client.query('database:queryDocuments', {
      table: 'users',
      column: 'phone',
      value: '+1234567890' // Test with a non-existent phone number
    });
    
    console.log('Query result:', testData);
    
    // Test authentication
    console.log('\nTesting authentication...');
    try {
      const authResult = await client.mutation('auth:login', {
        phone: '+1234567890',
        otp: '123456' // Test with invalid OTP
      });
      console.log('Auth result:', authResult);
    } catch (authError) {
      console.log('Expected auth error (this is normal for test user):', authError.message);
    }
    
    console.log('\n✅ Convex tests completed!');
    
  } catch (error) {
    console.error('❌ Error testing Convex:', error);
    process.exit(1);
  }
}

testConvex();
