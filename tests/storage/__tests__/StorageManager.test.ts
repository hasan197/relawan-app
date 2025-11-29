"use node";

import { describe, it, expect, beforeEach, vi } from "vitest";
import { StorageManager } from "../../../convex/storage/StorageManager";
import { BackblazeStorageProvider } from "../../../convex/storage/BackblazeStorageProvider";
import { ConvexStorageProvider } from "../../../convex/storage/ConvexStorageProvider";
import type { StorageProvider } from "../../../convex/storage/StorageProvider";

// Mock the providers
vi.mock("../../../convex/storage/BackblazeStorageProvider", () => {
  return {
    BackblazeStorageProvider: vi.fn().mockImplementation(function (this: any) {
      this.name = "Backblaze B2";
      this.uploadFile = vi.fn();
      this.getDownloadUrl = vi.fn();
      this.getFileContent = vi.fn();
    })
  };
});

vi.mock("../../../convex/storage/ConvexStorageProvider", () => {
  return {
    ConvexStorageProvider: vi.fn().mockImplementation(function (this: any) {
      this.name = "Convex File Storage";
      this.uploadFile = vi.fn();
      this.getDownloadUrl = vi.fn();
      this.getFileContent = vi.fn();
    })
  };
});

describe("StorageManager", () => {
  let storageManager: StorageManager;
  let mockBackblazeProvider: any;
  let mockConvexProvider: any;

  beforeEach(() => {
    // Reset instance
    (StorageManager as any).instance = null;

    // Get fresh instances
    storageManager = StorageManager.getInstance();
    mockBackblazeProvider = storageManager.getProvider("backblaze");
    mockConvexProvider = storageManager.getProvider("convex");
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = StorageManager.getInstance();
      const instance2 = StorageManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should initialize providers correctly", () => {
      const providers = storageManager.getAvailableProviders();
      expect(providers).toContain("backblaze");
      expect(providers).toContain("convex");
      expect(providers).toHaveLength(2);
    });
  });

  describe("Provider Selection", () => {
    it("should use default provider when none specified", () => {
      const defaultProvider = storageManager.getDefaultProvider();
      expect(defaultProvider).toBe("convex"); // Set in environment
    });

    it("should return correct provider when specified", () => {
      const backblazeProvider = storageManager.getProvider("backblaze");
      expect(backblazeProvider.name).toBe("Backblaze B2");

      const convexProvider = storageManager.getProvider("convex");
      expect(convexProvider.name).toBe("Convex File Storage");
    });

    it("should throw error for invalid provider", () => {
      expect(() => {
        storageManager.getProvider("invalid" as any);
      }).toThrow("Storage provider 'invalid' not found");
    });
  });

  describe("Environment Configuration", () => {
    it("should use convex as default when STORAGE_PROVIDER is not set", () => {
      const originalEnv = process.env.STORAGE_PROVIDER;
      delete process.env.STORAGE_PROVIDER;

      (StorageManager as any).instance = null;
      const newManager = StorageManager.getInstance();

      expect(newManager.getDefaultProvider()).toBe("convex");

      process.env.STORAGE_PROVIDER = originalEnv;
    });

    it("should use environment variable when set", () => {
      const originalEnv = process.env.STORAGE_PROVIDER;
      process.env.STORAGE_PROVIDER = "backblaze";

      (StorageManager as any).instance = null;
      const newManager = StorageManager.getInstance();

      expect(newManager.getDefaultProvider()).toBe("backblaze");

      process.env.STORAGE_PROVIDER = originalEnv;
    });
  });

  describe("Upload Functionality", () => {
    const mockFileData = new ArrayBuffer(1024);
    const mockFileName = "test.jpg";
    const mockContentType = "image/jpeg";
    const mockDonationId = "test-donation-123";

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should upload using default provider when none specified", async () => {
      const mockResult = { success: true, url: "test-url", fileName: "test-file" };
      mockConvexProvider.uploadFile.mockResolvedValue(mockResult);

      const result = await storageManager.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );

      expect(mockConvexProvider.uploadFile).toHaveBeenCalledWith(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );
      expect(result).toEqual(mockResult);
    });

    it("should upload using specified provider", async () => {
      const mockResult = { success: true, url: "test-url", fileName: "test-file" };
      mockBackblazeProvider.uploadFile.mockResolvedValue(mockResult);

      const result = await storageManager.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId,
        "backblaze"
      );

      expect(mockBackblazeProvider.uploadFile).toHaveBeenCalledWith(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );
      expect(result).toEqual(mockResult);
    });

    it("should handle upload errors", async () => {
      const mockError = new Error("Upload failed");
      mockConvexProvider.uploadFile.mockRejectedValue(mockError);

      await expect(
        storageManager.uploadFile(
          mockFileData,
          mockFileName,
          mockContentType,
          mockDonationId
        )
      ).rejects.toThrow("Upload failed");
    });
  });

  describe("Download URL Functionality", () => {
    const mockFileName = "test-file.jpg";

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should get download URL using default provider", async () => {
      const mockResult = { success: true, url: "download-url" };
      mockConvexProvider.getDownloadUrl.mockResolvedValue(mockResult);

      const result = await storageManager.getDownloadUrl(mockFileName);

      expect(mockConvexProvider.getDownloadUrl).toHaveBeenCalledWith(mockFileName);
      expect(result).toEqual(mockResult);
    });

    it("should get download URL using specified provider", async () => {
      const mockResult = { success: true, url: "download-url" };
      mockBackblazeProvider.getDownloadUrl.mockResolvedValue(mockResult);

      const result = await storageManager.getDownloadUrl(mockFileName, "backblaze");

      expect(mockBackblazeProvider.getDownloadUrl).toHaveBeenCalledWith(mockFileName);
      expect(result).toEqual(mockResult);
    });
  });

  describe("File Content Functionality", () => {
    const mockFileUrl = "https://example.com/file.jpg";

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should get file content using default provider", async () => {
      const mockResult = {
        success: true,
        content: new ArrayBuffer(1024),
        size: 1024
      };
      mockConvexProvider.getFileContent.mockResolvedValue(mockResult);

      const result = await storageManager.getFileContent(mockFileUrl);

      expect(mockConvexProvider.getFileContent).toHaveBeenCalledWith(mockFileUrl);
      expect(result).toEqual(mockResult);
    });

    it("should get file content using specified provider", async () => {
      const mockResult = {
        success: true,
        content: new ArrayBuffer(1024),
        size: 1024
      };
      mockBackblazeProvider.getFileContent.mockResolvedValue(mockResult);

      const result = await storageManager.getFileContent(mockFileUrl, "backblaze");

      expect(mockBackblazeProvider.getFileContent).toHaveBeenCalledWith(mockFileUrl);
      expect(result).toEqual(mockResult);
    });
  });
});
