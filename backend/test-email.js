import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testEmailConnection() {
  console.log("🔍 Testing email connection...");
  console.log("📧 Email User:", process.env.EMAIL_USER);
  console.log("🔑 App Password:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("❌ Error: Missing EMAIL_USER or EMAIL_PASS in .env file");
    console.log("📝 Please create a .env file with your Gmail credentials");
    return;
  }

  try {
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("🔄 Verifying connection...");
    await transporter.verify();
    console.log("✅ Email connection successful!");
    console.log("📤 You can now send emails from:", process.env.EMAIL_USER);
    
  } catch (error) {
    console.log("❌ Email connection failed:");
    console.log("Error:", error.message);
    
    if (error.message.includes("Invalid login")) {
      console.log("💡 Solution: Check your App Password and make sure 2FA is enabled");
    } else if (error.message.includes("Less secure app")) {
      console.log("💡 Solution: Use App Passwords instead of regular password");
    }
  }
}

testEmailConnection();
