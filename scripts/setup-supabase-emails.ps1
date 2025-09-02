# Supabase Email Setup Script for FolioTech Institute
# PowerShell version for Windows users

param(
    [switch]$Help
)

# Configuration
$PROJECT_NAME = "FolioTech Institute"
$PRODUCTION_URL = "https://foliotechinstitute.com"
$LOCAL_URL = "http://localhost:3000"
$SUPABASE_CONFIG_DIR = ".\supabase"
$TEMPLATES_DIR = ".\supabase\templates"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Show help
if ($Help) {
    Write-Host "Supabase Email Setup Script for FolioTech Institute" -ForegroundColor Cyan
    Write-Host "Usage: .\scripts\setup-supabase-emails.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "This script helps automate the setup of custom email templates and configuration." -ForegroundColor White
    Write-Host "Run without parameters to execute the full setup process." -ForegroundColor White
    exit 0
}

# Main execution
Write-Host "🚀 $PROJECT_NAME - Supabase Email Setup Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor White
Write-Host ""

# Check prerequisites
Write-Info "Checking prerequisites..."

if (-not (Test-Path $SUPABASE_CONFIG_DIR)) {
    Write-Error "Supabase directory not found: $SUPABASE_CONFIG_DIR"
    exit 1
}

if (-not (Test-Path $TEMPLATES_DIR)) {
    Write-Error "Templates directory not found: $TEMPLATES_DIR"
    exit 1
}

Write-Status "Prerequisites check passed"

# Verify email templates
Write-Info "Verifying email templates..."

$required_templates = @(
    "confirmation.html",
    "recovery.html",
    "magic_link.html",
    "email_change.html",
    "invite.html"
)

foreach ($template in $required_templates) {
    if (Test-Path "$TEMPLATES_DIR\$template") {
        Write-Status "Found template: $template"
    } else {
        Write-Error "Missing template: $template"
        exit 1
    }
}

Write-Status "All email templates verified"

# Show configuration summary
Write-Info "Configuration Summary:"
Write-Host ""
Write-Host "  Production URL: $PRODUCTION_URL" -ForegroundColor White
Write-Host "  Local URL: $LOCAL_URL" -ForegroundColor White
Write-Host "  Supabase Config: $SUPABASE_CONFIG_DIR" -ForegroundColor White
Write-Host "  Templates: $TEMPLATES_DIR" -ForegroundColor White
Write-Host ""

Write-Info "Email Templates Available:"
Get-ChildItem "$TEMPLATES_DIR\*.html" | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor White
}
Write-Host ""

# Show manual setup steps
Write-Info "Manual Setup Steps Required:"
Write-Host ""
Write-Host "1. 📧 Configure Email Templates in Supabase Dashboard:" -ForegroundColor White
Write-Host "   - Go to Authentication > Email Templates" -ForegroundColor White
Write-Host "   - Copy content from each template file" -ForegroundColor White
Write-Host "   - Update subjects and content for each type" -ForegroundColor White
Write-Host ""

Write-Host "2. 🔗 Update Redirect URLs:" -ForegroundColor White
Write-Host "   - Go to Authentication > Settings" -ForegroundColor White
Write-Host "   - Set Site URL: $PRODUCTION_URL" -ForegroundColor White
Write-Host "   - Add Redirect URLs:" -ForegroundColor White
Write-Host "     * $PRODUCTION_URL/auth/callback" -ForegroundColor White
Write-Host "     * $LOCAL_URL/auth/callback" -ForegroundColor White
Write-Host "     * $LOCAL_URL" -ForegroundColor White
Write-Host ""

Write-Host "3. ⚙️  Configure SMTP (Optional):" -ForegroundColor White
Write-Host "   - Go to Authentication > Settings > SMTP" -ForegroundColor White
Write-Host "   - Set SMTP credentials for custom email delivery" -ForegroundColor White
Write-Host ""

Write-Host "4. 🧪 Test Configuration:" -ForegroundColor White
Write-Host "   - Test signup flow locally" -ForegroundColor White
Write-Host "   - Verify email templates are used" -ForegroundColor White
Write-Host "   - Check redirect URLs work correctly" -ForegroundColor White
Write-Host ""

# Show environment variables setup
Write-Info "Environment Variables to Update:"
Write-Host ""
Write-Host "Add these to your .env file:" -ForegroundColor White
Write-Host ""
Write-Host "# Supabase Configuration" -ForegroundColor White
Write-Host "VITE_SUPABASE_URL=https://your-project-ref.supabase.co" -ForegroundColor White
Write-Host "VITE_SUPABASE_ANON_KEY=your-anon-key" -ForegroundColor White
Write-Host ""
Write-Host "# Site URLs" -ForegroundColor White
Write-Host "VITE_SITE_URL=$PRODUCTION_URL" -ForegroundColor White
Write-Host "VITE_LOCAL_URL=$LOCAL_URL" -ForegroundColor White
Write-Host ""

# Show testing instructions
Write-Info "Testing Instructions:"
Write-Host ""
Write-Host "1. 🚀 Start Local Development:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. 📝 Test Signup Flow:" -ForegroundColor White
Write-Host "   - Navigate to signup page" -ForegroundColor White
Write-Host "   - Use a test email address" -ForegroundColor White
Write-Host "   - Check email for custom template" -ForegroundColor White
Write-Host ""
Write-Host "3. 🔐 Test Password Recovery:" -ForegroundColor White
Write-Host "   - Use password reset feature" -ForegroundColor White
Write-Host "   - Verify custom recovery template" -ForegroundColor White
Write-Host ""
Write-Host "4. ✨ Test Magic Link:" -ForegroundColor White
Write-Host "   - Use magic link login option" -ForegroundColor White
Write-Host "   - Check custom magic link template" -ForegroundColor White
Write-Host ""
Write-Host "5. 🔍 Verify Redirect URLs:" -ForegroundColor White
Write-Host "   - Confirm localhost works for development" -ForegroundColor White
Write-Host "   - Verify production URLs are configured" -ForegroundColor White
Write-Host ""

Write-Status "Setup script completed successfully!"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Follow the manual setup steps above" -ForegroundColor White
Write-Host "2. Update your Supabase dashboard configuration" -ForegroundColor White
Write-Host "3. Test the email flow locally" -ForegroundColor White
Write-Host "4. Deploy to production when ready" -ForegroundColor White
Write-Host ""

Write-Info "For detailed instructions, see: docs/supabase-email-setup.md"
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
