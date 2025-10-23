# Gmail Setup Guide

## Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process
4. **Required** for App Passwords

## Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other (Custom name)" as device
4. Enter name: "Email System"
5. Click "Generate"
6. **Copy the 16-character password**

## Step 3: Create .env File
Create a file named `.env` in the backend directory with:

```
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

**Important Notes:**
- Use your regular Gmail address (the one you want emails to come FROM)
- Use the App Password (not your regular Gmail password)
- Remove spaces from the App Password when copying
- No quotes needed around the values

## Step 4: Test the Setup
Run the backend server and check the console for any connection errors.

## Troubleshooting

### "Invalid login" error:
- Make sure 2FA is enabled
- Verify you're using the App Password, not regular password
- Check that there are no extra spaces in the .env file

### "Less secure app access" error:
- This is normal - use App Passwords instead
- App Passwords are more secure than "less secure apps"

### Connection timeout:
- Check your internet connection
- Verify Gmail settings allow the connection
- Try again after a few minutes
