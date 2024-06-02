import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { UKR_NET_MAIL, UKR_NET_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_MAIL,
    pass: UKR_NET_PASSWORD,
  },
});

const sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: UKR_NET_MAIL,
    to: email,
    subject: "Verify your email",
    html: `<strong>Please verify your email by clicking on the following link: <a href="http://localhost:3000/api/users/verify/${token}">Verify Email</a></strong>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
