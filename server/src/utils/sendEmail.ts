import nodemailer from "nodemailer";

let testAccount: nodemailer.TestAccount | null = null;
nodemailer.createTestAccount().then(acc => (testAccount = acc));

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ name: string } | null> {
  // const testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);
  if (!testAccount) return null;

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({ from: "blog", subject, to, html });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return { name: testAccount.user };
}
