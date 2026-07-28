const nodemailer = require('nodemailer');
const { prisma } = require('../config/prisma');
const { logger } = require('../config/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
      logger.info(`SMTP Mail Transporter initialized successfully for host: ${host}`);
    } else {
      logger.info('SMTP credentials not configured in backend/.env. Email service will run in Console/Simulation Mode.');
    }
  }

  async sendCriticalPostAlertToAdmins({ dateStr, shiftCode, vacancies }) {
    try {
      this.initTransporter();

      // Query all SuperAdmin and Admin employees and fetch their email from employeepersonal
      const admins = await prisma.employeemaster.findMany({
        where: {
          Enable: 'Y',
          SecurityRole: { in: ['SUPERADMIN', 'ADMIN'] },
        },
        include: { personal: true },
      });

      const adminEmails = Array.from(
        new Set(
          admins
            .map((a) => a.personal?.Email)
            .filter((email) => email && email.includes('@'))
        )
      );

      // If no admin emails found in DB, fallback to default admin email
      if (adminEmails.length === 0) {
        adminEmails.push('adikadia05@gmail.com');
      }

      const formattedDate = new Date(dateStr).toLocaleDateString();
      const mailSubject = `[URGENT SPPAS ALERT] ${vacancies.length} Critical Duty Post(s) Unfilled for Shift ${shiftCode} (${formattedDate})`;

      const rowsHtml = vacancies
        .map(
          (v) => `
          <tr style="border-bottom: 1px solid #1f2937;">
            <td style="padding: 10px; font-weight: bold; color: #ef4444;">${v.postName} <span style="background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">CRITICAL</span></td>
            <td style="padding: 10px;">${v.locationName}</td>
            <td style="padding: 10px; text-align: center;">${v.required}</td>
            <td style="padding: 10px; text-align: center; color: #f59e0b;">${v.allocated}</td>
            <td style="padding: 10px; text-align: center; color: #ef4444; font-weight: bold;">${v.vacant} Vacant</td>
          </tr>
        `
        )
        .join('');

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 8px; padding: 24px; border: 2px solid #ef4444;">
          <div style="text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #ef4444; margin: 0; font-size: 22px;">🚨 URGENT: Critical Security Post Vacancy Alert</h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">Control Room Automated Alert • Executive Security Action Required</p>
          </div>

          <p style="font-size: 15px;">Attention <strong>SuperAdmin & Security Management</strong>,</p>
          <p style="font-size: 14px; color: #cbd5e1;">The Automatic Guard Allocation Engine completed its execution cycle for <strong>Shift ${shiftCode} (${formattedDate})</strong> and detected <strong>${vacancies.length} Critical Duty Post(s)</strong> that remain unfilled due to insufficient guard attendance or restrictions.</p>

          <div style="background-color: #111827; border-radius: 6px; padding: 16px; margin: 20px 0; border: 1px solid #374151;">
            <h3 style="color: #f8fafc; font-size: 15px; margin: 0 0 12px 0;">Unfilled Critical Duty Posts Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #f8fafc;">
              <thead>
                <tr style="background-color: #1f2937; text-align: left;">
                  <th style="padding: 8px;">Duty Post Name</th>
                  <th style="padding: 8px;">Location</th>
                  <th style="padding: 8px; text-align: center;">Req</th>
                  <th style="padding: 8px; text-align: center;">Alloc</th>
                  <th style="padding: 8px; text-align: center;">Shortage</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>

          <div style="background-color: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0; font-size: 13px; color: #fca5a5;">
              <strong>Action Required:</strong> Critical infrastructure posts (e.g. Data Center, Main Entrance Gates) require immediate security coverage. Please log into the SPPAS Portal Control Room and deploy reserve guards manually using <strong>Manual Guard Deployment</strong>.
            </p>
          </div>

          <div style="border-top: 1px solid #1e293b; pt: 16px; margin-top: 24px; font-size: 11px; color: #64748b; text-align: center;">
            <p style="margin: 0;">Automated Alert dispatched by SPPAS Control Room Monitoring Engine.</p>
            <p style="margin: 4px 0 0 0;">Recipients: ${adminEmails.join(', ')}</p>
          </div>
        </div>
      `;

      const fromAddress = process.env.EMAIL_FROM || '"SPPAS Control Room Alert" <no-reply@sppas-security.com>';

      if (this.transporter) {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: adminEmails,
          subject: mailSubject,
          html: htmlContent,
        });
        logger.info(`[Critical Alert Email Dispatch] Sent alert email to SuperAdmins & Admins (${adminEmails.join(', ')}). Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId, recipients: adminEmails };
      } else {
        logger.info(`[Critical Alert Email Simulation] Alert email queued for SuperAdmins & Admins -> Recipients: ${adminEmails.join(', ')} | Shortages: ${vacancies.length} posts`);
        return { success: true, simulated: true, recipients: adminEmails };
      }
    } catch (error) {
      logger.error(`[Critical Alert Email Dispatch Error] Failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendTestEmail(targetEmail = 'adikadia05@gmail.com') {
    this.initTransporter();

    const fromAddress = process.env.EMAIL_FROM || '"SPPAS Guard Allocation" <no-reply@sppas-security.com>';
    const mailSubject = `[SPPAS Test Email] Security Guard Duty Allocation Test`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 8px; padding: 24px; border: 1px solid #1e293b;">
        <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #3b82f6; margin: 0; font-size: 20px;">SPPAS Security Duty Post Allocation</h2>
          <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">SMTP Test Dispatch Notification</p>
        </div>

        <p style="font-size: 15px;">Hello <strong>Aditya Kadia</strong>,</p>
        <p style="font-size: 14px; color: #cbd5e1;">This is a test notification from the Automated Security Personnel Post Allocation System (SPPAS).</p>

        <div style="background-color: #111827; border-radius: 6px; padding: 16px; margin: 20px 0; border: 1px solid #1f2937;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #f8fafc;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Assigned Duty Post:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #60a5fa;">Main Gate (Gate 1) <span style="background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">CRITICAL</span></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Location Sector:</td>
              <td style="padding: 6px 0;">North Gate Sector</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Deployment Date:</td>
              <td style="padding: 6px 0; font-weight: bold;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Shift Timing:</td>
              <td style="padding: 6px 0; color: #10b981; font-weight: bold;">Morning Shift (A)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Status:</td>
              <td style="padding: 6px 0; color: #10b981;">SMTP Connection Active & Verified</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #94a3b8;">Your SMTP configuration in <code>backend/.env</code> is active and working properly.</p>
      </div>
    `;

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: targetEmail,
          subject: mailSubject,
          html: htmlContent,
        });
        logger.info(`[Test Email Dispatch] Successfully sent test email to ${targetEmail}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId, email: targetEmail };
      } catch (err) {
        logger.error(`[Test Email Dispatch Error] Failed: ${err.message}`);
        return { success: false, error: err.message };
      }
    } else {
      logger.warn(`[Test Email Dispatch] SMTP transporter not initialized. Credentials missing in .env.`);
      return { success: false, error: 'SMTP credentials missing in backend/.env' };
    }
  }

  async sendGuardDeploymentEmail(deploymentDetails) {
    try {
      this.initTransporter();

      const {
        empNo,
        deploymentDate,
        shiftName = 'Morning Shift (A)',
        postName = 'Main Gate',
        categoryName = 'Main Entrances',
        locationName = 'Main Campus',
        isCritical = false,
        remarks = 'Report to duty post on time.',
      } = deploymentDetails;

      const employee = await prisma.employeemaster.findUnique({
        where: { EmpNo: String(empNo) },
        include: { personal: true },
      });

      if (!employee) {
        logger.warn(`Email dispatch skipped: Employee #${empNo} not found.`);
        return { success: false, message: 'Employee not found' };
      }

      const guardEmail = employee.personal?.Email || `${employee.FirstName?.toLowerCase()}.${employee.LastName?.toLowerCase()}@sppas-security.com`;
      const guardName = `${employee.FirstName} ${employee.LastName}`.trim();
      const formattedDate = new Date(deploymentDate).toLocaleDateString();

      const mailSubject = `[SPPAS Notice] Duty Post Allocation: ${postName} (${formattedDate})`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f8fafc; border-radius: 8px; padding: 24px; border: 1px solid #1e293b;">
          <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #3b82f6; margin: 0; font-size: 20px;">SPPAS Security Duty Post Allocation</h2>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Official Guard Deployment Notification</p>
          </div>

          <p style="font-size: 15px;">Dear <strong>${guardName}</strong> (Emp #${employee.EmpNo}),</p>
          <p style="font-size: 14px; color: #cbd5e1;">You have been allocated to a Security Duty Post. Below are your deployment details:</p>

          <div style="background-color: #111827; border-radius: 6px; padding: 16px; margin: 20px 0; border: 1px solid #1f2937;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #f8fafc;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Assigned Duty Post:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #60a5fa;">${postName} ${isCritical ? '<span style="background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">CRITICAL</span>' : ''}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Post Category:</td>
                <td style="padding: 6px 0;">${categoryName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Location Sector:</td>
                <td style="padding: 6px 0;">${locationName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Deployment Date:</td>
                <td style="padding: 6px 0; font-weight: bold;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Shift Timing:</td>
                <td style="padding: 6px 0; color: #10b981; font-weight: bold;">${shiftName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Supervisor Remarks:</td>
                <td style="padding: 6px 0;">${remarks}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: #94a3b8;">Please report to your assigned post prior to shift commencement.</p>
        </div>
      `;

      const fromAddress = process.env.EMAIL_FROM || '"SPPAS Guard Allocation" <no-reply@sppas-security.com>';

      if (this.transporter) {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: guardEmail,
          subject: mailSubject,
          html: htmlContent,
        });
        logger.info(`[Email Dispatch] Deployment email sent to Guard #${employee.EmpNo} (${guardEmail}). Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId, email: guardEmail };
      } else {
        logger.info(`[Email Dispatch Simulation] Deployment email queued for Guard #${employee.EmpNo} (${guardName}) -> Recipient: ${guardEmail}`);
        return { success: true, simulated: true, email: guardEmail };
      }
    } catch (error) {
      logger.error(`[Email Dispatch Error] Failed to send deployment email: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
