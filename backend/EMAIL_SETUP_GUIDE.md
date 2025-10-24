# Email System Setup Guide

## 🚨 CRITICAL: Email Configuration Required

Your email system cannot send emails because the email credentials are not configured.

## 📧 Step 1: Create .env File

Create a file named `.env` in the `backend` folder with the following content:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# MongoDB Configuration (optional)
MONGODB_URI=mongodb://localhost:27017/email-system
```

## 🔐 Step 2: Gmail Setup

### Option A: App Password (Recommended)
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to "App passwords" section
4. Generate a new app password for "Mail"
5. Use this app password in your `.env` file

### Option B: Less Secure Apps (Not Recommended)
1. Go to Google Account settings
2. Turn on "Less secure app access"
3. Use your regular Gmail password

## 🧪 Step 3: Test Configuration

Run the test script to verify your setup:

```bash
cd backend
node quick-test.js
```

## 🔍 Step 4: Check Server Status

Visit: `http://localhost:5000/api/health`

This will show you if your email is properly configured.

## 🚀 Step 5: Start the Server

```bash
cd backend
npm start
```

## ❌ Common Issues

### "Invalid login" Error
- Check your app password is correct
- Make sure 2FA is enabled
- Verify EMAIL_USER is your full Gmail address

### "Less secure app" Error
- Use App Password instead of regular password
- Enable 2-Factor Authentication

### "Missing credentials" Error
- Check your `.env` file exists
- Verify EMAIL_USER and EMAIL_PASS are set
- Restart the server after creating `.env`

## 📝 Example .env File

```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
MONGODB_URI=mongodb://localhost:27017/email-system
```

## 🔧 Troubleshooting

1. **Check server logs** for error messages
2. **Verify .env file** is in the correct location (backend folder)
3. **Test connection** using the quick-test.js script
4. **Restart server** after making changes to .env

## 📞 Need Help?

If you're still having issues:
1. Check the server console for error messages
2. Verify your Gmail account settings
3. Make sure the .env file is properly formatted (no spaces around =)
4. Try generating a new app password
