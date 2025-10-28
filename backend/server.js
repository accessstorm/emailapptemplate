import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads - use memory storage for MongoDB integration
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, but you can restrict if needed
    cb(null, true);
  }
});

// Configure multer for media uploads (images/videos) - use disk storage for public access
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || "";
    const safeName = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9_\-]/gi, "_")
      .toLowerCase();
    cb(null, `${timestamp}-${safeName}${ext}`);
  }
});

const mediaUpload = multer({
  storage: mediaStorage,
  limits: { 
    fileSize: 20 * 1024 * 1024 // 20MB limit for media files
  },
  fileFilter: (req, file, cb) => {
    const isImageOrVideo = /^(image|video)\//.test(file.mimetype);
    if (isImageOrVideo) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"), false);
    }
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/email-system';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('💡 Please install MongoDB or use MongoDB Atlas');
  console.log('💡 For now, drafts will be stored in memory (temporary)');
});

// Draft Schema
const draftSchema = new mongoose.Schema({
  userId: { type: String, default: 'default-user' },
  to: String,
  cc: String,
  bcc: String,
  subject: String,
  message: String,
  messageHtml: String,
  attachments: [{
    name: String,
    size: Number,
    path: String
  }],
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  status: { type: String, default: 'draft' }
});

const Draft = mongoose.model('Draft', draftSchema);

// Client Schema
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  lastContact: { type: Date, default: Date.now }
});

const Client = mongoose.model('Client', clientSchema);

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
    path: String,
    data: Buffer, // Store file data in MongoDB
    contentType: String
  }],
  labels: [{ type: String }], // Array of label IDs
  sentAt: { type: Date, default: Date.now },
  status: { type: String, default: 'sent' }
});

const SentEmail = mongoose.model('SentEmail', sentEmailSchema);

// Create indexes for better performance
const createIndexes = async () => {
  try {
    await Draft.createIndexes([
      { userId: 1, lastModified: -1 },
      { status: 1, lastModified: -1 }
    ]);
    
    await Client.createIndexes([
      { email: 1 },
      { createdAt: -1 }
    ]);
    
    await SentEmail.createIndexes([
      { sentAt: -1 },
      { to: 1 },
      { status: 1 }
    ]);
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

// Create indexes after connection
mongoose.connection.once('open', createIndexes);

// Fallback in-memory storage for drafts when MongoDB is not available
let inMemoryDrafts = [];
let draftIdCounter = 1;

// Fallback in-memory storage for clients when MongoDB is not available
let inMemoryClients = [];
let clientIdCounter = 1;

// Fallback in-memory storage for sent emails when MongoDB is not available
let inMemorySentEmails = [];
let sentEmailIdCounter = 1;

// Rate limiting
const rateLimiter = new Map();
const RATE_LIMIT = 10; // emails per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

const checkRateLimit = (userId) => {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Please wait before sending more emails.');
  }
  
  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);
};

// Data cleanup function
const cleanupOldDrafts = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await Draft.deleteMany({ 
      lastModified: { $lt: thirtyDaysAgo },
      status: 'draft' 
    });
    console.log(`🧹 Cleaned up ${result.deletedCount} old drafts`);
  } catch (error) {
    console.error('❌ Error cleaning up old drafts:', error);
  }
};

// Run cleanup every 24 hours
setInterval(cleanupOldDrafts, 24 * 60 * 60 * 1000);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
  res.json({ 
    status: "OK", 
    message: "Server is running",
    emailConfigured,
    emailUser: process.env.EMAIL_USER ? "Set" : "Missing",
    emailPass: process.env.EMAIL_PASS ? "Set" : "Missing",
    instructions: emailConfigured ? "Email is configured" : "Please set EMAIL_USER and EMAIL_PASS in .env file"
  });
});

