import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

/**
 * Convex Router
 * 
 * Maps Supabase API endpoints to Convex queries
 * This allows apiCall() to route to Convex without changing any hooks
 */

// Type definition for environment variables
interface ImportMetaEnv {
    readonly VITE_CONVEX_URL: string;
    readonly NEXT_PUBLIC_CONVEX_URL: string;
    readonly [key: string]: any;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

const convexUrl = (import.meta.env?.VITE_CONVEX_URL as string) ||
    (import.meta.env?.NEXT_PUBLIC_CONVEX_URL as string) ||
    'https://quixotic-rhinoceros-311.convex.cloud';
let convexClient: ConvexHttpClient | null = null;

function getConvexClient(): ConvexHttpClient {
    if (!convexClient) {
        if (!convexUrl) {
            throw new Error('VITE_CONVEX_URL is not configured');
        }
        convexClient = new ConvexHttpClient(convexUrl);
    }
    // Note: We don't use client.setAuth() because our tokens are not JWT format
    // Instead, we pass the token in function arguments
    return convexClient;
}

// Helper function to handle file uploads
async function handleFileUpload(formData: FormData, client: any, api: any, token: string | null) {
    console.log('🔄 Starting file upload process...');
    try {
        // Parse FormData to extract file
        console.log('🔍 Extracting file and donation ID from FormData...');
        const file = formData.get('file') as File;
        const donationId = formData.get('donation_id') as string;

        console.log('📁 FormData debug:', {
            hasFile: !!file,
            fileName: file?.name,
            fileSize: file?.size,
            fileType: file?.type,
            donationId: donationId,
            donationIdType: typeof donationId,
            donationIdValue: donationId === 'undefined' ? 'STRING_UNDEFINED' : donationId,
            formDataKeys: Array.from(formData.keys())
        });

        if (!file) {
            const errorMsg = '❌ Missing file in FormData';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        if (!donationId || donationId === 'undefined' || donationId === 'null') {
            const errorMsg = `❌ Invalid donation_id: ${donationId}. Must be a valid Convex ID.`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        // Convert file to ArrayBuffer for Convex (not Uint8Array)
        console.log('🔄 Converting file to ArrayBuffer...');
        const arrayBuffer = await file.arrayBuffer();

        console.log('📁 File info:', {
            name: file.name,
            type: file.type,
            size: file.size,
            arrayBufferSize: arrayBuffer.byteLength
        });

        // Call Convex action to upload to storage (provider selected via config)
        console.log('🚀 Calling Convex action to upload file...');
        try {
            // @ts-ignore
            const result = await client.action(api.backblazeUpload.uploadFileToB2, {
                fileData: arrayBuffer, // Use ArrayBuffer, not Uint8Array
                fileName: file.name,
                fileType: file.type,
                donationId: donationId, // Validated donation ID
                token: token // Add authentication token
            });

            console.log('📤 Upload result:', JSON.stringify(result, null, 2));

            if (result?.success && result?.url) {
                console.log('🔄 Updating donation record with URL:', result.url);
                try {
                    // Update donation record with the file URL
                    // @ts-ignore
                    const updateResult = await client.mutation(api.donations.updateBuktiTransferUrl, {
                        donationId: donationId,
                        buktiTransferUrl: result.url,
                        token: token
                    });
                    console.log('✅ Donation record updated successfully:', updateResult);
                    return {
                        ...result,
                        updateResult: updateResult
                    };
                } catch (updateError) {
                    console.error('❌ Failed to update donation record:', updateError);
                    return {
                        success: false,
                        error: 'File uploaded but failed to update donation record',
                        uploadResult: result,
                        updateError: updateError.message
                    };
                }
            } else {
                console.warn('⚠️ Upload successful but no URL returned, skipping database update');
                return {
                    success: false,
                    error: 'Upload successful but no URL was returned',
                    uploadResult: result
                };
            }
        } catch (uploadError) {
            console.error('❌ Error during file upload:', uploadError);
            return {
                success: false,
                error: uploadError.message || 'Failed to upload file',
                stack: uploadError.stack
            };
        }
    } catch (error: any) {
        console.error('❌ Convex B2 upload error:', error);
        return {
            success: false,
            error: error.message || 'Failed to upload file to B2'
        };
    }
}

/**
 * Route API call to appropriate Convex query
 */
export async function routeToConvex(endpoint: string, options: RequestInit = {}): Promise<any> {
    const method = options.method || 'GET';

    // Extract auth token from headers
    // Handle different header formats (Headers object, array, or plain object)
    let token: string | null = null;
    if (options.headers) {
        if (options.headers instanceof Headers) {
            const auth = options.headers.get('Authorization');
            if (auth?.startsWith('Bearer ')) token = auth.split(' ')[1];
        } else if (Array.isArray(options.headers)) {
            const auth = options.headers.find(([key]) => key.toLowerCase() === 'authorization')?.[1];
            if (auth?.startsWith('Bearer ')) token = auth.split(' ')[1];
        } else {
            // Plain object
            const headers = options.headers as Record<string, string>;
            // Case-insensitive lookup
            const key = Object.keys(headers).find(k => k.toLowerCase() === 'authorization');
            const auth = key ? headers[key] : null;
            if (auth?.startsWith('Bearer ')) token = auth.split(' ')[1];
        }
    }

    // Get Convex client (token is passed in arguments, not via setAuth)
    const client = getConvexClient();

    if (token) {
        console.log('🔐 Convex Auth Token will be passed in arguments');
    } else {
        console.log('⚠️ No Auth Token found for Convex request');
    }

    console.log(`🔀 Routing to Convex: ${method} ${endpoint}`);
    console.log(`🔍 Full options:`, options);
    console.log(`🔍 Body type: ${options.body instanceof FormData ? 'FormData' : 'Other'}`);
    console.log(`🔍 Body content:`, options.body instanceof FormData ? 'FormData object' : options.body);

    // Helper to inject token into arguments
    const withAuth = (args: any) => {
        // All Convex functions expect the token in arguments
        if (token) {
            return { ...args, token };
        }
        return args;
    };

    // Parse endpoint and extract parameters
    const [path, queryString] = endpoint.split('?');
    const pathParts = path.split('/').filter(Boolean);

    try {
        // --- NOTIFICATIONS ---
        // GET /notifications/:userId
        if (pathParts[0] === 'notifications' && pathParts.length === 2 && method === 'GET') {
            const userId = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.notifications.getByUser, withAuth({ userId }));
            return { data: result };
        }
        // PUT /notifications/:id/read
        if (pathParts[0] === 'notifications' && pathParts.length === 3 && pathParts[2] === 'read' && method === 'PUT') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.notifications.markAsRead, withAuth({ id }));
            return { data: result };
        }
        // POST /notifications
        if (pathParts[0] === 'notifications' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.notifications.create, withAuth(body));
            return { data: result };
        }

