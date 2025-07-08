// utils/sendEmail.js
import nodemailer from 'nodemailer';

export const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for port 465, false for 587
      auth: {
        user: 'salmanulfarisc13@gmail.com',
        pass: 'jzbiiuvgblokcard', // Consider using environment variable
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '"OTP Verification" <salmanulfarisc13@gmail.com>',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is: ${otp}`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send OTP email');
  }
};
