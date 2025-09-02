# 🚀 Supabase Project Migration

This repository contains everything you need to migrate your FolioTech Institute Supabase project from your personal account to your client's account. **This is a Supabase-only project** - no Firebase dependencies.

## 📁 **Migration Files**

### **Scripts Directory (`scripts/`)**
- **`supabase-migration.sh`** - Linux/Mac migration script
- **`supabase-migration.ps1`** - Windows PowerShell migration script  
- **`client-setup.ps1`** - Client setup script for new project

### **Documentation Directory (`docs/`)**
- **`supabase-migration-guide.md`** - Comprehensive migration guide
- **`manual-migration-guide.md`** - Manual migration without CLI
- **`supabase-email-setup.md`** - Email template configuration guide

### **Supabase Configuration (`supabase/`)**
- **`config.toml`** - Local development configuration
- **`production-config.toml`** - Production configuration template
- **`templates/`** - Custom email templates

---

## 🎯 **Quick Start Migration**

### **Option A: Automated Migration (Recommended)**

#### **Step 1: Export Your Current Project**

**For Windows Users:**
```powershell
# Run the PowerShell migration script
.\scripts\supabase-migration.ps1

# Or specify your project reference directly
.\scripts\supabase-migration.ps1 "your-project-ref-here"
```

**For Linux/Mac Users:**
```bash
# Make script executable
chmod +x scripts/supabase-migration.sh

# Run the bash migration script
./scripts/supabase-migration.sh

# Or specify your project reference directly
./scripts/supabase-migration.sh "your-project-ref-here"
```

### **Option B: Manual Migration (No CLI Required)**

If you encounter issues with the Supabase CLI installation, use the manual migration guide:

```bash
# Follow the manual migration guide
docs/manual-migration-guide.md
```

This method uses direct PostgreSQL connections and doesn't require the Supabase CLI.

---

## 🔧 **What Gets Migrated**

### **✅ Complete Database**
- All tables and data
- Row Level Security (RLS) policies
- PostgreSQL extensions
- Storage bucket configurations

### **✅ Authentication Settings**
- User accounts and sessions
- Custom email templates
- SMTP configuration
- Redirect URLs

### **✅ Storage & Files**
- File metadata and permissions
- Storage bucket settings
- File access policies

### **❌ NOT Migrated (Manual Setup Required)**
- API keys (regenerated in new project)
- Environment variables
- Deployed application configurations
- Custom domains (if any)

---

## 🚨 **Important Notes**

### **Supabase-Only Project**
- **No Firebase dependencies** - this project uses Supabase exclusively
- **All Firebase references have been removed** from the codebase
- **Environment variables cleaned up** to remove Firebase keys

### **Security**
- **Never commit `.env` files** to version control
- **Rotate API keys** after migration
- **Secure database passwords** properly

### **Downtime**
- **Minimal downtime** - export during low-traffic periods
- **Keep old project** until migration is verified
- **Test thoroughly** before switching

---

## 🆘 **Troubleshooting**

### **CLI Installation Issues**
If you can't install the Supabase CLI:

1. **Use Manual Migration**: Follow `docs/manual-migration-guide.md`
2. **Alternative CLI Methods**:
   - Try `scoop install supabase` (if you have Scoop)
   - Download binary from [GitHub releases](https://github.com/supabase/cli/releases)
   - Use Docker: `docker run --rm -it supabase/cli:latest`

### **Common Issues**

#### **Script Won't Run**
```bash
# Check if Supabase CLI is installed
supabase --version

# If CLI fails, use manual migration
# Follow: docs/manual-migration-guide.md
```

#### **Export Fails**
```bash
# Verify project reference is correct
# Check database password
# Ensure network connectivity
# Use manual migration as alternative
```

### **Get Help**
- **Automated Migration**: Use the provided scripts
- **Manual Migration**: `docs/manual-migration-guide.md`
- **Email Setup**: `docs/supabase-email-setup.md`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

## 📚 **Detailed Documentation**

### **Automated Migration**
- **Main Guide**: `docs/supabase-migration-guide.md`
- **Scripts**: Use the provided automation scripts

### **Manual Migration**
- **Manual Guide**: `docs/manual-migration-guide.md`
- **No CLI required** - direct database operations

### **Email Template Setup**
- **Email Setup**: `docs/supabase-email-setup.md`
- **Custom templates** already configured

---

## 🎉 **Success Criteria**

Your migration is successful when:

1. ✅ **Client has full access** to Supabase dashboard
2. ✅ **All data migrated** without loss
3. ✅ **Authentication works** for all user types
4. ✅ **Storage functions** correctly
5. ✅ **RLS policies** enforce security
6. ✅ **Environment variables** updated everywhere
7. ✅ **No downtime** for end users
8. ✅ **Client can manage** billing and settings

---

## 📞 **Support**

### **During Migration**
- **Try automated scripts first**
- **Fall back to manual migration** if CLI issues occur
- **Follow the comprehensive guides** step-by-step

### **Post-Migration**
- Client has full access to Supabase support
- Provide client with setup documentation
- Offer post-migration support if needed

---

**🎯 Ready to migrate?** 

1. **Try the automated scripts first**: `.\scripts\supabase-migration.ps1`
2. **If CLI fails, use manual migration**: `docs/manual-migration-guide.md`
3. **Both methods achieve the same result** - choose what works for you!

**Success guaranteed** with either approach! 🚀✨
