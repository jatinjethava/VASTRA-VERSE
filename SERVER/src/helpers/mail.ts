"use strict"
import nodemailer from 'nodemailer';
import { env } from '../config';
import { subscribeModel } from '../models';

const mailHost = env.EMAIL_HOST || "smtp.gmail.com";
const mailPort = Number(env.EMAIL_PORT || 465);
const mailUser = env.EMAIL_HOST_USER || "";
const mailPass = env.EMAIL_HOST_PASSWORD || "";
const fromEmail = env.EMAIL_FROM || mailUser || "VASTRA VERSE <noreply@vastraverse.com>";

const isDev = (env.ENVIRONMENT || 'dev') === 'dev';

let transPorter: nodemailer.Transporter;
let etherealReady: Promise<void> = Promise.resolve();

// If in dev and no Gmail credentials provided, use ethereal fake SMTP
if (isDev && (!mailUser || !mailPass)) {
    etherealReady = nodemailer.createTestAccount().then((testAccount) => {
        transPorter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        } as any);
    }).catch((err) => {
        console.log("Ethereal test account creation failed:", err.message);
    });
} else {
    transPorter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: mailPort === 465,
        family: 4,
        tls: { rejectUnauthorized: false },
        auth: { user: mailUser, pass: mailPass },
    } as any);
}

const sendEmail = async (to: string, subject: string, html: string, logLabel: string): Promise<string> => {
    await etherealReady;

    return new Promise((resolve, reject) => {
        if (!transPorter) {
            return reject(new Error("Mail transporter is not initialized."));
        }

        transPorter.sendMail({ from: fromEmail, to, subject, html }, (err: any, data: any) => {
            if (err) {
                console.log(`❌ [${logLabel}] Failed:`, err.message);
                return reject(err);
            }

            const previewUrl = nodemailer.getTestMessageUrl(data);
            console.log("===========================================");
            if (previewUrl) {
                console.log(`📧 [${logLabel}] Email sent to: ${to} (Ethereal Sandbox)`);
                console.log(`🔗 Preview URL: ${previewUrl}`);
            } else {
                console.log(`📧 [${logLabel}] Email successfully sent to: ${to} via Gmail`);
            }
            console.log("===========================================");

            resolve(`Email has been sent to ${to}`);
        });
    });
};


export const email_verification_mail = async (user: any, otp: any) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - VASTRA VERSE</title>
</head>
<body style="margin:0; padding:0; background-color:#f8f6f3; font-family:'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f3;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

                    <tr>
                        <td align="center" style="padding:30px 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-bottom:2px solid #c8a96e; padding-bottom:12px;">
                                        <h1 style="margin:0; font-size:28px; font-weight:300; letter-spacing:8px; color:#1a1a1a; font-family:'Helvetica Neue', Arial, sans-serif;">VASTRA VERSE</h1>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:8px 0 0; font-size:11px; letter-spacing:3px; color:#c8a96e; text-transform:uppercase;">Premium Fashion</p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">

                                <tr>
                                    <td style="background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding:32px 40px; text-align:center;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center">
                                                    <div style="width:56px; height:56px; border-radius:50%; background:rgba(200,169,110,0.15); display:inline-block; line-height:56px; font-size:24px;">
                                                        ✉️
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding-top:16px;">
                                                    <h2 style="margin:0; color:#ffffff; font-size:22px; font-weight:400; letter-spacing:1px;">Email Verification</h2>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:40px 40px 20px;">
                                        <p style="margin:0 0 20px; color:#333333; font-size:16px; line-height:1.6;">
                                            Hello <strong style="color:#1a1a1a;">${user.name || 'there'}</strong>,
                                        </p>
                                        <p style="margin:0 0 30px; color:#666666; font-size:15px; line-height:1.7;">
                                            Welcome to <strong style="color:#1a1a1a;">VASTRA VERSE</strong>! To complete your registration, please use the verification code below:
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding:0 40px 30px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%); border:2px solid #c8a96e; border-radius:12px; width:100%; max-width:320px;">
                                            <tr>
                                                <td align="center" style="padding:24px 20px 8px;">
                                                    <p style="margin:0; font-size:11px; letter-spacing:3px; color:#999999; text-transform:uppercase;">Your Verification Code</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding:8px 20px 24px;">
                                                    <h1 style="margin:0; font-size:36px; font-weight:700; letter-spacing:10px; color:#1a1a1a; font-family:'Courier New', monospace;">${otp}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding:0 40px 30px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background:#fff8f0; border-left:3px solid #c8a96e; padding:12px 20px; border-radius:0 6px 6px 0;">
                                                    <p style="margin:0; color:#8a7350; font-size:13px;">
                                                        ⏱ This code will expire in <strong>2 minutes</strong>. Do not share it with anyone.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:0 40px;">
                                        <hr style="border:none; border-top:1px solid #eeeeee; margin:0;">
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:24px 40px 36px;">
                                        <p style="margin:0; color:#999999; font-size:13px; line-height:1.6;">
                                            If you didn't create an account with VASTRA VERSE, you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding:30px 0;">
                            <p style="margin:0 0 8px; font-size:12px; color:#999999;">© ${new Date().getFullYear()} VASTRA VERSE. All rights reserved.</p>
                            <p style="margin:0; font-size:11px; color:#bbbbbb;">Premium Fashion & Lifestyle</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    return sendEmail(user.email, "Email verification", html, "OTP Verification");
}

