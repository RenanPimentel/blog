import nodemailer from "nodemailer";
import { GMAILPASS, GMAILUSER } from "../config";

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ name: string } | null> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAILUSER, pass: GMAILPASS },
  });

  await transporter.sendMail({ from: GMAILUSER, to, subject, html });

  return { name: GMAILUSER || "" };
}
