import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
  logger: true,
});

const frontendURL = process.env.CLIENT_URL;

// ✅ Send verification email
export const sendVerificationEmail = (email, token) => {
  const verificationLink = `${frontendURL}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending verification email: ", error);
    } else {
      console.log("Verification email sent: ", info.response);
    }
  });
};

// ✅ Send password reset email (UPDATED)
export const sendResetPasswordEmail = async (email, token, id) => {
  const resetLink = `${frontendURL}/reset-password?token=${token}&id=${id}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};
