import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('🔍 Email Configuration Debug\n');

// Check environment variables
console.log('Environment Variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('\n❌ Missing email credentials!');
  console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
  process.exit(1);
}

// Test transporter creation
console.log('\n🔧 Testing transporter creation...');
try {
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  console.log('✅ Transporter created successfully');
  
  // Test connection
  console.log('\n🔄 Testing connection...');
  transporter.verify()
    .then(() => {
      console.log('✅ Email connection verified successfully');
      console.log('\n🎉 Email configuration is working!');
    })
    .catch((error) => {
      console.log('❌ Email connection failed:', error.message);
      console.log('\n💡 Common issues:');
      console.log('- Check if EMAIL_USER and EMAIL_PASS are correct');
      console.log('- Make sure 2-factor authentication is enabled');
      console.log('- Use an App Password instead of your regular password');
      console.log('- Check if "Less secure app access" is enabled (if using regular password)');
    });
    
} catch (error) {
  console.log('❌ Failed to create transporter:', error.message);
}
