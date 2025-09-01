import { ApplicationFormData } from '../../lib/validation/application';

interface ApplicationEmailData {
  applicationId: string;
  personalInfo: {
    firstName: string;
    surname: string;
    email: string;
    phone?: string;
  };
  programSelection: {
    program: string;
    course: string;
  };
  submittedAt: string;
}

export const createApplicationEmail = {
  // Email template for applicant confirmation
  applicant: (data: ApplicationEmailData) => ({
    subject: 'Application Submitted Successfully - FolioTech Institute',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f8fafc;
          }
          .container { 
            background-color: white; 
            border-radius: 8px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
            overflow: hidden; 
          }
          .header { 
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: 600; 
          }
          .content { 
            padding: 30px 20px; 
          }
          .greeting { 
            font-size: 18px; 
            margin-bottom: 20px; 
            color: #1f2937; 
          }
          .message { 
            font-size: 16px; 
            line-height: 1.7; 
            margin-bottom: 25px; 
            color: #4b5563; 
          }
          .application-details { 
            background-color: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 20px; 
            margin: 25px 0; 
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 12px; 
            padding-bottom: 8px; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .detail-row:last-child { 
            border-bottom: none; 
            margin-bottom: 0; 
          }
          .detail-label { 
            font-weight: 600; 
            color: #374151; 
            min-width: 120px; 
          }
          .detail-value { 
            color: #1f2937; 
            text-align: right; 
          }
          .reference-id { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; 
            padding: 15px; 
            border-radius: 6px; 
            text-align: center; 
            margin: 25px 0; 
            font-weight: 600; 
            font-size: 18px; 
          }
          .next-steps { 
            background-color: #eff6ff; 
            border-left: 4px solid #2563eb; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 0 6px 6px 0; 
          }
          .next-steps h3 { 
            margin-top: 0; 
            color: #1e40af; 
            font-size: 18px; 
          }
          .next-steps ul { 
            margin: 15px 0; 
            padding-left: 20px; 
          }
          .next-steps li { 
            margin-bottom: 8px; 
            color: #374151; 
          }
          .footer { 
            background-color: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            border-top: 1px solid #e2e8f0; 
            color: #6b7280; 
            font-size: 14px; 
          }
          .contact-info { 
            margin-top: 15px; 
            padding-top: 15px; 
            border-top: 1px solid #e2e8f0; 
          }
          .contact-info a { 
            color: #2563eb; 
            text-decoration: none; 
          }
          .contact-info a:hover { 
            text-decoration: underline; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Application Submitted Successfully!</h1>
          </div>
          
          <div class="content">
            <div class="greeting">
              Dear ${data.personalInfo.firstName} ${data.personalInfo.surname},
            </div>
            
            <div class="message">
              Thank you for submitting your application to FolioTech Institute! We're excited that you've chosen to pursue your educational journey with us.
            </div>
            
            <div class="reference-id">
              Application Reference ID: ${data.applicationId}
            </div>
            
            <div class="application-details">
              <h3 style="margin-top: 0; color: #1f2937; margin-bottom: 20px;">Application Summary</h3>
              
              <div class="detail-row">
                <span class="detail-label">Full Name:</span>
                <span class="detail-value">${data.personalInfo.firstName} ${data.personalInfo.surname}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${data.personalInfo.email}</span>
              </div>
              
              ${data.personalInfo.phone ? `
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${data.personalInfo.phone}</span>
              </div>
              ` : ''}
              
              <div class="detail-row">
                <span class="detail-label">Program:</span>
                <span class="detail-value">${data.programSelection.program}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Course:</span>
                <span class="detail-value">${data.programSelection.course}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">${data.submittedAt}</span>
              </div>
            </div>
            
            <div class="next-steps">
              <h3>What Happens Next?</h3>
              <ul>
                <li><strong>Review Process:</strong> Our admissions team will carefully review your application</li>
                <li><strong>Documentation:</strong> We may request additional documents if needed</li>
                <li><strong>Interview:</strong> You may be invited for an interview or assessment</li>
                <li><strong>Decision:</strong> You'll receive a decision within 2-3 weeks</li>
              </ul>
            </div>
            
            <div class="message">
              We appreciate your patience during the review process. If you have any questions or need to provide additional information, please don't hesitate to contact us.
            </div>
          </div>
          
          <div class="footer">
            <p><strong>FolioTech Institute</strong></p>
            <p>Empowering the next generation of technology professionals</p>
            
            <div class="contact-info">
              <p>📧 <a href="mailto:info@foliotechinstitute.com">info@foliotechinstitute.com</a></p>
              <p>📱 <a href="tel:+2347088616350">+234 708 861 6350</a></p>
              <p>📍 1, Sunmonu Animashaun St, Zina Estate, Addo Rd, Ajah, Lagos, Nigeria</p>
            </div>
            
            <p style="margin-top: 20px;">© ${new Date().getFullYear()} FolioTech Institute. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email template for admin notification
  admin: (data: ApplicationEmailData) => ({
    subject: `New Application Received: ${data.personalInfo.firstName} ${data.personalInfo.surname} - ${data.programSelection.program}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Application Notification</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 700px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f8fafc;
          }
          .container { 
            background-color: white; 
            border-radius: 8px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
            overflow: hidden; 
          }
          .header { 
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
            color: white; 
            padding: 25px 20px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 22px; 
            font-weight: 600; 
          }
          .content { 
            padding: 25px 20px; 
          }
          .alert { 
            background-color: #fef2f2; 
            border: 1px solid #fecaca; 
            border-radius: 6px; 
            padding: 15px; 
            margin-bottom: 20px; 
            color: #991b1b; 
            font-weight: 500; 
          }
          .application-details { 
            background-color: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 12px; 
            padding-bottom: 8px; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .detail-row:last-child { 
            border-bottom: none; 
            margin-bottom: 0; 
          }
          .detail-label { 
            font-weight: 600; 
            color: #374151; 
            min-width: 140px; 
          }
          .detail-value { 
            color: #1f2937; 
            text-align: right; 
            max-width: 300px; 
          }
          .action-buttons { 
            text-align: center; 
            margin: 25px 0; 
          }
          .btn { 
            display: inline-block; 
            padding: 12px 24px; 
            margin: 0 10px; 
            background-color: #2563eb; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 500; 
            transition: background-color 0.2s; 
          }
          .btn:hover { 
            background-color: #1d4ed8; 
          }
          .btn-secondary { 
            background-color: #6b7280; 
          }
          .btn-secondary:hover { 
            background-color: #4b5563; 
          }
          .footer { 
            background-color: #f8fafc; 
            padding: 20px; 
            text-align: center; 
            border-top: 1px solid #e2e8f0; 
            color: #6b7280; 
            font-size: 14px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Application Received</h1>
          </div>
          
          <div class="content">
            <div class="alert">
              ⚠️ A new application has been submitted and requires your review.
            </div>
            
            <div class="application-details">
              <h3 style="margin-top: 0; color: #1f2937; margin-bottom: 20px;">Application Details</h3>
              
              <div class="detail-row">
                <span class="detail-label">Application ID:</span>
                <span class="detail-value">${data.applicationId}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Applicant Name:</span>
                <span class="detail-value">${data.personalInfo.firstName} ${data.personalInfo.surname}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Email Address:</span>
                <span class="detail-value">${data.personalInfo.email}</span>
              </div>
              
              ${data.personalInfo.phone ? `
              <div class="detail-row">
                <span class="detail-label">Phone Number:</span>
                <span class="detail-value">${data.personalInfo.phone}</span>
              </div>
              ` : ''}
              
              <div class="detail-row">
                <span class="detail-label">Program:</span>
                <span class="detail-value">${data.programSelection.program}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Course:</span>
                <span class="detail-value">${data.programSelection.course}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Submission Time:</span>
                <span class="detail-value">${data.submittedAt}</span>
              </div>
            </div>
            
            <div class="action-buttons">
              <a href="mailto:${data.personalInfo.email}" class="btn">
                📧 Contact Applicant
              </a>
              <a href="/admin/applications/${data.applicationId}" class="btn btn-secondary">
                👁️ View Full Application
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
              Please review this application and take appropriate action within 48 hours.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>FolioTech Institute - Admissions Team</strong></p>
            <p>© ${new Date().getFullYear()} FolioTech Institute. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};
