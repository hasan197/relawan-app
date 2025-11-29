"use node";

import { describe, it, expect, beforeEach, vi } from "vitest";
import { StorageManager } from "../../../convex/storage/StorageManager";

// Simple test without complex mocking
describe("StorageManager Basic Tests", () => {
  beforeEach(() => {
    // Reset environment
    vi.clearAllMocks();
    // Reset instance
    (StorageManager as any).instance = null;
  });

  it("should initialize with default provider", () => {
    // Mock console to avoid noise
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    const storageManager = StorageManager.getInstance();
    const defaultProvider = storageManager.getDefaultProvider();

    expect(defaultProvider).toBe("convex");

    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("should handle environment variables", () => {
    // Set environment
    process.env.STORAGE_PROVIDER = "backblaze";

    (StorageManager as any).instance = null;

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    const storageManager = StorageManager.getInstance();
    const defaultProvider = storageManager.getDefaultProvider();

    expect(defaultProvider).toBe("backblaze");

    // Clean up
    delete process.env.STORAGE_PROVIDER;
    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("should validate invalid provider", () => {
    // Set invalid environment
    process.env.STORAGE_PROVIDER = "invalid-provider";

    (StorageManager as any).instance = null;

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    const storageManager = StorageManager.getInstance();
    const defaultProvider = storageManager.getDefaultProvider();

    expect(defaultProvider).toBe("convex"); // Should default to convex
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Invalid STORAGE_PROVIDER")
    );

    // Clean up
    delete process.env.STORAGE_PROVIDER;
    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("should have available providers", () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    const storageManager = StorageManager.getInstance();
    const providers = storageManager.getAvailableProviders();

    expect(providers).toContain("backblaze");
    expect(providers).toContain("convex");
    expect(providers).toHaveLength(2);

    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
});
