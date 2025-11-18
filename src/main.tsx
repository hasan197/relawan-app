
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createClient } from '@supabase/supabase-js';
import App from "./App.tsx";
import "./index.css";

// Log konfigurasi backend
console.log('=== KONFIGURASI BACKEND ===');

// Cek konfigurasi Convex
const convexUrl = import.meta.env.VITE_CONVEX_URL || '';
const convexDeployment = import.meta.env.VITE_CONVEX_DEPLOYMENT || '';
const isConvexConfigured = !!convexUrl;

console.log('[Convex] Status:', isConvexConfigured ? '✅ Terkonfigurasi' : '❌ Tidak terkonfigurasi');
if (isConvexConfigured) {
  console.log(`[Convex] URL: ${convexUrl}`);
  console.log(`[Convex] Deployment: ${convexDeployment || 'Tidak diketahui'}`);
}

// Cek konfigurasi Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey;

console.log('[Supabase] Status:', isSupabaseConfigured ? '✅ Terkonfigurasi' : '❌ Tidak terkonfigurasi');
if (isSupabaseConfigured) {
  console.log(`[Supabase] URL: ${supabaseUrl}`);
  console.log(`[Supabase] Key: ${supabaseKey.substring(0, 10)}...`);
}

// Inisialisasi Convex
const convex = isConvexConfigured ? new ConvexReactClient(convexUrl) : null;

// Inisialisasi Supabase
let supabase = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase] Berhasil diinisialisasi');
  } catch (error) {
    console.error('[Supabase] Gagal menginisialisasi:', error);
  }
}

// Tampilkan status akhir
console.log('\n=== STATUS AKHIR ===');
console.log('Backend aktif:', 
  convex ? '✅ Convex' + (supabase ? ' + Supabase' : '') : 
  supabase ? '✅ Hanya Supabase' : '❌ Tidak ada backend yang aktif');

createRoot(document.getElementById("root")!).render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>
);