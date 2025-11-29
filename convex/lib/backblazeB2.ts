/**
 * Backblaze B2 Integration for Convex
 * 
 * This utility handles file uploads to Backblaze B2 cloud storage
 * B2 is cost-effective and works well with Convex applications
 */

"use node"; // Required for Node.js crypto module

// B2 API configuration
const B2_API_URL = 'https://api.backblazeb2.com/b2api/v2';

interface B2AuthResponse {
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
export class BackblazeB2Client {
  private authData: B2AuthResponse | null = null;
  private authExpiry: number = 0;

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
   * Get upload URL for the bucket
   */
  private async getUploadUrl(): Promise<B2UploadUrlResponse> {
    const auth = await this.authorize();
    
    const response = await fetch(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: 'POST',
      headers: {
        'Authorization': auth.authorizationToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId: this.bucketName,
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

    // Calculate SHA1 hash of the file using Node.js crypto
    const crypto = require('crypto');
    const hash = crypto.createHash('sha1');
    hash.update(Buffer.from(file));
    const sha1Hash = hash.digest('hex');

    const response = await fetch(uploadUrl.uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': uploadUrl.authorizationToken,
        'X-Bz-File-Name': fileName,
        'Content-Type': contentType,
        'Content-Length': file.byteLength.toString(),
        'X-Bz-Content-Sha1': sha1Hash,
        'X-Bz-Info-Author': 'relawan-app',
        'X-Bz-Info-Upload-Timestamp': Date.now().toString(),
      },
      body: file,
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

  /**
   * Delete file from Backblaze B2
   */
  async deleteFile(fileName: string, fileId: string): Promise<void> {
    const auth = await this.authorize();

    const response = await fetch(`${auth.apiUrl}/b2api/v2/b2_delete_file_version`, {
      method: 'POST',
      headers: {
        'Authorization': auth.authorizationToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(fileName: string): string {
    // This requires the bucket to be public
    return `https://f002.backblazeb2.com/file/${this.bucketName}/${fileName}`;
  }
}

/**
 * Create B2 client instance for Convex
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
