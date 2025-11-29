import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { runSeeder } from './seed.tsx';

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

// Normalize phone number format (ensure it starts with +)
const normalizePhone = (phone: string): string => {
  if (!phone) return phone;
  
  // Remove all spaces, dashes, and parentheses
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  
  // If starts with 0, replace with +62
  if (normalized.startsWith('0')) {
    normalized = '+62' + normalized.substring(1);
  }
  
  // If starts with 62 but no +, add +
  if (normalized.startsWith('62') && !normalized.startsWith('+')) {
    normalized = '+' + normalized;
  }
  
  // If doesn't start with +, assume it needs +
  if (!normalized.startsWith('+')) {
    normalized = '+' + normalized;
  }
  
  return normalized;
};

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
    const { fullName, phone: rawPhone, city, reguId } = await c.req.json();

    if (!fullName || !rawPhone) {
      return c.json({ error: 'Nama dan nomor WhatsApp harus diisi' }, 400);
    }

    // 🔧 NORMALIZE phone number
    const phone = normalizePhone(rawPhone);

    console.log('\n🔍 ===== DEBUG REGISTER =====');
    console.log('📞 Phone input (raw):', rawPhone);
    console.log('📞 Phone normalized:', phone);

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
    const { phone: rawPhone } = await c.req.json();

    if (!rawPhone) {
      return c.json({ error: 'Nomor WhatsApp harus diisi' }, 400)
    }

    // 🔧 NORMALIZE phone number
    const phone = normalizePhone(rawPhone);

    console.log('\n🔍 ===== DEBUG SEND OTP =====');
    console.log('📞 Phone input (raw):', rawPhone);
    console.log('📞 Phone normalized:', phone);
    console.log('🔑 Looking for key:', `user:phone:${phone}`);

    // 🔧 CHECK if user exists first
    const existingUser = await kv.get(`user:phone:${phone}`);
    
    console.log('📦 KV get result:', existingUser);
    console.log('❓ Is null?', existingUser === null);
    console.log('❓ Is undefined?', existingUser === undefined);
    console.log('❓ Type:', typeof existingUser);
    
    if (!existingUser) {
      console.log('❌ User NOT found in database');
      console.log('💡 Trying to check all users with similar phone...');
      
      // Debug: Get all users to see what's in database
      const allUsers = await kv.getByPrefix('user:phone:');
      console.log('📊 Total user:phone: entries:', allUsers.length);
      
      // Show first 5 phone numbers
      allUsers.slice(0, 5).forEach((u: any) => {
        console.log(`  - Phone: ${u.phone}, Name: ${u.full_name}`);
      });
      
      return c.json({ 
        error: 'Nomor ini belum terdaftar. Silakan daftar terlebih dahulu.',
        needsRegistration: true,
        debug: {
          searchedPhone: phone,
          totalUsersInDB: allUsers.length,
          hint: 'Check if phone format matches exactly'
        }
      }, 404);
    }

    console.log('✅ User found for OTP:', {
      phone: existingUser.phone,
      name: existingUser.full_name,
      role: existingUser.role,
      id: existingUser.id
    });

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
    console.log(`Name: ${existingUser.full_name}`);
    console.log(`Role: ${existingUser.role}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires: 5 minutes`);
    console.log('═══════════════════════════════════════════');
    console.log('\n');

    return c.json({
      success: true,
      message: 'Kode OTP telah dikirim',
      // For demo purposes - OTP akan terlihat di console log server
      demo_otp: otp,
      user: {
        name: existingUser.full_name,
        role: existingUser.role
      }
    });
  } catch (error) {
    console.log('❌ Send OTP error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Verify OTP and login
app.post('/make-server-f689ca3f/auth/verify-otp', async (c) => {
  try {
    const { phone: rawPhone, otp } = await c.req.json();

    if (!rawPhone || !otp) {
      return c.json({ error: 'Nomor WhatsApp dan OTP harus diisi' }, 400);
    }

    // 🔧 NORMALIZE phone number
    const phone = normalizePhone(rawPhone);

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

// Get single muzakki by ID
app.get('/make-server-f689ca3f/muzakki/:id', async (c) => {
  try {
    const muzakkiId = c.req.param('id');
    
    console.log('📥 GET /muzakki/:id request:', muzakkiId);

    // Find muzakki across all relawans
    const allMuzakki = await kv.getByPrefix('muzakki:');
    const muzakki = allMuzakki.find((m: any) => m.id === muzakkiId);

    if (!muzakki) {
      return c.json({ error: 'Muzakki tidak ditemukan' }, 404);
    }

    console.log('✅ Found muzakki:', muzakki);

    return c.json({
      success: true,
      data: muzakki
    });
  } catch (error) {
    console.error('❌ Get single muzakki error:', error);
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
    
    console.log('📝 Update Muzakki Request:', { muzakkiId, updates });

    // Try to get relawan_id from updates or find muzakki to get relawan_id
    let relawanId = updates.relawan_id;
    
    if (!relawanId) {
      // Find muzakki across all relawans to get relawan_id
      const allMuzakki = await kv.getByPrefix('muzakki:');
      const muzakki = allMuzakki.find((m: any) => m.id === muzakkiId);
      
      if (!muzakki) {
        return c.json({ error: 'Muzakki tidak ditemukan' }, 404);
      }
      
      relawanId = muzakki.relawan_id;
      console.log('🔍 Found relawan_id from existing muzakki:', relawanId);
    }

    const existing = await kv.get(`muzakki:${relawanId}:${muzakkiId}`);
    
    if (!existing) {
      return c.json({ error: 'Muzakki tidak ditemukan' }, 404);
    }

    const updated = {
      ...existing,
      ...updates,
      id: muzakkiId, // Preserve ID
      relawan_id: relawanId, // Preserve relawan_id
      updated_at: new Date().toISOString()
    };

    await kv.set(`muzakki:${relawanId}:${muzakkiId}`, updated);

    console.log('✅ Muzakki updated successfully:', updated);

    return c.json({
      success: true,
      message: 'Muzakki berhasil diupdate',
      data: updated
    });
  } catch (error) {
    console.error('❌ Update muzakki error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Delete muzakki
app.delete('/make-server-f689ca3f/muzakki/:id', async (c) => {
  try {
    const muzakkiId = c.req.param('id');
    let relawanId = c.req.query('relawan_id');

    if (!relawanId) {
      // Find muzakki across all relawans to get relawan_id
      const allMuzakki = await kv.getByPrefix('muzakki:');
      const muzakki = allMuzakki.find((m: any) => m.id === muzakkiId);
      
      if (!muzakki) {
        return c.json({ error: 'Muzakki tidak ditemukan' }, 404);
      }
      
      relawanId = muzakki.relawan_id;
      console.log('🔍 Found relawan_id from existing muzakki for delete:', relawanId);
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
    const muzakkiId = c.req.query('muzakki_id');
    const isAdmin = c.req.query('admin') === 'true';

    if (!relawanId && !muzakkiId && !isAdmin) {
      return c.json({ error: 'Relawan ID, Muzakki ID, atau admin parameter diperlukan' }, 400);
    }

    let donations = [];

    if (isAdmin) {
      // Get all donations for admin
      donations = await kv.getByPrefix('donation:');
    } else if (muzakkiId) {
      // Get donations for specific muzakki
      const allDonations = await kv.getByPrefix('donation:');
      donations = allDonations.filter((d: any) => d.muzakki_id === muzakkiId);
    } else if (relawanId) {
      // Get donations for relawan
      donations = await kv.getByPrefix(`donation:${relawanId}:`);
    }
    
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
    const { relawan_id, relawan_name, muzakki_id, donor_name, amount, category, type, payment_method, bukti_transfer_url, receipt_number, notes } = await c.req.json();

    if (!relawan_id || !amount || !category) {
      return c.json({ error: 'Relawan ID, nominal, dan kategori harus diisi' }, 400);
    }

    const donationId = crypto.randomUUID();
    const donation = {
      id: donationId,
      relawan_id: relawan_id,
      relawan_name: relawan_name || '',
      muzakki_id: muzakki_id || null,
      donor_name: donor_name || '',
      amount: amount,
      category: category,
      type: type || 'incoming',
      payment_method: payment_method || 'tunai',
      bukti_transfer_url: bukti_transfer_url || null,
      receipt_number: receipt_number || `${category.toUpperCase().substring(0,3)}${Date.now()}`,
      notes: notes || '',
      status: 'pending', // New donations need validation
      created_at: new Date().toISOString(),
      validated_by: null,
      validated_by_name: null,
      validated_at: null,
      rejection_reason: null
    };

    await kv.set(`donation:${relawan_id}:${donationId}`, donation);

    return c.json({
      success: true,
      message: 'Donasi berhasil dilaporkan dan menunggu validasi admin',
      data: donation
    });
  } catch (error) {
    console.log('Add donation error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Upload bukti transfer to Supabase Storage
app.post('/make-server-f689ca3f/donations/upload-bukti', async (c) => {
  try {
    const bucketName = 'make-f689ca3f-bukti-transfer';
    
    // Create bucket if doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return c.json({ error: `Failed to list buckets: ${listError.message}` }, 500);
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('Creating bucket:', bucketName);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return c.json({ error: `Failed to create bucket: ${createError.message}` }, 500);
      }
      
      console.log('Bucket created successfully');
    }

    // Get file from request
    const formData = await c.req.formData();
    const file = formData.get('file');
    const donationId = formData.get('donation_id');
    
    console.log('Upload request received:', {
      hasFile: !!file,
      donationId,
      fileType: file instanceof Blob ? file.type : typeof file,
      fileSize: file instanceof Blob ? file.size : 'N/A'
    });
    
    if (!file || !donationId) {
      return c.json({ error: 'File dan donation ID harus disertakan' }, 400);
    }

    // Convert file to buffer
    let fileBuffer: ArrayBuffer;
    let contentType = 'image/jpeg';
    
    if (file instanceof Blob) {
      fileBuffer = await file.arrayBuffer();
      contentType = file.type || 'image/jpeg';
      console.log('File converted to buffer:', { bufferSize: fileBuffer.byteLength, contentType });
    } else {
      console.error('File is not a Blob:', typeof file);
      return c.json({ error: 'Invalid file format' }, 400);
    }

    // Upload to storage
    const fileName = `${donationId}-${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: contentType,
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }

    // Get signed URL
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600 * 24 * 365); // 1 year

    if (urlError) {
      console.error('Signed URL error:', urlError);
      return c.json({ error: `Failed to create signed URL: ${urlError.message}` }, 500);
    }

    return c.json({
      success: true,
      message: 'Bukti transfer berhasil diupload',
      data: {
        url: signedUrl?.signedUrl,
        path: data.path
      }
    });
  } catch (error: any) {
    console.error('Upload bukti error:', error);
    return c.json({ error: `Server error: ${error?.message || 'Unknown error'}` }, 500);
  }
});

// Get all pending donations (for admin)
app.get('/make-server-f689ca3f/donations/pending', async (c) => {
  try {
    // Get all donations
    const allDonations = await kv.getByPrefix('donation:');
    
    // Filter pending ones
    const pendingDonations = allDonations.filter(d => d.status === 'pending');
    
    // Sort by date (newest first)
    pendingDonations.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return c.json({
      success: true,
      data: pendingDonations,
      count: pendingDonations.length
    });
  } catch (error) {
    console.error('Get pending donations error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Validate donation (admin only)
app.post('/make-server-f689ca3f/donations/:donationId/validate', async (c) => {
  try {
    const donationId = c.req.param('donationId');
    const { admin_id, admin_name, action, rejection_reason } = await c.req.json();
    
    if (!admin_id || !action) {
      return c.json({ error: 'Admin ID dan action harus diisi' }, 400);
    }
    
    if (action !== 'approve' && action !== 'reject') {
      return c.json({ error: 'Action harus "approve" atau "reject"' }, 400);
    }
    
    if (action === 'reject' && !rejection_reason) {
      return c.json({ error: 'Alasan penolakan harus diisi' }, 400);
    }
    
    // Find the donation
    const allDonations = await kv.getByPrefix('donation:');
    const donation = allDonations.find(d => d.id === donationId);
    
    if (!donation) {
      return c.json({ error: 'Donasi tidak ditemukan' }, 404);
    }
    
    // Update donation status
    const updatedDonation = {
      ...donation,
      status: action === 'approve' ? 'validated' : 'rejected',
      validated_by: admin_id,
      validated_by_name: admin_name || 'Admin',
      validated_at: new Date().toISOString(),
      rejection_reason: action === 'reject' ? rejection_reason : null
    };
    
    // Save back
    await kv.set(`donation:${donation.relawan_id}:${donationId}`, updatedDonation);
    
    return c.json({
      success: true,
      message: action === 'approve' ? 'Donasi berhasil divalidasi' : 'Donasi ditolak',
      data: updatedDonation
    });
  } catch (error) {
    console.error('Validate donation error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Update donation (for adding bukti transfer URL)
app.patch('/make-server-f689ca3f/donations/:donationId', async (c) => {
  try {
    const donationId = c.req.param('donationId');
    const updates = await c.req.json();
    
    // Find the donation
    const allDonations = await kv.getByPrefix('donation:');
    const donation = allDonations.find(d => d.id === donationId);
    
    if (!donation) {
      return c.json({ error: 'Donasi tidak ditemukan' }, 404);
    }
    
    // Update donation
    const updatedDonation = {
      ...donation,
      ...updates
    };
    
    // Save back
    await kv.set(`donation:${donation.relawan_id}:${donationId}`, updatedDonation);
    
    return c.json({
      success: true,
      message: 'Donasi berhasil diperbarui',
      data: updatedDonation
    });
  } catch (error) {
    console.error('Update donation error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get donation statistics by status
app.get('/make-server-f689ca3f/donations/stats', async (c) => {
  try {
    const allDonations = await kv.getByPrefix('donation:');
    
    const stats = {
      total: allDonations.length,
      pending: allDonations.filter(d => d.status === 'pending').length,
      validated: allDonations.filter(d => d.status === 'validated').length,
      rejected: allDonations.filter(d => d.status === 'rejected').length,
      total_amount: allDonations
        .filter(d => d.status === 'validated')
        .reduce((sum, d) => sum + d.amount, 0),
      pending_amount: allDonations
        .filter(d => d.status === 'pending')
        .reduce((sum, d) => sum + d.amount, 0)
    };
    
    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
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
    
    // 🔥 NEW: Calculate statistics for each member
    const membersWithStats = await Promise.all(
      uniqueMembers.map(async (member: any) => {
        // Get all donations for this member
        const donations = await kv.getByPrefix(`donation:${member.id}:`);
        
        // Calculate total donations (only incoming)
        const totalDonations = donations.reduce((sum: number, donation: any) => {
          if (!donation || typeof donation !== 'object') return sum;
          const isIncoming = !donation.type || donation.type === 'incoming';
          return isIncoming ? sum + (donation.amount || 0) : sum;
        }, 0);
        
        // Get all muzakki for this member
        const muzakkiList = await kv.getByPrefix(`muzakki:${member.id}:`);
        const totalMuzakki = muzakkiList.length;
        
        console.log(`📊 ${member.full_name}: ${totalDonations} donations, ${totalMuzakki} muzakki`);
        
        return {
          id: member.id,
          full_name: member.full_name,
          phone: member.phone,
          role: member.role,
          total_donations: totalDonations,
          total_muzakki: totalMuzakki,
          joined_at: member.created_at || new Date().toISOString()
        };
      })
    );
    
    // Sort by total donations (highest first) for leaderboard
    membersWithStats.sort((a, b) => b.total_donations - a.total_donations);
    
    console.log('✅ Members with stats calculated:', membersWithStats.length);
    
    return c.json({
      success: true,
      data: membersWithStats
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

    console.log('📊 Fetching statistics for relawan:', relawanId);

    // Get all donations
    const donations = await kv.getByPrefix(`donation:${relawanId}:`);
    console.log('💰 Donations found:', donations.length);
    
    // Get all muzakki
    const muzakkiList = await kv.getByPrefix(`muzakki:${relawanId}:`);
    console.log('👥 Muzakki found:', muzakkiList.length);

    // Get all communications
    const allComms = await kv.getByPrefix('communication:');
    const relawanComms = allComms.filter((comm: any) => comm.relawan_id === relawanId);
    console.log('💬 Communications found:', relawanComms.length);

    // Calculate statistics - donations is already array of values from getByPrefix
    const totalDonations = donations.reduce((sum: number, donation: any) => {
      // getByPrefix returns array of values directly (not { key, value })
      if (!donation || typeof donation !== 'object') {
        return sum;
      }
      // Check type field, default to 'incoming' if not specified
      const isIncoming = !donation.type || donation.type === 'incoming';
      return isIncoming ? sum + (donation.amount || 0) : sum;
    }, 0);

    console.log('💵 Total donations calculated:', totalDonations);

    const totalDistributed = donations.reduce((sum: number, donation: any) => {
      if (!donation || typeof donation !== 'object') {
        return sum;
      }
      return donation.type === 'outgoing' ? sum + (donation.amount || 0) : sum;
    }, 0);

    const byCategory = donations.reduce((acc: any, donation: any) => {
      if (!donation || typeof donation !== 'object') {
        return acc;
      }
      const isIncoming = !donation.type || donation.type === 'incoming';
      if (isIncoming && donation.category) {
        acc[donation.category] = (acc[donation.category] || 0) + (donation.amount || 0);
      }
      return acc;
    }, {});

    console.log('📊 Donations by category (raw):', byCategory);
    console.log('📊 Sample donations:', donations.slice(0, 3).map((d: any) => ({
      id: d.id,
      category: d.category,
      amount: d.amount,
      type: d.type
    })));

    // Combine donations and communications for recent activities
    const donationActivities = donations
      .filter((d: any) => d && (!d.type || d.type === 'incoming'))
      .map((d: any) => ({
        id: d.id,
        type: 'donation',
        title: `Donasi ${d.category || 'ZISWAF'}`,
        muzakki_name: d.muzakki_name || 'Donatur',
        amount: d.amount || 0,
        category: d.category,
        time: d.created_at || new Date().toISOString()
      }));

    const commActivities = relawanComms.map((comm: any) => ({
      id: comm.id,
      type: 'follow-up',
      title: `Follow up ${comm.type === 'call' ? 'Telepon' : comm.type === 'whatsapp' ? 'WhatsApp' : 'Pertemuan'}`,
      muzakki_name: comm.notes || 'Komunikasi',
      time: comm.created_at || new Date().toISOString()
    }));

    // Combine and sort by time (most recent first)
    const allActivities = [...donationActivities, ...commActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    console.log('📋 Recent activities:', allActivities.length);

    return c.json({
      success: true,
      data: {
        total_donations: totalDonations,
        total_distributed: totalDistributed,
        total_muzakki: muzakkiList.length,
        donations_by_category: {
          zakat: byCategory.zakat || 0,
          infaq: byCategory.infaq || 0,
          sedekah: byCategory.sedekah || 0,
          wakaf: byCategory.wakaf || 0
        },
        balance: totalDonations - totalDistributed,
        monthly_target: 15000000, // Default monthly target
        muzakki_target: 100, // Default muzakki target
        monthly_progress: (totalDonations / 15000000) * 100,
        muzakki_progress: (muzakkiList.length / 100) * 100,
        recent_activities: allActivities
      }
    });
  } catch (error) {
    console.error('❌ Get statistics error:', error);
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

// Get admin global statistics
app.get('/make-server-f689ca3f/admin/stats/global', async (c) => {
  try {
    console.log('📊 Fetching admin global statistics...');

    // Get all data
    const allDonations = await kv.getByPrefix('donation:');
    const allMuzakki = await kv.getByPrefix('muzakki:');
    const allUsers = await kv.getByPrefix('user:');
    const allRegus = await kv.getByPrefix('regu:');

    // Deduplicate users (since we have user:{id} and user:phone:{phone})
    const uniqueUsers = allUsers.reduce((acc: any[], user: any) => {
      if (!acc.some((u: any) => u.id === user.id)) {
        acc.push(user);
      }
      return acc;
    }, []);

    // Calculate total donations
    const totalDonations = allDonations
      .filter((d: any) => d.type === 'incoming')
      .reduce((sum: number, d: any) => sum + d.amount, 0);

    // Calculate by category
    const byCategory = allDonations
      .filter((d: any) => d.type === 'incoming')
      .reduce((acc: any, d: any) => {
        acc[d.category] = (acc[d.category] || 0) + d.amount;
        return acc;
      }, { zakat: 0, infaq: 0, sedekah: 0, wakaf: 0 });

    // Count relawans
    const totalRelawan = uniqueUsers.filter((u: any) => u.role === 'relawan').length;

    const stats = {
      total_donations: totalDonations,
      total_muzakki: allMuzakki.length,
      total_relawan: totalRelawan,
      total_regu: allRegus.filter((r: any) => r.id && !r.id.startsWith('code:')).length,
      by_category: byCategory
    };

    console.log('✅ Global stats calculated:', stats);

    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Get admin global stats error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get admin regu statistics
app.get('/make-server-f689ca3f/admin/stats/regu', async (c) => {
  try {
    console.log('📊 Fetching admin regu statistics...');

    // Get all regus
    const allRegus = await kv.getByPrefix('regu:');
    
    // Filter out code mappings (regu:code:XXX)
    const realRegus = allRegus.filter((r: any) => r.id && !r.id.includes('code:'));

    // Get all users and donations for enrichment
    const allUsers = await kv.getByPrefix('user:');
    const allDonations = await kv.getByPrefix('donation:');
    const allMuzakki = await kv.getByPrefix('muzakki:');

    // Deduplicate users
    const uniqueUsers = allUsers.reduce((acc: any[], user: any) => {
      if (user.id && !acc.some((u: any) => u.id === user.id)) {
        acc.push(user);
      }
      return acc;
    }, []);

    // Calculate stats for each regu
    const reguStats = realRegus.map((regu: any) => {
      // Count members in this regu
      const members = uniqueUsers.filter((u: any) => u.regu_id === regu.id);
      
      // Calculate total donations from members
      const memberIds = members.map((m: any) => m.id);
      const reguDonations = allDonations.filter((d: any) => 
        d.type === 'incoming' && memberIds.includes(d.relawan_id)
      );
      const totalDonations = reguDonations.reduce((sum: number, d: any) => sum + d.amount, 0);

      // Count muzakki from members
      const reguMuzakki = allMuzakki.filter((m: any) => memberIds.includes(m.relawan_id));

      return {
        id: regu.id,
        name: regu.name,
        pembimbing_name: regu.pembimbing_name,
        total_donations: totalDonations,
        total_muzakki: reguMuzakki.length,
        member_count: members.length,
        target: regu.target_amount || 60000000
      };
    });

    // Sort by total donations (descending)
    reguStats.sort((a, b) => b.total_donations - a.total_donations);

    console.log('✅ Regu stats calculated:', reguStats.length, 'regus');

    return c.json({
      success: true,
      data: reguStats
    });
  } catch (error) {
    console.error('❌ Get admin regu stats error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

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
    const { title, category, content, message, variables } = await c.req.json();

    const templateContent = message || content; // Support both message and content fields
    if (!title || !category || !templateContent) {
      return c.json({ error: 'Title, category, dan content harus diisi' }, 400);
    }

    const templateId = crypto.randomUUID();
    const template = {
      id: templateId,
      title,
      category,
      content: templateContent,
      message: templateContent, // Store in both fields for compatibility
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
    console.log('🌱 Running database seeder...');
    
    // Optional: Add a simple protection key
    const protectionKey = c.req.query('key');
    if (protectionKey && protectionKey !== 'ziswaf-dev-2025') {
      return c.json({ 
        success: false,
        error: 'Invalid protection key' 
      }, 403);
    }
    
    const result = await runSeeder();
    
    return c.json(result);
  } catch (error) {
    console.error('❌ Seed error:', error);
    return c.json({ 
      success: false,
      error: `Seed error: ${error.message}` 
    }, 500);
  }
});

// DEBUG: Check user in database
app.get('/make-server-f689ca3f/debug/user/:phone', async (c) => {
  try {
    const phone = c.req.param('phone');
    
    console.log('🔍 DEBUG: Checking user with phone:', phone);
    
    // Try to get user
    const user = await kv.get(`user:phone:${phone}`);
    
    console.log('🔍 DEBUG: User data:', user);
    
    if (!user) {
      return c.json({
        found: false,
        key: `user:phone:${phone}`,
        message: 'User not found in database'
      });
    }
    
    return c.json({
      found: true,
      key: `user:phone:${phone}`,
      user: user,
      hasId: !!user.id,
      hasPhone: !!user.phone,
      hasName: !!user.full_name,
      hasRole: !!user.role
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    return c.json({ 
      error: `Debug error: ${error.message}` 
    }, 500);
  }
});

// ============================================
// DATABASE RESET & SEED ENDPOINT
// ============================================

// DANGER: Reset entire database
app.post('/make-server-f689ca3f/admin/reset-database', async (c) => {
  try {
    console.log('⚠️  DATABASE RESET REQUESTED!');
    
    // Get all keys
    const allUsers = await kv.getByPrefix('user:');
    const allRegus = await kv.getByPrefix('regu:');
    const allDonations = await kv.getByPrefix('donation:');
    const allProspects = await kv.getByPrefix('prospect:');
    const allActivities = await kv.getByPrefix('activity:');
    const allTemplates = await kv.getByPrefix('template:');
    const allChats = await kv.getByPrefix('chat:');
    
    console.log('📊 Items to delete:');
    console.log('  - Users:', allUsers.length);
    console.log('  - Regus:', allRegus.length);
    console.log('  - Donations:', allDonations.length);
    console.log('  - Prospects:', allProspects.length);
    console.log('  - Activities:', allActivities.length);
    console.log('  - Templates:', allTemplates.length);
    console.log('  - Chats:', allChats.length);
    
    // Delete all data
    const keysToDelete = [
      ...allUsers.map((u: any) => `user:${u.id}`),
      ...allUsers.map((u: any) => `user:phone:${u.phone}`),
      ...allRegus.map((r: any) => `regu:${r.id}`),
      ...allRegus.map((r: any) => r.join_code ? `regu:code:${r.join_code}` : null).filter(Boolean),
      ...allDonations.map((d: any) => `donation:${d.id}`),
      ...allProspects.map((p: any) => `prospect:${p.id}`),
      ...allActivities.map((a: any) => `activity:${a.id}`),
      ...allTemplates.map((t: any) => `template:${t.id}`),
      ...allChats.map((c: any) => `chat:${c.regu_id}:${c.id}`)
    ];
    
    await kv.mdel(keysToDelete);
    
    console.log('✅ Database cleared!');
    
    return c.json({
      success: true,
      message: 'Database berhasil di-reset',
      deleted: keysToDelete.length
    });
  } catch (error) {
    console.error('❌ Reset database error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Seed initial data
app.post('/make-server-f689ca3f/admin/seed-database', async (c) => {
  try {
    console.log('🌱 SEEDING DATABASE...');
    
    const generateJoinCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };
    
    // ============================================
    // 1. CREATE ADMIN USER
    // ============================================
    const adminId = crypto.randomUUID();
    const admin = {
      id: adminId,
      phone: '+6281234567890',
      full_name: 'Admin ZISWAF',
      email: 'admin@ziswaf.org',
      city: 'Jakarta',
      role: 'admin',
      regu_id: null,
      created_at: new Date().toISOString()
    };
    
    await kv.set(`user:${adminId}`, admin);
    await kv.set(`user:phone:${admin.phone}`, admin);
    console.log('✅ Admin created:', admin.phone);
    
    // ============================================
    // 2. CREATE PEMBIMBING USERS
    // ============================================
    const pembimbing1Id = crypto.randomUUID();
    const pembimbing1 = {
      id: pembimbing1Id,
      phone: '+6281234567891',
      full_name: 'Ustadz Ahmad',
      email: 'ahmad@ziswaf.org',
      city: 'Jakarta',
      role: 'pembimbing',
      regu_id: null, // Will be set after creating regu
      created_at: new Date().toISOString()
    };
    
    const pembimbing2Id = crypto.randomUUID();
    const pembimbing2 = {
      id: pembimbing2Id,
      phone: '+6281234567892',
      full_name: 'Ustadzah Fatimah',
      email: 'fatimah@ziswaf.org',
      city: 'Bandung',
      role: 'pembimbing',
      regu_id: null,
      created_at: new Date().toISOString()
    };
    
    await kv.set(`user:${pembimbing1Id}`, pembimbing1);
    await kv.set(`user:phone:${pembimbing1.phone}`, pembimbing1);
    await kv.set(`user:${pembimbing2Id}`, pembimbing2);
    await kv.set(`user:phone:${pembimbing2.phone}`, pembimbing2);
    console.log('✅ Pembimbing 1 created:', pembimbing1.phone);
    console.log('✅ Pembimbing 2 created:', pembimbing2.phone);
    
    // ============================================
    // 3. CREATE REGUS
    // ============================================
    const regu1Id = crypto.randomUUID();
    const regu1JoinCode = generateJoinCode();
    const regu1 = {
      id: regu1Id,
      name: 'Regu Barokah',
      pembimbing_id: pembimbing1Id,
      pembimbing_name: pembimbing1.full_name,
      member_count: 0,
      total_donations: 0,
      target_amount: 60000000,
      join_code: regu1JoinCode,
      created_at: new Date().toISOString()
    };
    
    const regu2Id = crypto.randomUUID();
    const regu2JoinCode = generateJoinCode();
    const regu2 = {
      id: regu2Id,
      name: 'Regu Sakinah',
      pembimbing_id: pembimbing2Id,
      pembimbing_name: pembimbing2.full_name,
      member_count: 0,
      total_donations: 0,
      target_amount: 50000000,
      join_code: regu2JoinCode,
      created_at: new Date().toISOString()
    };
    
    await kv.set(`regu:${regu1Id}`, regu1);
    await kv.set(`regu:code:${regu1JoinCode}`, regu1Id);
    await kv.set(`regu:${regu2Id}`, regu2);
    await kv.set(`regu:code:${regu2JoinCode}`, regu2Id);
    console.log('✅ Regu 1 created:', regu1.name, 'Code:', regu1JoinCode);
    console.log('✅ Regu 2 created:', regu2.name, 'Code:', regu2JoinCode);
    
    // Update pembimbing with regu_id
    pembimbing1.regu_id = regu1Id;
    pembimbing2.regu_id = regu2Id;
    await kv.set(`user:${pembimbing1Id}`, pembimbing1);
    await kv.set(`user:phone:${pembimbing1.phone}`, pembimbing1);
    await kv.set(`user:${pembimbing2Id}`, pembimbing2);
    await kv.set(`user:phone:${pembimbing2.phone}`, pembimbing2);
    
    // ============================================
    // 4. CREATE RELAWAN USERS
    // ============================================
    const relawan1Id = crypto.randomUUID();
    const relawan1 = {
      id: relawan1Id,
      phone: '+6281234567893',
      full_name: 'Budi Santoso',
      email: 'budi@example.com',
      city: 'Jakarta',
      role: 'relawan',
      regu_id: regu1Id,
      created_at: new Date().toISOString()
    };
    
    const relawan2Id = crypto.randomUUID();
    const relawan2 = {
      id: relawan2Id,
      phone: '+6281234567894',
      full_name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      city: 'Jakarta',
      role: 'relawan',
      regu_id: regu1Id,
      created_at: new Date().toISOString()
    };
    
    const relawan3Id = crypto.randomUUID();
    const relawan3 = {
      id: relawan3Id,
      phone: '+6281234567895',
      full_name: 'Andi Wijaya',
      email: 'andi@example.com',
      city: 'Bandung',
      role: 'relawan',
      regu_id: regu2Id,
      created_at: new Date().toISOString()
    };
    
    await kv.set(`user:${relawan1Id}`, relawan1);
    await kv.set(`user:phone:${relawan1.phone}`, relawan1);
    await kv.set(`user:${relawan2Id}`, relawan2);
    await kv.set(`user:phone:${relawan2.phone}`, relawan2);
    await kv.set(`user:${relawan3Id}`, relawan3);
    await kv.set(`user:phone:${relawan3.phone}`, relawan3);
    console.log('✅ Relawan 1 created:', relawan1.phone);
    console.log('✅ Relawan 2 created:', relawan2.phone);
    console.log('✅ Relawan 3 created:', relawan3.phone);
    
    // Update regu member counts
    regu1.member_count = 3; // pembimbing + 2 relawan
    regu2.member_count = 2; // pembimbing + 1 relawan
    await kv.set(`regu:${regu1Id}`, regu1);
    await kv.set(`regu:${regu2Id}`, regu2);
    
    // ============================================
    // 5. CREATE SAMPLE DONATIONS
    // ============================================
    const donation1Id = crypto.randomUUID();
    const donation1 = {
      id: donation1Id,
      user_id: relawan1Id,
      user_name: relawan1.full_name,
      regu_id: regu1Id,
      muzakki_name: 'Pak Hasan',
      amount: 5000000,
      category: 'zakat',
      payment_method: 'transfer',
      notes: 'Zakat Maal',
      created_at: new Date().toISOString()
    };
    
    const donation2Id = crypto.randomUUID();
    const donation2 = {
      id: donation2Id,
      user_id: relawan2Id,
      user_name: relawan2.full_name,
      regu_id: regu1Id,
      muzakki_name: 'Bu Ani',
      amount: 2000000,
      category: 'infaq',
      payment_method: 'cash',
      notes: 'Infaq Jumat',
      created_at: new Date().toISOString()
    };
    
    await kv.set(`donation:${donation1Id}`, donation1);
    await kv.set(`donation:${donation2Id}`, donation2);
    console.log('✅ Sample donations created');
    
    // Update regu total donations
    regu1.total_donations = 7000000;
    await kv.set(`regu:${regu1Id}`, regu1);
    
    // ============================================
    // 6. CREATE SAMPLE PROSPECTS
    // ============================================
    const prospect1Id = crypto.randomUUID();
    const prospect1 = {
      id: prospect1Id,
      user_id: relawan1Id,
      user_name: relawan1.full_name,
      muzakki_name: 'Pak Bambang',
      phone: '+628123456789',
      address: 'Jl. Sudirman No. 123, Jakarta',
      status: 'contacted',
      potential_amount: 10000000,
      notes: 'Tertarik untuk zakat profesi',
      created_at: new Date().toISOString()
    };
    
    await kv.set(`prospect:${prospect1Id}`, prospect1);
    console.log('✅ Sample prospects created');
    
    // ============================================
    // 7. CREATE SAMPLE TEMPLATES
    // ============================================
    const template1Id = crypto.randomUUID();
    const template1 = {
      id: template1Id,
      title: 'Ucapan Terima Kasih',
      category: 'follow_up',
      content: 'Assalamu\'alaikum {{nama}}, jazakallahu khairan atas donasi {{kategori}} sebesar {{jumlah}}. Semoga menjadi amal jariyah.',
      message: 'Assalamu\'alaikum {{nama}}, jazakallahu khairan atas donasi {{kategori}} sebesar {{jumlah}}. Semoga menjadi amal jariyah.',
      variables: ['nama', 'kategori', 'jumlah'],
      created_at: new Date().toISOString()
    };
    
    const template2Id = crypto.randomUUID();
    const template2 = {
      id: template2Id,
      title: 'Undangan Program',
      category: 'invitation',
      content: 'Assalamu\'alaikum {{nama}}, kami mengundang Bapak/Ibu untuk menghadiri {{acara}} pada {{tanggal}}. Jazakallahu khairan.',
      message: 'Assalamu\'alaikum {{nama}}, kami mengundang Bapak/Ibu untuk menghadiri {{acara}} pada {{tanggal}}. Jazakallahu khairan.',
      variables: ['nama', 'acara', 'tanggal'],
      created_at: new Date().toISOString()
    };
    
    await kv.set(`template:${template1Id}`, template1);
    await kv.set(`template:${template2Id}`, template2);
    console.log('✅ Sample templates created');
    
    // ============================================
    // SUMMARY
    // ============================================
    const summary = {
      users: {
        admin: { phone: admin.phone, password: 'admin123' },
        pembimbing: [
          { phone: pembimbing1.phone, password: 'pembimbing123', regu: regu1.name, code: regu1JoinCode },
          { phone: pembimbing2.phone, password: 'pembimbing123', regu: regu2.name, code: regu2JoinCode }
        ],
        relawan: [
          { phone: relawan1.phone, password: 'relawan123', regu: regu1.name },
          { phone: relawan2.phone, password: 'relawan123', regu: regu1.name },
          { phone: relawan3.phone, password: 'relawan123', regu: regu2.name }
        ]
      },
      regus: [
        { name: regu1.name, code: regu1JoinCode, pembimbing: pembimbing1.full_name },
        { name: regu2.name, code: regu2JoinCode, pembimbing: pembimbing2.full_name }
      ],
      stats: {
        total_users: 6,
        total_regus: 2,
        total_donations: 2,
        total_prospects: 1,
        total_templates: 2
      }
    };
    
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('📊 Summary:', JSON.stringify(summary, null, 2));
    
    return c.json({
      success: true,
      message: 'Database berhasil di-seed!',
      data: summary
    });
  } catch (error) {
    console.error('❌ Seed database error:', error);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);