#!/bin/bash

# Supabase Email Setup Script for FolioTech Institute
# This script helps automate the setup of custom email templates and configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="FolioTech Institute"
PRODUCTION_URL="https://foliotechinstitute.com"
LOCAL_URL="http://localhost:3000"
SUPABASE_CONFIG_DIR="./supabase"
TEMPLATES_DIR="./supabase/templates"

echo -e "${BLUE}🚀 ${PROJECT_NAME} - Supabase Email Setup Script${NC}"
echo "=================================================="
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required directories exist
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if [ ! -d "$SUPABASE_CONFIG_DIR" ]; then
        print_error "Supabase directory not found: $SUPABASE_CONFIG_DIR"
        exit 1
    fi
    
    if [ ! -d "$TEMPLATES_DIR" ]; then
        print_error "Templates directory not found: $TEMPLATES_DIR"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Verify email templates exist
verify_templates() {
    print_info "Verifying email templates..."
    
    required_templates=(
        "confirmation.html"
        "recovery.html"
        "magic_link.html"
        "email_change.html"
        "invite.html"
    )
    
    for template in "${required_templates[@]}"; do
        if [ -f "$TEMPLATES_DIR/$template" ]; then
            print_status "Found template: $template"
        else
            print_error "Missing template: $template"
            exit 1
        fi
    done
    
    print_status "All email templates verified"
}

# Display configuration summary
show_configuration() {
    print_info "Configuration Summary:"
    echo ""
    echo "  Production URL: $PRODUCTION_URL"
    echo "  Local URL: $LOCAL_URL"
    echo "  Supabase Config: $SUPABASE_CONFIG_DIR"
    echo "  Templates: $TEMPLATES_DIR"
    echo ""
    
    print_info "Email Templates Available:"
    for template in "$TEMPLATES_DIR"/*.html; do
        if [ -f "$template" ]; then
            echo "  - $(basename "$template")"
        fi
    done
    echo ""
}

# Display manual setup steps
show_manual_steps() {
    print_info "Manual Setup Steps Required:"
    echo ""
    echo "1. 📧 Configure Email Templates in Supabase Dashboard:"
    echo "   - Go to Authentication > Email Templates"
    echo "   - Copy content from each template file"
    echo "   - Update subjects and content for each type"
    echo ""
    
    echo "2. 🔗 Update Redirect URLs:"
    echo "   - Go to Authentication > Settings"
    echo "   - Set Site URL: $PRODUCTION_URL"
    echo "   - Add Redirect URLs:"
    echo "     * $PRODUCTION_URL/auth/callback"
    echo "     * $LOCAL_URL/auth/callback"
    echo "     * $LOCAL_URL"
    echo ""
    
    echo "3. ⚙️  Configure SMTP (Optional):"
    echo "   - Go to Authentication > Settings > SMTP"
    echo "   - Set SMTP credentials for custom email delivery"
    echo ""
    
    echo "4. 🧪 Test Configuration:"
    echo "   - Test signup flow locally"
    echo "   - Verify email templates are used"
    echo "   - Check redirect URLs work correctly"
    echo ""
}

# Display environment variables setup
show_env_setup() {
    print_info "Environment Variables to Update:"
    echo ""
    echo "Add these to your .env file:"
    echo ""
    echo "# Supabase Configuration"
    echo "VITE_SUPABASE_URL=https://your-project-ref.supabase.co"
    echo "VITE_SUPABASE_ANON_KEY=your-anon-key"
    echo ""
    echo "# Site URLs"
    echo "VITE_SITE_URL=$PRODUCTION_URL"
    echo "VITE_LOCAL_URL=$LOCAL_URL"
    echo ""
}

# Display testing instructions
show_testing_instructions() {
    print_info "Testing Instructions:"
    echo ""
    echo "1. 🚀 Start Local Development:"
    echo "   npm run dev"
    echo ""
    
    echo "2. 📝 Test Signup Flow:"
    echo "   - Navigate to signup page"
    echo "   - Use a test email address"
    echo "   - Check email for custom template"
    echo ""
    
    echo "3. 🔐 Test Password Recovery:"
    echo "   - Use password reset feature"
    echo "   - Verify custom recovery template"
    echo ""
    
    echo "4. ✨ Test Magic Link:"
    echo "   - Use magic link login option"
    echo "   - Check custom magic link template"
    echo ""
    
    echo "5. 🔍 Verify Redirect URLs:"
    echo "   - Confirm localhost works for development"
    echo "   - Verify production URLs are configured"
    echo ""
}

# Main execution
main() {
    echo ""
    check_prerequisites
    verify_templates
    echo ""
    show_configuration
    echo ""
    show_manual_steps
    echo ""
    show_env_setup
    echo ""
    show_testing_instructions
    echo ""
    
    print_status "Setup script completed successfully!"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Follow the manual setup steps above"
    echo "2. Update your Supabase dashboard configuration"
    echo "3. Test the email flow locally"
    echo "4. Deploy to production when ready"
    echo ""
    
    print_info "For detailed instructions, see: docs/supabase-email-setup.md"
    echo ""
}

# Run main function
main "$@"
