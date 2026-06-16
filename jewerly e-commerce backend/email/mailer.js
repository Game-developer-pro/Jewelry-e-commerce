const nodemailer = require("nodemailer")
const env = require("../config/env.js")

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587 (uses STARTTLS)
    family: 4, // Force IPv4 to prevent ENETUNREACH on servers without IPv6
    auth: {
        user: env.appEmail,
        pass: env.appPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

const mailOption = (email, subject, html) => {
    return {
        from: env.appEmail,
        to: email,
        subject,
        html
    };
};

const sendWelcomingEmail = (email, name) => {
    const option = mailOption(
        email,
        `welcome ${name}`,
        `<p> Hi ${name}, Welcome to our platform</p>`
    );

    transporter.sendMail(option, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            console.log('Email sent: %s', info.messageId);
        }
    });
}

const sendSellerVerificationEmail = (email, name, storeName) => {
    const option = mailOption(
        email,
        `Seller Account Verification - ${storeName}`,
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #cda052;">Welcome to the Artisan Community, ${name}!</h2>
            <p>Thank you for registering as a seller for <strong>${storeName}</strong>.</p>
            <p>Your registration request has been received and is currently under review. We will verify your store details and get back to you shortly.</p>
            <p>Once verified, you'll be able to list your handcrafted jewelry and start selling to our community.</p>
            <br />
            <p>Best regards,</p>
            <p>The AURELIA Team</p>
        </div>
        `
    );

    transporter.sendMail(option, (error, info) => {
        if (error) {
            return console.log('Error sending seller email:', error);
        } else {
            console.log('Seller verification email sent: %s', info.messageId);
        }
    });
}

const sendVerificationEmail = (email, name, verificationCode) => {
    // URL without sensitive parameters
    const verificationLink = `https://jewelry-e-commerce-ebon.vercel.app/verify`;
    
    const option = mailOption(
        email,
        "Verify your account",
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #cda052; text-align: center;">Verify Your Account</h2>
            <p>Hi ${name},</p>
            <p>Thank you for joining our jewelry community! To complete your registration, please verify your email address using the code below or by clicking the button.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #cda052; background: #f9f9f9; padding: 10px 20px; border-radius: 5px; border: 1px dashed #cda052;">
                    ${verificationCode}
                </span>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="background-color: #cda052; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Verify My Account
                </a>
            </div>

            <p>This code will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <br />
            <p>Best regards,</p>
            <p><strong>The AURELIA Team</strong></p>
        </div>
        `
    );

    transporter.sendMail(option, (error, info) => {
        if (error) {
            return console.log('Error sending verification email:', error);
        } else {
            console.log('Verification email sent: %s', info.messageId);
        }
    });
}

module.exports = { sendWelcomingEmail, sendSellerVerificationEmail, sendVerificationEmail, transporter };