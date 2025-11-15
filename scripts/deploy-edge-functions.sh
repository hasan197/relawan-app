#!/bin/bash

# Exit on error
set -e

# Check if supabase cli is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase --save-dev"
    exit 1
fi

# Login to Supabase (uncomment and run once to login)
# supabase login

# Link to your Supabase project (only needed once)
# supabase link --project-ref your-project-ref

# Deploy all functions in the supabase/functions directory
supabase functions deploy --project-ref your-project-ref

echo "✅ Edge Functions deployed successfully!"
