
import nodemailer from 'nodemailer';
import { generateResetToken } from './generateResetToken';

// Function to send a password reset email
export async function sendPasswordResetEmail(email) {
  try {
    // Create a reset token
    const resetToken = generateResetToken();

    // Save the token and email to your database for verification later
    console.log(`Generated reset token for ${email}: ${resetToken}`);
    // Example: saveTokenToDatabase(email, resetToken);

    // Construct the reset URL
    const resetUrl = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;

    console.log(resetUrl, process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USERNAME, process.env.SMTP_PASSWORD,process.env.EMAIL_USER, )

    // Configure the SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" style="color: blue; text-decoration: underline;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p><small>Token (debugging): ${resetToken}</small></p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
