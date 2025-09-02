# Supabase Project Migration Script for Windows
# This script migrates a Supabase project from personal to client account
# Usage: .\supabase-migration.ps1 [SOURCE_PROJECT_REF]

param(
    [string]$SourceProjectRef
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if required tools are installed
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    # Check Supabase CLI
    try {
        $null = Get-Command supabase -ErrorAction Stop
        Write-Success "Supabase CLI found"
    }
    catch {
        Write-Error "Supabase CLI is not installed. Please install it first:"
        Write-Host "npm install -g supabase" -ForegroundColor Yellow
        exit 1
    }
    
    # Check if psql is available (optional)
    try {
        $null = Get-Command psql -ErrorAction Stop
        Write-Success "PostgreSQL client (psql) found"
    }
    catch {
        Write-Warning "PostgreSQL client (psql) is not installed. Some operations may fail."
    }
    
    Write-Success "Prerequisites check completed"
}

# Function to get database connection details
function Get-DatabaseConnection {
    Write-Status "Getting database connection details..."
    
    # Get the current project reference
    if ([string]::IsNullOrEmpty($SourceProjectRef)) {
        $script:SourceProjectRef = Read-Host "Enter your current Supabase project reference (e.g., abcdefghijklmnop)"
    }
    else {
        $script:SourceProjectRef = $SourceProjectRef
    }
    
    # Get database password
    $script:DBPassword = Read-Host "Enter your Supabase database password" -AsSecureString
    $script:DBPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($script:DBPassword))
    
    # Construct database URL
    $script:DBUrl = "postgresql://postgres.$($script:SourceProjectRef):$($script:DBPasswordPlain)@aws-0-$($script:SourceProjectRef).pooler.supabase.com:6543/postgres"
    
    Write-Success "Database connection configured"
}

# Function to export database
function Export-Database {
    Write-Status "Starting database export..."
    
    # Create backup directory
    $script:BackupDir = "supabase-migration-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Path $script:BackupDir -Force | Out-Null
    
    # Export schema and data
    Write-Status "Exporting database schema..."
    supabase db dump --db-url $script:DBUrl --schema-only | Out-File -FilePath "$($script:BackupDir)\schema.sql" -Encoding UTF8
    
    Write-Status "Exporting database data..."
    supabase db dump --db-url $script:DBUrl --data-only | Out-File -FilePath "$($script:BackupDir)\data.sql" -Encoding UTF8
    
    Write-Status "Exporting full database backup..."
    supabase db dump --db-url $script:DBUrl | Out-File -FilePath "$($script:BackupDir)\full_backup.sql" -Encoding UTF8
    
    # Export RLS policies (if psql is available)
    try {
        Write-Status "Exporting RLS policies..."
        $rlsQuery = @"
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
"@
        psql $script:DBUrl -c $rlsQuery | Out-File -FilePath "$($script:BackupDir)\rls_policies.sql" -Encoding UTF8
    }
    catch {
        Write-Warning "Could not export RLS policies. psql may not be available."
    }
    
    # Export extensions (if psql is available)
    try {
        Write-Status "Exporting extensions..."
        $extensionsQuery = @"
            SELECT 
                extname,
                extversion
            FROM pg_extension 
            WHERE extname NOT IN ('plpgsql');
"@
        psql $script:DBUrl -c $extensionsQuery | Out-File -FilePath "$($script:BackupDir)\extensions.sql" -Encoding UTF8
    }
    catch {
        Write-Warning "Could not export extensions. psql may not be available."
    }
    
    # Export storage buckets (if psql is available)
    try {
        Write-Status "Exporting storage configuration..."
        $storageQuery = @"
            SELECT 
                id,
                name,
                public,
                file_size_limit,
                allowed_mime_types
            FROM storage.buckets;
"@
        psql $script:DBUrl -c $storageQuery | Out-File -FilePath "$($script:BackupDir)\storage_buckets.sql" -Encoding UTF8
    }
    catch {
        Write-Warning "Could not export storage configuration. psql may not be available."
    }
    
    Write-Success "Database export completed. Files saved in: $($script:BackupDir)"
    
    # Save connection details for later use
    $migrationInfo = @"
Migration Information
====================
Source Project: $($script:SourceProjectRef)
Export Date: $(Get-Date)
Database URL: $($script:DBUrl)

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
"@
    
    $migrationInfo | Out-File -FilePath "$($script:BackupDir)\migration-info.txt" -Encoding UTF8
    Write-Success "Migration information saved to: $($script:BackupDir)\migration-info.txt"
}

# Function to create migration checklist
function New-MigrationChecklist {
    Write-Status "Creating migration checklist..."
    
    $checklist = @"
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
"@
    
    $checklist | Out-File -FilePath "$($script:BackupDir)\MIGRATION_CHECKLIST.md" -Encoding UTF8
    Write-Success "Migration checklist created: $($script:BackupDir)\MIGRATION_CHECKLIST.md"
}

# Function to create import script for client
function New-ImportScript {
    Write-Status "Creating import script for client..."
    
    $importScript = @"
# Supabase Project Import Script for Client
# This script imports the migrated database into the client's new project

# Get client project details
$clientProjectRef = Read-Host "Enter your new Supabase project reference"
$clientDBPassword = Read-Host "Enter your new Supabase database password" -AsSecureString
$clientDBPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($clientDBPassword))

# Construct client database URL
$clientDBUrl = "postgresql://postgres.$clientProjectRef`:$clientDBPasswordPlain@aws-0-$clientProjectRef.pooler.supabase.com:6543/postgres"

Write-Host "Importing database schema and data..." -ForegroundColor Green
psql $clientDBUrl -f full_backup.sql

Write-Host "Database import completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure authentication settings in Supabase dashboard"
Write-Host "2. Upload custom email templates"
Write-Host "3. Update environment variables"
Write-Host "4. Test functionality"
"@
    
    $importScript | Out-File -FilePath "$($script:BackupDir)\import-to-client.ps1" -Encoding UTF8
    Write-Success "Import script created: $($script:BackupDir)\import-to-client.ps1"
}

# Main execution
function Main {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Supabase Project Migration Script" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Test-Prerequisites
    Get-DatabaseConnection
    Export-Database
    New-MigrationChecklist
    New-ImportScript
    
    Write-Host ""
    Write-Success "Migration preparation completed!"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Review the exported files in: $($script:BackupDir)"
    Write-Host "2. Create new Supabase project in client account"
    Write-Host "3. Use the import script to migrate data"
    Write-Host "4. Follow the migration checklist"
    Write-Host ""
    Write-Host "Files created:" -ForegroundColor Yellow
    Write-Host "- schema.sql: Database structure"
    Write-Host "- data.sql: Database content"
    Write-Host "- full_backup.sql: Complete backup"
    Write-Host "- rls_policies.sql: Security policies"
    Write-Host "- extensions.sql: PostgreSQL extensions"
    Write-Host "- storage_buckets.sql: Storage configuration"
    Write-Host "- MIGRATION_CHECKLIST.md: Step-by-step guide"
    Write-Host "- import-to-client.ps1: Import script for client"
    Write-Host "- migration-info.txt: Migration details"
}

# Run main function
Main
