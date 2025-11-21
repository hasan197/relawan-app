import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

/**
 * Convex Router
 * 
 * Maps Supabase API endpoints to Convex queries
 * This allows apiCall() to route to Convex without changing any hooks
 */

const convexUrl = import.meta.env.VITE_CONVEX_URL;
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
        // Route: /statistics/:relawanId
        if (pathParts[0] === 'statistics' && pathParts.length === 2) {
            const relawanId = pathParts[1];
            const result = await client.query(api.statistics.getRelawanStatistics, {
                relawanId: relawanId as any,
            });

            // Wrap in { data } to match Supabase response format
            return { data: result };
        }

        // Route: /donations?relawan_id=xxx
        if (pathParts[0] === 'donations' && method === 'GET') {
            // TODO: Implement when needed
            throw new Error('Donations endpoint not yet implemented for Convex');
        }

        // Route: /muzakki?relawan_id=xxx
        if (pathParts[0] === 'muzakki' && method === 'GET') {
            const queryParams = new URLSearchParams(queryString);
            const relawanId = queryParams.get('relawan_id');

            if (!relawanId) {
                throw new Error('Missing relawan_id parameter');
            }

            const result = await client.query(api.muzakkis.listByRelawan, {
                relawanId: relawanId as any,
            });

            return { data: result };
        }

        // Route: /regus
        if (pathParts[0] === 'regus' && method === 'GET') {
            // TODO: Implement when needed
            throw new Error('Regus endpoint not yet implemented for Convex');
        }

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
