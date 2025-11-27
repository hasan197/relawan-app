import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

/**
 * Convex Router
 * 
 * Maps Supabase API endpoints to Convex queries
 * This allows apiCall() to route to Convex without changing any hooks
 */

const convexUrl = (import.meta.env.VITE_CONVEX_URL as string) || 
                   (import.meta.env.NEXT_PUBLIC_CONVEX_URL as string) || 
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

/**
 * Route API call to appropriate Convex query
 */
export async function routeToConvex(endpoint: string, options: RequestInit = {}): Promise<any> {
    const client = getConvexClient();
    const method = options.method || 'GET';

    console.log(`🔀 Routing to Convex: ${method} ${endpoint}`);

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
        // GET /donations?relawan_id=... or ?muzakki_id=...
        if (pathParts[0] === 'donations' && method === 'GET') {
            const queryParams = new URLSearchParams(queryString);
            const relawanId = queryParams.get('relawan_id');
            const muzakkiId = queryParams.get('muzakki_id');

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
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.donations.create, body);
            return { data: result };
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
            return { data: result };
        }
        // POST /auth/verify-otp
        if (pathParts[0] === 'auth' && pathParts[1] === 'verify-otp' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            // @ts-ignore
            const result = await client.mutation(api.auth.verifyOtp, body);
            return { data: result };
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
