"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

// B2 API configuration
const B2_API_URL = 'https://api.backblazeb2.com/b2api/v2';

interface B2AuthResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
  minimumPartSize: number;
  recommendedPartSize: string;
  accountId: string; // Added missing accountId
}

interface B2UploadUrlResponse {
  bucketId: string;
  uploadUrl: string;
  authorizationToken: string;
}

interface B2FileUploadResponse {
  fileId: string;
  fileName: string;
  accountId: string;
  bucketId: string;
  size: number;
  contentType: string;
  contentSha1: string;
  fileInfo: Record<string, string>;
  action: string;
  uploadTimestamp: number;
}

/**
 * Backblaze B2 Client for Convex
 */
class BackblazeB2Client {
  private authData: B2AuthResponse | null = null;
  private authExpiry: number = 0;
  private bucketId: string | null = null;

  constructor(
    private applicationKeyId: string,
    private applicationKey: string,
    private bucketName: string
  ) {}

  /**
   * Authorize with Backblaze B2 API
   */
  private async authorize(): Promise<B2AuthResponse> {
    // Check if we have valid cached auth
    if (this.authData && Date.now() < this.authExpiry) {
      return this.authData;
    }

    const credentials = Buffer.from(`${this.applicationKeyId}:${this.applicationKey}`).toString('base64');
    
    const response = await fetch(`${B2_API_URL}/b2_authorize_account`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`B2 Authorization failed: ${response.statusText}`);
    }

    const authData: B2AuthResponse = await response.json();
    
    // Cache auth data for 23 hours (B2 tokens last 24 hours)
    this.authData = authData;
    this.authExpiry = Date.now() + (23 * 60 * 60 * 1000);

