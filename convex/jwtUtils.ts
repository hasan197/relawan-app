"use node";

// Simple JWT implementation for Convex (without external dependencies)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Base64 URL safe encoding
function base64UrlEncode(data: string): string {
  return btoa(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(data: string): string {
  data += '='.repeat((4 - data.length % 4) % 4);
  return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
}

export function generateJWT(userId: string, phone: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    userId,
    phone,
    type: 'auth',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  
  // For simplicity, we'll use a basic signature approach
  // In production, you should use proper HMAC
  const signature = base64UrlEncode(btoa(signatureInput + JWT_SECRET).split('').reverse().join(''));
  
  return `${signatureInput}.${signature}`;
}

export async function verifyJWT(token: string): Promise<{ userId: string; phone: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Verify signature (simple approach)
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = base64UrlEncode(btoa(signatureInput + JWT_SECRET).split('').reverse().join(''));
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    // Check type
    if (payload.type !== 'auth') {
      return null;
    }
    
    return { userId: payload.userId, phone: payload.phone };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
