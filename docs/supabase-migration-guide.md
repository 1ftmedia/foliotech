# Supabase Project Migration Guide
## Transfer from Personal to Client Account

This guide provides a step-by-step process to migrate your Supabase project from your personal account to your client's account, ensuring full ownership transfer with minimal downtime.

---

## 📋 **Prerequisites**

### **Required Tools**
- [Supabase CLI](https://supabase.com/docs/guides/cli) (latest version)
- [PostgreSQL Client (psql)](https://www.postgresql.org/download/) (optional but recommended)
- Access to both personal and client Supabase accounts

### **Current Project Information**
- **Project Reference**: Your current project ID
- **Database Password**: Supabase database password
- **PostgreSQL Version**: 15
- **Custom Email Templates**: Already configured
- **Storage Buckets**: Configured for file uploads

---

## 🚀 **Step 1: Database Export (Personal Account)**

### **Option A: Using Migration Script (Recommended)**

#### **For Linux/Mac:**
```bash
# Make script executable
chmod +x scripts/supabase-migration.sh

# Run migration script
./scripts/supabase-migration.sh [YOUR_PROJECT_REF]
```

#### **For Windows:**
```powershell
# Run PowerShell migration script
.\scripts\supabase-migration.ps1 [YOUR_PROJECT_REF]
```

### **Option B: Manual Export**

#### **1.1 Export Database Schema**
```bash
# Get your database URL from Supabase dashboard
# Settings > Database > Connection string > URI

supabase db dump --db-url "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" --schema-only > schema.sql
```

#### **1.2 Export Database Data**
```bash
supabase db dump --db-url "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" --data-only > data.sql
```

#### **1.3 Export Complete Backup**
```bash
supabase db dump --db-url "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" > full_backup.sql
```

#### **1.4 Export RLS Policies**
```sql
-- Connect to your database and run:
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
```

#### **1.5 Export Extensions**
```sql
SELECT 
    extname,
    extversion
FROM pg_extension 
WHERE extname NOT IN ('plpgsql');
```

#### **1.6 Export Storage Configuration**
```sql
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets;
```

---

## 🆕 **Step 2: New Project Setup (Client Account)**

### **2.1 Create New Supabase Project**

1. **Login to Client's Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign in with client's credentials

2. **Create New Project**
   - Click "New Project"
   - **Organization**: Select client's organization
   - **Name**: `foliotech` (or preferred name)
   - **Database Password**: Generate strong password
   - **Region**: Choose same region as current project
   - **Pricing Plan**: Select appropriate plan

3. **Project Configuration**
   - **PostgreSQL Version**: Ensure version 15
   - **Database Password**: Save securely
   - **Project Reference**: Note the new project ID

### **2.2 Configure Project Settings**

#### **Database Settings**
- **Connection Pooling**: Enable if needed
- **Database Extensions**: Note required extensions

#### **Storage Settings**
- **File Size Limit**: Configure as needed
- **Allowed MIME Types**: Set appropriate restrictions

---

## 📥 **Step 3: Database Import (Client Account)**

### **3.1 Import Database**

#### **Using Import Script:**
```bash
# Navigate to backup directory
cd supabase-migration-[TIMESTAMP]

# Run import script
./import-to-client.sh
# or
.\import-to-client.ps1
```

#### **Manual Import:**
```bash
# Get client's database URL
# Settings > Database > Connection string > URI

# Import full backup
psql "postgresql://postgres.[CLIENT_PROJECT_REF]:[PASSWORD]@aws-0-[CLIENT_PROJECT_REF].pooler.supabase.com:6543/postgres" < full_backup.sql
```

### **3.2 Verify Import**

#### **Check Tables**
```sql
-- Connect to client database
\dt
\dt auth.*
\dt storage.*
```

#### **Check Data**
```sql
-- Verify sample data exists
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM public.applications;
```

#### **Check Extensions**
```sql
SELECT extname, extversion FROM pg_extension;
```

---

## 🔐 **Step 4: Authentication & Configuration**

### **4.1 Authentication Settings**

#### **Site URL Configuration**
```toml
# In Supabase dashboard: Settings > Auth > URL Configuration
Site URL: https://foliotechinstitute.com
Redirect URLs: 
- https://foliotechinstitute.com/auth/callback
- http://localhost:3000 (for development)
```

#### **Email Templates**
1. **Upload Custom Templates**
   - Go to: Settings > Auth > Email Templates
   - Upload each template:
     - `confirmation.html`
     - `recovery.html`
     - `magic_link.html`
     - `email_change.html`
     - `invite.html`

2. **SMTP Configuration**
   ```toml
   Host: smtp.gmail.com
   Port: 587
   User: noreply@foliotechinstitute.com
   Password: [APP_PASSWORD]
   Admin Email: admin@foliotechinstitute.com
   Sender Name: FolioTech Institute
   ```

### **4.2 Row Level Security (RLS)**

#### **Enable RLS on Tables**
```sql
-- Enable RLS on all tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ... other tables
```

#### **Apply RLS Policies**
```sql
-- Import policies from exported file
-- Or recreate manually based on exported policies
```

### **4.3 Storage Configuration**

#### **Recreate Storage Buckets**
```sql
-- Based on exported storage_buckets.sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (...);
```

---

## 🔧 **Step 5: Environment Variables Update**

### **5.1 Frontend Environment**

#### **Update `.env` files:**
```bash
# Development
VITE_SUPABASE_URL=https://[CLIENT_PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[NEW_ANON_KEY]

# Production
VITE_SUPABASE_URL=https://[CLIENT_PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[NEW_ANON_KEY]
```

### **5.2 Backend Environment**

#### **Update server environment:**
```bash
SUPABASE_URL=https://[CLIENT_PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=[NEW_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[NEW_SERVICE_ROLE_KEY]
```

### **5.3 Deployed Environments**

#### **Vercel:**
```bash
# Update environment variables in Vercel dashboard
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### **Render:**
```bash
# Update environment variables in Render dashboard
# Settings > Environment Variables
```

#### **Other Platforms:**
- Update environment variables in respective dashboards
- Ensure all instances use new Supabase credentials

---

## 🧪 **Step 6: Testing & Verification**

### **6.1 Authentication Testing**

#### **User Registration**
1. Create new test user
2. Verify confirmation email
3. Test login functionality

#### **Password Reset**
1. Request password reset
2. Verify reset email
3. Test new password login

#### **Magic Link Login**
1. Request magic link
2. Verify magic link email
3. Test magic link login

### **6.2 Database Testing**

#### **Data Integrity**
```sql
-- Verify data exists
SELECT COUNT(*) FROM public.applications;
SELECT COUNT(*) FROM auth.users;

-- Test sample queries
SELECT * FROM public.applications LIMIT 5;
```

#### **RLS Policies**
```sql
-- Test RLS policies work correctly
-- Verify users can only access their own data
```

### **6.3 Storage Testing**

#### **File Upload**
1. Upload test file
2. Verify file appears in storage
3. Test file download/access

#### **File Permissions**
1. Test public file access
2. Test authenticated file access
3. Verify RLS policies work

---

## 🔄 **Step 7: Final Configuration**

### **7.1 Update DNS (if needed)**

#### **Custom Domain:**
- Update DNS records to point to new Supabase project
- Configure custom domain in Supabase dashboard

#### **SSL Certificate:**
- Verify SSL certificate is active
- Test HTTPS connections

### **7.2 Monitor & Debug**

#### **Error Monitoring**
- Check Supabase logs for errors
- Monitor application logs
- Set up error tracking if needed

#### **Performance Monitoring**
- Monitor database performance
- Check storage usage
- Monitor API response times

---

## 📚 **Step 8: Documentation & Handover**

### **8.1 Client Documentation**

#### **Create Handover Document:**
```markdown
# FolioTech Institute - Supabase Handover

## Project Information
- **Project Reference**: [CLIENT_PROJECT_REF]
- **Database URL**: https://[CLIENT_PROJECT_REF].supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/[CLIENT_PROJECT_REF]

## Credentials
- **Database Password**: [SAVED_PASSWORD]
- **Service Role Key**: [SERVICE_ROLE_KEY]
- **Anon Key**: [ANON_KEY]

## Important URLs
- **API**: https://[CLIENT_PROJECT_REF].supabase.co
- **Auth Callback**: https://foliotechinstitute.com/auth/callback
- **Site URL**: https://foliotechinstitute.com

## Custom Email Templates
- All templates uploaded and configured
- SMTP configured for noreply@foliotechinstitute.com

## Storage Buckets
- [List configured buckets]

## RLS Policies
- All security policies applied
- User data properly isolated
```

### **8.2 Access Transfer**

#### **Client Access:**
1. **Dashboard Access**: Client has full access to Supabase dashboard
2. **API Keys**: Client owns all API keys
3. **Billing**: Client controls billing and usage
4. **Support**: Client can contact Supabase support directly

#### **Your Access:**
1. **Remove Access**: Remove yourself from client's organization
2. **Documentation**: Provide all necessary documentation
3. **Support**: Offer post-migration support if needed

---

## ⚠️ **Important Notes & Warnings**

### **Data Security**
- **Never share database passwords** in code or documentation
- **Use environment variables** for all sensitive information
- **Rotate keys** if they were ever exposed

### **Downtime Considerations**
- **Minimal downtime**: Export during low-traffic periods
- **Backup verification**: Always verify backup integrity before deletion
- **Rollback plan**: Keep old project until migration is verified

### **Cost Implications**
- **New project**: May have different pricing structure
- **Data transfer**: Consider bandwidth costs for large datasets
- **Storage costs**: Verify storage pricing in new region

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Import Failures**
```bash
# Check PostgreSQL version compatibility
psql --version

# Verify connection string format
# Ensure password doesn't contain special characters

# Check file encoding
file full_backup.sql
```

#### **Authentication Issues**
```bash
# Verify site URL configuration
# Check redirect URL format
# Test email template syntax
```

#### **RLS Policy Problems**
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify policies exist
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### **Support Resources**
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✅ **Migration Checklist**

Use the generated `MIGRATION_CHECKLIST.md` file to track your progress:

- [ ] **Pre-Migration**: Database export completed
- [ ] **New Project**: Created in client account
- [ ] **Database Import**: Schema and data imported
- [ ] **Authentication**: Settings configured
- [ ] **Email Templates**: Uploaded and tested
- [ ] **Environment Variables**: Updated everywhere
- [ ] **Testing**: All functionality verified
- [ ] **Documentation**: Handover document created
- [ ] **Access Transfer**: Client has full control
- [ ] **Cleanup**: Old project access removed

---

## 🎯 **Success Criteria**

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

## 📞 **Post-Migration Support**

### **Client Training**
- Dashboard navigation
- User management
- Database monitoring
- Storage management
- Billing overview

### **Ongoing Support**
- Define support scope and duration
- Document common tasks
- Provide escalation procedures
- Set up monitoring alerts

---

**🎉 Congratulations!** You've successfully migrated your Supabase project to your client's account. The client now has full ownership and control over their infrastructure while maintaining all functionality and data integrity.
