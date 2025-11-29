"use node";

import { v } from "convex/values";


// B2 API configuration
const B2_API_URL = 'https://api.backblazeb2.com/b2api/v2';

interface B2AuthResponse {
  accountId: string;
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
  minimumPartSize: number;
  recommendedPartSize: string;
}

interface B2UploadUrlResponse {
  bucketId: string;
  uploadUrl: string;
  authorizationToken: string;
}

interface B2UploadResponse {
  fileId: string;
  fileName: string;
  bucketId: string;
  size: number;
  contentType: string;
  checksum: string;
  uploadTimestamp: number;
}

/**
 * Backblaze B2 Client for handling file operations
 */
export class BackblazeB2Client {
  private authData: B2AuthResponse | null = null;
  private authExpiry: number = 0;
  private bucketId: string | null = null;

  constructor(
    private keyId: string,
    private applicationKey: string,
    private bucketName: string
  ) { }

  /**
   * Authenticate with Backblaze B2 API
   */
  private async authorize(): Promise<B2AuthResponse> {
    // Check if we have cached auth data that's still valid
    if (this.authData && Date.now() < this.authExpiry) {
      return this.authData;
    }

    console.log('🔑 Authenticating with Backblaze B2...');

    const credentials = Buffer.from(`${this.keyId}:${this.applicationKey}`).toString('base64');

    const response = await fetch(`${B2_API_URL}/b2_authorize_account`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('B2 Authorization failed:', errorText);
      throw new Error(`B2 Authorization failed: ${errorText}`);
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
        bucketName: this.bucketName,
        bucketTypes: ['all'],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get bucket ID');
    }

    const data = await response.json();
    const bucket = data.buckets.find((b: any) => b.bucketName === this.bucketName);

    if (!bucket) {
      throw new Error(`Bucket '${this.bucketName}' not found`);
    }

    this.bucketId = bucket.bucketId;
    return this.bucketId as string;
  }

  /**
   * Get upload URL for the bucket
   */
  private async getUploadUrl(): Promise<B2UploadUrlResponse> {
    const auth = await this.authorize();
    const bucketId = await this.getBucketIdInternal();

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
      throw new Error('Failed to get upload URL');
    }

    return response.json();
  }

  /**
   * Upload file to Backblaze B2
   */
  async uploadFile(fileData: ArrayBuffer, fileName: string, contentType: string): Promise<{
    success: boolean;
    url?: string;
    fileId?: string;
    error?: string;
  }> {
    try {
      console.log('📤 Starting B2 file upload:', fileName);

      const uploadUrl = await this.getUploadUrl();

      // Calculate SHA1 hash
      const crypto = require('crypto');
      const sha1Hash = crypto.createHash('sha1').update(Buffer.from(fileData)).digest('hex');

      const response = await fetch(uploadUrl.uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': uploadUrl.authorizationToken,
          'X-Bz-File-Name': fileName,
          'Content-Type': contentType,
          'Content-Length': fileData.byteLength.toString(),
          'X-Bz-Content-Sha1': sha1Hash,
        },
        body: fileData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('B2 Upload failed:', errorText);
        throw new Error(`B2 Upload failed: ${errorText}`);
      }

      const uploadResult: B2UploadResponse = await response.json();

      // Construct the public URL
      const fileUrl = `${uploadUrl.uploadUrl.split('/b2api')[0]}/file/${this.bucketName}/${fileName}`;

      console.log('✅ B2 Upload successful:', { fileId: uploadResult.fileId, fileName, url: fileUrl });

      return {
        success: true,
        url: fileUrl,
        fileId: uploadResult.fileId,
      };
    } catch (error) {
      console.error('❌ B2 Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Get download URL for a file
   */
  async getDownloadUrl(fileName: string): Promise<{
    success: boolean;
    url?: string;
    authToken?: string;
    error?: string;
  }> {
    try {
      const auth = await this.authorize();

      // Get download authorization for the specific file
      const downloadAuthUrl = `${auth.apiUrl}/b2api/v2/b2_get_download_authorization`;
      const authResponse = await fetch(downloadAuthUrl, {
        method: 'POST',
        headers: {
          'Authorization': auth.authorizationToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketId: await this.getBucketIdInternal(),
          fileNamePrefix: fileName,
          validDurationInSeconds: 3600, // 1 hour
        }),
      });

      if (!authResponse.ok) {
        throw new Error(`Failed to get download auth: ${authResponse.statusText}`);
      }

      const downloadAuth = await authResponse.json();

      // Construct authorized download URL
      const authorizedUrl = `${auth.downloadUrl}/file/${this.bucketName}/${fileName}?Authorization=${encodeURIComponent(downloadAuth.authorizationToken)}`;

      return {
        success: true,
        url: authorizedUrl,
        authToken: downloadAuth.authorizationToken
      };
    } catch (error) {
      console.error('Failed to generate download URL:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate download URL'
      };
    }
  }
}

/**
 * Create B2 client with environment variables
 */
export function createB2Client(): BackblazeB2Client {
  const applicationKeyId = process.env.B2_APPLICATION_KEY_ID;
  const applicationKey = process.env.B2_APPLICATION_KEY;
  const bucketName = process.env.B2_BUCKET_NAME || 'relawan-app-bukti-transfer';

  if (!applicationKeyId || !applicationKey) {
    throw new Error('Backblaze B2 credentials not configured');
  }

  return new BackblazeB2Client(applicationKeyId, applicationKey, bucketName);
}
