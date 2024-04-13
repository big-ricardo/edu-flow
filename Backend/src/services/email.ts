import * as nodemailer from "nodemailer";

const userAccount = process.env.EMAIL_ACCOUNT;
const userPassword = process.env.EMAIL_PASSWORD;

if (!userAccount || !userPassword) {
  throw new Error("Email account or password not found");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userAccount,
    pass: userPassword,
  },
});

export const sendEmail = async (
  to: string | Array<string>,
  subject: string,
  html: string
) => {
  await transporter
    .sendMail({
      from: process.env.EMAIL_ACCOUNT,
      to,
      subject,
      html,
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};