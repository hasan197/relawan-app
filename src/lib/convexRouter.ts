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
    return convexClient;
}

// Helper function to handle file uploads
async function handleFileUpload(formData: FormData, client: any, api: any) {
    try {
        // Parse FormData to extract file
        const file = formData.get('file') as File;
        const donationId = formData.get('donation_id') as string;

        console.log('📁 FormData debug:', {
            hasFile: !!file,
            fileName: file?.name,
            donationId: donationId,
            donationIdType: typeof donationId,
            donationIdValue: donationId === 'undefined' ? 'STRING_UNDEFINED' : donationId
        });

        if (!file) {
            throw new Error('Missing file in FormData');
        }

        if (!donationId || donationId === 'undefined' || donationId === 'null') {
            throw new Error(`Invalid donation_id: ${donationId}. Must be a valid Convex ID.`);
        }

        // Convert file to ArrayBuffer for Convex (not Uint8Array)
        const arrayBuffer = await file.arrayBuffer();

        console.log('📁 File info:', {
            name: file.name,
            type: file.type,
            size: file.size,
            arrayBufferSize: arrayBuffer.byteLength
        });

        // Call Convex action to upload to storage (provider selected via config)
        // @ts-ignore
        const result = await client.action(api.backblazeUpload.uploadFileToB2, {
            fileData: arrayBuffer, // Use ArrayBuffer, not Uint8Array
            fileName: file.name,
            fileType: file.type,
            donationId: donationId, // Validated donation ID
        });

        console.log('📤 Upload result:', result);

        if (result.success && result.url) {
            console.log('🔄 Updating donation record with URL:', result.url);
            // Update donation record with the file URL
            // @ts-ignore
            await client.mutation(api.donations.updateBuktiTransferUrl, {
                donationId: donationId,
                buktiTransferUrl: result.url
            });
            console.log('✅ Donation record updated successfully');
        } else {
            console.warn('⚠️ Upload successful but no URL returned, skipping database update');
        }

        return result;
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
    const client = getConvexClient();
    const method = options.method || 'GET';

    console.log(`🔀 Routing to Convex: ${method} ${endpoint}`);
    console.log(`🔍 Body type: ${options.body instanceof FormData ? 'FormData' : 'Other'}`);
    console.log(`🔍 Body content:`, options.body instanceof FormData ? 'FormData object' : options.body);

    // Parse endpoint and extract parameters
    const [path, queryString] = endpoint.split('?');
    const pathParts = path.split('/').filter(Boolean);

    try {
        // --- NOTIFICATIONS ---
        // GET /notifications/:userId
        if (pathParts[0] === 'notifications' && pathParts.length === 2 && method === 'GET') {
            const userId = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.notifications.getByUser, { userId });
            return { data: result };
        }
        // PUT /notifications/:id/read
        if (pathParts[0] === 'notifications' && pathParts.length === 3 && pathParts[2] === 'read' && method === 'PUT') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.notifications.markAsRead, { id });
            return { data: result };
        }
        // POST /notifications
        if (pathParts[0] === 'notifications' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.notifications.create, body);
            return { data: result };
        }

        // --- STATISTICS ---
        // GET /statistics/:relawanId
        if (pathParts[0] === 'statistics' && pathParts.length === 2) {
            const relawanId = pathParts[1];
            const result = await client.query(api.statistics.getRelawanStatistics, {
                relawanId: relawanId as any,
            });
            return { data: result };
        }
        // GET /admin/stats/global
        if (pathParts[0] === 'admin' && pathParts[1] === 'stats' && pathParts[2] === 'global') {
            // @ts-ignore
            const result = await client.query(api.statistics.getGlobalStats, {});
            return { data: result };
        }
        // GET /admin/stats/regu
        if (pathParts[0] === 'admin' && pathParts[1] === 'stats' && pathParts[2] === 'regu') {
            // @ts-ignore
            const result = await client.query(api.statistics.getReguStats, {});
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
            const result = await client.mutation(api.donations.validate, {
                donationId: donationId as any,
                adminId: body.admin_id as any,
                adminName: body.admin_name,
                action: body.action === 'approve' ? 'validate' : 'reject',
                rejectionReason: body.rejection_reason || undefined
            });
            console.log('✅ Validation result:', result);
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
                const allDonations = await client.query(api.donations.listAll, {});
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
                const result = await client.query(api.donations.listByRelawan, { relawanId });
                return { data: result };
            }
            if (muzakkiId) {
                // @ts-ignore
                const result = await client.query(api.donations.listByMuzakki, { muzakkiId });
                return { data: result };
            }
            // If no filter, maybe return all? Or empty.
            return { data: [] };
        }
        // POST /donations
        if (pathParts[0] === 'donations' && method === 'POST') {
            // Check if this is FormData (file upload) or JSON (regular donation)
            if (options.body instanceof FormData) {
                console.log('📁 Detected FormData in POST /donations - redirecting to file upload');
                return handleFileUpload(options.body as FormData, client, api);
            } else {
                console.log('📄 Detected JSON in POST /donations - creating donation');
                const body = JSON.parse(options.body as string);
                // @ts-ignore
                const donationId = await client.mutation(api.donations.create, body);
                console.log('📝 Donation created with ID:', donationId);
                // Return donation object with id property
                return { data: { id: donationId } };
            }
        }
        // POST /donations/:id/validate
        if (pathParts[0] === 'donations' && pathParts.length === 3 && pathParts[2] === 'validate' && method === 'POST') {
            console.log('🔍 Validation endpoint hit:', pathParts);
            const donationId = pathParts[1];
            const body = JSON.parse(options.body as string);
            console.log('🔍 Validation body:', body);
            // @ts-ignore
            const result = await client.mutation(api.donations.validate, {
                donationId: donationId as any,
                adminId: body.admin_id as any,
                adminName: body.admin_name,
                action: body.action === 'approve' ? 'validate' : 'reject',
                rejectionReason: body.rejection_reason || undefined
            });
            console.log('✅ Validation result:', result);
            return { success: true, data: result };
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
            return handleFileUpload(options.body as FormData, client, api);
        }

        // --- MUZAKKI ---
        // GET /muzakki?relawan_id=...
        if (pathParts[0] === 'muzakki' && pathParts.length === 1 && method === 'GET') {
            const queryParams = new URLSearchParams(queryString);
            const relawanId = queryParams.get('relawan_id');
            if (relawanId) {
                const result = await client.query(api.muzakkis.listByRelawan, {
                    relawanId: relawanId as any,
                });
                return { data: result };
            }
        }
        // GET /muzakki/:id
        if (pathParts[0] === 'muzakki' && pathParts.length === 2 && method === 'GET') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.muzakkis.get, { id });
            return { data: result };
        }
        // POST /muzakki
        if (pathParts[0] === 'muzakki' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.muzakkis.create, body);
            return { data: result };
        }
        // PUT /muzakki/:id
        if (pathParts[0] === 'muzakki' && pathParts.length === 2 && method === 'PUT') {
            const id = pathParts[1];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.muzakkis.update, { id, ...body });
            return { data: result };
        }
        // DELETE /muzakki/:id
        if (pathParts[0] === 'muzakki' && pathParts.length === 2 && method === 'DELETE') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.mutation(api.muzakkis.deleteMuzakki, { id });
            return { data: result };
        }

        // --- COMMUNICATIONS ---
        // GET /communications/:muzakkiId
        if (pathParts[0] === 'communications' && pathParts.length === 2 && method === 'GET') {
            const muzakkiId = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.muzakkis.listCommunications, { muzakkiId });
            return { data: result };
        }
        // POST /communications
        if (pathParts[0] === 'communications' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.muzakkis.addCommunication, body);
            return { data: result };
        }

        // --- REGUS ---
        // GET /regus
        if (pathParts[0] === 'regus' && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.regus.list, {});
            return { data: result };
        }
        // POST /regus
        if (pathParts[0] === 'regus' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.regus.create, body);
            return { data: result };
        }
        // GET /regu/:id
        if (pathParts[0] === 'regu' && pathParts.length === 2 && method === 'GET') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.regus.get, { id });
            return { data: result };
        }
        // GET /regu/by-code/:code
        if (pathParts[0] === 'regu' && pathParts[1] === 'by-code' && method === 'GET') {
            const code = pathParts[2];
            // @ts-ignore
            const result = await client.query(api.regus.getByCode, { code });
            return { data: result };
        }
        // GET /regu/:id/members
        if (pathParts[0] === 'regu' && pathParts.length === 3 && pathParts[2] === 'members' && method === 'GET') {
            const reguId = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.regus.getMembers, { reguId });
            return { data: result };
        }
        // POST /regu/:id/members
        if (pathParts[0] === 'regu' && pathParts.length === 3 && pathParts[2] === 'members' && method === 'POST') {
            const reguId = pathParts[1];
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.regus.addMember, { reguId, userId: body.userId });
            return { data: result };
        }

        // --- PROGRAMS ---
        // GET /programs
        if (pathParts[0] === 'programs' && pathParts.length === 1 && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.programs.list, {});
            return { data: result };
        }
        // GET /programs/:id
        if (pathParts[0] === 'programs' && pathParts.length === 2 && method === 'GET') {
            const id = pathParts[1];
            // @ts-ignore
            const result = await client.query(api.programs.get, { id });
            return { data: result };
        }
        // POST /programs
        if (pathParts[0] === 'programs' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.programs.create, body);
            return { data: result };
        }

        // --- TEMPLATES ---
        // GET /templates
        if (pathParts[0] === 'templates' && method === 'GET') {
            // @ts-ignore
            const result = await client.query(api.templates.list, {});
            return { data: result };
        }
        // POST /templates
        if (pathParts[0] === 'templates' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.templates.create, body);
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
            const result = await client.mutation(api.auth.updatePhone, { oldPhone, newPhone: body.newPhone });
            return { data: result };
        }

        // --- CHAT ---
        // Route: /chat/:reguId
        if (pathParts[0] === 'chat' && pathParts.length === 2 && method === 'GET') {
            const reguId = pathParts[1];
            // @ts-ignore - api.chat might not be generated yet in types
            const result = await client.query(api.chat.list, {
                reguId: reguId,
            });
            return { data: result };
        }
        // Route: POST /chat
        if (pathParts[0] === 'chat' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore - api.chat might not be generated yet in types
            const result = await client.mutation(api.chat.send, {
                regu_id: body.regu_id,
                sender_id: body.sender_id,
                sender_name: body.sender_name,
                message: body.message,
            });
            return { data: result };
        }

        // Fallback: endpoint not mapped
        throw new Error(`Convex route not implemented for: ${method} ${endpoint}`);

    } catch (error: any) {
        console.error('❌ Convex routing error:', error);
        throw error;
    }
}
