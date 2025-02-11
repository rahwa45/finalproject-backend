import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Include debugging information in logs
  logger: true, // Log to console
});

export const sendVerificationEmail = (email, token) => {
  const verificationLink = `https://finalprojectfrontend-hnck.vercel.app/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Verification email sent: ", info.response);
    }
  });
};
