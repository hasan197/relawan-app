import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserFromToken } from "./auth";

/**
 * Generate upload information for file upload to Backblaze B2
 */
export const generateUploadUrl = mutation({
  args: {
    fileType: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromToken(ctx, args.token);
    if (!user) throw new Error("Unauthenticated");
    // For Backblaze B2, we don't need presigned URLs
    // We'll upload directly from the backend
    return {
      uploadUrl: null, // Not used for B2
      fileUrl: null,  // Will be generated after upload
      uploadMethod: "direct", // Indicates backend will handle upload
      maxSize: 5 * 1024 * 1024, // 5MB limit
    };
  },
});

/**
 * Store the file URL after successful upload (legacy compatibility)
 */
export const confirmUpload = mutation({
  args: {
    donationId: v.id("donations"),
    fileUrl: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromToken(ctx, args.token);
    if (!user) throw new Error("Unauthenticated");
    // Update the donation with the file URL
    await ctx.db.patch(args.donationId, {
      buktiTransferUrl: args.fileUrl,
    });

    return {
      success: true,
      fileUrl: args.fileUrl,
    };
  },
});

/**
 * Get file info for a donation
 */
export const getFileInfo = query({
  args: {
    donationId: v.id("donations"),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromToken(ctx, args.token);
    if (!user) throw new Error("Unauthenticated");
    const donation = await ctx.db.get(args.donationId);

    if (!donation) {
      throw new Error("Donation not found");
    }

    return {
      fileUrl: donation.buktiTransferUrl,
      hasFile: !!donation.buktiTransferUrl,
    };
  },
});

/**
 * Delete file from storage
 */
export const deleteFile = mutation({
  args: {
    donationId: v.id("donations"),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromToken(ctx, args.token);
    if (!user) throw new Error("Unauthenticated");
    const donation = await ctx.db.get(args.donationId);

    if (!donation || !donation.buktiTransferUrl) {
      return { success: false, error: "No file to delete" };
    }

    // For now, we'll just remove the URL from the donation
    // B2 deletion would require fileId which we'd need to store separately
    await ctx.db.patch(args.donationId, {
      buktiTransferUrl: null,
    });

    return { success: true };
  },
});
