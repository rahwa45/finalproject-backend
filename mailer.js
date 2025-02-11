import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Add the host
  port: 587, // Use 587 for TLS or 465 for SSL
  secure: false,
  service: "gmail",
  auth: {
    user: "rahwa3113@gmail.com",
    pass: "qzvy iffa xqzv zhex",
  },
  tls: {
    rejectUnauthorized: false, // If you're facing SSL issues, you can add this line
  },
});

export const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:5173/verify?token=${token}`;

  const mailOptions = {
    from: "rahwa3113@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Verification email sent: ", info.response);
    }
  });
};
