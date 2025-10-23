import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/send-email", async (req, res) => {
  console.log("📧 Email request received:", req.body);
  
  const { to, subject, message } = req.body;

  // Validate required fields
  if (!to || !subject || !message) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields" 
    });
  }

  console.log("🔧 Creating transporter...");
  console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
  console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Missing");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("🔄 Verifying connection...");
    await transporter.verify();
    console.log("✅ Connection verified");

    console.log("📤 Sending email...");
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    console.log("✅ Email sent successfully:", result.messageId);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ ERROR DETAILS:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email.",
      error: error.message 
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
  console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
  console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Missing");
});