        // --- ADMIN USERS ---
        // GET /admin/users
        if (pathParts[0] === 'admin' && pathParts[1] === 'users' && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.admin.getAllUsers, withAuth({}));
            return { success: true, data: result };
        }
        // POST /admin/users
        if (pathParts[0] === 'admin' && pathParts[1] === 'users' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.admin.createUser, withAuth(body));
            return { success: true, data: result };
        }
        // PUT /admin/users/:id
        if (pathParts[0] === 'admin' && pathParts[1] === 'users' && pathParts.length === 3 && method === 'PUT') {
            const userId = pathParts[2];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.admin.updateUser, withAuth({ userId: userId as any, ...body }));
            return { success: true, data: result };
        }
        // DELETE /admin/users/:id
        if (pathParts[0] === 'admin' && pathParts[1] === 'users' && pathParts.length === 3 && method === 'DELETE') {
            const userId = pathParts[2];
            // @ts-ignore
            const result = await client.mutation(api.admin.deleteUser, withAuth({ userId: userId as any }));
            return { success: true, data: result };
        }

        // --- ADMIN REGU ---
        // GET /regu (list with enrichment)
        if (pathParts[0] === 'regu' && pathParts.length === 1 && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.admin.getAllRegus, withAuth({}));
            return { success: true, data: result };
        }
        // POST /admin/regu
        if (pathParts[0] === 'admin' && pathParts[1] === 'regu' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.admin.createRegu, withAuth(body));
            return { success: true, data: result };
        }
        // PUT /admin/regu/:id
        if (pathParts[0] === 'admin' && pathParts[1] === 'regu' && pathParts.length === 3 && method === 'PUT') {
            const reguId = pathParts[2];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.admin.updateRegu, withAuth({ reguId, ...body }));
            return { success: true, data: result };
        }
        // DELETE /regu/:id
        if (pathParts[0] === 'regu' && pathParts.length === 2 && method === 'DELETE') {
            const reguId = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.admin.deleteRegu, withAuth({ reguId }));
            return { success: true, data: result };
        }

        // --- ADMIN MUZAKKI ---
        // GET /muzakki?all=true
        if (pathParts[0] === 'muzakki' && pathParts.length === 1 && method === 'GET') {
            const queryParams = new URLSearchParams(queryString);
            const all = queryParams.get('all') === 'true';
            if (all) {
                // @ts-ignore
                const result = await client.query(api.admin.getAllMuzakkis, withAuth({}));
                return { success: true, data: result };
            }
        }
        // PUT /muzakki/:id
        if (pathParts[0] === 'muzakki' && pathParts.length === 2 && method === 'PUT') {
            const muzakkiId = pathParts[1];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.admin.updateMuzakki, withAuth({ muzakkiId, ...body }));
            return { success: true, data: result };
        }
        // DELETE /muzakki/:id
        if (pathParts[0] === 'muzakki' && pathParts.length === 2 && method === 'DELETE') {
            const muzakkiId = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.admin.deleteMuzakki, withAuth({ muzakkiId }));
            return { success: true, data: result };
        }

        // --- ADMIN DONATIONS ---
        // GET /donations?admin=true
        if (pathParts[0] === 'donations' && method === 'GET') {
            const queryParams = new URLSearchParams(queryString);
            const isAdmin = queryParams.get('admin') === 'true';
            const relawanId = queryParams.get('relawan_id');

            if (isAdmin) {
                // @ts-ignore
                const result = await client.query(api.donationsAdmin.getAllDonations, withAuth({ admin: true }));
                return { success: true, data: result };
            }
            if (relawanId) {
                // @ts-ignore
                const result = await client.query(api.donations.listByRelawan, withAuth({ relawanId }));
                // Ensure we always return an array
                return { data: Array.isArray(result) ? result : [] };
            }
        }
        // GET /donations/pending
        if (pathParts[0] === 'donations' && pathParts[1] === 'pending' && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.donationsAdmin.getPendingDonations, withAuth({}));
            return { success: true, data: result };
        }
        // GET /donations/stats
        if (pathParts[0] === 'donations' && pathParts[1] === 'stats' && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.donationsAdmin.getDonationStats, withAuth({}));
            return { data: result };
        }
        // POST /admin/donations
        if (pathParts[0] === 'admin' && pathParts[1] === 'donations' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.donationsAdmin.createDonation, withAuth(body));
            return { success: true, data: result };
        }
        // PUT /admin/donations/:id
        if (pathParts[0] === 'admin' && pathParts[1] === 'donations' && pathParts.length === 3 && method === 'PUT') {
            const donationId = pathParts[2];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.donationsAdmin.updateDonation, withAuth({ donationId, ...body }));
            return { success: true, data: result };
        }
        // DELETE /donations/:id
        if (pathParts[0] === 'donations' && pathParts.length === 2 && method === 'DELETE') {
            const donationId = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.donationsAdmin.deleteDonation, withAuth({ donationId }));
            return { success: true, data: result };
        }

        // --- ADMIN PROGRAMS ---
        // POST /admin/programs
        if (pathParts[0] === 'admin' && pathParts[1] === 'programs' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.programs.adminCreate, withAuth(body));
            return { success: true, data: result };
        }
        // PUT /admin/programs/:id
        if (pathParts[0] === 'admin' && pathParts[1] === 'programs' && pathParts.length === 3 && method === 'PUT') {
            const programId = pathParts[2];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.programs.adminUpdate, withAuth({ programId, ...body }));
            return { success: true, data: result };
        }
        // DELETE /programs/:id
        if (pathParts[0] === 'programs' && pathParts.length === 2 && method === 'DELETE') {
            const programId = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.programs.adminDelete, withAuth({ programId }));
            return { success: true, data: result };
        }
        // PATCH /programs/:id/collect
        if (pathParts[0] === 'programs' && pathParts.length === 3 && pathParts[2] === 'collect' && method === 'PATCH') {
            const programId = pathParts[1];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.programs.collect, withAuth({ programId, amount: body.amount }));
            return { success: true, data: result };
        }

        // --- ADMIN TEMPLATES ---
        // GET /templates?all=true
        if (pathParts[0] === 'templates' && method === 'GET') {
            const queryParams = new URLSearchParams(queryString);
            const all = queryParams.get('all') === 'true';
            let relawanId = queryParams.get('relawan_id');
            // Convert null to undefined for optional Convex validator
            if (relawanId === null || relawanId === '') {
                relawanId = undefined;
            }
            // @ts-ignore
            const result = await client.query(api.templates.list, withAuth({ all, relawanId }));
            return { success: true, data: result };
        }
        // POST /admin/templates
        if (pathParts[0] === 'admin' && pathParts[1] === 'templates' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.templates.adminCreate, withAuth(body));
            return { success: true, data: result };
        }
        // PUT /admin/templates/:id
        if (pathParts[0] === 'admin' && pathParts[1] === 'templates' && pathParts.length === 3 && method === 'PUT') {
            const templateId = pathParts[2];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.templates.adminUpdate, withAuth({ templateId, ...body }));
            return { success: true, data: result };
        }
        // DELETE /templates/:id
        if (pathParts[0] === 'templates' && pathParts.length === 2 && method === 'DELETE') {
            const templateId = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.templates.adminDelete, withAuth({ templateId }));
            return { success: true, data: result };
        }

        // --- ADMIN DATABASE MANAGEMENT ---
        // POST /admin/reset-database
        if (pathParts[0] === 'admin' && pathParts[1] === 'reset-database' && method === 'POST') {
            // @ts-ignore
            const result = await client.mutation(api.admin.resetDatabase, withAuth({}));
            return { success: true, data: result };
        }
        // POST /admin/seed-database
        if (pathParts[0] === 'admin' && pathParts[1] === 'seed-database' && method === 'POST') {
            // @ts-ignore
            const result = await client.mutation(api.admin.seedDatabase, withAuth({}));
            return { success: true, data: result };
        }
        // GET /statistics/:relawanId
        if (pathParts[0] === 'statistics' && pathParts.length === 2) {
            const relawanId = pathParts[1];
            const result = await client.query(api.statistics.getRelawanStatistics, withAuth({
                relawanId: relawanId as any,
            }));
            return { data: result };
        }
        // GET /admin/stats/global
        if (pathParts[0] === 'admin' && pathParts[1] === 'stats' && pathParts[2] === 'global') {
            // @ts-ignore
            const result = await client.query(api.admin.getGlobalStats, withAuth({}));
            return { data: result };
        }
        // GET /admin/stats/regu
        if (pathParts[0] === 'admin' && pathParts[1] === 'stats' && pathParts[2] === 'regu') {
            // @ts-ignore
            const result = await client.query(api.admin.getReguStats, withAuth({}));
            return { data: result };
        }

        // --- DONATIONS ---
        // GET /donations/:id/bukti-transfer - serve bukti transfer file (must come before general donations)
        if (pathParts[0] === 'donations' && pathParts.length === 3 && pathParts[2] === 'bukti-transfer' && method === 'GET') {
            console.log('🔍 Bukti transfer endpoint matched!');
            const donationId = pathParts[1];
            console.log('🔍 Serving bukti transfer for donation:', donationId);

            try {
                // Get donation by ID directly
                // @ts-ignore
                const donation = await client.query(api.donations.getById, { donationId: donationId as any });
                console.log('🔍 Found donation:', donation ? 'yes' : 'no');

                if (!donation || !donation.bukti_transfer_url) {
                    return { error: 'Bukti transfer not found' };
                }

                console.log('🔍 Fetching file content from:', donation.bukti_transfer_url);

                try {
                    // Use serveBuktiTransfer action to fetch and serve file
                    // @ts-ignore
                    const result = await client.action(api.backblazeUpload.serveBuktiTransfer, {
                        fileUrl: donation.bukti_transfer_url
                    });
                    console.log('🔍 File serve result:', result);

                    if (result.success) {
                        return {
                            success: true,
                            data: {
                                url: result.url,
                                contentType: result.contentType,
                                size: result.size
                            }
                        };
                    } else {
                        return { error: result.error };
                    }
                } catch (error) {
                    console.error('❌ Failed to serve file:', error);
                    return { error: 'Failed to serve file' };
                }

            } catch (error) {
                console.error('❌ Error getting donation:', error);
                return { error: 'Failed to get donation data' };
            }
        }

        // POST /donations/:id/validate
        if (pathParts[0] === 'donations' && pathParts.length === 3 && pathParts[2] === 'validate' && method === 'POST') {
            console.log('🔍 Validation endpoint hit:', pathParts);
            const donationId = pathParts[1];
            const body = JSON.parse(options.body as string);
            console.log('🔍 Validation body:', body);
            // @ts-ignore
            const result = await client.mutation(api.donations.validate, withAuth({
                donationId: donationId as any,
                action: body.action === 'approve' ? 'validate' : 'reject',
                rejectionReason: body.rejection_reason || undefined
            }));            console.log('✅ Validation result:', result);
            return { success: true, data: result };
        }

        // GET /donations?relawan_id=... or ?muzakki_id=... or ?admin=true (general donations)
        if (pathParts[0] === 'donations' && method === 'GET') {
            console.log('🔍 Donations endpoint hit:', { pathParts, method, pathPartsLength: pathParts.length });
            const queryParams = new URLSearchParams(queryString);
            const relawanId = queryParams.get('relawan_id');
            const muzakkiId = queryParams.get('muzakki_id');
            const isAdmin = queryParams.get('admin') === 'true';

            if (isAdmin) {
                console.log('🔍 Admin route detected, fetching all donations');
                const page = parseInt(queryParams.get('page') || '0');
                const limit = parseInt(queryParams.get('limit') || '50');

                console.log('🔍 Pagination params:', { page, limit });

                // Get all donations (pending, validated, rejected)
                // @ts-ignore
                const allDonations = await client.query(api.donations.listAll, withAuth({}));
                console.log('📊 All donations:', allDonations?.length || 0);

                // Apply pagination
                const startIndex = page * limit;
                const endIndex = startIndex + limit;
                const paginatedDonations = allDonations.slice(startIndex, endIndex);

                console.log('🔍 Paginated result:', {
                    page,
                    limit,
                    returned: paginatedDonations.length,
                    hasMore: endIndex < allDonations.length
                });

                return {
                    success: true,
                    data: paginatedDonations,
                    pagination: {
                        page,
                        limit,
                        total: allDonations.length,
                        hasMore: endIndex < allDonations.length
                    }
                };
            }
            if (relawanId) {
                // @ts-ignore
                const result = await client.query(api.donations.listByRelawan, withAuth({ relawanId }));
                // Ensure we always return an array
                return { data: Array.isArray(result) ? result : [] };
            }
            if (muzakkiId) {
                // @ts-ignore
                const result = await client.query(api.donations.listByMuzakki, withAuth({ muzakkiId }));
                // Ensure we always return an array
                return { data: Array.isArray(result) ? result : [] };
            }
            // If no filter, maybe return all? Or empty.
            return { data: [] };
        }
        // POST /donations
        if (pathParts[0] === 'donations' && method === 'POST') {
            // Check if this is FormData (file upload) or JSON (regular donation)
            if (options.body instanceof FormData) {
                console.log('📁 Detected FormData in POST /donations - redirecting to file upload');
                return handleFileUpload(options.body as FormData, client, api, token);
            } else {
                console.log('📄 Detected JSON in POST /donations - creating donation');
                const body = JSON.parse(options.body as string);

                // Map frontend fields to Convex schema
                // Frontend might send either muzakki_id or muzakkiId
                const donorId = body.muzakki_id || body.muzakkiId;
                if (!donorId) {
                    throw new Error('Donor ID (muzakki_id) is required');
                }
                
                const convexBody = {
                    ...body,
                    donor_id: donorId, // Map muzakki_id/muzakkiId to donor_id
                };
                
                // Remove old field names to avoid duplicate fields
                delete convexBody.muzakki_id;
                delete convexBody.muzakkiId;

                // @ts-ignore
                const donationId = await client.mutation(api.donations.create, withAuth(convexBody));
                console.log('📝 Donation created with ID:', donationId);
                // Return response in the format expected by the frontend
                return { 
                    success: true, 
                    data: { 
                        id: donationId 
                    } 
                };
            }
        }
        // GET /donations/:id/bukti-transfer - serve bukti transfer file
        if (pathParts[0] === 'donations' && pathParts.length === 3 && pathParts[2] === 'bukti-transfer' && method === 'GET') {
            const donationId = pathParts[1];
            console.log('🔍 Serving bukti transfer for donation:', donationId);

            try {
                // Get donation by ID directly
                // @ts-ignore
                const donation = await client.query(api.donations.getById, { donationId: donationId as any });
                console.log('🔍 Found donation:', donation ? 'yes' : 'no');

                if (!donation || !donation.bukti_transfer_url) {
                    return { error: 'Bukti transfer not found' };
                }

                // Extract filename/path from URL
                let fileName = donation.bukti_transfer_url;

                // Handle Backblaze B2 URLs which contain the full path
                // Format: .../file/<bucketName>/<path/to/file>
                if (fileName.includes('/file/')) {
                    const parts = fileName.split('/file/');
                    if (parts.length > 1) {
                        // parts[1] is <bucketName>/<path/to/file>
                        const pathParts = parts[1].split('/');
                        if (pathParts.length > 1) {
                            // Remove bucket name (first segment) to get the file key
                            fileName = pathParts.slice(1).join('/');
                        }
                    }
                } else if (fileName.includes('/')) {
                    // Fallback for other URLs: take the last segment
                    const urlParts = fileName.split('/');
                    fileName = urlParts[urlParts.length - 1];
                }
                // If no slashes (e.g. Convex Storage ID), use as is

                console.log('🔍 Extracted filename/key:', fileName);

                try {
                    // Generate signed URL for download
                    // @ts-ignore
                    const result = await client.action(api.backblazeUpload.getDownloadUrl, { fileName });
                    console.log('🔍 Generated download URL:', result);

                    if (result.success) {
                        return {
                            success: true,
                            data: {
                                url: result.url,
                                authToken: result.authToken
                            }
                        };
                    } else {
                        return { error: result.error };
                    }
                } catch (error) {
                    console.error('❌ Failed to generate download URL:', error);
                    return { error: 'Failed to generate download URL' };
                }
            } catch (error) {
                console.error('❌ Error getting donation:', error);
                return { error: 'Failed to get donation data' };
            }
        }
        // POST /donations/upload-bukti (file upload to Backblaze B2)
        if (pathParts[0] === 'donations' && pathParts[1] === 'upload-bukti' && method === 'POST') {
            return handleFileUpload(options.body as FormData, client, api, token);
        }

        // --- MUZAKKI ---
        // GET /muzakki?relawan_id=...
        if (pathParts[0] === 'muzakki' && pathParts.length === 1 && method === 'GET') {
            const queryParams = new URLSearchParams(queryString);
            const relawanId = queryParams.get('relawan_id');
            if (relawanId) {
                const result = await client.query(api.muzakkis.listByRelawan, withAuth({
                    relawanId: relawanId as any,
                }));
                return { data: result };
            }
        }
        // GET /muzakki/:id
        if (pathParts[0] === 'muzakki' && pathParts.length === 2 && method === 'GET') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.muzakkis.get, withAuth({ id }));
            return { data: result };
        }
        // POST /muzakki
        if (pathParts[0] === 'muzakki' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.muzakkis.create, withAuth(body));
            return { data: result };
        }
        // PUT /muzakki/:id
        if (pathParts[0] === 'muzakki' && pathParts.length === 2 && method === 'PUT') {
            const id = pathParts[1];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.muzakkis.update, withAuth({ id, ...body }));
            return { data: result };
        }
        // DELETE /muzakki/:id
        if (pathParts[0] === 'muzakki' && pathParts.length === 2 && method === 'DELETE') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.muzakkis.deleteMuzakki, withAuth({ id }));
            return { data: result };
        }

        // --- COMMUNICATIONS ---
        // GET /communications/:muzakkiId
        if (pathParts[0] === 'communications' && pathParts.length === 2 && method === 'GET') {
            const muzakkiId = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.muzakkis.listCommunications, withAuth({ muzakkiId }));
            return { data: result };
        }
        // POST /communications
        if (pathParts[0] === 'communications' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.muzakkis.addCommunication, withAuth(body));
            return { data: result };
        }

        // --- REGUS ---
        // GET /regus
        if (pathParts[0] === 'regus' && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.regus.list, withAuth({}));
            return { data: result };
        }
        // POST /regus
        if (pathParts[0] === 'regus' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.regus.create, withAuth(body));
            return { data: result };
        }
        // GET /regu/:id
        if (pathParts[0] === 'regu' && pathParts.length === 2 && method === 'GET') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.regus.get, withAuth({ id }));
            return { data: result };
        }
        // GET /regu/by-code/:code
        if (pathParts[0] === 'regu' && pathParts[1] === 'by-code' && method === 'GET') {
            const code = pathParts[2];
            // @ts-ignore
            const result = await client.query(api.regus.getByCode, withAuth({ code }));
            return { data: result };
        }
        // GET /regu/:id/members
        if (pathParts[0] === 'regu' && pathParts.length === 3 && pathParts[2] === 'members' && method === 'GET') {
            const reguId = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.regus.getMembers, withAuth({ reguId }));
            return { data: result };
        }
        // POST /regu/:id/members
        if (pathParts[0] === 'regu' && pathParts.length === 3 && pathParts[2] === 'members' && method === 'POST') {
            const reguId = pathParts[1];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.regus.addMember, withAuth({ reguId, userId: body.userId }));
            return { data: result };
        }

        // --- PROGRAMS ---
        // GET /programs
        if (pathParts[0] === 'programs' && pathParts.length === 1 && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.programs.list, withAuth({}));
            return { data: result };
        }
        // GET /programs/:id
        if (pathParts[0] === 'programs' && pathParts.length === 2 && method === 'GET') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.programs.get, withAuth({ id }));
            return { data: result };
        }
        // POST /programs
        if (pathParts[0] === 'programs' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.programs.create, withAuth(body));
            return { data: result };
        }

        // --- TEMPLATES ---
        // GET /templates
        if (pathParts[0] === 'templates' && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.templates.list, withAuth({}));
            return { data: result };
        }
        // POST /templates
        if (pathParts[0] === 'templates' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.templates.create, withAuth(body));
            return { data: result };
        }

        // --- AUTH ---
        // POST /auth/register
        if (pathParts[0] === 'auth' && pathParts[1] === 'register' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.auth.register, body);
            return { data: result };
        }
        // POST /auth/send-otp
        if (pathParts[0] === 'auth' && pathParts[1] === 'send-otp' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.auth.sendOtp, body);
            return result; // Return directly without data wrapper
        }
        // POST /auth/verify-otp
        if (pathParts[0] === 'auth' && pathParts[1] === 'verify-otp' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.auth.verifyOtp, body);
            return result; // Return directly without data wrapper
        }
        // PUT /users/phone/:phone
        if (pathParts[0] === 'users' && pathParts[1] === 'phone' && method === 'PUT') {
            const oldPhone = pathParts[2];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.auth.updatePhone, withAuth({ oldPhone, newPhone: body.newPhone }));
            return { data: result };
        }

        // --- CHAT ---
        // Route: /chat/:reguId
        if (pathParts[0] === 'chat' && pathParts.length === 2 && method === 'GET') {
            const reguId = pathParts[1];
            // @ts-ignore - api.chat might not be generated yet in types
            const result = await client.query(api.chat.list, withAuth({
                reguId: reguId,
            }));
            return { data: result };
        }
        // Route: POST /chat
        if (pathParts[0] === 'chat' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore - api.chat might not be generated yet in types
            const result = await client.mutation(api.chat.send, withAuth({
                regu_id: body.regu_id,
                sender_id: body.sender_id,
                sender_name: body.sender_name,
                message: body.message,
            }));
            return { data: result };
        }

        // Fallback: endpoint not mapped
        throw new Error(`Convex route not implemented for: ${method} ${endpoint}`);

    } catch (error: any) {
        console.error('❌ Convex routing error:', error);
        throw error;
    }
}