// Test endpoint for media upload
app.get("/api/media/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Media upload endpoint is working",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/send-email", upload.array('attachments'), async (req, res) => {
  
  // Handle multer errors
  if (req.fileValidationError) {
    return res.status(400).json({ 
      success: false, 
      message: req.fileValidationError 
    });
  }
  
  const { to, cc, bcc, subject, message, messageHtml, draftId } = req.body;
  const userId = 'default-user'; // In a real app, this would come from authentication

  // Check rate limit
  try {
    checkRateLimit(userId);
  } catch (error) {
    return res.status(429).json({
      success: false,
      message: error.message
    });
  }

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
    console.log("💡 Please create a .env file with EMAIL_USER and EMAIL_PASS");
    return res.status(500).json({ 
      success: false, 
      message: "Server configuration error: Missing email credentials. Please check your .env file." 
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
      // Add timeout and connection settings for faster sending
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,    // 5 seconds
      socketTimeout: 10000,     // 10 seconds
      pool: true,               // Use connection pooling
      maxConnections: 1,        // Limit connections
      maxMessages: 1,           // Limit messages per connection
    });

    console.log("🔄 Verifying transporter connection...");
    await transporter.verify();
    console.log("✅ Transporter verified successfully");
    
    // Store the transporter globally to reuse it
    global.transporter = transporter;

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
      mailOptions.attachments = req.files.map(file => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      }));
    }

    // Add timeout to email sending
    const sendEmailWithTimeout = (transporter, mailOptions) => {
      return Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email sending timeout after 30 seconds')), 30000)
        )
      ]);
    };

    const result = await sendEmailWithTimeout(global.transporter, mailOptions);

    console.log("✅ Email sent successfully:", result.messageId);
    
    // Only save to database AFTER email is successfully sent
    try {
      const sentEmail = new SentEmail({
        to, cc, bcc, subject, message, messageHtml,
        attachments: req.files ? req.files.map(f => ({
          name: f.originalname,
          size: f.size,
          path: '', // No file path since using memory storage
          data: f.buffer, // Store file data
          contentType: f.mimetype
        })) : []
      });
      await sentEmail.save();
      console.log("💾 Sent email saved to database:", sentEmail._id);
    } catch (error) {
      console.error("❌ Error saving sent email:", error);
      // Don't fail the email send if saving fails
    }
    
    // If this was sent from a draft, delete the draft
    if (draftId) {
      try {
        await Draft.findByIdAndDelete(draftId);
        console.log("🗑️ Draft deleted after sending:", draftId);
      } catch (error) {
        console.error("❌ Error deleting draft:", error);
        // Don't fail the email send if draft deletion fails
      }
    }
    
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending error:", error);
    
    let errorMessage = "Failed to send email.";
    let userMessage = "Please check your email configuration.";
    
    if (error.message.includes("Invalid login")) {
      errorMessage = "Gmail authentication failed";
      userMessage = "Please check your EMAIL_USER and EMAIL_PASS in .env file. Use App Password, not regular password.";
    } else if (error.message.includes("Less secure app")) {
      errorMessage = "Gmail security settings issue";
      userMessage = "Enable 2-Factor Authentication and use App Password instead of regular password.";
    } else if (error.message.includes("2-Step Verification")) {
      errorMessage = "2-Factor Authentication required";
      userMessage = "Enable 2-Factor Authentication on your Gmail account and generate an App Password.";
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      userMessage: userMessage,
      error: error.message 
    });
  }
});

// Draft API endpoints
app.get("/api/drafts", async (req, res) => {
  try {
    // Try MongoDB first
    const drafts = await Draft.find({ status: 'draft' }).sort({ lastModified: -1 });
    res.json({ success: true, drafts });
  } catch (error) {
    console.error("❌ Error fetching drafts from MongoDB:", error);
    // Fallback to in-memory storage
    console.log("📝 Using in-memory storage for drafts");
    res.json({ success: true, drafts: inMemoryDrafts });
  }
});

app.post("/api/drafts", async (req, res) => {
  try {
    const { to, cc, bcc, subject, message, messageHtml, attachments } = req.body;
    const draft = new Draft({
      to, cc, bcc, subject, message, messageHtml, attachments
    });
    await draft.save();
    res.json({ success: true, draft });
  } catch (error) {
    console.error("❌ Error creating draft in MongoDB:", error);
    // Fallback to in-memory storage
    console.log("📝 Creating draft in memory");
    const draft = {
      _id: `draft_${draftIdCounter++}`,
      to, cc, bcc, subject, message, messageHtml, attachments,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft'
    };
    inMemoryDrafts.push(draft);
    res.json({ success: true, draft });
  }
});

