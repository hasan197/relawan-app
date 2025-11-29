import { useState } from 'react';
import { apiCall } from '../lib/supabase';

// Conditional import for Convex - fallback to mocks during build
let useMutation: any;
let api: any;

try {
  const convex = require('convex/react');
  useMutation = convex.useMutation;
  api = require('../convex/_generated/api').api;
} catch (e) {
  // Fallback for build time
  useMutation = () => (args: any) => Promise.resolve({ success: true });
  api = {
    uploads: {
      generateUploadUrl: 'generateUploadUrl',
      confirmUpload: 'confirmUpload'
    }
  };
}

interface UploadResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const confirmUpload = useMutation(api.uploads.confirmUpload);

  const uploadFile = async (
    file: File,
    donationId: string
  ): Promise<UploadResult> => {
    try {
      setUploading(true);
      setProgress(0);

      // Step 1: Generate upload URL
      const { uploadUrl, fileUrl } = await generateUploadUrl({
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
      });

      // Step 2: Upload file to storage service
      const formData = new FormData();
      formData.append('file', file);
      formData.append('donation_id', donationId);

      const uploadResult = await apiCall('/donations/upload-bukti', {
        method: 'POST',
        body: formData, // apiCall akan handle FormData dengan benar
      });
      
      setProgress(100);

      // Step 3: Confirm upload and store URL
      await confirmUpload({
        donationId: donationId as any,
        fileUrl: uploadResult.url || fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      return {
        success: true,
        fileUrl: uploadResult.url || fileUrl,
      };
    } catch (error: any) {
      console.error('❌ File upload error:', error);
      return {
        success: false,
        error: error.message || 'File upload failed',
      };
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadToExternalService = async (
    file: File,
    uploadUrl: string
  ): Promise<string> => {
    // This would upload the file directly to your storage service
    // For example, AWS S3, Cloudinary, or another service
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.fileUrl;
  };

  return {
    uploadFile,
    uploadToExternalService,
    uploading,
    progress,
  };
}
