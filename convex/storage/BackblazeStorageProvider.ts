import { StorageProvider, StorageUploadResult, StorageDownloadResult, StorageFileContentResult } from "./StorageProvider";

/**
 * Backblaze B2 Storage Provider Implementation
 */
export class BackblazeStorageProvider implements StorageProvider {
  name = 'Backblaze B2';

  async uploadFile(fileData: ArrayBuffer, fileName: string, contentType: string, donationId: string): Promise<StorageUploadResult> {
    try {
      // Import BackblazeB2Client from separate file
      const { createB2Client } = await import("./BackblazeClient");
      const b2Client = createB2Client();
      
      // Generate unique filename with donation ID
      const uniqueFileName = `bukti-transfer/${donationId}/${Date.now()}-${fileName}`;
      console.log('📝 Generated filename:', uniqueFileName);
      
      // Upload file to Backblaze B2
      console.log('⬆️ Uploading to B2...');
      const uploadResult = await b2Client.uploadFile(
        fileData,
        uniqueFileName,
        contentType
      );
      
      console.log('✅ B2 upload success:', uploadResult);
      
      if (uploadResult.success) {
        return {
          success: true,
          url: uploadResult.url,
          fileName: uniqueFileName
        };
      } else {
        return {
          success: false,
          error: uploadResult.error || 'Upload failed'
        };
      }
    } catch (error) {
      console.error('❌ Backblaze upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Backblaze upload failed'
      };
    }
  }

  async getDownloadUrl(fileName: string): Promise<StorageDownloadResult> {
    try {
      // Import BackblazeB2Client from separate file
      const { createB2Client } = await import("./BackblazeClient");
      const b2Client = createB2Client();
      
      // Use getDownloadUrl method
      const result = await b2Client.getDownloadUrl(fileName);
      
      return result;
    } catch (error) {
      console.error('❌ Backblaze getDownloadUrl failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get download URL'
      };
    }
  }

  async getFileContent(fileUrl: string): Promise<StorageFileContentResult> {
    try {
      // Parse the URL to extract file path
      const url = new URL(fileUrl);
      const filePath = url.pathname.replace(`/file/${process.env.B2_BUCKET_NAME}/`, '');
      console.log('🔍 Extracted file path:', filePath);
      
      // Import BackblazeB2Client from separate file
      const { createB2Client } = await import("./BackblazeClient");
      const b2Client = createB2Client();
      
      // Get auth data
      const authData = await b2Client.authenticate();
      console.log('🔍 Authenticated with B2');
      
      // Try to fetch file directly with auth header
      const response = await fetch(fileUrl, {
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
  }
}
