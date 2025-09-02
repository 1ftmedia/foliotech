import nodemailer from 'nodemailer';
import { createApplicationEmail } from '../config/applicationEmail.ts';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Check if required environment variables are set
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });
};

/**
 * Sends application confirmation emails to both applicant and admin
 * @param {Object} applicationData - The application data
 * @param {string} applicationData.id - Application ID
 * @param {Object} applicationData.personalInfo - Personal information
 * @param {Object} applicationData.programSelection - Program selection
 * @param {string} applicationData.created_at - Submission timestamp
 * @returns {Promise<Object>} - Email sending results
 */
export const sendApplicationConfirmationEmails = async (applicationData) => {
  try {
    const transporter = createTransporter();
    
    // Format submission date
    const formattedDate = new Date(applicationData.created_at).toLocaleString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Prepare email data
    const emailData = {
      applicationId: applicationData.id,
      personalInfo: {
        firstName: applicationData.personal_info.firstName,
        surname: applicationData.personal_info.surname,
        email: applicationData.personal_info.email,
        phone: applicationData.personal_info.phone
      },
      programSelection: {
        program: applicationData.program_selection.program,
        course: applicationData.program_selection.course
      },
      submittedAt: formattedDate
    };

    // Create email templates
    const applicantEmail = createApplicationEmail.applicant(emailData);
    const adminEmail = createApplicationEmail.admin(emailData);

    // Send email to applicant
    const applicantMailOptions = {
      from: process.env.SMTP_FROM,
      to: applicationData.personal_info.email,
      subject: applicantEmail.subject,
      html: applicantEmail.html
    };

    // Send email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: adminEmail.subject,
      html: adminEmail.html
    };

    // Send both emails concurrently
    const [applicantInfo, adminInfo] = await Promise.all([
      transporter.sendMail(applicantMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    console.log('Application confirmation emails sent successfully:', {
      applicationId: applicationData.id,
      applicant: applicantInfo.messageId,
      admin: adminInfo.messageId,
      applicantEmail: applicationData.personal_info.email,
      adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER
    });

    return {
      success: true,
      applicantInfo,
      adminInfo,
      message: 'Application confirmation emails sent successfully'
    };

  } catch (error) {
    console.error('Error sending application confirmation emails:', error);
    
    // Return error details but don't throw to avoid blocking form submission
    return {
      success: false,
      error: error.message,
      message: 'Failed to send confirmation emails, but application was saved'
    };
  }
};

/**
 * Sends only the applicant confirmation email (fallback method)
 * @param {Object} applicationData - The application data
 * @returns {Promise<Object>} - Email sending result
 */
export const sendApplicantConfirmationEmail = async (applicationData) => {
  try {
    const transporter = createTransporter();
    
    // Format submission date
    const formattedDate = new Date(applicationData.created_at).toLocaleString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Prepare email data
    const emailData = {
      applicationId: applicationData.id,
      personalInfo: {
        firstName: applicationData.personal_info.firstName,
        surname: applicationData.personal_info.surname,
        email: applicationData.personal_info.email,
        phone: applicationData.personal_info.phone
      },
      programSelection: {
        program: applicationData.program_selection.program,
        course: applicationData.program_selection.course
      },
      submittedAt: formattedDate
    };

    // Create applicant email template
    const applicantEmail = createApplicationEmail.applicant(emailData);

    // Send email to applicant
    const applicantMailOptions = {
      from: process.env.SMTP_FROM,
      to: applicationData.personal_info.email,
      subject: applicantEmail.subject,
      html: applicantEmail.html
    };

    const applicantInfo = await transporter.sendMail(applicantMailOptions);

    console.log('Applicant confirmation email sent successfully:', {
      applicationId: applicationData.id,
      applicant: applicantInfo.messageId,
      applicantEmail: applicationData.personal_info.email
    });

    return {
      success: true,
      applicantInfo,
      message: 'Applicant confirmation email sent successfully'
    };

  } catch (error) {
    console.error('Error sending applicant confirmation email:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send confirmation email, but application was saved'
    };
  }
};

/**
 * Sends only the admin notification email (fallback method)
 * @param {Object} applicationData - The application data
 * @returns {Promise<Object>} - Email sending result
 */
export const sendAdminNotificationEmail = async (applicationData) => {
  try {
    const transporter = createTransporter();
    
    // Format submission date
    const formattedDate = new Date(applicationData.created_at).toLocaleString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Prepare email data
    const emailData = {
      applicationId: applicationData.id,
      personalInfo: {
        firstName: applicationData.personal_info.firstName,
        surname: applicationData.personal_info.surname,
        email: applicationData.personal_info.email,
        phone: applicationData.personal_info.phone
      },
      programSelection: {
        program: applicationData.program_selection.program,
        course: applicationData.program_selection.course
      },
      submittedAt: formattedDate
    };

    // Create admin email template
    const adminEmail = createApplicationEmail.admin(emailData);

    // Send email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: adminEmail.subject,
      html: adminEmail.html
    };

    const adminInfo = await transporter.sendMail(adminMailOptions);

    console.log('Admin notification email sent successfully:', {
      applicationId: applicationData.id,
      admin: adminInfo.messageId,
      adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER
    });

    return {
      success: true,
      adminInfo,
      message: 'Admin notification email sent successfully'
    };

  } catch (error) {
    console.error('Error sending admin notification email:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send admin notification email'
    };
  }
};
