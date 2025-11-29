"use node";

// Test setup for storage tests
import { vi, beforeEach, afterEach } from "vitest";

// Mock console methods to avoid noise in tests
Object.defineProperty(console, "log", {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(console, "error", {
  value: vi.fn(),
  writable: true,
});

// Mock process.env for testing
const originalEnv = process.env;

beforeEach(() => {
  // Reset process.env before each test
  process.env = { ...originalEnv };
});

afterEach(() => {
  // Restore original environment
  process.env = originalEnv;
});

// Global test utilities
export const createMockFileData = (size: number = 1024): ArrayBuffer => {
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < size; i++) {
    view[i] = Math.floor(Math.random() * 256);
  }
  return buffer;
};

export const createMockUploadResult = (success: boolean = true) => {
  return {
    success,
    url: success ? "mock-download-url" : undefined,
    fileName: success ? "mock-filename.jpg" : undefined,
    fileId: success ? "mock-file-id" : undefined,
    size: success ? 1024 : undefined,
    error: success ? undefined : "Mock error"
  };
};

export const createMockDownloadResult = (success: boolean = true) => {
  return {
    success,
    url: success ? "mock-download-url" : undefined,
    error: success ? undefined : "Mock download error"
  };
};

export const createMockFileContentResult = (success: boolean = true) => {
  return {
    success,
    content: success ? createMockFileData(2048) : undefined,
    size: success ? 2048 : undefined,
    error: success ? undefined : "Mock file content error"
  };
};
