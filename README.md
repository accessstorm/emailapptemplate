# Email System

A modern email system with a React frontend and Node.js backend, featuring a Gmail-like compose interface.

## Features

- 🎨 **Modern UI**: Clean, minimalistic design with yellow accent color
- 📱 **Responsive**: Works on desktop and mobile devices
- ✉️ **Gmail-like Interface**: Floating compose button with modal
- 🔒 **Secure**: Uses Gmail App Passwords for authentication
- ⚡ **Fast**: Built with Vite for lightning-fast development

## Project Structure

```
email-system/
├─ backend/
│  ├─ server.js          # Express server with email endpoint
│  ├─ package.json       # Backend dependencies
│  └─ README.md          # Backend setup instructions
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  └─ ComposeModal.jsx  # Main compose component
│  │  ├─ App.jsx         # Main app component
│  │  └─ main.jsx        # React entry point
│  ├─ index.html         # HTML template
│  ├─ package.json       # Frontend dependencies
│  └─ vite.config.js     # Vite configuration
└─ README.md             # This file
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
```

**Important**: Get your Gmail App Password from [Google App Passwords](https://myaccount.google.com/apppasswords)

Start the backend server:
```bash
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Open the application in your browser
2. Click the yellow "✉️ Compose" button in the bottom-right corner
3. Fill in the recipient email, subject, and message
4. Click "Send" to send the email
5. The system will show a success/failure status

## API Endpoints

### POST /api/send-email

Sends an email using Nodemailer.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "message": "Email content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully!"
}
```

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Nodemailer** - Email sending library
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Customization

### Changing the Accent Color

The system uses a yellow accent color (`#ffda03`). To change it:

1. Update the `style` attributes in `ComposeModal.jsx`
2. Update the Tailwind classes from `yellow-*` to your preferred color
3. Update the focus ring colors in the input fields

### Adding More Features

- Email templates
- File attachments
- Email history
- Multiple email providers
- Email validation
- Rich text editor

## Troubleshooting

### Common Issues

1. **"Failed to send email" error**
   - Check your Gmail App Password
   - Ensure 2FA is enabled on your Gmail account
   - Verify the EMAIL_USER and EMAIL_PASS in .env

2. **CORS errors**
   - Make sure the backend is running on port 5000
   - Check that the frontend is making requests to the correct URL

3. **Connection refused**
   - Ensure both frontend and backend servers are running
   - Check that no other process is using port 5000

## License

MIT License - feel free to use this project for personal or commercial purposes.
