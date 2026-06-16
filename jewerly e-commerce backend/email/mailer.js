const axios = require("axios");
const env = require("../config/env.js");

// We no longer need nodemailer, using Resend API over HTTP instead
const sendViaResend = async (email, subject, html) => {
    try {
        const response = await axios.post(
            'https://api.resend.com/emails',
            {
                // NOTE: If you haven't verified a domain in Resend, you MUST use "onboarding@resend.dev" as the 'from' address
                // AND you can only send emails to the email address you registered your Resend account with.
                // To send to any user, verify a custom domain in your Resend dashboard.
                from: "onboarding@resend.dev", 
                to: email,
                subject: subject,
                html: html
            },
            {
                headers: {
                    'Authorization': `Bearer ${env.resendApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Email sent successfully via Resend:', response.data);
    } catch (error) {
        console.error('Error sending email via Resend:', error.response ? error.response.data : error.message);
    }
};

const sendSellerVerificationEmail = (email, name, storeName) => {
    const subject = `Seller Account Verification - ${storeName}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #cda052;">
                <h1 style="color: #333; margin: 0;">Welcome to Jewelry Marketplace!</h1>
            </div>
            <div style="padding: 30px; color: #555; line-height: 1.6;">
                <p>Hello <strong>${name}</strong>,</p>
                <p>Thank you for registering as a seller for <strong>${storeName}</strong>.</p>
                <p>Your registration request has been received and is currently under review. We will verify your store details and get back to you shortly.</p>
                <p>In the meantime, feel free to explore our platform and get familiar with our seller guidelines.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>The Jewelry Marketplace Team</strong></p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                <p>&copy; ${new Date().getFullYear()} Jewelry Marketplace. All rights reserved.</p>
            </div>
        </div>
    `;
    sendViaResend(email, subject, html);
};

const sendVerificationEmail = (email, name, verificationCode) => {
    // URL without sensitive parameters
    const verificationLink = `https://jewelry-e-commerce-ebon.vercel.app/verify`;
    const subject = "Verify Your Seller Account";
    const html = `
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
                        Go to Verification Page
                    </a>
                </div>
                
                <p>If you did not create an account, no further action is required.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>The Jewelry Marketplace Team</strong></p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                <p>&copy; ${new Date().getFullYear()} Jewelry Marketplace. All rights reserved.</p>
            </div>
        </div>
    `;
    sendViaResend(email, subject, html);
};

const sendWelcomingEmail = (email, name) => {
    const subject = "Welcome to Our Jewelry E-commerce!";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #cda052;">
                <h1 style="color: #333; margin: 0;">Welcome Aboard!</h1>
            </div>
            <div style="padding: 30px; color: #555; line-height: 1.6;">
                <p>Hello <strong>${name}</strong>,</p>
                <p>We are thrilled to welcome you to our Jewelry E-commerce platform. Start exploring our exclusive collections today!</p>
                <p>Discover handcrafted pieces, special offers, and much more.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://jewelry-e-commerce-ebon.vercel.app/" style="background-color: #cda052; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Start Shopping
                    </a>
                </div>
                <br>
                <p>Best regards,</p>
                <p><strong>The Jewelry Marketplace Team</strong></p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                <p>&copy; ${new Date().getFullYear()} Jewelry Marketplace. All rights reserved.</p>
            </div>
        </div>
    `;
    sendViaResend(email, subject, html);
};

module.exports = { sendWelcomingEmail, sendSellerVerificationEmail, sendVerificationEmail };