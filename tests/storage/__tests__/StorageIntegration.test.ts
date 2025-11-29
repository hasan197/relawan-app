"use node";

import { describe, it, expect, beforeEach, vi } from "vitest";
import { StorageManager } from "../../../convex/storage/StorageManager";
import { BackblazeStorageProvider } from "../../../convex/storage/BackblazeStorageProvider";
import { ConvexStorageProvider } from "../../../convex/storage/ConvexStorageProvider";

// Mock environment variables
const originalEnv = process.env;

describe("Storage Integration Tests", () => {
  beforeEach(() => {
    // Reset instance before each test
    (StorageManager as any).instance = null;
    
    // Reset environment
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe("Environment-Based Provider Selection", () => {
    it("should use Convex when STORAGE_PROVIDER=convex", () => {
      process.env.STORAGE_PROVIDER = "convex";
      
      const storageManager = StorageManager.getInstance();
      const defaultProvider = storageManager.getDefaultProvider();
      
      expect(defaultProvider).toBe("convex");
    });

    it("should use Backblaze when STORAGE_PROVIDER=backblaze", () => {
      process.env.STORAGE_PROVIDER = "backblaze";
      
      const storageManager = StorageManager.getInstance();
      const defaultProvider = storageManager.getDefaultProvider();
      
      expect(defaultProvider).toBe("backblaze");
    });

    it("should default to Convex when STORAGE_PROVIDER is not set", () => {
      delete process.env.STORAGE_PROVIDER;
      
      const storageManager = StorageManager.getInstance();
      const defaultProvider = storageManager.getDefaultProvider();
      
      expect(defaultProvider).toBe("convex");
    });

    it("should default to Convex when STORAGE_PROVIDER is invalid", () => {
      process.env.STORAGE_PROVIDER = "invalid-provider";
      
      const storageManager = StorageManager.getInstance();
      const defaultProvider = storageManager.getDefaultProvider();
      
      expect(defaultProvider).toBe("convex");
    });
  });

  describe("Provider Switching", () => {
    it("should switch providers based on environment change", () => {
      // Start with Convex
      process.env.STORAGE_PROVIDER = "convex";
      let storageManager = StorageManager.getInstance();
      expect(storageManager.getDefaultProvider()).toBe("convex");

      // Change to Backblaze
      (StorageManager as any).instance = null;
      process.env.STORAGE_PROVIDER = "backblaze";
      storageManager = StorageManager.getInstance();
      expect(storageManager.getDefaultProvider()).toBe("backblaze");
    });
  });

  describe("Provider Interface Consistency", () => {
    it("should ensure all providers implement the same interface", () => {
      const storageManager = StorageManager.getInstance();
      const backblazeProvider = storageManager.getProvider("backblaze");
      const convexProvider = storageManager.getProvider("convex");

      // Both should have required methods
      expect(typeof backblazeProvider.uploadFile).toBe("function");
      expect(typeof backblazeProvider.getDownloadUrl).toBe("function");
      expect(typeof backblazeProvider.getFileContent).toBe("function");

      expect(typeof convexProvider.uploadFile).toBe("function");
      expect(typeof convexProvider.getDownloadUrl).toBe("function");
      expect(typeof convexProvider.getFileContent).toBe("function");

      // Both should have name property
      expect(backblazeProvider.name).toBe("Backblaze B2");
      expect(convexProvider.name).toBe("Convex File Storage");
    });
  });

  describe("Error Handling Consistency", () => {
    it("should handle provider errors consistently", async () => {
      const storageManager = StorageManager.getInstance();
      const mockFileData = new ArrayBuffer(1024);
      const mockFileName = "test.jpg";
      const mockContentType = "image/jpeg";
      const mockDonationId = "test-donation-123";

      // Test with invalid provider
      await expect(
        storageManager.uploadFile(
          mockFileData,
          mockFileName,
          mockContentType,
          mockDonationId,
          "invalid" as any
        )
      ).rejects.toThrow("Storage provider 'invalid' not found");
    });
  });

  describe("Configuration Validation", () => {
    it("should validate available providers", () => {
      const storageManager = StorageManager.getInstance();
      const availableProviders = storageManager.getAvailableProviders();

      expect(availableProviders).toContain("backblaze");
      expect(availableProviders).toContain("convex");
      expect(availableProviders).toHaveLength(2);
    });

    it("should handle provider retrieval correctly", () => {
      const storageManager = StorageManager.getInstance();

      // Test valid providers
      const backblazeProvider = storageManager.getProvider("backblaze");
      expect(backblazeProvider).toBeInstanceOf(BackblazeStorageProvider);

      const convexProvider = storageManager.getProvider("convex");
      expect(convexProvider).toBeInstanceOf(ConvexStorageProvider);

      // Test default provider (no argument)
      const defaultProvider = storageManager.getProvider();
      expect(defaultProvider).toBeDefined();
    });
  });

  describe("Real-World Scenarios", () => {
    it("should handle typical upload workflow", async () => {
      const storageManager = StorageManager.getInstance();
      
      // Mock the upload methods
      const mockBackblazeProvider = storageManager.getProvider("backblaze");
      const mockConvexProvider = storageManager.getProvider("convex");
      
      const mockResult = { 
        success: true, 
        url: "test-url", 
        fileName: "test-file.jpg" 
      };

      mockBackblazeProvider.uploadFile = vi.fn().mockResolvedValue(mockResult);
      mockConvexProvider.uploadFile = vi.fn().mockResolvedValue(mockResult);

      const mockFileData = new ArrayBuffer(1024);
      const mockFileName = "test.jpg";
      const mockContentType = "image/jpeg";
      const mockDonationId = "test-donation-123";

      // Test with default provider
      const result1 = await storageManager.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );

      expect(result1).toEqual(mockResult);

      // Test with explicit provider
      const result2 = await storageManager.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId,
        "backblaze"
      );

      expect(result2).toEqual(mockResult);
      expect(mockBackblazeProvider.uploadFile).toHaveBeenCalled();
    });

    it("should handle typical download workflow", async () => {
      const storageManager = StorageManager.getInstance();
      
      // Mock the download methods
      const mockBackblazeProvider = storageManager.getProvider("backblaze");
      const mockConvexProvider = storageManager.getProvider("convex");
      
      const mockResult = { success: true, url: "download-url" };

      mockBackblazeProvider.getDownloadUrl = vi.fn().mockResolvedValue(mockResult);
      mockConvexProvider.getDownloadUrl = vi.fn().mockResolvedValue(mockResult);

      const mockFileName = "test-file.jpg";

      // Test with default provider
      const result1 = await storageManager.getDownloadUrl(mockFileName);

      expect(result1).toEqual(mockResult);

      // Test with explicit provider
      const result2 = await storageManager.getDownloadUrl(mockFileName, "backblaze");

      expect(result2).toEqual(mockResult);
      expect(mockBackblazeProvider.getDownloadUrl).toHaveBeenCalledWith(mockFileName);
    });
  });

  describe("Performance and Reliability", () => {
    it("should maintain singleton pattern under stress", () => {
      const instances = [];
      
      // Create multiple instances rapidly
      for (let i = 0; i < 100; i++) {
        instances.push(StorageManager.getInstance());
      }

      // All should be the same instance
      const firstInstance = instances[0];
      instances.forEach(instance => {
        expect(instance).toBe(firstInstance);
      });
    });

    it("should handle concurrent operations", async () => {
      const storageManager = StorageManager.getInstance();
      
      // Mock the upload method
      const mockProvider = storageManager.getProvider("convex");
      mockProvider.uploadFile = vi.fn().mockResolvedValue({ 
        success: true, 
        url: "test-url" 
      });

      const mockFileData = new ArrayBuffer(1024);
      const mockFileName = "test.jpg";
      const mockContentType = "image/jpeg";
      const mockDonationId = "test-donation-123";

      // Run multiple uploads concurrently
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          storageManager.uploadFile(
            mockFileData,
            mockFileName,
            mockContentType,
            mockDonationId
          )
        );
      }

      const results = await Promise.all(promises);
      
      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Should have been called 10 times
      expect(mockProvider.uploadFile).toHaveBeenCalledTimes(10);
    });
  });
});
