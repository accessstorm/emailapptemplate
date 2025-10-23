import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  });
});

app.post("/api/send-email", async (req, res) => {
  console.log("📧 Email request received:", req.body);
  
  const { to, subject, message } = req.body;

  // Validate required fields
  if (!to || !subject || !message) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields: to, subject, message" 
    });
  }

  // Check environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("❌ Missing environment variables");
    return res.status(500).json({ 
      success: false, 
      message: "Server configuration error: Missing email credentials" 
    });
  }

  console.log("🔧 Creating transporter with user:", process.env.EMAIL_USER);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("🔄 Verifying transporter connection...");
    await transporter.verify();
    console.log("✅ Transporter verified successfully");

    console.log("📤 Sending email to:", to);
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    console.log("✅ Email sent successfully:", result.messageId);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email.",
      error: error.message 
    });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
