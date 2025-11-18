import { test, expect } from 'vitest';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

// Load environment variables
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error('VITE_CONVEX_URL is not set in environment variables');
}

const convex = new ConvexHttpClient(CONVEX_URL);

// Test user data
const testUser = {
  phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`, // Random phone number
  otp: '123456',
  fullName: 'Test User',
  city: 'Test City'
};

let testUserId: string;

test('should connect to Convex', async () => {
  // Test a simple query to verify connection
  const result = await convex.query(api.database.queryDocuments, {
    table: 'users',
    column: 'phone',
    value: testUser.phone
  });
  
  expect(Array.isArray(result)).toBe(true);
});

test('should sign up a new user', async () => {
  const result = await convex.mutation(api.auth.signUp, {
    phone: testUser.phone,
    fullName: testUser.fullName,
    city: testUser.city
  });
  
  expect(result).toHaveProperty('userId');
  expect(result).toHaveProperty('token');
  
  testUserId = result.userId;
});

test('should log in with OTP', async () => {
  // First, request OTP
  await convex.mutation(api.auth.requestOtp, {
    phone: testUser.phone
  });
  
  // Then use the OTP to log in
  const result = await convex.mutation(api.auth.login, {
    phone: testUser.phone,
    otp: testUser.otp
  });
  
  expect(result).toHaveProperty('userId');
  expect(result).toHaveProperty('token');
  expect(result.userId).toBe(testUserId);
});

test('should perform CRUD operations', async () => {
  // Create a test document
  const createResult = await convex.mutation(api.database.insert, {
    table: 'test_items',
    data: {
      name: 'Test Item',
      description: 'This is a test item',
      userId: testUserId,
      createdAt: Date.now()
    }
  });
  
  expect(createResult).toHaveProperty('_id');
  
  const itemId = createResult._id;
  
  // Read the document
  const readResult = await convex.query(api.database.queryDocuments, {
    table: 'test_items',
    column: '_id',
    value: itemId
  });
  
  expect(readResult).toHaveLength(1);
  expect(readResult[0].name).toBe('Test Item');
  
  // Update the document
  await convex.mutation(api.database.update, {
    table: 'test_items',
    column: '_id',
    value: itemId,
    data: {
      description: 'Updated description'
    }
  });
  
  // Verify update
  const updatedItem = await convex.query(api.database.queryDocuments, {
    table: 'test_items',
    column: '_id',
    value: itemId
  });
  
  expect(updatedItem[0].description).toBe('Updated description');
  
  // Delete the document
  await convex.mutation(api.database.remove, {
    table: 'test_items',
    column: '_id',
    value: itemId
  });
  
  // Verify deletion
  const deletedItem = await convex.query(api.database.queryDocuments, {
    table: 'test_items',
    column: '_id',
    value: itemId
  });
  
  expect(deletedItem).toHaveLength(0);
});

test('should handle authentication errors', async () => {
  // Test with invalid OTP
  await expect(
    convex.mutation(api.auth.login, {
      phone: testUser.phone,
      otp: 'wrong-otp'
    })
  ).rejects.toThrow();
  
  // Test with non-existent user
  await expect(
    convex.mutation(api.auth.login, {
      phone: '+1234567890',
      otp: '123456'
    })
  ).rejects.toThrow();
});
