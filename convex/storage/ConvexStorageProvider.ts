"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { StorageProvider, StorageUploadResult, StorageDownloadResult, StorageFileContentResult } from "./StorageProvider";

/**
 * Convex File Storage Provider Implementation
 * Uses Convex's built-in file storage system
 */
export class ConvexStorageProvider implements StorageProvider {
  name = 'Convex File Storage';

  async uploadFile(fileData: ArrayBuffer, fileName: string, contentType: string, donationId: string, ctx?: any): Promise<StorageUploadResult> {
    try {
      if (!ctx) {
        throw new Error('Convex context (ctx) is required for Convex storage upload');
      }

      // Generate unique filename with donation ID
      const uniqueFileName = `bukti-transfer/${donationId}/${Date.now()}-${fileName}`;
      console.log('📝 Generated Convex filename:', uniqueFileName);

      // Upload to Convex storage using the provided context
      // Convert ArrayBuffer to Blob as required by Convex storage
      const blob = new Blob([fileData], { type: contentType });
      const storageId = await ctx.storage.store(blob);

      console.log('✅ Convex upload success:', storageId);

      return {
        success: true,
        url: storageId, // In Convex, we store the storageId
        fileName: uniqueFileName
      };
    } catch (error) {
      console.error('❌ Convex upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Convex upload failed'
      };
    }
  }

  async getDownloadUrl(fileName: string, ctx?: any): Promise<StorageDownloadResult> {
    try {
      if (!ctx) {
        // If no context, return the storageId as URL (frontend handles generation)
        return {
          success: true,
          url: fileName,
          error: 'Context missing, returned storageId as URL'
        };
      }

      // If we have context, we can generate a signed URL
      const url = await ctx.storage.getUrl(fileName); // fileName is storageId

      if (!url) {
        throw new Error('Failed to generate URL');
      }

      return {
        success: true,
        url: url
      };
    } catch (error) {
      console.error('❌ Convex getDownloadUrl failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get download URL'
      };
    }
  }

  async getFileContent(fileUrl: string, ctx?: any): Promise<StorageFileContentResult> {
    try {
      if (!ctx) {
        throw new Error('Convex context (ctx) is required to fetch file content');
      }

      const storageId = fileUrl;
      const blob = await ctx.storage.get(storageId);

      if (!blob) {
        throw new Error('File not found in storage');
      }

      const arrayBuffer = await blob.arrayBuffer();

      return {
        success: true,
        url: await ctx.storage.getUrl(storageId),
        content: arrayBuffer,
        contentType: blob.type,
        size: blob.size
      };
    } catch (error) {
      console.error('❌ Convex getFileContent failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get file content'
      };
    }
  }

  private async uploadToConvexStorage(fileData: ArrayBuffer, fileName: string): Promise<string> {
    // Deprecated internal method, logic moved to uploadFile
    return `convex-storage-${Date.now()}-${fileName}`;
  }
}

/**
 * Convex Action for uploading files to Convex storage
 */
export const uploadToConvexStorage = action({
  args: {
    fileData: v.bytes(),
    fileName: v.string(),
    donationId: v.id("donations"),
  },
  handler: async (ctx, args) => {
    try {
      console.log('🚀 Starting Convex storage upload for donation:', args.donationId);

      // Generate unique filename
      const uniqueFileName = `bukti-transfer/${args.donationId}/${Date.now()}-${args.fileName}`;

      // Upload to Convex storage
      const blob = new Blob([args.fileData]);
      const storageId = await ctx.storage.store(blob);

      console.log('✅ Convex storage upload success:', { storageId, fileName: uniqueFileName });

      return {
        success: true,
        storageId,
        fileName: uniqueFileName,
        url: storageId // In Convex, the URL is the storageId
      };
    } catch (error) {
      console.error('❌ Convex storage upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Convex storage upload failed'
      };
    }
  },
});

/**
 * Get file from Convex storage
 */
export const getFromConvexStorage = action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    try {
      console.log('🔍 Getting file from Convex storage:', args.storageId);

      // Get file from Convex storage
      const blob = await ctx.storage.get(args.storageId);

      if (!blob) {
        return {
          success: false,
          error: 'File not found in storage'
        };
      }

      // Convert to base64 data URL
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:application/octet-stream;base64,${base64}`;

      return {
        success: true,
        data: dataUrl,
        size: blob.size
      };
    } catch (error) {
      console.error('❌ Get from Convex storage failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get file from storage'
      };
    }
  },
});
