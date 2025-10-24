import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Testing Gmail Credentials");
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Missing");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log("❌ Missing credentials in .env file");
  console.log("💡 Create a .env file with:");
  console.log("   EMAIL_USER=your-email@gmail.com");
  console.log("   EMAIL_PASS=your-app-password");
  process.exit(1);
}

async function testGmailCredentials() {
  try {
    console.log("🔄 Creating transporter...");
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("🔄 Verifying connection...");
    await transporter.verify();
    console.log("✅ SUCCESS: Gmail credentials are working!");
    console.log("📧 You can now send emails from your application.");
    
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    
    if (error.message.includes("Invalid login")) {
      console.log("\n💡 SOLUTION:");
      console.log("1. Make sure you're using an App Password, not your regular Gmail password");
      console.log("2. Enable 2-Factor Authentication on your Gmail account");
      console.log("3. Generate a new App Password:");
      console.log("   - Go to Google Account → Security → App passwords");
      console.log("   - Generate password for 'Mail'");
      console.log("   - Use this password in your .env file");
    } else if (error.message.includes("Less secure app")) {
      console.log("\n💡 SOLUTION:");
      console.log("1. Enable 2-Factor Authentication on your Gmail account");
      console.log("2. Use App Password instead of regular password");
      console.log("3. Don't use 'Less secure app access' - it's deprecated");
    } else if (error.message.includes("2-Step Verification")) {
      console.log("\n💡 SOLUTION:");
      console.log("1. Enable 2-Factor Authentication on your Gmail account");
      console.log("2. Generate an App Password for 'Mail'");
      console.log("3. Use the App Password in your .env file");
    } else {
      console.log("\n💡 GENERAL SOLUTION:");
      console.log("1. Check your EMAIL_USER is your full Gmail address");
      console.log("2. Check your EMAIL_PASS is correct");
      console.log("3. Make sure 2-Factor Authentication is enabled");
      console.log("4. Use App Password, not regular password");
    }
  }
}

testGmailCredentials();
