import { ConvexReactClient } from 'convex/react';

// Create a Convex client with the deployment URL from environment variables
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export default convex;