app.put("/api/drafts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { to, cc, bcc, subject, message, messageHtml, attachments } = req.body;
    
    const draft = await Draft.findByIdAndUpdate(
      id,
      { 
        to, cc, bcc, subject, message, messageHtml, attachments,
        lastModified: new Date()
      },
      { new: true }
    );
    
    if (!draft) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }
    
    res.json({ success: true, draft });
  } catch (error) {
    console.error("❌ Error updating draft in MongoDB:", error);
    // Fallback to in-memory storage
    console.log("📝 Updating draft in memory");
    const draftIndex = inMemoryDrafts.findIndex(d => d._id === id);
    if (draftIndex === -1) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }
    
    inMemoryDrafts[draftIndex] = {
      ...inMemoryDrafts[draftIndex],
      to, cc, bcc, subject, message, messageHtml, attachments,
      lastModified: new Date()
    };
    
    res.json({ success: true, draft: inMemoryDrafts[draftIndex] });
  }
});

app.delete("/api/drafts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await Draft.findByIdAndDelete(id);
    
    if (!draft) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }
    
    res.json({ success: true, message: "Draft deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting draft from MongoDB:", error);
    // Fallback to in-memory storage
    console.log("📝 Deleting draft from memory");
    const draftIndex = inMemoryDrafts.findIndex(d => d._id === id);
    if (draftIndex === -1) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }
    
    inMemoryDrafts.splice(draftIndex, 1);
    res.json({ success: true, message: "Draft deleted successfully" });
  }
});

app.get("/api/drafts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await Draft.findById(id);
    
    if (!draft) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }
    
    res.json({ success: true, draft });
  } catch (error) {
    console.error("❌ Error fetching draft:", error);
    res.status(500).json({ success: false, message: "Failed to fetch draft" });
  }
});

// Auto-save draft endpoint
app.put("/api/drafts/autosave", async (req, res) => {
  try {
    const { draftId, to, cc, bcc, subject, message, messageHtml, attachments } = req.body;
    
    if (draftId) {
      // Update existing draft
      const draft = await Draft.findByIdAndUpdate(
        draftId,
        { 
          to, cc, bcc, subject, message, messageHtml, attachments,
          lastModified: new Date()
        },
        { new: true }
      );
      res.json({ success: true, draft });
    } else {
      // Create new draft if there's content
      if (to || subject || message) {
        const draft = new Draft({
          to, cc, bcc, subject, message, messageHtml, attachments
        });
        await draft.save();
        res.json({ success: true, draft });
      } else {
        res.json({ success: true, message: "No content to save" });
      }
    }
  } catch (error) {
    console.error("❌ Error auto-saving draft:", error);
    res.status(500).json({ success: false, message: "Failed to auto-save draft" });
  }
});

// Client API endpoints
app.get("/api/clients", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (error) {
    console.error("❌ Error fetching clients from MongoDB:", error);
    // Fallback to in-memory storage
    console.log("👥 Using in-memory storage for clients");
    res.json({ success: true, clients: inMemoryClients });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const { name, email, company } = req.body;
    
    // Check if client with this email already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ 
        success: false, 
        message: "Client with this email already exists" 
      });
    }
    
    const client = new Client({ name, email, company });
    await client.save();
    res.json({ success: true, client });
  } catch (error) {
    console.error("❌ Error creating client in MongoDB:", error);
    // Fallback to in-memory storage
    console.log("👥 Creating client in memory");
    const { name, email, company } = req.body;
    
    // Check if client with this email already exists in memory
    const existingClient = inMemoryClients.find(c => c.email === email);
    if (existingClient) {
      return res.status(400).json({ 
        success: false, 
        message: "Client with this email already exists" 
      });
    }
    
    const client = {
      _id: `client_${clientIdCounter++}`,
      name, email, company,
      createdAt: new Date(),
      lastContact: new Date()
    };
    inMemoryClients.push(client);
    res.json({ success: true, client });
  }
});