export const confirmAccount = async (user: any) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Confirmed - VASTRA VERSE</title>
</head>
<body style="margin:0; padding:0; background-color:#f8f6f3; font-family:'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f3;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

                    <tr>
                        <td align="center" style="padding:30px 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-bottom:2px solid #c8a96e; padding-bottom:12px;">
                                        <h1 style="margin:0; font-size:28px; font-weight:300; letter-spacing:8px; color:#1a1a1a; font-family:'Helvetica Neue', Arial, sans-serif;">VASTRA VERSE</h1>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:8px 0 0; font-size:11px; letter-spacing:3px; color:#c8a96e; text-transform:uppercase;">Premium Fashion</p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">

                                <tr>
                                    <td style="background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding:32px 40px; text-align:center;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center">
                                                    <div style="width:56px; height:56px; border-radius:50%; background:rgba(76,175,80,0.15); display:inline-block; line-height:56px; font-size:28px;">
                                                        ✅
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding-top:16px;">
                                                    <h2 style="margin:0; color:#ffffff; font-size:22px; font-weight:400; letter-spacing:1px;">Account Confirmed</h2>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:40px 40px 20px;">
                                        <p style="margin:0 0 20px; color:#333333; font-size:16px; line-height:1.6;">
                                            Hello <strong style="color:#1a1a1a;">${user.name || 'there'}</strong>,
                                        </p>
                                        <p style="margin:0 0 24px; color:#666666; font-size:15px; line-height:1.7;">
                                            Your email has been successfully verified and your <strong style="color:#1a1a1a;">VASTRA VERSE</strong> account is now fully activated!
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding:0 40px 30px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #f0faf0 0%, #e8f5e9 100%); border:2px solid #4caf50; border-radius:12px; width:100%;">
                                            <tr>
                                                <td align="center" style="padding:24px 30px;">
                                                    <p style="margin:0 0 8px; font-size:14px; color:#2e7d32; font-weight:600;">🎉 You're all set!</p>
                                                    <p style="margin:0; font-size:13px; color:#666666; line-height:1.5;">
                                                        You can now explore our exclusive fashion collections, save your favorites, and enjoy a seamless shopping experience.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:0 40px;">
                                        <hr style="border:none; border-top:1px solid #eeeeee; margin:0;">
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:24px 40px 36px;">
                                        <p style="margin:0; color:#999999; font-size:13px; line-height:1.6;">
                                            Thank you for joining VASTRA VERSE. If you have any questions, feel free to reach out to our support team.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding:30px 0;">
                            <p style="margin:0 0 8px; font-size:12px; color:#999999;">© ${new Date().getFullYear()} VASTRA VERSE. All rights reserved.</p>
                            <p style="margin:0; font-size:11px; color:#bbbbbb;">Premium Fashion & Lifestyle</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    return sendEmail(user.email, "Account Confirmation", html, "Account Confirmation");
}

