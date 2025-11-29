/**
 * Storage Provider Interface
 * Defines the contract that all storage providers must implement
 */

export type StorageProviderType = 'backblaze' | 'convex';

export interface StorageUploadResult {
    success: boolean;
    url?: string;
    fileName?: string;
    fileId?: string;
    size?: number;
    error?: string;
}

export interface StorageDownloadResult {
    success: boolean;
    url?: string;
    error?: string;
}

export interface StorageFileContentResult {
    success: boolean;
    url?: string;
    content?: ArrayBuffer;
    contentType?: string;
    size?: number;
    error?: string;
}

export interface StorageProvider {
    name: string;
    uploadFile(
        fileData: ArrayBuffer,
        fileName: string,
        contentType: string,
        donationId: string,
        ctx?: any // Optional context for providers that need it (e.g. Convex)
    ): Promise<StorageUploadResult>;
    getDownloadUrl(fileName: string, ctx?: any): Promise<StorageDownloadResult>;
    getFileContent(fileUrl: string, ctx?: any): Promise<StorageFileContentResult>;
}
