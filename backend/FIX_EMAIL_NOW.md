# 🚨 URGENT: Fix Email Sending Issue

## ❌ Current Problem
Your email system is failing with: **`Invalid login: 535-5.7.8 Username and Password not accepted`**

This means your Gmail credentials in the `.env` file are incorrect or not properly configured.

## ✅ SOLUTION - Follow These Steps EXACTLY:

### Step 1: Check Your .env File
Make sure you have a `.env` file in the `backend` folder with:
```env
EMAIL_USER=your-full-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Step 2: Gmail Account Setup (CRITICAL)
1. **Go to your Google Account**: https://myaccount.google.com/
2. **Click "Security"** in the left sidebar
3. **Enable 2-Step Verification** (if not already enabled)
4. **Go to "App passwords"** section
5. **Generate a new app password**:
   - Select "Mail" as the app
   - Copy the 16-character password (like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Replace your current `.env` file content with:
```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=the-16-character-app-password-from-step-2
```

### Step 4: Test Your Credentials
Run this command to test:
```bash
cd backend
node test-gmail-credentials.js
```

### Step 5: Restart Server
After updating .env:
```bash
cd backend
npm start
```

## 🔍 Common Mistakes:
- ❌ Using your regular Gmail password
- ❌ Not enabling 2-Factor Authentication
- ❌ Using wrong email format
- ❌ Not copying the app password correctly

## ✅ Correct Format:
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## 🧪 Test Commands:
```bash
# Test credentials
cd backend
node test-gmail-credentials.js

# Check server health
curl http://localhost:5000/api/health
```

## 📞 If Still Not Working:
1. Double-check your Gmail account has 2FA enabled
2. Generate a NEW app password
3. Make sure no spaces in EMAIL_USER
4. Make sure EMAIL_PASS is exactly 16 characters
5. Restart your server after changes

The error `535-5.7.8` specifically means Gmail is rejecting your login credentials.
