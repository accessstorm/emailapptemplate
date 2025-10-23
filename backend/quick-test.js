import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Quick Gmail Test");
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log("❌ Missing credentials in .env file");
  process.exit(1);
}

async function quickTest() {
  try {
    console.log("🔄 Creating transporter...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("🔄 Verifying connection...");
    await transporter.verify();
    console.log("✅ SUCCESS: Gmail connection works!");
    
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    
    if (error.message.includes("Invalid login")) {
      console.log("💡 Fix: Check your App Password");
    } else if (error.message.includes("Less secure app")) {
      console.log("💡 Fix: Use App Password, not regular password");
    } else if (error.message.includes("2-Step Verification")) {
      console.log("💡 Fix: Enable 2FA on your Gmail account");
    }
  }
}

quickTest();
