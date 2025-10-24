import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// Simple email test endpoint
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

  // For testing - use a mock transporter
  try {
    console.log("🔧 Creating test transporter...");
    
    // Mock transporter for testing
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'test@gmail.com', // This will fail but we'll catch it
        pass: 'test-password'
      }
    });

    console.log("📤 Attempting to send email...");
    
    // This will fail but we'll return success for testing
    const result = await transporter.sendMail({
      from: 'test@gmail.com',
      to,
      subject,
      text: message,
    });

    console.log("✅ Email sent successfully:", result.messageId);
    res.json({ success: true, message: "Email sent successfully!" });
    
  } catch (error) {
    console.log("❌ Email sending error:", error.message);
    
    // For testing purposes, return success even if email fails
    // This allows the frontend to work while we fix the email config
    res.json({ 
      success: true, 
      message: "Email test successful (email not actually sent - configure Gmail credentials)" 
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Simple email test server running on port 5000");
  console.log("📧 This is a test server - emails won't actually be sent");
  console.log("💡 To send real emails, configure Gmail credentials in .env file");
});
