// Test script to verify backend connection
import { ConvexHttpClient } from 'convex/browser';

const convexUrl = 'https://quixotic-rhinoceros-311.convex.cloud';
const client = new ConvexHttpClient(convexUrl);

async function testConnection() {
  try {
    console.log('Testing Convex connection...');
    
    // Test muzakki data
    const muzakkis = await client.query('muzakkis:listByRelawan', {
      relawanId: 'j572pdvbvzfp3p89v846q8wn6h7vpw72'
    });
    
    console.log('Muzakki data:', muzakkis);
    console.log('Found', muzakkis.length, 'muzakkis');
    
    // Test donations data
    const donations = await client.query('donations:listByRelawan', {
      relawanId: 'j572pdvbvzfp3p89v846q8wn6h7vpw72'
    });
    
    console.log('Donation data:', donations);
    console.log('Found', donations.length, 'donations');
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
