# Manual Supabase Migration Guide
## No CLI Required - Direct Database Migration

This guide provides an alternative migration method that doesn't require the Supabase CLI installation. It uses direct database connections and manual steps.

---

## 📋 **Prerequisites**

### **Required Tools**
- [PostgreSQL Client (psql)](https://www.postgresql.org/download/) - for direct database access
- Access to both personal and client Supabase accounts
- Database connection details from both projects

### **Current Project Information**
- **Project Reference**: Your current project ID
- **Database Password**: Supabase database password
- **PostgreSQL Version**: 15
- **Custom Email Templates**: Already configured
- **Storage Buckets**: Configured for file uploads

---

## 🚀 **Step 1: Manual Database Export (Personal Account)**

### **1.1 Get Database Connection Details**

1. **Go to your Supabase Dashboard**
   - Navigate to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your current project

2. **Get Database Connection String**
   - Go to **Settings** > **Database**
   - Copy the **Connection string** (URI format)
   - It looks like: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres`

### **1.2 Export Database Schema**

```bash
# Export only the schema (structure)
pg_dump "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" --schema-only > schema.sql
```

### **1.3 Export Database Data**

```bash
# Export only the data
pg_dump "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" --data-only > data.sql
```

### **1.4 Export Complete Backup**

```bash
# Export everything (schema + data)
pg_dump "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" > full_backup.sql
```

### **1.5 Export RLS Policies**

```bash
# Connect to your database and export policies
psql "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" -c "
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
" > rls_policies.sql
```

### **1.6 Export Extensions**

```bash
psql "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" -c "
SELECT 
    extname,
    extversion
FROM pg_extension 
WHERE extname NOT IN ('plpgsql');
" > extensions.sql
```

### **1.7 Export Storage Configuration**

```bash
psql "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[PROJECT_REF].pooler.supabase.com:6543/postgres" -c "
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets;
" > storage_buckets.sql
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

### **2.2 Get Client Database Connection**

1. **Go to Client's Supabase Dashboard**
   - Navigate to the new project
   - Go to **Settings** > **Database**
   - Copy the **Connection string** (URI format)

---

## 📥 **Step 3: Manual Database Import (Client Account)**

### **3.1 Import Complete Database**

```bash
# Import the full backup to client's database
psql "postgresql://postgres.[CLIENT_PROJECT_REF]:[PASSWORD]@aws-0-[CLIENT_PROJECT_REF].pooler.supabase.com:6543/postgres" < full_backup.sql
```

### **3.2 Verify Import**

```bash
# Connect to client database and verify
psql "postgresql://postgres.[CLIENT_PROJECT_REF]:[PASSWORD]@aws-0-[CLIENT_PROJECT_REF].pooler.supabase.com:6543/postgres"

# Check tables
\dt
\dt auth.*
\dt storage.*

# Check data
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM public.applications;

# Check extensions
SELECT extname, extversion FROM pg_extension;
```

---

## 🔐 **Step 4: Authentication & Configuration**

### **4.1 Authentication Settings**

#### **Site URL Configuration**
1. **Go to Client's Supabase Dashboard**
   - Navigate to **Settings** > **Auth** > **URL Configuration**
   - Set **Site URL**: `https://foliotechinstitute.com`
   - Add **Redirect URLs**:
     - `https://foliotechinstitute.com/auth/callback`
     - `http://localhost:3000` (for development)

#### **Email Templates**
1. **Upload Custom Templates**
   - Go to **Settings** > **Auth** > **Email Templates**
   - Upload each template:
     - `confirmation.html`
     - `recovery.html`
     - `magic_link.html`
     - `email_change.html`
     - `invite.html`

2. **SMTP Configuration**
   - Go to **Settings** > **Auth** > **SMTP Settings**
   - Configure:
     - **Host**: `smtp.gmail.com`
     - **Port**: `587`
     - **User**: `noreply@foliotechinstitute.com`
     - **Password**: [APP_PASSWORD]
     - **Admin Email**: `admin@foliotechinstitute.com`
     - **Sender Name**: `FolioTech Institute`

### **4.2 Row Level Security (RLS)**

#### **Enable RLS on Tables**
```sql
-- Connect to client database and enable RLS
psql "postgresql://postgres.[CLIENT_PROJECT_REF]:[PASSWORD]@aws-0-[CLIENT_PROJECT_REF].pooler.supabase.com:6543/postgres"

-- Enable RLS on all tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ... other tables
```

#### **Apply RLS Policies**
```sql
-- Import policies from exported file
-- Or recreate manually based on exported policies
-- Check the rls_policies.sql file for your specific policies
```

### **4.3 Storage Configuration**

#### **Recreate Storage Buckets**
```sql
-- Based on exported storage_buckets.sql
-- Check the storage_buckets.sql file for your bucket configurations
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (...);
```

---

## 🔧 **Step 5: Environment Variables Update**

### **5.1 Get New API Keys**

1. **Go to Client's Supabase Dashboard**
   - Navigate to **Settings** > **API**
   - Copy the **Project API keys**:
     - **anon public** key
     - **service_role** key (keep secret)

### **5.2 Update Environment Files**

#### **Frontend Environment**
```bash
# Update .env files
VITE_SUPABASE_URL=https://[CLIENT_PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[NEW_ANON_KEY]
```

#### **Backend Environment**
```bash
SUPABASE_URL=https://[CLIENT_PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=[NEW_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[NEW_SERVICE_ROLE_KEY]
```

### **5.3 Update Deployed Environments**

#### **Vercel:**
- Go to Vercel dashboard
- Update environment variables for your project

#### **Render:**
- Go to Render dashboard
- Update environment variables in project settings

---

## 🧪 **Step 6: Testing & Verification**

### **6.1 Authentication Testing**

1. **User Registration**
   - Create new test user
   - Verify confirmation email
   - Test login functionality

2. **Password Reset**
   - Request password reset
   - Verify reset email
   - Test new password login

3. **Magic Link Login**
   - Request magic link
   - Verify magic link email
   - Test magic link login

### **6.2 Database Testing**

```sql
-- Verify data exists
SELECT COUNT(*) FROM public.applications;
SELECT COUNT(*) FROM auth.users;

-- Test sample queries
SELECT * FROM public.applications LIMIT 5;
```

### **6.3 Storage Testing**

1. **File Upload**
   - Upload test file
   - Verify file appears in storage
   - Test file download/access

2. **File Permissions**
   - Test public file access
   - Test authenticated file access
   - Verify RLS policies work

---

## 🔄 **Step 7: Final Configuration**

### **7.1 Monitor & Debug**

1. **Check Supabase Logs**
   - Go to **Logs** in client dashboard
   - Monitor for errors

2. **Check Application Logs**
   - Monitor your application for errors
   - Test all functionality thoroughly

### **7.2 Update DNS (if needed)**

1. **Custom Domain Configuration**
   - Update DNS records if using custom domain
   - Configure in Supabase dashboard

---

## 📚 **Step 8: Documentation & Handover**

### **8.1 Create Handover Document**

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

1. **Client Access**
   - Client has full access to Supabase dashboard
   - Client owns all API keys
   - Client controls billing and usage

2. **Your Access**
   - Remove yourself from client's organization
   - Provide all necessary documentation
   - Offer post-migration support if needed

---

## ✅ **Migration Checklist**

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
- Verify site URL configuration
- Check redirect URL format
- Test email template syntax

#### **RLS Policy Problems**
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify policies exist
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

**🎉 Congratulations!** You've successfully migrated your Supabase project to your client's account using manual methods. The client now has full ownership and control over their infrastructure while maintaining all functionality and data integrity.