export const sendMarketingMail = async (user: any, campaign: any) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${campaign.name || 'Exclusive Offer'} - VASTRA VERSE</title>
</head>
<body style="margin:0; padding:0; background-color:#f8f6f3; font-family:'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f3;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

                    <tr>
                        <td align="center" style="padding:30px 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-bottom:2px solid #c8a96e; padding-bottom:12px;">
                                        <h1 style="margin:0; font-size:28px; font-weight:300; letter-spacing:8px; color:#1a1a1a; font-family:'Helvetica Neue', Arial, sans-serif;">VASTRA VERSE</h1>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:8px 0 0; font-size:11px; letter-spacing:3px; color:#c8a96e; text-transform:uppercase;">Premium Fashion</p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">

                                <tr>
                                    <td style="background:linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding:32px 40px; text-align:center;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center">
                                                    <div style="width:56px; height:56px; border-radius:50%; background:rgba(200,169,110,0.15); display:inline-block; line-height:56px; font-size:28px;">
                                                        🎁
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding-top:16px;">
                                                    <h2 style="margin:0; color:#ffffff; font-size:22px; font-weight:400; letter-spacing:1px;">${campaign.name || 'Exclusive Offer Just For You'}</h2>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:40px 40px 20px;">
                                        <p style="margin:0 0 20px; color:#333333; font-size:16px; line-height:1.6;">
                                            Hello <strong style="color:#1a1a1a;">${user.name || 'there'}</strong>,
                                        </p>
                                        <p style="margin:0 0 24px; color:#666666; font-size:15px; line-height:1.7;">
                                            ${campaign.description || 'We have an exclusive offer waiting for you at <strong style="color:#1a1a1a;">VASTRA VERSE</strong>! Don\'t miss out on our latest collection and amazing deals.'}
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding:0 40px 30px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%); border:2px solid #c8a96e; border-radius:12px; width:100%;">
                                            <tr>
                                                <td align="center" style="padding:24px 30px;">
                                                    <p style="margin:0 0 8px; font-size:11px; letter-spacing:3px; color:#999999; text-transform:uppercase;">Limited Time Offer</p>
                                                    <h1 style="margin:0 0 8px; font-size:32px; font-weight:700; color:#c8a96e; font-family:'Helvetica Neue', Arial, sans-serif;">
                                                        ${campaign.discountType === 'percentage' ? campaign.discountValue + '% OFF' : campaign.discountType === 'fixed' ? '₹' + campaign.discountValue + ' OFF' : 'SHOP NOW'}
                                                    </h1>
                                                    ${campaign.endDate ? '<p style="margin:0; font-size:13px; color:#8a7350;">Valid until ' + new Date(campaign.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) + '</p>' : ''}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding:0 40px 30px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background:linear-gradient(135deg, #c8a96e 0%, #b8944e 100%); border-radius:8px;">
                                                    <a href="#" style="display:inline-block; padding:14px 40px; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">Shop the Collection</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:0 40px;">
                                        <hr style="border:none; border-top:1px solid #eeeeee; margin:0;">
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:24px 40px 36px;">
                                        <p style="margin:0; color:#999999; font-size:13px; line-height:1.6;">
                                            You are receiving this email because you are a valued member of VASTRA VERSE. If you wish to unsubscribe, please update your notification preferences in your account settings.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding:30px 0;">
                            <p style="margin:0 0 8px; font-size:12px; color:#999999;">© ${new Date().getFullYear()} VASTRA VERSE. All rights reserved.</p>
                            <p style="margin:0; font-size:11px; color:#bbbbbb;">Premium Fashion & Lifestyle</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    return sendEmail(user.email, `${campaign.name || 'Exclusive Offer'} - VASTRA VERSE`, html, "Marketing");
}

export const sendNotificationMailToSubscribers = async (campaign: any, type: 'campaign' | 'flash_sale' = 'campaign') => {
    try {

        const subscribers = await subscribeModel.find({ isDeleted: false });

        if (!subscribers || subscribers.length === 0) {
            return { sent: 0, failed: 0, total: 0 };
        }

        const results = await Promise.allSettled(
            subscribers.map((subscriber: any) =>
                sendMarketingMail(
                    { email: subscriber.email, name: 'Valued Customer' },
                    campaign
                )
            )
        );

        const sent = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        // console.log("===========================================");
        // console.log(`✅ ${type.toUpperCase()} notification emails - Sent: ${sent}, Failed: ${failed}, Total: ${subscribers.length}`);
        // console.log("===========================================");

        return { sent, failed, total: subscribers.length };
    } catch (error) {
        return { sent: 0, failed: 0, total: 0, error };
    }
}

