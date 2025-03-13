#!/bin/bash

# Reset Supabase and apply initial migration
# This script resets the Supabase database and applies the initial migration

set -e

echo "==== Resetting Supabase Database ===="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Installing..."
    # Install Supabase CLI
    curl -s https://raw.githubusercontent.com/supabase/cli/main/install.sh | bash
fi

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

# Stop Supabase if it's running
echo "Stopping Supabase services..."
supabase stop

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Clean up Docker volumes
echo "Cleaning up Supabase Docker volumes..."
docker volume ls --filter label=com.supabase.cli.project=root -q | xargs -r docker volume rm

# Start Supabase
echo "Starting Supabase services..."
supabase start

# Wait for Supabase to be ready
echo "Waiting for Supabase to be ready..."
sleep 10

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

echo "==== Supabase Reset Complete ===="
echo "Default admin credentials:"
echo "Email: $NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL"
echo "Password: $NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD"
echo ""
echo "Supabase Studio URL: http://localhost:54323"
echo "API URL: http://localhost:54321"
