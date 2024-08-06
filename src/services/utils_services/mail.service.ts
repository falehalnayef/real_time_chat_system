
import nodemailer from 'nodemailer';
import env from "dotenv";
import StatusError from '../../utils/statusError';
env.config();


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, text: string): Promise<void>{
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new StatusError(500, "Failed to send email.");
  }

}

  