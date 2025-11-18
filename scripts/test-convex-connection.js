// Simple script to test Convex connection
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

async function testConnection() {
  try {
    console.log('Testing connection to Convex...');
    const client = new ConvexHttpClient(CONVEX_URL);
    
    // Test a simple query
    const result = await client.query('queryDocuments', {
      table: 'users',
      column: 'phone',
      value: '+1234567890' // Test with a non-existent phone number
    });
    
    console.log('✅ Successfully connected to Convex!');
    console.log('Query result:', result);
    
  } catch (error) {
    console.error('❌ Error connecting to Convex:', error.message);
    process.exit(1);
  }
}

testConnection();
