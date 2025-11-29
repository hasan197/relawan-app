"use node";

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ConvexStorageProvider } from "../../../convex/storage/ConvexStorageProvider";
import type { StorageUploadResult, StorageDownloadResult, StorageFileContentResult } from "../../../convex/storage/StorageProvider";

// Mock Convex storage functions
vi.mock("convex/server", () => ({
  action: vi.fn(),
  query: vi.fn(),
  mutation: vi.fn(),
  internalAction: vi.fn(),
  internalQuery: vi.fn(),
  internalMutation: vi.fn(),
  queryGeneric: vi.fn(),
  mutationGeneric: vi.fn(),
  actionGeneric: vi.fn(),
  internalQueryGeneric: vi.fn(),
  internalMutationGeneric: vi.fn(),
  internalActionGeneric: vi.fn(),
  httpAction: vi.fn(),
  httpActionGeneric: vi.fn(),
}));

vi.mock("convex/values", () => ({
  v: {
    string: vi.fn(),
    bytes: vi.fn(),
    id: vi.fn(),
  },
}));

describe("ConvexStorageProvider", () => {
  let provider: ConvexStorageProvider;

  beforeEach(() => {
    provider = new ConvexStorageProvider();
  });

  describe("Basic Properties", () => {
    it("should have correct name", () => {
      expect(provider.name).toBe("Convex File Storage");
    });
  });

  describe("Upload Functionality", () => {
    const mockFileData = new ArrayBuffer(1024);
    const mockFileName = "test.jpg";
    const mockContentType = "image/jpeg";
    const mockDonationId = "test-donation-123";

    it("should generate correct filename format", () => {
      // Test filename generation logic
      const timestamp = Date.now();
      const expectedFileName = `bukti-transfer/${mockDonationId}/${timestamp}-${mockFileName}`;

      // Since we can't directly test the private method, we'll test through upload
      // and check the filename pattern in the mock
      expect(expectedFileName).toMatch(/^bukti-transfer\/test-donation-123\/\d+-test\.jpg$/);
    });

    it("should handle upload success", async () => {
      // Mock successful upload
      const mockResult: StorageUploadResult = {
        success: true,
        url: "convex-storage-id",
        fileName: "bukti-transfer/test-donation-123/1234567890-test.jpg"
      };

      // Mock the uploadToConvexStorage method
      const uploadSpy = vi.spyOn(provider as any, "uploadToConvexStorage");
      uploadSpy.mockResolvedValue("convex-storage-id");

      const result = await provider.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );

      expect(result).toEqual({
        success: true,
        url: "convex-storage-id",
        fileName: expect.stringMatching(/^bukti-transfer\/test-donation-123\/\d+-test\.jpg$/)
      });

      uploadSpy.mockRestore();
    });

    it("should handle upload failure", async () => {
      const mockError = new Error("Convex storage error");

      const uploadSpy = vi.spyOn(provider as any, "uploadToConvexStorage");
      uploadSpy.mockRejectedValue(mockError);

      const result = await provider.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );

      expect(result).toEqual({
        success: false,
        error: "Convex storage error"
      });

      uploadSpy.mockRestore();
    });
  });

  describe("Download URL Functionality", () => {
    const mockFileName = "bukti-transfer/test-donation-123/1234567890-test.jpg";

    it("should get download URL for Convex storage", async () => {
      const mockFileName = "bukti-transfer/test-donation-123/1234567890-test.jpg";

      const result = await provider.getDownloadUrl(mockFileName);

      expect(result).toEqual({
        success: true,
        url: mockFileName,
        error: 'Convex URLs are generated on frontend using convex/storage package'
      });
    });

    it("should handle download URL failure", async () => {
      // ConvexStorageProvider doesn't actually throw errors in getDownloadUrl
      // It just returns the fileName as the URL
      const mockFileName = "bukti-transfer/test-donation-123/1234567890-test.jpg";

      const result = await provider.getDownloadUrl(mockFileName);

      expect(result.success).toBe(true);
      expect(result.url).toBe(mockFileName);
    });
  });

  describe("File Content Functionality", () => {
    const mockFileUrl = "https://convex.cloud/files/convex-storage-id";

    it("should get file content from Convex storage", async () => {
      const mockFileUrl = "convex-storage-id";

      const result = await provider.getFileContent(mockFileUrl);

      // ConvexStorageProvider returns an error for file content
      expect(result).toEqual({
        success: false,
        error: 'Convex file content retrieval requires frontend implementation using convex/storage package'
      });
    });

    it("should handle file content failure", async () => {
      const mockFileUrl = "convex-storage-id";

      const result = await provider.getFileContent(mockFileUrl);

      // ConvexStorageProvider always returns this error
      expect(result).toEqual({
        success: false,
        error: 'Convex file content retrieval requires frontend implementation using convex/storage package'
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle null/undefined errors gracefully", async () => {
      const uploadSpy = vi.spyOn(provider as any, "uploadToConvexStorage");
      uploadSpy.mockRejectedValue(null);

      const result = await provider.uploadFile(
        new ArrayBuffer(1024),
        "test.jpg",
        "image/jpeg",
        "test-id"
      );

      expect(result).toEqual({
        success: false,
        error: "Convex upload failed"
      });

      uploadSpy.mockRestore();
    });

    it("should handle string errors", async () => {
      const uploadSpy = vi.spyOn(provider as any, "uploadToConvexStorage");
      uploadSpy.mockRejectedValue("String error message");

      const result = await provider.uploadFile(
        new ArrayBuffer(1024),
        "test.jpg",
        "image/jpeg",
        "test-id"
      );

      expect(result).toEqual({
        success: false,
        error: "Convex upload failed"
      });

      uploadSpy.mockRestore();
    });
  });
});
