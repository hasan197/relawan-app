"use node";

import { describe, it, expect, beforeEach, vi } from "vitest";
import { BackblazeStorageProvider } from "../../../convex/storage/BackblazeStorageProvider";
import type { StorageUploadResult, StorageDownloadResult, StorageFileContentResult } from "../../../convex/storage/StorageProvider";
import { createB2Client } from "../../../convex/storage/BackblazeClient";

// Mock BackblazeClient
vi.mock("../../../convex/storage/BackblazeClient", () => ({
  createB2Client: vi.fn(),
}));

describe("BackblazeStorageProvider", () => {
  let provider: BackblazeStorageProvider;
  let mockB2Client: any;
  let mockCreateB2Client: any;

  beforeEach(() => {
    provider = new BackblazeStorageProvider();

    // Mock B2 client
    mockB2Client = {
      uploadFile: vi.fn(),
      getDownloadUrl: vi.fn(),
      authenticate: vi.fn(),
    };

    mockCreateB2Client = createB2Client as any;
    mockCreateB2Client.mockReturnValue(mockB2Client);
  });

  describe("Basic Properties", () => {
    it("should have correct name", () => {
      expect(provider.name).toBe("Backblaze B2");
    });
  });

  describe("Upload Functionality", () => {
    const mockFileData = new ArrayBuffer(1024);
    const mockFileName = "test.jpg";
    const mockContentType = "image/jpeg";
    const mockDonationId = "test-donation-123";

    it("should generate correct filename format", async () => {
      const mockUploadResult = {
        success: true,
        url: "https://download.backblazeb2.com/file/bucket/test.jpg",
        fileId: "file-123"
      };

      mockB2Client.uploadFile.mockResolvedValue(mockUploadResult);

      await provider.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );

      // Check that filename includes donation ID and timestamp
      const callArgs = mockB2Client.uploadFile.mock.calls[0];
      const fileName = callArgs[1];
      expect(fileName).toMatch(/^bukti-transfer\/test-donation-123\/\d+-test\.jpg$/);
    });

    it("should handle upload success", async () => {
      const mockUploadResult = {
        success: true,
        url: "https://download.backblazeb2.com/file/bucket/test.jpg",
        fileId: "file-123"
      };

      mockB2Client.uploadFile.mockResolvedValue(mockUploadResult);

      const result = await provider.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );

      expect(result).toEqual({
        success: true,
        url: mockUploadResult.url,
        fileName: expect.stringMatching(/^bukti-transfer\/test-donation-123\/\d+-test\.jpg$/)
      });

      expect(mockB2Client.uploadFile).toHaveBeenCalledWith(
        mockFileData,
        expect.stringMatching(/^bukti-transfer\/test-donation-123\/\d+-test\.jpg$/),
        mockContentType
      );
    });

    it("should handle upload failure", async () => {
      const mockError = new Error("B2 upload failed");
      mockB2Client.uploadFile.mockRejectedValue(mockError);

      const result = await provider.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );

      expect(result).toEqual({
        success: false,
        error: "B2 upload failed"
      });
    });

    it("should handle B2 client creation failure", async () => {
      mockCreateB2Client.mockImplementation(() => {
        throw new Error("B2 credentials not configured");
      });

      const result = await provider.uploadFile(
        mockFileData,
        mockFileName,
        mockContentType,
        mockDonationId
      );

      expect(result).toEqual({
        success: false,
        error: "B2 credentials not configured"
      });
    });
  });

  describe("Download URL Functionality", () => {
    const mockFileName = "bukti-transfer/test-donation-123/1234567890-test.jpg";

    it("should get download URL from B2", async () => {
      const mockDownloadResult = {
        success: true,
        url: "https://download.backblazeb2.com/file/bucket/test.jpg"
      };
      mockB2Client.getDownloadUrl.mockResolvedValue(mockDownloadResult);

      const result = await provider.getDownloadUrl(mockFileName);

      expect(result).toEqual(mockDownloadResult);
      expect(mockB2Client.getDownloadUrl).toHaveBeenCalledWith(mockFileName);
    });

    it("should handle download URL failure", async () => {
      const mockError = new Error("File not found in B2");
      mockB2Client.getDownloadUrl.mockRejectedValue(mockError);

      const result = await provider.getDownloadUrl(mockFileName);

      expect(result).toEqual({
        success: false,
        error: "File not found in B2"
      });
    });
  });

  describe("File Content Functionality", () => {
    const mockFileUrl = "https://download.backblazeb2.com/file/bucket/test.jpg";

    it("should get file content from B2", async () => {
      // Mock fetch for file content
      const mockContent = new ArrayBuffer(2048);
      const mockAuthData = {
        authorizationToken: "mock-auth-token",
        apiUrl: "https://api.backblazeb2.com",
        downloadUrl: "https://download.backblazeb2.com"
      };

      mockB2Client.authenticate.mockResolvedValue(mockAuthData);

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: {
          get: () => "image/jpeg"
        },
        arrayBuffer: async () => mockContent
      });

      const result = await provider.getFileContent(mockFileUrl);

      expect(result.success).toBe(true);
      expect(result.size).toBe(2048);
    });

    it("should handle file content failure", async () => {
      const mockError = new Error("Access denied to B2 file");
      mockB2Client.authenticate.mockRejectedValue(mockError);

      const result = await provider.getFileContent(mockFileUrl);

      expect(result).toEqual({
        success: false,
        error: "Access denied to B2 file"
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle null errors gracefully", async () => {
      mockB2Client.uploadFile.mockRejectedValue(null);

      const result = await provider.uploadFile(
        new ArrayBuffer(1024),
        "test.jpg",
        "image/jpeg",
        "test-id"
      );

      expect(result).toEqual({
        success: false,
        error: "Backblaze upload failed"
      });
    });

    it("should handle string errors", async () => {
      mockB2Client.uploadFile.mockRejectedValue("String error message");

      const result = await provider.uploadFile(
        new ArrayBuffer(1024),
        "test.jpg",
        "image/jpeg",
        "test-id"
      );

      expect(result).toEqual({
        success: false,
        error: "Backblaze upload failed"
      });
    });

    it("should handle object errors without message", async () => {
      mockB2Client.uploadFile.mockRejectedValue({ code: "ERROR_CODE" });

      const result = await provider.uploadFile(
        new ArrayBuffer(1024),
        "test.jpg",
        "image/jpeg",
        "test-id"
      );

      expect(result).toEqual({
        success: false,
        error: "Backblaze upload failed"
      });
    });
  });

  describe("Filename Generation", () => {
    it("should generate unique filenames with timestamp", async () => {
      const mockUploadResult = {
        success: true,
        url: "https://download.backblazeb2.com/file/bucket/test.jpg",
        fileId: "file-123"
      };

      mockB2Client.uploadFile.mockResolvedValue(mockUploadResult);

      // Upload same file twice
      await provider.uploadFile(
        new ArrayBuffer(1024),
        "test.jpg",
        "image/jpeg",
        "test-donation-123"
      );

      const firstCall = mockB2Client.uploadFile.mock.calls[0];
      const firstFileName = firstCall[1];

      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1));

      await provider.uploadFile(
        new ArrayBuffer(1024),
        "test.jpg",
        "image/jpeg",
        "test-donation-123"
      );

      const secondCall = mockB2Client.uploadFile.mock.calls[1];
      const secondFileName = secondCall[1];

      // Filenames should be different (different timestamps)
      expect(firstFileName).not.toBe(secondFileName);

      // But both should follow the same pattern
      expect(firstFileName).toMatch(/^bukti-transfer\/test-donation-123\/\d+-test\.jpg$/);
      expect(secondFileName).toMatch(/^bukti-transfer\/test-donation-123\/\d+-test\.jpg$/);
    });
  });
});
