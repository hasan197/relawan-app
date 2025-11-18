// Script to verify Convex connection and basic operations
const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: '.env' });

const CONVEX_URL = process.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  console.error('❌ Error: VITE_CONVEX_URL is not set in .env file');
  process.exit(1);
}

async function testConvexConnection() {
  try {
    console.log('🔌 Testing connection to Convex...');
    const client = new ConvexHttpClient(CONVEX_URL);
    
    // Test connection
    const connectionTest = await client.query('testQueries:testConnection');
    console.log('✅ Connection test:', connectionTest);
    
    // Test database access
    console.log('\n🔍 Testing database access...');
    const users = await client.query('testQueries:getAllUsers');
    console.log(`✅ Found ${users.length} users in the database.`);
    
    console.log('\n🎉 Convex integration tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing Convex integration:', error.message);
    process.exit(1);
  }
}

testConvexConnection();
