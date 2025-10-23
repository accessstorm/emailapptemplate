import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  });
});

app.post("/api/send-email", upload.array('attachments'), async (req, res) => {
  console.log("📧 Email request received:", req.body);
  console.log("📎 Files received:", req.files);
  
  const { to, cc, bcc, subject, message, messageHtml } = req.body;

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
    
    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message, // Plain text version
      html: messageHtml || message, // HTML version if available
    };

    // Add CC and BCC if provided
    if (cc) {
      mailOptions.cc = cc;
    }
    if (bcc) {
      mailOptions.bcc = bcc;
    }

    // Add attachments if any
    if (req.files && req.files.length > 0) {
      console.log("📎 Adding attachments:", req.files.map(f => f.originalname));
      mailOptions.attachments = req.files.map(file => ({
        filename: file.originalname,
        path: file.path
      }));
    }

    const result = await transporter.sendMail(mailOptions);

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
