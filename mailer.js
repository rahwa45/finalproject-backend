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
  const verificationLink = `https://finalprojectfrontend-lyart.vercel.app/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    html: `<p>Please verify your email by clicking on the following link:</p>
    <a href="${verificationLink}">${verificationLink}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Verification email sent: ", info.response);
    }
  });
};
