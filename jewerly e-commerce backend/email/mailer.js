const nodemailer = require("nodemailer");
const env = require("../config/env.js");

// Gmail SMTP (STARTTLS on port 587). Force IPv4 to avoid ENETUNREACH on Render.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // e.g., smtp.gmail.com
  port: 587,
  secure: false, // true for 465, false for other ports
  family: 4,     // <--- ADD THIS LINE TO FORCE IPV4
  auth: {
    user: env.appEmail,
    pass: env.appPassword,
  },
});

// Helper to build a standard mail option object
const mailOption = (email, subject, html) => ({
  from: env.appEmail,
  to: email,
  subject,
  html,
});

// ----------------------------------------------------------
// Seller verification email
// ----------------------------------------------------------
const sendSellerVerificationEmail = (email, name, storeName) => {
  const option = mailOption(
    email,
    `Seller Account Verification - ${storeName}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #cda052;">
        <h1 style="color: #333; margin: 0;">Welcome to Jewelry Marketplace!</h1>
      </div>
      <div style="padding: 30px; color: #555; line-height: 1.6;">
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for registering as a seller for <strong>${storeName}</strong>.</p>
        <p>Your registration request has been received and is currently under review. We will verify your store details and get back to you shortly.</p>
        <p>In the meantime, feel free to explore our platform and get familiar with our seller guidelines.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>The Jewelry Marketplace Team</strong></p>
      </div>
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p>&copy; ${new Date().getFullYear()} Jewelry Marketplace. All rights reserved.</p>
      </div>
    </div>
    `
  );

  transporter.sendMail(option, (error, info) => {
    if (error) {
      console.error("Error sending seller verification email:", error);
    } else {
      console.log("Seller verification email sent:", info.messageId);
    }
  });
};

// ----------------------------------------------------------
// General verification email (code based)
// ----------------------------------------------------------
const sendVerificationEmail = (email, name, verificationCode) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify?code=${verificationCode}`;
  const option = mailOption(
    email,
    "Verify Your Account",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #cda052;">
        <h1 style="color: #333; margin: 0;">Verify Your Email</h1>
      </div>
      <div style="padding: 30px; color: #555; line-height: 1.6;">
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for joining our jewelry community! To complete your registration, please verify your email address using the code below.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #cda052; background: #f9f9f9; padding: 10px 20px; border-radius: 5px; border: 1px dashed #cda052;">
            ${verificationCode}
          </span>
        </div>
        <p>This code will expire in 24 hours.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #cda052; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Verify My Account
          </a>
        </div>
        <p>If you did not create an account, no further action is required.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>The Jewelry Marketplace Team</strong></p>
      </div>
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p>&copy; ${new Date().getFullYear()} Jewelry Marketplace. All rights reserved.</p>
      </div>
    </div>
    `
  );

  transporter.sendMail(option, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
    } else {
      console.log("Verification email sent:", info.messageId);
    }
  });
};

// ----------------------------------------------------------
// Welcome email for new users
// ----------------------------------------------------------
const sendWelcomingEmail = (email, name) => {
  const option = mailOption(
    email,
    "Welcome to Our Jewelry E-commerce!",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #cda052;">
        <h1 style="color: #333; margin: 0;">Welcome Aboard!</h1>
      </div>
      <div style="padding: 30px; color: #555; line-height: 1.6;">
        <p>Hello <strong>${name}</strong>,</p>
        <p>We are thrilled to welcome you to our Jewelry E-commerce platform. Start exploring our exclusive collections today!</p>
        <p>Discover handcrafted pieces, special offers, and much more.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" style="background-color: #cda052; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Start Shopping
          </a>
        </div>
        <br/>
        <p>Best regards,</p>
        <p><strong>The Jewelry Marketplace Team</strong></p>
      </div>
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p>&copy; ${new Date().getFullYear()} Jewelry Marketplace. All rights reserved.</p>
      </div>
    </div>
    `
  );

  transporter.sendMail(option, (error, info) => {
    if (error) {
      console.error("Error sending welcoming email:", error);
    } else {
      console.log("Welcoming email sent:", info.messageId);
    }
  });
};

module.exports = {
  sendWelcomingEmail,
  sendSellerVerificationEmail,
  sendVerificationEmail,
};