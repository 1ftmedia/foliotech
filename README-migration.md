# 🚀 Supabase Project Migration

This repository contains everything you need to migrate your FolioTech Institute Supabase project from your personal account to your client's account.

## 📁 **Migration Files**

### **Scripts Directory (`scripts/`)**
- **`supabase-migration.sh`** - Linux/Mac migration script
- **`supabase-migration.ps1`** - Windows PowerShell migration script  
- **`client-setup.ps1`** - Client setup script for new project

### **Documentation Directory (`docs/`)**
- **`supabase-migration-guide.md`** - Comprehensive migration guide
- **`supabase-email-setup.md`** - Email template configuration guide

### **Supabase Configuration (`supabase/`)**
- **`config.toml`** - Local development configuration
- **`production-config.toml`** - Production configuration template
- **`templates/`** - Custom email templates

---

## 🎯 **Quick Start Migration**

### **Step 1: Export Your Current Project**

#### **For Windows Users:**
```powershell
# Run the PowerShell migration script
.\scripts\supabase-migration.ps1

# Or specify your project reference directly
.\scripts\supabase-migration.ps1 "your-project-ref-here"
```

#### **For Linux/Mac Users:**
```bash
# Make script executable
chmod +x scripts/supabase-migration.sh

# Run the bash migration script
./scripts/supabase-migration.sh

# Or specify your project reference directly
./scripts/supabase-migration.sh "your-project-ref-here"
```

### **Step 2: Create New Project in Client Account**

1. **Login to client's Supabase account**
2. **Create new project** with same settings:
   - PostgreSQL version 15
   - Same region
   - Strong database password
3. **Note the new project reference**

### **Step 3: Import to Client Project**

```bash
# Navigate to the backup directory created by the script
cd supabase-migration-[TIMESTAMP]

# Run the import script
.\import-to-client.ps1
# or
./import-to-client.sh
```

### **Step 4: Configure Client Project**

```powershell
# Run the client setup script
.\scripts\client-setup.ps1 "new-project-ref"
```

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

## 📋 **Migration Checklist**

### **Pre-Migration (Your Account)**
- [ ] Run migration script to export data
- [ ] Verify backup files are created
- [ ] Test backup integrity

### **New Project Setup (Client Account)**
- [ ] Create new Supabase project
- [ ] Ensure PostgreSQL version 15
- [ ] Configure same region
- [ ] Note new project reference

### **Data Import (Client Account)**
- [ ] Import full_backup.sql
- [ ] Verify all tables created
- [ ] Check data integrity
- [ ] Verify RLS policies

### **Configuration (Client Account)**
- [ ] Configure site_url: https://foliotechinstitute.com
- [ ] Set redirect URLs
- [ ] Upload custom email templates
- [ ] Configure SMTP settings

### **Environment Updates**
- [ ] Update VITE_SUPABASE_URL
- [ ] Update VITE_SUPABASE_ANON_KEY
- [ ] Update backend .env files
- [ ] Update deployed environments

### **Testing & Verification**
- [ ] Test user authentication
- [ ] Test database queries
- [ ] Test storage operations
- [ ] Test RLS policies
- [ ] Verify client has full access

---

## 🚨 **Important Notes**

### **Security**
- **Never commit `.env` files** to version control
- **Rotate API keys** after migration
- **Secure database passwords** properly

### **Downtime**
- **Minimal downtime** - export during low-traffic periods
- **Keep old project** until migration is verified
- **Test thoroughly** before switching

### **Cost Considerations**
- **New project** may have different pricing
- **Data transfer** costs for large datasets
- **Storage costs** may vary by region

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Script Won't Run**
```bash
# Check if Supabase CLI is installed
npm install -g supabase

# Check if psql is available (optional)
# Install PostgreSQL client if needed
```

#### **Export Fails**
```bash
# Verify project reference is correct
# Check database password
# Ensure network connectivity
```

#### **Import Fails**
```bash
# Check PostgreSQL version compatibility
# Verify connection string format
# Check file encoding
```

### **Get Help**
- **Migration Guide**: `docs/supabase-migration-guide.md`
- **Email Setup**: `docs/supabase-email-setup.md`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [GitHub Discussions](https://github.com/supabase/supabase/discussions)

---

## 📚 **Detailed Documentation**

### **Full Migration Guide**
See `docs/supabase-migration-guide.md` for:
- Step-by-step instructions
- Manual migration commands
- Troubleshooting guide
- Post-migration support

### **Email Template Setup**
See `docs/supabase-email-setup.md` for:
- Custom email template configuration
- SMTP setup instructions
- Template customization

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
- Follow the migration guide step-by-step
- Use the provided scripts for automation
- Check troubleshooting section for common issues

### **Post-Migration**
- Client has full access to Supabase support
- Provide client with setup documentation
- Offer post-migration support if needed

---

**🎯 Ready to migrate?** Start with Step 1 above and follow the comprehensive guide in `docs/supabase-migration-guide.md` for detailed instructions.
