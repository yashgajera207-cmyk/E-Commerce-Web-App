import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (!transporter) {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }
  return transporter;
}

export async function sendOtpEmail(toEmail, otp) {
  const mailTransporter = getTransporter();

  console.log(`\n========================================================`);
  console.log(`[ShopZone Email OTP Sent]`);
  console.log(`Recipient: ${toEmail}`);
  console.log(`Verification OTP: ${otp}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`========================================================\n`);

  if (mailTransporter) {
    try {
      await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || '"ShopZone" <no-reply@shopzone.com>',
        to: toEmail,
        subject: "Your ShopZone Login OTP Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 26px; font-weight: 800; font-style: italic; color: #2874f0;">Shop<span style="color: #ffb400;">Zone</span></span>
            </div>
            <h2 style="color: #1f2937; font-size: 20px; text-align: center; margin-bottom: 12px;">Your Verification Code</h2>
            <p style="color: #4b5563; font-size: 14px; text-align: center; line-height: 1.5;">
              Use the one-time password (OTP) below to log in to your ShopZone account. This code is valid for <strong>10 minutes</strong>.
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <div style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2874f0; padding: 14px 28px; background-color: #f0f5ff; border: 2px dashed #2874f0; border-radius: 8px;">
                ${otp}
              </div>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If you didn't request this code, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 11px; text-align: center;">
              © ${new Date().getFullYear()} ShopZone Inc. All rights reserved.
            </p>
          </div>
        `,
      });
      console.log(`[ShopZone Email Delivery] Successfully sent to ${toEmail}`);
    } catch (err) {
      console.error(`[ShopZone Email Delivery Error]: ${err.message}`);
    }
  }
}

export async function sendOtpSms(mobile, otp) {
  console.log(`\n========================================================`);
  console.log(`[ShopZone Mobile SMS OTP Sent]`);
  console.log(`Recipient: +91 ${mobile}`);
  console.log(`Verification OTP: ${otp}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`========================================================\n`);
  // If third party SMS gateway like Twilio or Fast2SMS is configured:
  // we can trigger the API call here.
}
