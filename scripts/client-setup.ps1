# Client Supabase Project Setup Script
# This script helps set up the new Supabase project after migration

param(
    [string]$ProjectRef,
    [string]$DatabasePassword
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
function Write-Status { param([string]$Message) Write-Host "[INFO] $Message" -ForegroundColor Blue }
function Write-Success { param([string]$Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Warning { param([string]$Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

# Function to create environment file template
function New-EnvironmentTemplate {
    Write-Status "Creating environment file template..."
    
    $envTemplate = @"
# FolioTech Institute - Supabase Environment Variables
# Update these values with your new Supabase project credentials

# Supabase Configuration
VITE_SUPABASE_URL=https://$ProjectRef.supabase.co
VITE_SUPABASE_ANON_KEY=your-new-anon-key-here

# Development Environment (for local testing)
# VITE_SUPABASE_URL=http://localhost:54321
# VITE_SUPABASE_ANON_KEY=your-local-anon-key-here

# Email Configuration (for application emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@foliotechinstitute.com
SMTP_PASS=your-app-password-here
SMTP_FROM=noreply@foliotechinstitute.com
SMTP_SECURE=false
ADMIN_EMAIL=admin@foliotechinstitute.com

# Other Services
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-key-here
VITE_FIREBASE_API_KEY=your-firebase-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id-here
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
VITE_FIREBASE_APP_ID=your-app-id-here

# IMPORTANT: Replace 'your-new-anon-key-here' with the actual anon key from your Supabase dashboard
# Go to: Settings > API > Project API keys > anon public
"@
    
    $envTemplate | Out-File -FilePath ".env.client" -Encoding UTF8
    Write-Success "Environment template created: .env.client"
}

# Function to create setup checklist
function New-SetupChecklist {
    Write-Status "Creating setup checklist..."
    
    $checklist = @"
# FolioTech Institute - Client Setup Checklist

## Project Information
- [ ] **Project Reference**: $ProjectRef
- [ ] **Database URL**: https://$ProjectRef.supabase.co
- [ ] **Dashboard**: https://supabase.com/dashboard/project/$ProjectRef

## Authentication Setup
- [ ] Configure site_url: https://foliotechinstitute.com
- [ ] Set redirect URLs:
  - [ ] https://foliotechinstitute.com/auth/callback
  - [ ] http://localhost:3000 (for development)
- [ ] Upload custom email templates:
  - [ ] confirmation.html
  - [ ] recovery.html
  - [ ] magic_link.html
  - [ ] email_change.html
  - [ ] invite.html
- [ ] Configure SMTP settings:
  - [ ] Host: smtp.gmail.com
  - [ ] Port: 587
  - [ ] User: noreply@foliotechinstitute.com
  - [ ] Password: [APP_PASSWORD]
  - [ ] Admin Email: admin@foliotechinstitute.com
  - [ ] Sender Name: FolioTech Institute

## Environment Variables
- [ ] Update .env file with new Supabase URL
- [ ] Update .env file with new anon key
- [ ] Update deployed environments (Vercel, Render, etc.)
- [ ] Test environment variables

## Testing
- [ ] Test user registration
- [ ] Test email confirmation
- [ ] Test password reset
- [ ] Test magic link login
- [ ] Test file uploads
- [ ] Test database queries

## Post-Setup
- [ ] Verify all functionality works
- [ ] Monitor for errors
- [ ] Set up monitoring alerts
- [ ] Document any issues found
"@
    
    $checklist | Out-File -FilePath "CLIENT_SETUP_CHECKLIST.md" -Encoding UTF8
    Write-Success "Setup checklist created: CLIENT_SETUP_CHECKLIST.md"
}

# Function to create quick reference
function New-QuickReference {
    Write-Status "Creating quick reference guide..."
    
    $quickRef = @"
# FolioTech Institute - Quick Reference

## Supabase Dashboard
- **URL**: https://supabase.com/dashboard/project/$ProjectRef
- **Login**: Use your Supabase account credentials

## Important URLs
- **API**: https://$ProjectRef.supabase.co
- **Auth Callback**: https://foliotechinstitute.com/auth/callback
- **Site URL**: https://foliotechinstitute.com

## Key Settings Locations
- **Authentication**: Dashboard > Settings > Auth
- **Database**: Dashboard > Settings > Database
- **Storage**: Dashboard > Storage
- **API Keys**: Dashboard > Settings > API
- **Logs**: Dashboard > Logs

## Common Tasks
- **View Users**: Dashboard > Authentication > Users
- **View Applications**: Dashboard > Table Editor > applications
- **Upload Files**: Dashboard > Storage > [bucket_name]
- **Monitor Usage**: Dashboard > Settings > Billing

## Support
- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Your Developer**: [Contact Information]
"@
    
    $quickRef | Out-File -FilePath "QUICK_REFERENCE.md" -Encoding UTF8
    Write-Success "Quick reference created: QUICK_REFERENCE.md"
}

# Function to validate project reference
function Test-ProjectReference {
    if ([string]::IsNullOrEmpty($ProjectRef)) {
        $script:ProjectRef = Read-Host "Enter your Supabase project reference (e.g., abcdefghijklmnop)"
    }
    
    # Basic validation
    if ($ProjectRef.Length -lt 10 -or $ProjectRef.Length -gt 20) {
        Write-Warning "Project reference seems unusual. Please verify it's correct."
    }
    
    Write-Success "Using project reference: $ProjectRef"
}

# Main execution
function Main {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "FolioTech Institute - Client Setup" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Test-ProjectReference
    New-EnvironmentTemplate
    New-SetupChecklist
    New-QuickReference
    
    Write-Host ""
    Write-Success "Client setup files created successfully!"
    Write-Host ""
    Write-Host "Files created:" -ForegroundColor Yellow
    Write-Host "- .env.client: Environment variables template"
    Write-Host "- CLIENT_SETUP_CHECKLIST.md: Setup checklist"
    Write-Host "- QUICK_REFERENCE.md: Quick reference guide"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update .env.client with your actual values"
    Write-Host "2. Follow the setup checklist"
    Write-Host "3. Test all functionality"
    Write-Host "4. Update deployed environments"
    Write-Host ""
    Write-Host "Important:" -ForegroundColor Red
    Write-Host "- Never commit .env files to version control"
    Write-Host "- Keep your API keys secure"
    Write-Host "- Test thoroughly before going live"
}

# Run main function
Main