app.put("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, company } = req.body;
    
    const client = await Client.findByIdAndUpdate(
      id,
      { name, email, company, lastContact: new Date() },
      { new: true }
    );
    
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    
    res.json({ success: true, client });
  } catch (error) {
    console.error("❌ Error updating client in MongoDB:", error);
    // Fallback to in-memory storage
    console.log("👥 Updating client in memory");
    const { id } = req.params;
    const { name, email, company } = req.body;
    
    const clientIndex = inMemoryClients.findIndex(c => c._id === id);
    if (clientIndex === -1) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    
    inMemoryClients[clientIndex] = {
      ...inMemoryClients[clientIndex],
      name, email, company,
      lastContact: new Date()
    };
    
    res.json({ success: true, client: inMemoryClients[clientIndex] });
  }
});

app.delete("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting client from MongoDB:", error);
    // Fallback to in-memory storage
    console.log("👥 Deleting client from memory");
    const { id } = req.params;
    
    const clientIndex = inMemoryClients.findIndex(c => c._id === id);
    if (clientIndex === -1) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    
    inMemoryClients.splice(clientIndex, 1);
    res.json({ success: true, message: "Client deleted successfully" });
  }
});

// Sent Emails API endpoints
app.get("/api/sent-emails", async (req, res) => {
  try {
    const sentEmails = await SentEmail.find().sort({ sentAt: -1 });
    console.log("📤 Fetched sent emails from MongoDB:", sentEmails.map(e => ({ id: e._id, labels: e.labels })));
    res.json({ success: true, sentEmails });
  } catch (error) {
    console.error("❌ Error fetching sent emails from MongoDB:", error);
    // Fallback to in-memory storage
    console.log("📤 Using in-memory storage for sent emails");
    res.json({ success: true, sentEmails: inMemorySentEmails });
  }
});

app.get("/api/sent-emails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sentEmail = await SentEmail.findById(id);
    
    if (!sentEmail) {
      return res.status(404).json({ success: false, message: "Sent email not found" });
    }
    
    res.json({ success: true, sentEmail });
  } catch (error) {
    console.error("❌ Error fetching sent email:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sent email" });
  }
});

app.delete("/api/sent-emails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sentEmail = await SentEmail.findByIdAndDelete(id);
    
    if (!sentEmail) {
      return res.status(404).json({ success: false, message: "Sent email not found" });
    }
    
    res.json({ success: true, message: "Sent email deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting sent email from MongoDB:", error);
    // Fallback to in-memory storage
    console.log("📤 Deleting sent email from memory");
    const { id } = req.params;
    
    const sentEmailIndex = inMemorySentEmails.findIndex(e => e._id === id);
    if (sentEmailIndex === -1) {
      return res.status(404).json({ success: false, message: "Sent email not found" });
    }
    
    inMemorySentEmails.splice(sentEmailIndex, 1);
    res.json({ success: true, message: "Sent email deleted successfully" });
  }
});

// Update email labels
app.put("/api/sent-emails/:id/labels", async (req, res) => {
  try {
    const { id } = req.params;
    const { labels } = req.body;
    
    const sentEmail = await SentEmail.findByIdAndUpdate(
      id,
      { labels: labels || [] },
      { new: true }
    );
    
    if (!sentEmail) {
      return res.status(404).json({ success: false, message: "Sent email not found" });
    }
    
    res.json({ success: true, sentEmail });
  } catch (error) {
    console.error("❌ Error updating email labels:", error);
    res.status(500).json({ success: false, message: "Failed to update labels" });
  }
});