    return authData;
  }

  /**
 * Public method for authentication
   */
  public async authenticate(): Promise<B2AuthResponse> {
    return this.authorize();
  }

  /**
   * Public method for getting bucket ID
   */
  public async getBucketId(): Promise<string> {
    return this.getBucketIdInternal();
  }

  /**
   * Get bucket ID from bucket name
   */
  private async getBucketIdInternal(): Promise<string> {
    if (this.bucketId) {
      return this.bucketId;
    }

    const auth = await this.authorize();
    
    const response = await fetch(`${auth.apiUrl}/b2api/v2/b2_list_buckets`, {
      method: 'POST',
      headers: {
        'Authorization': auth.authorizationToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: auth.accountId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to list buckets: ${response.statusText}`);
    }

    const bucketsData = await response.json();
    const bucket = bucketsData.buckets.find((b: any) => b.bucketName === this.bucketName);
    
    if (!bucket) {
      throw new Error(`Bucket '${this.bucketName}' not found`);
    }

    this.bucketId = bucket.bucketId;
    return this.bucketId!; // Non-null assertion since we just set it
  }

  /**
   * Get upload URL for the bucket
   */
  private async getUploadUrl(): Promise<B2UploadUrlResponse> {
    const auth = await this.authorize();
    const bucketId = await this.getBucketId();
    
    const response = await fetch(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: 'POST',
      headers: {
        'Authorization': auth.authorizationToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId: bucketId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Upload file to Backblaze B2
   */
  async uploadFile(
    file: ArrayBuffer | Uint8Array,
    fileName: string,
    contentType: string = 'application/octet-stream'
  ): Promise<{
    fileId: string;
    fileName: string;
    downloadUrl: string;
    size: number;
  }> {
    const uploadUrl = await this.getUploadUrl();

    // Convert to Buffer for crypto and ensure proper type for fetch
    const fileBuffer = Buffer.from(file as ArrayBuffer); // Explicit type cast
    
    // Calculate SHA1 hash of the file using Node.js crypto
    const crypto = require('crypto');
    const hash = crypto.createHash('sha1');
    hash.update(fileBuffer);
    const sha1Hash = hash.digest('hex');

    const response = await fetch(uploadUrl.uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': uploadUrl.authorizationToken,
        'X-Bz-File-Name': fileName,
        'Content-Type': contentType,
        'Content-Length': fileBuffer.byteLength.toString(),
        'X-Bz-Content-Sha1': sha1Hash,
        'X-Bz-Info-Author': 'relawan-app',
        'X-Bz-Info-Upload-Timestamp': Date.now().toString(),
      },
      body: fileBuffer, // Use Buffer instead of ArrayBuffer/Uint8Array
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
    }

    const uploadResult: B2FileUploadResponse = await response.json();
    const auth = await this.authorize();

    return {
      fileId: uploadResult.fileId,
      fileName: uploadResult.fileName,
      downloadUrl: `${auth.downloadUrl}/file/${this.bucketName}/${uploadResult.fileName}`,
      size: uploadResult.size,
    };
  }
}

/**
 * Create B2 client instance for Convex
 */
function createB2Client(): BackblazeB2Client {
  const applicationKeyId = process.env.B2_APPLICATION_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY;
  const bucketName = process.env.B2_BUCKET_NAME || 'relawan-app-bukti-transfer';

  if (!applicationKeyId || !applicationKey) {
    throw new Error('Backblaze B2 credentials not configured');
  }

  return new BackblazeB2Client(applicationKeyId, applicationKey, bucketName);
}

/**
 * Upload file directly to Backblaze B2
 * This handles the actual file upload from Convex backend
 */
export const uploadFileToB2 = action({
  args: {
    fileData: v.bytes(), // File data as bytes
    fileName: v.string(),
    fileType: v.string(),
    donationId: v.id("donations"),
  },
  handler: async (ctx, args) => {
    try {
      console.log('🚀 Starting B2 upload for donation:', args.donationId);
      console.log('📁 File info:', {
        fileName: args.fileName,
        fileType: args.fileType,
        fileSize: args.fileData.byteLength,
      });
      
      const b2Client = createB2Client();
      
      // Generate unique filename with donation ID
      const uniqueFileName = `bukti-transfer/${args.donationId}/${Date.now()}-${args.fileName}`;
      console.log('📝 Generated filename:', uniqueFileName);
      
      // Upload file to Backblaze B2
      console.log('⬆️ Uploading to B2...');
      const uploadResult = await b2Client.uploadFile(
        args.fileData,
        uniqueFileName,
        args.fileType
      );
      
      console.log('✅ B2 upload successful:', {
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        downloadUrl: uploadResult.downloadUrl,
        size: uploadResult.size,
      });

      // Update donation with file URL using scheduler (bypasses action limitations)
      console.log('💾 Updating donation database...');
      await ctx.scheduler.runAfter(0, "donations:updateBuktiTransferUrl", {
        donationId: args.donationId,
        buktiTransferUrl: uploadResult.downloadUrl,
      });
      
      console.log('✅ Database update scheduled');

      return {
        success: true,
        fileUrl: uploadResult.downloadUrl,
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        size: uploadResult.size,
      };
    } catch (error: any) {
      console.error('❌ B2 Upload error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        error: error.message || 'Failed to upload file to B2',
      };
    }
  },
});

/**
 * Fetch and serve bukti transfer file content
 */
export const serveBuktiTransfer = action({
  args: {
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log('🔍 Fetching file from URL:', args.fileUrl);
      
      // Parse the URL to extract file path
      const url = new URL(args.fileUrl);
      const filePath = url.pathname.replace(`/file/${process.env.B2_BUCKET_NAME}/`, '');
      console.log('🔍 Extracted file path:', filePath);
      
      // Use the same client creation as uploadFileToB2
      const b2Client = createB2Client();
      
      // Get auth data
      const authData = await b2Client.authenticate();
      console.log('🔍 Authenticated with B2');
      
      // Try to fetch file directly with auth header
      const response = await fetch(args.fileUrl, {
        headers: {
          'Authorization': authData.authorizationToken,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      
      // Return data URL that can be opened directly
      const dataUrl = `data:${contentType};base64,${base64}`;
      
      return {
        success: true,
        url: dataUrl,
        contentType,
        size: buffer.byteLength
      };
    } catch (error) {
      console.error('Failed to serve bukti transfer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});

/**
 * Generate signed URL for file download
 */
export const getDownloadUrl = action({
  args: {
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const client = new BackblazeB2Client(
      process.env.B2_KEY_ID!,
      process.env.B2_APP_KEY!,
      process.env.B2_BUCKET_NAME!
    );

    try {
      const authData = await client.authorize();
      
      // Generate download URL with signed token (if needed)
      // For B2, we can use the public download URL with auth token
      const downloadUrl = `${authData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${args.fileName}`;
      
      return {
        success: true,
        url: downloadUrl,
        authToken: authData.authorizationToken
      };
    } catch (error) {
      console.error('Failed to generate download URL:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});
