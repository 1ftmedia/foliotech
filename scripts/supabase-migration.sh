#!/bin/bash

# Supabase Project Migration Script
# This script migrates a Supabase project from personal to client account
# Usage: ./supabase-migration.sh [SOURCE_PROJECT_REF] [CLIENT_EMAIL]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI is not installed. Please install it first:"
        echo "npm install -g supabase"
        exit 1
    fi
    
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client (psql) is not installed. Some operations may fail."
    fi
    
    print_success "Prerequisites check completed"
}

# Function to get database connection details
get_db_connection() {
    print_status "Getting database connection details..."
    
    # Get the current project reference
    if [ -z "$1" ]; then
        echo "Enter your current Supabase project reference (e.g., abcdefghijklmnop):"
        read SOURCE_PROJECT_REF
    else
        SOURCE_PROJECT_REF=$1
    fi
    
    # Get database password
    echo "Enter your Supabase database password:"
    read -s DB_PASSWORD
    
    # Construct database URL
    DB_URL="postgresql://postgres.${SOURCE_PROJECT_REF}:${DB_PASSWORD}@aws-0-${SOURCE_PROJECT_REF}.pooler.supabase.com:6543/postgres"
    
    print_success "Database connection configured"
}

# Function to export database
export_database() {
    print_status "Starting database export..."
    
    # Create backup directory
    BACKUP_DIR="supabase-migration-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Export schema and data
    print_status "Exporting database schema..."
    supabase db dump --db-url "$DB_URL" --schema-only > "$BACKUP_DIR/schema.sql"
    
    print_status "Exporting database data..."
    supabase db dump --db-url "$DB_URL" --data-only > "$BACKUP_DIR/data.sql"
    
    print_status "Exporting full database backup..."
    supabase db dump --db-url "$DB_URL" > "$BACKUP_DIR/full_backup.sql"
    
    # Export RLS policies
    print_status "Exporting RLS policies..."
    psql "$DB_URL" -c "
        SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd,
            qual,
            with_check
        FROM pg_policies 
        ORDER BY schemaname, tablename, policyname;
    " > "$BACKUP_DIR/rls_policies.sql"
    
    # Export extensions
    print_status "Exporting extensions..."
    psql "$DB_URL" -c "
        SELECT 
            extname,
            extversion
        FROM pg_extension 
        WHERE extname NOT IN ('plpgsql');
    " > "$BACKUP_DIR/extensions.sql"
    
    # Export storage buckets
    print_status "Exporting storage configuration..."
    psql "$DB_URL" -c "
        SELECT 
            id,
            name,
            public,
            file_size_limit,
            allowed_mime_types
        FROM storage.buckets;
    " > "$BACKUP_DIR/storage_buckets.sql"
    
    print_success "Database export completed. Files saved in: $BACKUP_DIR"
    
    # Save connection details for later use
    cat > "$BACKUP_DIR/migration-info.txt" << EOF
Migration Information
====================
Source Project: $SOURCE_PROJECT_REF
Export Date: $(date)
Database URL: $DB_URL

Files Created:
- schema.sql: Database schema only
- data.sql: Database data only  
- full_backup.sql: Complete database backup
- rls_policies.sql: Row Level Security policies
- extensions.sql: PostgreSQL extensions
- storage_buckets.sql: Storage bucket configuration

Next Steps:
1. Create new Supabase project in client account
2. Import the full_backup.sql file
3. Update environment variables
4. Test functionality
EOF
    
    print_success "Migration information saved to: $BACKUP_DIR/migration-info.txt"
}

# Function to create migration checklist
create_checklist() {
    print_status "Creating migration checklist..."
    
    cat > "$BACKUP_DIR/MIGRATION_CHECKLIST.md" << 'EOF'
# Supabase Project Migration Checklist

## Pre-Migration (Personal Account)
- [x] Database export completed
- [x] RLS policies exported
- [x] Extensions documented
- [x] Storage configuration exported

## New Project Setup (Client Account)
- [ ] Create new Supabase project
- [ ] Ensure same Postgres version (15)
- [ ] Configure same region
- [ ] Set up storage buckets

## Database Import
- [ ] Import full_backup.sql
- [ ] Verify all tables created
- [ ] Check data integrity
- [ ] Verify RLS policies

## Authentication Setup
- [ ] Configure site_url: https://foliotechinstitute.com
- [ ] Set redirect URLs
- [ ] Upload custom email templates
- [ ] Configure SMTP settings
- [ ] Test email functionality

## Environment Variables
- [ ] Update VITE_SUPABASE_URL
- [ ] Update VITE_SUPABASE_ANON_KEY
- [ ] Update VITE_SUPABASE_SERVICE_ROLE_KEY
- [ ] Update backend .env files
- [ ] Update deployed environments

## Testing & Verification
- [ ] Test user authentication
- [ ] Test database queries
- [ ] Test storage operations
- [ ] Test RLS policies
- [ ] Verify client has full access

## Post-Migration
- [ ] Update DNS if needed
- [ ] Monitor for errors
- [ ] Document new credentials
- [ ] Hand over to client
EOF
    
    print_success "Migration checklist created: $BACKUP_DIR/MIGRATION_CHECKLIST.md"
}

# Function to create import script for client
create_import_script() {
    print_status "Creating import script for client..."
    
    cat > "$BACKUP_DIR/import-to-client.sh" << 'EOF'
#!/bin/bash

# Supabase Project Import Script for Client
# This script imports the migrated database into the client's new project

set -e

echo "Starting Supabase project import..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Get client project details
echo "Enter your new Supabase project reference:"
read CLIENT_PROJECT_REF

echo "Enter your new Supabase database password:"
read -s CLIENT_DB_PASSWORD

# Construct client database URL
CLIENT_DB_URL="postgresql://postgres.${CLIENT_PROJECT_REF}:${CLIENT_DB_PASSWORD}@aws-0-${CLIENT_PROJECT_REF}.pooler.supabase.com:6543/postgres"

echo "Importing database schema and data..."
psql "$CLIENT_DB_URL" < full_backup.sql

echo "Database import completed successfully!"
echo "Next steps:"
echo "1. Configure authentication settings in Supabase dashboard"
echo "2. Upload custom email templates"
echo "3. Update environment variables"
echo "4. Test functionality"
EOF
    
    chmod +x "$BACKUP_DIR/import-to-client.sh"
    print_success "Import script created: $BACKUP_DIR/import-to-client.sh"
}

# Main execution
main() {
    echo "=========================================="
    echo "Supabase Project Migration Script"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    get_db_connection "$1"
    export_database
    create_checklist
    create_import_script
    
    echo ""
    print_success "Migration preparation completed!"
    echo ""
    echo "Next steps:"
    echo "1. Review the exported files in: $BACKUP_DIR"
    echo "2. Create new Supabase project in client account"
    echo "3. Use the import script to migrate data"
    echo "4. Follow the migration checklist"
    echo ""
    echo "Files created:"
    echo "- schema.sql: Database structure"
    echo "- data.sql: Database content"
    echo "- full_backup.sql: Complete backup"
    echo "- rls_policies.sql: Security policies"
    echo "- extensions.sql: PostgreSQL extensions"
    echo "- storage_buckets.sql: Storage configuration"
    echo "- MIGRATION_CHECKLIST.md: Step-by-step guide"
    echo "- import-to-client.sh: Import script for client"
    echo "- migration-info.txt: Migration details"
}

# Run main function
main "$@"
