const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_RECEIVER, 
            subject: `Portfolio - Message from ${name}`,
            text: message,
        });

        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("An error occurred while sending the email.");
    }
};

module.exports = { sendEmail };