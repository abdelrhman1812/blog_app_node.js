import nodemailer from "nodemailer";

const sendEmails = async (email, subject, htmlContent, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail's SMTP server
      auth: {
        user: "abdelrhmanali1812@gmail.com",
        pass: process.env.NODEMAILER_PASS, // Ensure this is an application-specific password
      },
    });

    const info = await transporter.sendMail({
      from: '"Moltqa Team 💛" <abdelrhmanali1812@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: htmlContent, // html body
    });
  } catch (error) {
    console.error("Error initializing email sending:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Email sending failed", error });
    }
    return false;
  }
};

export default sendEmails;
