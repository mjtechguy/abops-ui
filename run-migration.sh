#!/bin/bash

# Run the initial migration for ABOps UI
# This script applies the initial migration to the Supabase database

set -e

echo "==== Running Initial Migration ===="

# Navigate to the project root
cd "$(dirname "$0")"

# Load environment variables from .env.local
ENV_FILE="./frontend/abops-ui/.env.local"
if [ -f "$ENV_FILE" ]; then
    echo "Loading environment variables from $ENV_FILE"
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo "Warning: $ENV_FILE not found. Using default admin credentials."
    export NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL="admin@example.com"
    export NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD="Password123!"
fi

# Check if Supabase is running
if ! nc -z localhost 54321 &>/dev/null; then
    echo "Error: Supabase is not running. Please start Supabase first with 'supabase start'"
    exit 1
fi

# Apply initial migration
echo "Applying initial migration..."

# Create a temporary migration file with environment variables substituted
TEMP_MIGRATION="./temp-migration.sql"
cat initial-migration.sql | \
    sed "s/admin@example\.com/${NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL}/g" | \
    sed "s/Password123!/${NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD}/g" > "$TEMP_MIGRATION"

# Apply the migration
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f "$TEMP_MIGRATION"

# Clean up
rm "$TEMP_MIGRATION"

echo "==== Migration Complete ===="
echo "The database has been set up with:"
echo "- All required tables"
echo "- Row Level Security policies"
echo "- Default admin user"
echo ""
echo "Default admin credentials:"
echo "Email: $NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL"
echo "Password: $NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD"
