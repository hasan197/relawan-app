"use node";

import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// Import new storage system
import { StorageManager } from "./storage/StorageManager";

/**
 * Legacy upload function - maintains backward compatibility
 * @deprecated Use uploadFileToStorage instead
 */
export const uploadFileToB2 = action({
  args: {
    fileData: v.bytes(), // File data as bytes
    fileName: v.string(),
    fileType: v.string(),
    donationId: v.id("donations"),
  },
  handler: async (ctx, args) => {
    console.log('🔄 Using legacy uploadFileToB2 - redirecting to StorageManager');

    // Force reset to ensure we pick up latest env vars
    StorageManager.resetInstance();

    // Use new StorageManager directly to avoid "action calling action" warning
    const storageManager = StorageManager.getInstance();
    const result = await storageManager.uploadFile(
      args.fileData,
      args.fileName,
      args.fileType,
      args.donationId,
      undefined, // provider default
      ctx // Pass context
    );

    return result;
  },
});

/**
 * Legacy getDownloadUrl function - maintains backward compatibility
 * @deprecated Use getStorageDownloadUrl instead
 */
export const getDownloadUrl = action({
  args: {
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('🔄 Using legacy getDownloadUrl - redirecting to StorageManager');

    // Use new StorageManager directly
    const storageManager = StorageManager.getInstance();
    const result = await storageManager.getDownloadUrl(
      args.fileName,
      undefined, // provider default
      ctx // Pass context
    );

    return result;
  },
});

/**
 * Legacy serveBuktiTransfer function - maintains backward compatibility
 * @deprecated Use getStorageFileContent instead
 */
export const serveBuktiTransfer = action({
  args: {
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('🔄 Using legacy serveBuktiTransfer - redirecting to StorageManager');

    // Use new StorageManager directly
    const storageManager = StorageManager.getInstance();
    const result = await storageManager.getFileContent(
      args.fileUrl,
      undefined, // provider default
      ctx // Pass context
    );

    return result;
  },
});
