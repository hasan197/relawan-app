import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ============================================
// AUTHENTICATION HELPER
// ============================================

// Validate access token (simple custom token format)
const validateAccessToken = async (token: string) => {
  if (!token) {
    return { valid: false, error: 'No token provided' };
  }

  // Check if it's our custom token format: ziswaf_${userId}_${timestamp}
  if (token.startsWith('ziswaf_')) {
    const parts = token.split('_');
    if (parts.length === 3) {
      const userId = parts[1];
      const timestamp = parseInt(parts[2]);
      
      // Check if token is not too old (e.g., 7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
      if (Date.now() - timestamp > maxAge) {
        return { valid: false, error: 'Token expired' };
      }
      
      // Verify user exists
      const user = await kv.get(`user:${userId}`);
      if (!user) {
        return { valid: false, error: 'User not found' };
      }
      
      return { valid: true, userId, user };
    }
  }
  
  return { valid: false, error: 'Invalid token format' };
};

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Register new user (relawan)
app.post('/make-server-f689ca3f/auth/register', async (c) => {
  try {
    const { fullName, phone, city, reguId } = await c.req.json();

    if (!fullName || !phone) {
      return c.json({ error: 'Nama dan nomor WhatsApp harus diisi' }, 400);
    }

    // Check if user already exists
    const existingUserData = await kv.get(`user:phone:${phone}`);
    if (existingUserData) {
      return c.json({ error: 'Nomor WhatsApp sudah terdaftar' }, 400);
    }

    // Create dummy email from phone for Supabase Auth compatibility
    const email = `${phone}@ziswaf.app`;
    const password = Math.random().toString(36).slice(-12) + 'Ab1!'; // Random secure password

    // Create user with Supabase Auth using email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm since it's dummy email
      user_metadata: {
        full_name: fullName,
        phone: phone,
        city: city,
        regu_id: reguId || null,
        role: 'relawan'
      }
    });

    if (authError) {
      console.log('Auth registration error:', authError);
      return c.json({ error: `Gagal membuat akun: ${authError.message}` }, 400);
    }

    // Store user data in KV store
    const userData = {
      id: authData.user.id,
      full_name: fullName,
      phone: phone,
      email: email,
      city: city,
      regu_id: reguId || null,
      role: 'relawan',
      created_at: new Date().toISOString()
    };

    // Store by user ID and phone number for easy lookup
    await kv.set(`user:${authData.user.id}`, userData);
    await kv.set(`user:phone:${phone}`, userData);

    console.log('✅ User registered successfully:', { phone, name: fullName });

    return c.json({
      success: true,
      message: 'Registrasi berhasil!',
      user: userData
    });
  } catch (error) {
    console.log('Registration error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Send OTP
app.post('/make-server-f689ca3f/auth/send-otp', async (c) => {
  try {
    const { phone } = await c.req.json();

    if (!phone) {
      return c.json({ error: 'Nomor WhatsApp harus diisi' }, 400);
    }

    // In production, this would send OTP via SMS/WhatsApp
    // For demo, we'll use Supabase's phone OTP (but it needs Twilio setup)
    // So we'll simulate it and store a mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await kv.set(`otp:${phone}`, {
      otp: otp,
      expires_at: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // ========================================
    // 📱 OTP LOG (Karena belum ada SMS service)
    // ========================================
    console.log('\n');
    console.log('═══════════════════════════════════════════');
    console.log('📱 OTP VERIFICATION CODE');
    console.log('═══════════════════════════════════════════');
    console.log(`Phone: ${phone}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires: 5 minutes`);
    console.log('═══════════════════════════════════════════');
    console.log('\n');

    return c.json({
      success: true,
      message: 'Kode OTP telah dikirim',
      // For demo purposes - OTP akan terlihat di console log server
      demo_otp: otp
    });
  } catch (error) {
    console.log('Send OTP error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Verify OTP and login
app.post('/make-server-f689ca3f/auth/verify-otp', async (c) => {
  try {
    const { phone, otp } = await c.req.json();

    if (!phone || !otp) {
      return c.json({ error: 'Nomor WhatsApp dan OTP harus diisi' }, 400);
    }

    // Get stored OTP
    const storedOtpData = await kv.get(`otp:${phone}`);
    
    if (!storedOtpData) {
      return c.json({ error: 'OTP tidak valid atau sudah kadaluarsa' }, 400);
    }

    if (storedOtpData.expires_at < Date.now()) {
      await kv.del(`otp:${phone}`);
      return c.json({ error: 'OTP sudah kadaluarsa' }, 400);
    }

    if (storedOtpData.otp !== otp) {
      return c.json({ error: 'Kode OTP salah' }, 400);
    }

    // Get user by phone
    const user = await kv.get(`user:phone:${phone}`);

    if (!user) {
      await kv.del(`otp:${phone}`);
      return c.json({ error: 'User tidak ditemukan. Silakan daftar terlebih dahulu.' }, 404);
    }

    console.log('👤 User found:', {
      id: user.id,
      full_name: user.full_name,
      phone: user.phone,
      has_id: !!user.id
    });

    if (!user.id) {
      console.error('❌ CRITICAL ERROR: User object does not have ID!');
      console.error('User object:', user);
      return c.json({ error: 'Data user tidak lengkap. Silakan hubungi admin.' }, 500);
    }

    // Delete used OTP
    await kv.del(`otp:${phone}`);

    // Generate simple access token
    const accessToken = `ziswaf_${user.id}_${Date.now()}`;

    console.log('✅ User logged in successfully:', { phone, name: user.full_name, id: user.id });
    console.log('📤 Returning user:', user);

    return c.json({
      success: true,
      message: 'Login berhasil!',
      user: user,
      access_token: accessToken
    });
  } catch (error) {
    console.log('Verify OTP error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// ============================================
// MUZAKKI ENDPOINTS
// ============================================

// Update user role (admin only - for now open for testing)
app.patch('/make-server-f689ca3f/users/:phone/role', async (c) => {
  try {
    const phone = c.req.param('phone');
    const { role } = await c.req.json();

    if (!phone || !role) {
      return c.json({ error: 'Phone dan role harus diisi' }, 400);
    }

    if (!['relawan', 'pembimbing', 'admin'].includes(role)) {
      return c.json({ error: 'Role tidak valid. Harus: relawan, pembimbing, atau admin' }, 400);
    }

    // Get user by phone
    const user = await kv.get(`user:phone:${phone}`);
    
    if (!user) {
      return c.json({ error: 'User tidak ditemukan' }, 404);
    }

    // Update role
    const updatedUser = {
      ...user,
      role: role,
      updated_at: new Date().toISOString()
    };

    // Update in both locations
    await kv.set(`user:${user.id}`, updatedUser);
    await kv.set(`user:phone:${phone}`, updatedUser);

    console.log(`✅ User role updated: ${phone} → ${role}`);

    return c.json({
      success: true,
      message: `Role berhasil diubah menjadi ${role}`,
      user: updatedUser
    });
  } catch (error) {
    console.log('Update user role error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get user by phone
app.get('/make-server-f689ca3f/users/phone/:phone', async (c) => {
  try {
    const phone = c.req.param('phone');
    
    if (!phone) {
      return c.json({ error: 'Phone harus diisi' }, 400);
    }

    // Get user by phone
    const user = await kv.get(`user:phone:${phone}`);
    
    if (!user) {
      return c.json({ error: 'User tidak ditemukan' }, 404);
    }

    console.log(`✅ User found: ${phone} → ${user.role}`);

    return c.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.log('Get user error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get all muzakki for a relawan
app.get('/make-server-f689ca3f/muzakki', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const relawanId = c.req.query('relawan_id');

    console.log('📥 GET /muzakki request:', {
      relawanId,
      hasToken: !!accessToken
    });

    if (!relawanId) {
      console.error('❌ Missing relawan_id');
      return c.json({ error: 'Relawan ID diperlukan' }, 400);
    }

    console.log('🔍 Fetching muzakki with prefix:', `muzakki:${relawanId}:`);
    const muzakkiList = await kv.getByPrefix(`muzakki:${relawanId}:`);
    
    console.log('📦 Raw muzakki data from KV:', {
      count: muzakkiList.length,
      dataType: typeof muzakkiList[0],
      firstItem: muzakkiList[0],
      allData: muzakkiList
    });

    // IMPORTANT: getByPrefix already returns array of values (not { key, value })
    // So muzakkiList is already the data we need!
    
    console.log('✅ Returning muzakki data:', {
      count: muzakkiList.length,
      data: muzakkiList
    });
    
    return c.json({
      success: true,
      data: muzakkiList  // Return directly, no need to map
    });
  } catch (error) {
    console.error('❌ Get muzakki error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Add new muzakki
app.post('/make-server-f689ca3f/muzakki', async (c) => {
  try {
    const body = await c.req.json();
    console.log('📝 Add Muzakki Request Body:', body);
    
    const { relawan_id, name, phone, city, notes, status } = body;

    console.log('🔍 Extracted values:', {
      relawan_id,
      name,
      phone,
      city,
      notes,
      status
    });

    if (!relawan_id || !name || !phone) {
      console.error('❌ Missing required fields:', {
        has_relawan_id: !!relawan_id,
        has_name: !!name,
        has_phone: !!phone
      });
      return c.json({ error: 'Relawan ID, nama, dan nomor WhatsApp harus diisi' }, 400);
    }

    const muzakkiId = crypto.randomUUID();
    const muzakki = {
      id: muzakkiId,
      relawan_id: relawan_id,
      name: name,
      phone: phone,
      city: city || '',
      notes: notes || '',
      status: status || 'baru',
      created_at: new Date().toISOString(),
      last_contact: new Date().toISOString()
    };

    console.log('💾 Saving muzakki:', muzakki);
    console.log('🔑 Storage key:', `muzakki:${relawan_id}:${muzakkiId}`);

    await kv.set(`muzakki:${relawan_id}:${muzakkiId}`, muzakki);

    console.log('✅ Muzakki saved successfully');

    return c.json({
      success: true,
      message: 'Muzakki berhasil ditambahkan',
      data: muzakki
    });
  } catch (error) {
    console.error('❌ Add muzakki error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Update muzakki
app.put('/make-server-f689ca3f/muzakki/:id', async (c) => {
  try {
    const muzakkiId = c.req.param('id');
    const updates = await c.req.json();
    const relawanId = updates.relawan_id;

    if (!relawanId) {
      return c.json({ error: 'Relawan ID diperlukan' }, 400);
    }

    const existing = await kv.get(`muzakki:${relawanId}:${muzakkiId}`);
    
    if (!existing) {
      return c.json({ error: 'Muzakki tidak ditemukan' }, 404);
    }

    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await kv.set(`muzakki:${relawanId}:${muzakkiId}`, updated);

    return c.json({
      success: true,
      message: 'Muzakki berhasil diupdate',
      data: updated
    });
  } catch (error) {
    console.log('Update muzakki error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Delete muzakki
app.delete('/make-server-f689ca3f/muzakki/:id', async (c) => {
  try {
    const muzakkiId = c.req.param('id');
    const relawanId = c.req.query('relawan_id');

    if (!relawanId) {
      return c.json({ error: 'Relawan ID diperlukan' }, 400);
    }

    await kv.del(`muzakki:${relawanId}:${muzakkiId}`);

    return c.json({
      success: true,
      message: 'Muzakki berhasil dihapus'
    });
  } catch (error) {
    console.log('Delete muzakki error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// ============================================
// DONATION ENDPOINTS
// ============================================

// Get donations for a relawan
app.get('/make-server-f689ca3f/donations', async (c) => {
  try {
    const relawanId = c.req.query('relawan_id');

    if (!relawanId) {
      return c.json({ error: 'Relawan ID diperlukan' }, 400);
    }

    const donations = await kv.getByPrefix(`donation:${relawanId}:`);
    
    return c.json({
      success: true,
      data: donations  // Already returns array of values
    });
  } catch (error) {
    console.log('Get donations error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Add new donation
app.post('/make-server-f689ca3f/donations', async (c) => {
  try {
    const { relawan_id, muzakki_id, amount, category, type, receipt_number, notes } = await c.req.json();

    if (!relawan_id || !amount || !category) {
      return c.json({ error: 'Relawan ID, nominal, dan kategori harus diisi' }, 400);
    }

    const donationId = crypto.randomUUID();
    const donation = {
      id: donationId,
      relawan_id: relawan_id,
      muzakki_id: muzakki_id || null,
      amount: amount,
      category: category,
      type: type || 'incoming',
      receipt_number: receipt_number || `${category.toUpperCase().substring(0,3)}${Date.now()}`,
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    await kv.set(`donation:${relawan_id}:${donationId}`, donation);

    return c.json({
      success: true,
      message: 'Donasi berhasil dicatat',
      data: donation
    });
  } catch (error) {
    console.log('Add donation error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// ============================================
// COMMUNICATION LOG ENDPOINTS
// ============================================

// Add communication log
app.post('/make-server-f689ca3f/communications', async (c) => {
  try {
    const { relawan_id, muzakki_id, type, notes } = await c.req.json();

    if (!relawan_id || !muzakki_id || !type) {
      return c.json({ error: 'Relawan ID, Muzakki ID, dan tipe komunikasi harus diisi' }, 400);
    }

    const commId = crypto.randomUUID();
    const communication = {
      id: commId,
      relawan_id: relawan_id,
      muzakki_id: muzakki_id,
      type: type, // 'call', 'whatsapp', 'meeting'
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    await kv.set(`communication:${muzakki_id}:${commId}`, communication);

    // Update last_contact on muzakki
    const muzakki = await kv.get(`muzakki:${relawan_id}:${muzakki_id}`);
    if (muzakki) {
      await kv.set(`muzakki:${relawan_id}:${muzakki_id}`, {
        ...muzakki,
        last_contact: new Date().toISOString()
      });
    }

    return c.json({
      success: true,
      message: 'Komunikasi berhasil dicatat',
      data: communication
    });
  } catch (error) {
    console.log('Add communication error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get communications for a muzakki
app.get('/make-server-f689ca3f/communications/:muzakki_id', async (c) => {
  try {
    const muzakkiId = c.req.param('muzakki_id');
    const communications = await kv.getByPrefix(`communication:${muzakkiId}:`);
    
    return c.json({
      success: true,
      data: communications  // Already returns array of values
    });
  } catch (error) {
    console.log('Get communications error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// ============================================
// REGU & CHAT ENDPOINTS
// ============================================

// Get all regus
app.get('/make-server-f689ca3f/regus', async (c) => {
  try {
    console.log('🔍 Fetching all regus...');
    const regus = await kv.getByPrefix('regu:');
    console.log('✅ Regus found:', regus.length);
    
    return c.json({
      success: true,
      data: regus
    });
  } catch (error) {
    console.error('❌ Get all regus error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Create new regu (pembimbing only)
app.post('/make-server-f689ca3f/regus', async (c) => {
  try {
    const { pembimbing_id, name, target_amount } = await c.req.json();

    console.log('📝 Create Regu Request:', { pembimbing_id, name, target_amount });

    if (!pembimbing_id || !name) {
      return c.json({ error: 'Pembimbing ID dan nama regu harus diisi' }, 400);
    }

    // Get pembimbing user
    console.log(`🔍 Looking up user with ID: ${pembimbing_id}`);
    const pembimbing = await kv.get(`user:${pembimbing_id}`);
    
    if (!pembimbing) {
      console.error(`❌ User not found with ID: ${pembimbing_id}`);
      
      // Try to find all users to help debug
      const allUsers = await kv.getByPrefix('user:');
      console.log('📦 Available users in database:', allUsers.length);
      allUsers.slice(0, 5).forEach((u: any) => {
        console.log(`  - ID: ${u.id}, Name: ${u.full_name}, Role: ${u.role}, Phone: ${u.phone}`);
      });
      
      return c.json({ error: 'Pembimbing tidak ditemukan. Silakan pastikan Anda sudah login dengan benar.' }, 404);
    }

    console.log(`✅ User found:`, { 
      id: pembimbing.id, 
      name: pembimbing.full_name, 
      role: pembimbing.role,
      phone: pembimbing.phone
    });

    if (pembimbing.role !== 'pembimbing') {
      console.error(`❌ User role check failed. Expected: 'pembimbing', Got: '${pembimbing.role}'`);
      return c.json({ error: `Hanya pembimbing yang bisa membuat regu. Role Anda saat ini: ${pembimbing.role}` }, 403);
    }

    // Generate unique join code (6 karakter uppercase alphanumeric)
    const generateJoinCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar chars
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let joinCode = generateJoinCode();
    // Ensure uniqueness
    let codeExists = await kv.get(`regu:code:${joinCode}`);
    while (codeExists) {
      joinCode = generateJoinCode();
      codeExists = await kv.get(`regu:code:${joinCode}`);
    }

    const reguId = crypto.randomUUID();
    const regu = {
      id: reguId,
      name: name,
      pembimbing_id: pembimbing_id,
      pembimbing_name: pembimbing.full_name,
      member_count: 0,
      total_donations: 0,
      target_amount: target_amount || 60000000,
      join_code: joinCode,
      created_at: new Date().toISOString()
    };

    // Save regu
    await kv.set(`regu:${reguId}`, regu);

    // Update regu
    const updatedPembimbing = {
      ...pembimbing,
      regu_id: reguId,
      updated_at: new Date().toISOString()
    };
    
    // 🔧 FIX: Save to BOTH keys
    await kv.set(`user:${pembimbing.id}`, updatedPembimbing);
    await kv.set(`user:phone:${pembimbing.phone}`, updatedPembimbing);
    
    // Save join code mapping
    await kv.set(`regu:code:${joinCode}`, reguId);

    console.log('✅ Regu created successfully:', { reguId, name, joinCode });

    return c.json({
      success: true,
      message: 'Regu berhasil dibuat!',
      data: regu
    });
  } catch (error) {
    console.error('❌ Create regu error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get regu info
app.get('/make-server-f689ca3f/regu/:id', async (c) => {
  try {
    const reguId = c.req.param('id');
    const regu = await kv.get(`regu:${reguId}`);
    
    if (!regu) {
      return c.json({ error: 'Regu tidak ditemukan' }, 404);
    }

    return c.json({
      success: true,
      data: regu
    });
  } catch (error) {
    console.log('Get regu error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get regu info by join code
app.get('/make-server-f689ca3f/regu/by-code/:code', async (c) => {
  try {
    const joinCode = c.req.param('code');
    
    console.log('🔍 Looking for regu with join code:', joinCode);
    
    // Get all regus and find the one with matching join code
    const allRegus = await kv.getByPrefix('regu:');
    
    console.log('📦 Total regus found:', allRegus.length);
    
    const regu = allRegus.find((r: any) => r.join_code === joinCode);
    
    if (!regu) {
      console.log('❌ Regu not found with code:', joinCode);
      return c.json({ error: 'Regu tidak ditemukan' }, 404);
    }
    
    console.log('✅ Regu found:', regu);

    return c.json({
      success: true,
      data: regu
    });
  } catch (error) {
    console.log('Get regu by code error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get regu members
app.get('/make-server-f689ca3f/regu/:id/members', async (c) => {
  try {
    const reguId = c.req.param('id');
    
    console.log('🔍 Fetching members for regu:', reguId);
    
    // Get all users in this regu  
    // IMPORTANT: getByPrefix already returns array of values directly
    const allUsers = await kv.getByPrefix('user:');
    console.log('📦 Total user entries found:', allUsers.length);
    
    const members = allUsers
      .filter((user: any) => {
        // Skip null/undefined entries
        if (!user) return false;
        
        // Skip entries that don't have regu_id (like user:phone:XXX entries)
        if (!user.hasOwnProperty('regu_id')) return false;
        
        // Match regu_id
        return user.regu_id === reguId;
      });
    
    // IMPORTANT: Remove duplicates by id
    // Since both user:{id} and user:phone:{phone} have same data,
    // we need to deduplicate by user.id
    const uniqueMembers = members.reduce((acc: any[], member: any) => {
      if (!acc.some((m: any) => m.id === member.id)) {
        acc.push(member);
      }
      return acc;
    }, []);
    
    console.log('✅ Members found (before dedup):', members.length);
    console.log('✅ Unique members (after dedup):', uniqueMembers.length);
    
    return c.json({
      success: true,
      data: uniqueMembers
    });
  } catch (error) {
    console.error('❌ Get regu members error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Add member to regu
app.post('/make-server-f689ca3f/regu/:id/members', async (c) => {
  try {
    const reguId = c.req.param('id');
    const { userId } = await c.req.json();
    
    // Get user
    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ error: 'User tidak ditemukan' }, 404)
    }
    
    // Update user's regu
    const updatedUser = {
      ...user,
      regu_id: reguId,
      updated_at: new Date().toISOString()
    };
    
    // 🔧 FIX: Save to BOTH keys
    await kv.set(`user:${userId}`, updatedUser);
    await kv.set(`user:phone:${user.phone}`, updatedUser);
    
    return c.json({
      success: true,
      message: 'Member berhasil ditambahkan ke regu'
    });
  } catch (error) {
    console.log('Add regu member error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Join regu by code (QR code or manual input)
app.post('/make-server-f689ca3f/regu/join', async (c) => {
  try {
    const { user_id, join_code } = await c.req.json();

    console.log('🔍 Join regu request:', { user_id, join_code });

    if (!user_id || !join_code) {
      return c.json({ error: 'User ID dan kode regu harus diisi' }, 400);
    }

    // Get user
    const user = await kv.get(`user:${user_id}`);
    if (!user) {
      return c.json({ error: 'User tidak ditemukan' }, 404);
    }

    // Check if user already in a regu
    if (user.regu_id) {
      return c.json({ error: 'Anda sudah tergabung dalam regu. Hubungi pembimbing untuk pindah regu.' }, 400);
    }

    // Get regu ID from join code
    const reguId = await kv.get(`regu:code:${join_code.toUpperCase()}`);
    if (!reguId) {
      return c.json({ error: 'Kode regu tidak valid' }, 404);
    }

    // Get regu details
    const regu = await kv.get(`regu:${reguId}`);
    if (!regu) {
      return c.json({ error: 'Regu tidak ditemukan' }, 404);
    }

    // Update user's regu
    const updatedUser = {
      ...user,
      regu_id: reguId,
      regu_name: regu.name,
      joined_regu_at: new Date().toISOString()
    };

    await kv.set(`user:${user_id}`, updatedUser);
    await kv.set(`user:phone:${user.phone}`, updatedUser);

    // Update regu member count
    await kv.set(`regu:${reguId}`, {
      ...regu,
      member_count: (regu.member_count || 0) + 1,
      updated_at: new Date().toISOString()
    });

    console.log('✅ User joined regu successfully:', {
      user_id,
      regu_id: reguId,
      regu_name: regu.name
    });

    return c.json({
      success: true,
      message: `Berhasil bergabung dengan ${regu.name}!`,
      data: {
        user: updatedUser,
        regu: regu
      }
    });
  } catch (error) {
    console.error('❌ Join regu error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get chat messages for a regu
app.get('/make-server-f689ca3f/chat/:regu_id', async (c) => {
  try {
    const reguId = c.req.param('regu_id');
    const messages = await kv.getByPrefix(`chat:${reguId}:`);
    
    return c.json({
      success: true,
      data: messages.sort((a: any, b: any) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    });
  } catch (error) {
    console.log('Get chat messages error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Send chat message
app.post('/make-server-f689ca3f/chat', async (c) => {
  try {
    const { regu_id, sender_id, sender_name, message } = await c.req.json();

    if (!regu_id || !sender_id || !message) {
      return c.json({ error: 'Regu ID, Sender ID, dan message harus diisi' }, 400);
    }

    const messageId = crypto.randomUUID();
    const chatMessage = {
      id: messageId,
      regu_id: regu_id,
      sender_id: sender_id,
      sender_name: sender_name,
      message: message,
      created_at: new Date().toISOString()
    };

    await kv.set(`chat:${regu_id}:${messageId}`, chatMessage);

    return c.json({
      success: true,
      message: 'Pesan terkirim',
      data: chatMessage
    });
  } catch (error) {
    console.log('Send chat message error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// ============================================
// STATISTICS ENDPOINTS
// ============================================

// Get statistics for a relawan
app.get('/make-server-f689ca3f/statistics/:relawan_id', async (c) => {
  try {
    const relawanId = c.req.param('relawan_id');

    // Get all donations
    const donations = await kv.getByPrefix(`donation:${relawanId}:`);
    
    // Get all muzakki
    const muzakkiList = await kv.getByPrefix(`muzakki:${relawanId}:`);

    // Calculate statistics
    const totalDonations = donations.reduce((sum: number, item: any) => {
      return item.value.type === 'incoming' ? sum + item.value.amount : sum;
    }, 0);

    const totalDistributed = donations.reduce((sum: number, item: any) => {
      return item.value.type === 'outgoing' ? sum + item.value.amount : sum;
    }, 0);

    const byCategory = donations.reduce((acc: any, item: any) => {
      if (item.value.type === 'incoming') {
        acc[item.value.category] = (acc[item.value.category] || 0) + item.value.amount;
      }
      return acc;
    }, {});

    return c.json({
      success: true,
      data: {
        total_donations: totalDonations,
        total_distributed: totalDistributed,
        total_muzakki: muzakkiList.length,
        by_category: byCategory,
        balance: totalDonations - totalDistributed
      }
    });
  } catch (error) {
    console.log('Get statistics error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// ============================================
// PROGRAM ENDPOINTS
// ============================================

// Get all programs
app.get('/make-server-f689ca3f/programs', async (c) => {
  try {
    const programs = await kv.getByPrefix('program:');
    
    return c.json({
      success: true,
      data: programs  // Already returns array of values
    });
  } catch (error) {
    console.log('Get programs error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get program by ID
app.get('/make-server-f689ca3f/programs/:id', async (c) => {
  try {
    const programId = c.req.param('id');
    const program = await kv.get(`program:${programId}`);
    
    if (!program) {
      return c.json({ error: 'Program tidak ditemukan' }, 404);
    }

    return c.json({
      success: true,
      data: program
    });
  } catch (error) {
    console.log('Get program error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Add new program (admin only)
app.post('/make-server-f689ca3f/programs', async (c) => {
  try {
    const { title, category, description, target, location, endDate, image } = await c.req.json();

    if (!title || !category || !target) {
      return c.json({ error: 'Title, category, dan target harus diisi' }, 400);
    }

    const programId = crypto.randomUUID();
    const program = {
      id: programId,
      title,
      category,
      description: description || '',
      target,
      collected: 0,
      contributors: 0,
      location: location || '',
      endDate: endDate || '',
      image: image || '',
      created_at: new Date().toISOString()
    };

    await kv.set(`program:${programId}`, program);

    return c.json({
      success: true,
      message: 'Program berhasil ditambahkan',
      data: program
    });
  } catch (error) {
    console.log('Add program error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Update program collected amount
app.patch('/make-server-f689ca3f/programs/:id/collect', async (c) => {
  try {
    const programId = c.req.param('id');
    const { amount } = await c.req.json();

    const program = await kv.get(`program:${programId}`);
    if (!program) {
      return c.json({ error: 'Program tidak ditemukan' }, 404);
    }

    const updated = {
      ...program,
      collected: program.collected + amount,
      contributors: program.contributors + 1,
      updated_at: new Date().toISOString()
    };

    await kv.set(`program:${programId}`, updated);

    return c.json({
      success: true,
      message: 'Donasi program berhasil dicatat',
      data: updated
    });
  } catch (error) {
    console.log('Update program error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================

// Get notifications for a user
app.get('/make-server-f689ca3f/notifications/:user_id', async (c) => {
  try {
    const userId = c.req.param('user_id');
    const notifications = await kv.getByPrefix(`notification:${userId}:`);
    
    return c.json({
      success: true,
      data: notifications.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    });
  } catch (error) {
    console.log('Get notifications error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Create notification
app.post('/make-server-f689ca3f/notifications', async (c) => {
  try {
    const { user_id, title, message, type, action_url } = await c.req.json();

    if (!user_id || !title || !message) {
      return c.json({ error: 'User ID, title, dan message harus diisi' }, 400);
    }

    const notifId = crypto.randomUUID();
    const notification = {
      id: notifId,
      user_id,
      title,
      message,
      type: type || 'info',
      action_url: action_url || null,
      read: false,
      created_at: new Date().toISOString()
    };

    await kv.set(`notification:${user_id}:${notifId}`, notification);

    return c.json({
      success: true,
      message: 'Notifikasi berhasil dibuat',
      data: notification
    });
  } catch (error) {
    console.log('Create notification error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Mark notification as read
app.patch('/make-server-f689ca3f/notifications/:user_id/:notif_id/read', async (c) => {
  try {
    const userId = c.req.param('user_id');
    const notifId = c.req.param('notif_id');

    const notification = await kv.get(`notification:${userId}:${notifId}`);
    if (!notification) {
      return c.json({ error: 'Notifikasi tidak ditemukan' }, 404);
    }

    const updated = {
      ...notification,
      read: true,
      read_at: new Date().toISOString()
    };

    await kv.set(`notification:${userId}:${notifId}`, updated);

    return c.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.log('Mark notification read error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// ============================================
// TEMPLATE ENDPOINTS
// ============================================

// Get all templates
app.get('/make-server-f689ca3f/templates', async (c) => {
  try {
    const templates = await kv.getByPrefix('template:');
    
    return c.json({
      success: true,
      data: templates  // Already returns array of values
    });
  } catch (error) {
    console.log('Get templates error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Add new template
app.post('/make-server-f689ca3f/templates', async (c) => {
  try {
    const { title, category, content, variables } = await c.req.json();

    if (!title || !category || !content) {
      return c.json({ error: 'Title, category, dan content harus diisi' }, 400);
    }

    const templateId = crypto.randomUUID();
    const template = {
      id: templateId,
      title,
      category,
      content,
      variables: variables || [],
      created_at: new Date().toISOString()
    };

    await kv.set(`template:${templateId}`, template);

    return c.json({
      success: true,
      message: 'Template berhasil ditambahkan',
      data: template
    });
  } catch (error) {
    console.log('Add template error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Health check
app.get('/make-server-f689ca3f/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed database with initial data
app.post('/make-server-f689ca3f/seed', async (c) => {
  try {
    console.log('🌱 Seeding database...');
    
    // Helper function to generate unique regu code
    const generateReguCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };
    
    // Seed Regus
    const regus = [
      {
        id: 'regu1',
        name: 'Regu Ar-Rahman',
        pembimbing_name: 'Ustadz Abdullah',
        member_count: 8,
        total_donations: 52000000,
        target_amount: 60000000,
        join_code: generateReguCode(),
        created_at: new Date().toISOString()
      },
      {
        id: 'regu2',
        name: 'Regu Al-Karim',
        pembimbing_name: 'Ustadz Muhammad',
        member_count: 6,
        total_donations: 38000000,
        target_amount: 50000000,
        join_code: generateReguCode(),
        created_at: new Date().toISOString()
      },
      {
        id: 'regu3',
        name: 'Regu An-Nur',
        pembimbing_name: 'Ustadzah Fatimah',
        member_count: 7,
        total_donations: 45000000,
        target_amount: 55000000,
        join_code: generateReguCode(),
        created_at: new Date().toISOString()
      }
    ];

    for (const regu of regus) {
      await kv.set(`regu:${regu.id}`, regu);
      // Also create reverse lookup: code -> regu_id
      await kv.set(`regu:code:${regu.join_code}`, regu.id);
    }

    // Seed Programs
    const programs = [
      {
        id: crypto.randomUUID(),
        title: 'Bantu Pendidikan Anak Yatim',
        category: 'zakat',
        description: 'Program beasiswa untuk 100 anak yatim di seluruh Indonesia',
        target: 500000000,
        collected: 325000000,
        contributors: 1250,
        location: 'Seluruh Indonesia',
        endDate: '2025-12-31',
        image: '',
        created_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Wakaf Quran untuk Pesantren',
        category: 'wakaf',
        description: 'Pengadaan 1000 Al-Quran untuk pesantren di daerah terpencil',
        target: 200000000,
        collected: 145000000,
        contributors: 580,
        location: 'Papua, NTT',
        endDate: '2025-11-30',
        image: '',
        created_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Infaq Pembangunan Masjid',
        category: 'infaq',
        description: 'Renovasi masjid di desa tertinggal',
        target: 300000000,
        collected: 180000000,
        contributors: 720,
        location: 'Jawa Tengah',
        endDate: '2026-01-31',
        image: '',
        created_at: new Date().toISOString()
      }
    ];

    for (const program of programs) {
      await kv.set(`program:${program.id}`, program);
    }

    // Seed Templates
    const templates = [
      {
        id: crypto.randomUUID(),
        title: 'Ucapan Terima Kasih Donasi',
        category: 'terima-kasih',
        content: 'Assalamualaikum {nama},\n\nBarakallahu fiikum atas donasi {kategori} sebesar {nominal} yang telah Bapak/Ibu salurkan.\n\nSemoga menjadi amal jariyah dan berkah untuk keluarga.\n\nJazakumullahu khairan.',
        variables: ['nama', 'kategori', 'nominal'],
        created_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Reminder Follow Up',
        category: 'follow-up',
        content: 'Assalamualaikum {nama},\n\nSemoga Bapak/Ibu dalam keadaan sehat selalu.\n\nKami ingin mengingatkan tentang kesempatan berbagi kebaikan di bulan {bulan} ini.\n\nTerima kasih atas perhatiannya.',
        variables: ['nama', 'bulan'],
        created_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Laporan Penyaluran',
        category: 'laporan',
        content: 'Assalamualaikum {nama},\n\nAlhamdulillah, donasi Bapak/Ibu sebesar {nominal} telah disalurkan untuk program {program}.\n\nTerlampir bukti penyaluran.\n\nBarakallahu fiikum.',
        variables: ['nama', 'nominal', 'program'],
        created_at: new Date().toISOString()
      }
    ];

    for (const template of templates) {
      await kv.set(`template:${template.id}`, template);
    }

    // Seed Demo Users (for testing role-based access)
    const demoUsers = [
      {
        id: 'demo-pembimbing-1',
        full_name: 'Ustadz Abdullah (Pembimbing)',
        phone: '+6281111111111',
        email: 'pembimbing1@demo.com',
        city: 'Jakarta',
        regu_id: 'regu1',
        role: 'pembimbing',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-admin-1',
        full_name: 'Admin ZISWAF',
        phone: '+6282222222222',
        email: 'admin@demo.com',
        city: 'Jakarta',
        regu_id: null,
        role: 'admin',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-relawan-1',
        full_name: 'Ahmad Relawan',
        phone: '+6283333333333',
        email: 'relawan1@demo.com',
        city: 'Bandung',
        regu_id: 'regu1',
        role: 'relawan',
        created_at: new Date().toISOString()
      }
    ];

    for (const user of demoUsers) {
      await kv.set(`user:${user.id}`, user);
      await kv.set(`user:phone:${user.phone}`, user);
    }

    console.log('✅ Database seeded successfully');

    return c.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        regus: regus.length,
        programs: programs.length,
        templates: templates.length,
        demo_users: demoUsers.length
      }
    });
  } catch (error) {
    console.error('❌ Seed error:', error);
    return c.json({ error: `Seed error: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);