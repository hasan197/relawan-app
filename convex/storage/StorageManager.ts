"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { StorageProvider, StorageUploadResult, StorageDownloadResult, StorageFileContentResult } from "./StorageProvider";
import { BackblazeStorageProvider } from "./BackblazeStorageProvider";
import { ConvexStorageProvider } from "./ConvexStorageProvider";
import type { StorageProviderType } from "./StorageProvider";

/**
 * Storage Manager - Factory for managing multiple storage providers
 */
export class StorageManager {
  private static instance: StorageManager;
  private providers: Map<string, StorageProvider> = new Map();
  private defaultProvider: string;

  constructor() {
    // Initialize providers
    this.providers.set('backblaze', new BackblazeStorageProvider());
    this.providers.set('convex', new ConvexStorageProvider());

    // Set default provider from environment with validation
    const envProvider = process.env.STORAGE_PROVIDER;
    const validProviders = ['backblaze', 'convex'];

    if (envProvider && validProviders.includes(envProvider)) {
      this.defaultProvider = envProvider;
    } else {
      this.defaultProvider = 'convex'; // Always default to convex
      if (envProvider && !validProviders.includes(envProvider)) {
        console.warn(`⚠️ Invalid STORAGE_PROVIDER "${envProvider}", defaulting to "convex"`);
      }
    }

    console.log('🗄️ Storage Manager initialized:', {
      availableProviders: Array.from(this.providers.keys()),
      defaultProvider: this.defaultProvider,
      envStorageProvider: process.env.STORAGE_PROVIDER
    });
  }

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  public static resetInstance(): void {
    // @ts-ignore
    StorageManager.instance = undefined;
    console.log('🔄 StorageManager instance reset');
  }

  public getProvider(providerType?: StorageProviderType): StorageProvider {
    const type = providerType || this.defaultProvider;
    const provider = this.providers.get(type);

    if (!provider) {
      throw new Error(`Storage provider '${type}' not found. Available: ${Array.from(this.providers.keys()).join(', ')}`);
    }

    return provider;
  }

  public async uploadFile(
    fileData: ArrayBuffer,
    fileName: string,
    contentType: string,
    donationId: string,
    providerType?: StorageProviderType,
    ctx?: any // Optional context
  ): Promise<StorageUploadResult> {
    const type = providerType || this.defaultProvider;
    console.log(`🔍 StorageManager.uploadFile called:`, {
      requestedProvider: providerType,
      selectedProvider: type,
      defaultProvider: this.defaultProvider
    });

    const provider = this.getProvider(providerType);
    console.log(`📤 Uploading file using ${provider.name} provider`);
    return provider.uploadFile(fileData, fileName, contentType, donationId, ctx);
  }

  public async getDownloadUrl(
    fileName: string,
    providerType?: StorageProviderType,
    ctx?: any // Optional context
  ): Promise<StorageDownloadResult> {
    const provider = this.getProvider(providerType);
    console.log(`🔗 Getting download URL using ${provider.name} provider`);
    return provider.getDownloadUrl(fileName, ctx);
  }

  public async getFileContent(
    fileUrl: string,
    providerType?: StorageProviderType,
    ctx?: any // Optional context
  ): Promise<StorageFileContentResult> {
    const provider = this.getProvider(providerType);
    console.log(`📄 Getting file content using ${provider.name} provider`);
    return provider.getFileContent(fileUrl, ctx);
  }

  public getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  public getDefaultProvider(): string {
    return this.defaultProvider;
  }
}

/**
 * Convex Actions for Storage Operations
 */

/**
 * Upload file to storage (uses configured provider)
 */
export const uploadFileToStorage = action({
  args: {
    fileData: v.bytes(),
    fileName: v.string(),
    fileType: v.string(),
    donationId: v.id("donations"),
    provider: v.optional(v.union(v.literal("backblaze"), v.literal("convex"))),
  },
  handler: async (ctx, args) => {
    try {
      console.log('🚀 Starting storage upload for donation:', args.donationId);
      console.log('📁 File info:', {
        fileName: args.fileName,
        fileType: args.fileType,
        fileSize: args.fileData.byteLength,
        provider: args.provider || 'default'
      });

      const storageManager = StorageManager.getInstance();
      const result = await storageManager.uploadFile(
        args.fileData,
        args.fileName,
        args.fileType,
        args.donationId,
        args.provider,
        ctx // Pass context
      );

      console.log('📤 Storage upload result:', result);
      return result;
    } catch (error) {
      console.error('❌ Storage upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  },
});

/**
 * Get download URL from storage
 */
export const getStorageDownloadUrl = action({
  args: {
    fileName: v.string(),
    provider: v.optional(v.union(v.literal("backblaze"), v.literal("convex"))),
  },
  handler: async (ctx, args) => {
    try {
      console.log('🔗 Getting storage download URL for:', args.fileName);

      const storageManager = StorageManager.getInstance();
      const result = await storageManager.getDownloadUrl(args.fileName, args.provider, ctx);

      console.log('🔗 Storage download URL result:', result);
      return result;
    } catch (error) {
      console.error('❌ Get download URL failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get download URL'
      };
    }
  },
});

/**
 * Get file content from storage (for preview)
 */
export const getStorageFileContent = action({
  args: {
    fileUrl: v.string(),
    provider: v.optional(v.union(v.literal("backblaze"), v.literal("convex"))),
  },
  handler: async (ctx, args) => {
    try {
      console.log('📄 Getting storage file content from:', args.fileUrl);

      const storageManager = StorageManager.getInstance();
      const result = await storageManager.getFileContent(args.fileUrl, args.provider, ctx);

      console.log('📄 Storage file content result:', { success: result.success, size: result.size });
      return result;
    } catch (error) {
      console.error('❌ Get file content failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get file content'
      };
    }
  },
});
