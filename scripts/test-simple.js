// Simple test script for Convex
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

async function testSimple() {
  try {
    console.log('Testing Convex connection...');
    
    // Create a client
    const client = new ConvexHttpClient(CONVEX_URL);
    
    // Test getCurrentUser (should return null for unauthenticated user)
    console.log('\nTesting getCurrentUser...');
    const currentUser = await client.query('auth:getCurrentUser');
    console.log('Current user:', currentUser);
    
    console.log('\n✅ Simple Convex test completed!');
    
  } catch (error) {
    console.error('❌ Error testing Convex:', error);
    process.exit(1);
  }
}

testSimple();