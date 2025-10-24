import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/email-system';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Sent Email Schema
const sentEmailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  cc: { type: String, default: '' },
  bcc: { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  messageHtml: { type: String, default: '' },
  attachments: [{
    name: String,
    size: Number,
    path: String
  }],
  sentAt: { type: Date, default: Date.now },
  status: { type: String, default: 'sent' }
});

const SentEmail = mongoose.model('SentEmail', sentEmailSchema);

// Bypass email sending - just save to database
app.post("/api/send-email", async (req, res) => {
  console.log("📧 Email request received (BYPASS MODE):", req.body);
  
  const { to, cc, bcc, subject, message, messageHtml, draftId } = req.body;

  // Validate required fields
  if (!to || !subject || !message) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields: to, subject, message" 
    });
  }

  try {
    console.log("💾 Saving email to database (BYPASS MODE)");
    
    // Save sent email to database
    const sentEmail = new SentEmail({
      to, cc, bcc, subject, message, messageHtml,
      attachments: []
    });
    await sentEmail.save();
    console.log("✅ Email saved to database:", sentEmail._id);
    
    res.json({ 
      success: true, 
      message: "Email saved successfully! (BYPASS MODE - No actual email sent)",
      emailId: sentEmail._id
    });
    
  } catch (error) {
    console.error("❌ Error saving email:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save email.",
      error: error.message 
    });
  }
});

// Get sent emails
app.get("/api/sent-emails", async (req, res) => {
  try {
    const sentEmails = await SentEmail.find().sort({ sentAt: -1 });
    res.json({ success: true, sentEmails });
  } catch (error) {
    console.error("❌ Error fetching sent emails:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sent emails" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server running in BYPASS MODE",
    mode: "BYPASS - Emails saved to database only"
  });
});

app.listen(5000, () => {
  console.log("🚀 BYPASS Server running on port 5000");
  console.log("📧 Emails will be saved to database but NOT actually sent");
  console.log("💡 This allows you to test the email system without Gmail setup");
});
