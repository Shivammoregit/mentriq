const nodemailer = require("nodemailer");

const sendEnrollmentEmail = async (toEmail, userName, courseTitle) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // support@mentriqtechnologies.in
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"MentriQ Technologies" <${process.env.SMTP_USER || "support@mentriqtechnologies.in"}>`,
            to: toEmail,
            subject: `Enrollment Confirmation: ${courseTitle}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #4f46e5; text-align: center;">Welcome to MentriQ Technologies!</h2>
                <p>Dear <strong>${userName}</strong>,</p>
                <p>Congratulations! You have successfully enrolled in the course: <strong>${courseTitle}</strong>.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #374151;">
                        Kindly visit to our office or contact our team for further process.
                    </p>
                </div>
                <p>If you have any questions, feel free to reply to this email or reach out to our support team.</p>
                <br>
                <p>Best Regards,</p>
                <p><strong>Team MentriQ Technologies</strong></p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                    support@mentriqtechnologies.in | MentriQ Technologies Office
                </p>
            </div>
        `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Enrollment email sent to ${toEmail}`);
    } catch (error) {
        console.error("EMAIL SEND ERROR 👉", error);
    }
};

const sendBroadcastEmail = async (bccEmails, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"MentriQ Technologies" <${process.env.SMTP_USER || "support@mentriqtechnologies.in"}>`,
            bcc: bccEmails.join(','),
            subject,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #4f46e5; text-align: center;">MentriQ Team Broadcast</h2>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; color: #334155; font-size: 15px; line-height: 1.6;">
                    ${message.replace(/\n/g, '<br/>')}
                </div>
                <br>
                <p>Best Regards,</p>
                <p><strong>Team MentriQ Technologies</strong></p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                    support@mentriqtechnologies.in | MentriQ Technologies Office
                </p>
            </div>
        `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Broadcast email sent to ${bccEmails.length} recipients`);
    } catch (error) {
        console.error("BROADCAST EMAIL SEND ERROR 👉", error);
        throw error;
    }
};

module.exports = { sendEnrollmentEmail, sendBroadcastEmail };
