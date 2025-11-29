import { useState, useRef } from 'react';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  uploadProgress?: number;
  currentFile?: string | null;
  onRemoveFile?: () => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

export function FileUpload({
  onFileSelect,
  uploading = false,
  uploadProgress = 0,
  currentFile = null,
  onRemoveFile,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = ''
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (uploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    // Validate file type
    if (!file.type.match(accept.replace('*', '.*'))) {
      setError('Invalid file type. Please select an image file.');
      return;
    }

    onFileSelect(file);
  };

  const openFileDialog = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={uploading}
      />

      {currentFile ? (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileImage className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {currentFile.split('/').pop()?.split('?')[0] || 'Uploaded file'}
                </p>
                <p className="text-xs text-gray-500">Bukti transfer uploaded</p>
              </div>
            </div>
            {onRemoveFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveFile}
                disabled={uploading}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploading && (
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">
                  Uploading... {uploadProgress}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card
          className={`p-6 border-2 border-dashed transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="text-center">
            <Upload
              className={`mx-auto h-12 w-12 ${
                dragActive ? 'text-blue-500' : 'text-gray-400'
              }`}
            />
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Images up to {(maxSize / 1024 / 1024).toFixed(1)}MB
              </p>
            </div>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">
                  Uploading... {uploadProgress}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
