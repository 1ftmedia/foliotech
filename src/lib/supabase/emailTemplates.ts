/**
 * Custom Email Templates for Supabase Authentication
 * 
 * These templates provide a modern, branded design for:
 * - Email confirmation
 * - Password reset
 * - Magic link login
 * - Email change confirmation
 */

export interface EmailTemplateData {
  userName?: string;
  confirmationURL: string;
  actionType: 'confirm' | 'reset' | 'magic' | 'change';
}

export const createAuthEmailTemplate = (data: EmailTemplateData) => {
  const { userName, confirmationURL, actionType } = data;
  
  // Template configuration based on action type
  const templates = {
    confirm: {
      subject: 'Confirm Your Email - FolioTech Institute',
      title: 'Welcome to FolioTech Institute!',
      message: 'Please confirm your email address to complete your account setup.',
      buttonText: 'Confirm Email',
      buttonColor: '#2563eb'
    },
    reset: {
      subject: 'Reset Your Password - FolioTech Institute',
      title: 'Password Reset Request',
      message: 'We received a request to reset your password. Click the button below to create a new password.',
      buttonText: 'Reset Password',
      buttonColor: '#dc2626'
    },
    magic: {
      subject: 'Login to FolioTech Institute',
      title: 'Your Login Link',
      message: 'Click the button below to securely log in to your account.',
      buttonText: 'Login Now',
      buttonColor: '#059669'
    },
    change: {
      subject: 'Confirm Email Change - FolioTech Institute',
      title: 'Email Change Request',
      message: 'We received a request to change your email address. Please confirm this change.',
      buttonText: 'Confirm Change',
      buttonColor: '#7c3aed'
    }
  };

  const template = templates[actionType];
  const greeting = userName ? `Hello ${userName},` : 'Hello,';
  const currentYear = new Date().getFullYear();

  return {
    subject: template.subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
        <style>
          /* Reset and base styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
          }
          
          /* Container */
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          /* Header */
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          
          .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
          }
          
          .tagline {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          
          /* Content */
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          
          .greeting {
            font-size: 20px;
            color: #1f2937;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
            font-weight: 700;
          }
          
          .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.7;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
          
          /* Button */
          .button-container {
            margin: 30px 0;
          }
          
          .action-button {
            display: inline-block;
            background: ${template.buttonColor};
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }
          
          /* Security notice */
          .security-notice {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
          }
          
          .security-notice h4 {
            color: #92400e;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 600;
          }
          
          .security-notice p {
            color: #92400e;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
          }
          
          /* Footer */
          .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer-content {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .footer-links {
            margin-top: 20px;
          }
          
          .footer-links a {
            color: #2563eb;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 500;
          }
          
          .footer-links a:hover {
            text-decoration: underline;
          }
          
          /* Responsive design */
          @media (max-width: 600px) {
            .email-container {
              margin: 10px;
              border-radius: 8px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .footer {
              padding: 20px;
            }
            
            .logo {
              font-size: 24px;
            }
            
            .title {
              font-size: 20px;
            }
            
            .action-button {
              padding: 14px 28px;
              font-size: 15px;
            }
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .email-container {
              background-color: #1f2937;
              color: #f9fafb;
            }
            
            .content {
              background-color: #1f2937;
            }
            
            .greeting, .title {
              color: #f9fafb;
            }
            
            .message {
              color: #d1d5db;
            }
            
            .footer {
              background-color: #111827;
              border-top-color: #374151;
            }
            
            .footer-content {
              color: #9ca3af;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo">🎓 FolioTech Institute</div>
            <div class="tagline">Empowering the next generation of technology professionals</div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="greeting">${greeting}</div>
            <h1 class="title">${template.title}</h1>
            <p class="message">${template.message}</p>
            
            <!-- Action Button -->
            <div class="button-container">
              <a href="${confirmationURL}" class="action-button">
                ${template.buttonText}
              </a>
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
              <h4>🔒 Security Notice</h4>
              <p>If you didn't request this action, you can safely ignore this email. Your account security is important to us.</p>
            </div>
            
            <!-- Additional Info -->
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              This link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-content">
              <p><strong>FolioTech Institute</strong></p>
              <p>1, Sunmonu Animashaun St, Zina Estate, Addo Rd, Ajah, Lagos, Nigeria</p>
              <p>📧 info@foliotechinstitute.com | 📱 +234 708 861 6350</p>
              
              <div class="footer-links">
                <a href="https://foliotechinstitute.com">Website</a>
                <a href="https://foliotechinstitute.com/programs">Programs</a>
                <a href="https://foliotechinstitute.com/contact">Contact</a>
              </div>
              
              <p style="margin-top: 20px;">© ${currentYear} FolioTech Institute. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Specific template functions for different auth actions
export const createConfirmationEmail = (data: EmailTemplateData) => 
  createAuthEmailTemplate({ ...data, actionType: 'confirm' });

export const createPasswordResetEmail = (data: EmailTemplateData) => 
  createAuthEmailTemplate({ ...data, actionType: 'reset' });

export const createMagicLinkEmail = (data: EmailTemplateData) => 
  createAuthEmailTemplate({ ...data, actionType: 'magic' });

export const createEmailChangeEmail = (data: EmailTemplateData) => 
  createAuthEmailTemplate({ ...data, actionType: 'change' });
