# Email Template Setup for Supabase

## 🎯 Quick Setup Guide

### **1. Supabase Dashboard Configuration**

1. Go to **Authentication** → **Email Templates**
2. Configure each template with the HTML from `supabase/templates/` folder

### **2. Required Templates**

#### **Confirm signup**
- **Subject:** `Confirm Your Email - FolioTech Institute`
- **HTML:** Copy from `supabase/templates/confirmation.html`

#### **Reset password**
- **Subject:** `Reset Your Password - FolioTech Institute`  
- **HTML:** Copy from `supabase/templates/recovery.html`

#### **Magic Link**
- **Subject:** `Login to FolioTech Institute`
- **HTML:** Copy from `supabase/templates/magic_link.html`

### **3. Redirect URLs (Authentication → URL Configuration)**

**Development:**
- `http://localhost:5173/auth/callback`
- `http://localhost:5173/auth/success`

**Production:**
- `https://foliotechinstitute.com/auth/callback`
- `https://foliotechinstitute.com/auth/success`

### **4. Site URL**
- **Development:** `http://localhost:5173`
- **Production:** `https://foliotechinstitute.com`

### **✅ Key Features**
- Professional FolioTech branding
- Visible "Verify Email Address" button
- Mobile-responsive design
- Spam-filter friendly language
- Security notices

### **🔧 Template Variables**
- `{{ .ConfirmationURL }}` - The confirmation link
- `{{ .CurrentYear }}` - Current year
- `{{ .SiteURL }}` - Your site URL

**After configuration, test the signup flow with a real email address!**
