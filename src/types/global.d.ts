// Type definitions for global objects

// Extend the Window interface to include supabase
declare global {
  interface Window {
    supabase: any; // You can replace 'any' with a more specific type if needed
  }
}

// This file doesn't need to export anything since it's augmenting global types
export {};