// Serve attachments from MongoDB
app.get("/api/attachments/:emailId/:attachmentIndex", async (req, res) => {
  try {
    const { emailId, attachmentIndex } = req.params;
    const sentEmail = await SentEmail.findById(emailId);
    
    if (!sentEmail || !sentEmail.attachments || !sentEmail.attachments[attachmentIndex]) {
      return res.status(404).json({ success: false, message: "Attachment not found" });
    }
    
    const attachment = sentEmail.attachments[attachmentIndex];
    
    // Set appropriate headers
    res.set({
      'Content-Type': attachment.contentType || 'application/octet-stream',
      'Content-Length': attachment.size,
      'Content-Disposition': `inline; filename="${attachment.name}"`
    });
    
    // Send the file data
    res.send(attachment.data);
  } catch (error) {
    console.error("❌ Error serving attachment:", error);
    res.status(500).json({ success: false, message: "Error serving attachment" });
  }
});

// Media upload endpoint for Visual Editor (images/videos)
app.post("/api/media/upload", (req, res) => {
  console.log("📁 Media upload request received");
  
  mediaUpload.single("file")(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        console.error("❌ Multer error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "File upload error"
        });
      }
      
      if (!req.file) {
        console.log("❌ No file uploaded");
        return res.status(400).json({ 
          success: false, 
          message: "No file uploaded" 
        });
      }

      // Generate public URL
      const publicUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      
      console.log("📁 Media uploaded successfully:", {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: publicUrl
      });

      res.json({ 
        success: true, 
        url: publicUrl,
        mimetype: req.file.mimetype,
        name: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename
      });
    } catch (error) {
      console.error("❌ Media upload error:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message || "Upload failed" 
      });
    }
  });
});

// Form Submission Schema - to store responses from email forms
const formSubmissionSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible field for any form data
  submitterEmail: { type: String },
  submitterName: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

// API endpoint to handle form submissions from emails
app.post("/api/form-submission", express.urlencoded({ extended: true }), async (req, res) => {
  try {
    console.log("📝 Form submission received:", req.body);
    
    const { formId, ...formData } = req.body;
    
    // Extract email and name if present
    const submitterEmail = formData.email || formData.your_email || '';
    const submitterName = formData.name || formData.your_name || '';
    
    // Get IP and User Agent
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    // Check if MongoDB is available
    if (mongoose.connection.readyState === 1) {
      // Save to MongoDB
      const submission = new FormSubmission({
        formId,
        data: formData,
        submitterEmail,
        submitterName,
        ipAddress,
        userAgent
      });
      
      await submission.save();
      console.log("✅ Form submission saved to database");
    } else {
      // Fallback: just log it
      console.log("⚠️ MongoDB not available, logging submission:");
      console.log(JSON.stringify({ formId, formData, submitterEmail, submitterName }, null, 2));
    }
    
    // Send a success response (HTML page)
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 500px;
          }
          .success-icon {
            font-size: 64px;
            color: #28a745;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 10px;
          }
          p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .btn {
            display: inline-block;
            padding: 12px 30px;
            background-color: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            transition: background-color 0.3s;
          }
          .btn:hover {
            background-color: #5568d3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✓</div>
          <h1>Thank You!</h1>
          <p>Your response has been submitted successfully. We'll get back to you soon.</p>
          <a href="javascript:window.close()" class="btn">Close Window</a>
        </div>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error("❌ Error handling form submission:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #f4f4f4;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
          }
          .error-icon {
            font-size: 64px;
            color: #dc3545;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 10px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">✕</div>
          <h1>Oops!</h1>
          <p>There was an error submitting your response. Please try again later.</p>
        </div>
      </body>
      </html>
    `);
  }
});

// API endpoint to get form submissions (for viewing responses)
app.get("/api/form-submissions", async (req, res) => {
  try {
    const { formId } = req.query;
    
    if (mongoose.connection.readyState === 1) {
      const query = formId ? { formId } : {};
      const submissions = await FormSubmission.find(query).sort({ submittedAt: -1 });
      
      res.json({ 
        success: true, 
        submissions,
        count: submissions.length
      });
    } else {
      res.status(503).json({ 
        success: false, 
        message: "Database not available" 
      });
    }
  } catch (error) {
    console.error("❌ Error fetching form submissions:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching form submissions" 
    });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
