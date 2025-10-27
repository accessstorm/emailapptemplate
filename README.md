# 📧 Professional Email Management System

A modern, full-stack email client built with React and Node.js, designed specifically for agencies and professional use. Features a clean interface, advanced email management, and powerful template system.

## ✨ Features

### 🎯 Core Email Management
- **Compose & Send Emails** - Rich text editor with HTML support
- **Draft Management** - Auto-save drafts with manual save/load
- **Client Management** - Store and manage client contacts
- **Sent Email Tracking** - View all sent emails with full history
- **Attachment Support** - Upload and manage file attachments
- **Email Templates** - 8 professional agency templates + custom templates

### 🏷️ Advanced Labeling System
- **Smart Labels** - Work, Personal, Important, Newsletters
- **Real-time Filtering** - Filter emails by labels instantly
- **Persistent Storage** - Labels saved to database
- **Visual Indicators** - Color-coded labels with counts
- **Bulk Operations** - Select multiple emails for batch operations

### 📝 Professional Email Templates
- **Client Proposal** - Professional project proposals
- **Project Kickoff** - Welcome emails for new projects
- **Invoice Reminder** - Payment reminder templates
- **Project Update** - Weekly status updates
- **Contract Renewal** - Business renewal offers
- **Feedback Request** - Customer satisfaction surveys
- **Meeting Invitation** - Professional meeting scheduling
- **Project Completion** - Project delivery celebrations
- **Custom Templates** - Create your own HTML templates

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Professional color scheme
- **Smooth Animations** - Polished user experience
- **Intuitive Navigation** - Easy-to-use interface
- **Real-time Updates** - Live data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account with App Password

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd email-system
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in backend directory
   cd backend
   touch .env
   ```

4. **Configure Environment Variables**
   ```env
   # backend/.env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   MONGODB_URI=mongodb://localhost:27017/email-system
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
email-system/
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── App.jsx        # Main application
│   │   │   ├── ComposeModal.jsx # Email composition
│   │   │   ├── EmailList.jsx  # Email listing
│   │   │   ├── EmailDetail.jsx # Email viewing
│   │   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   │   ├── TemplateModal.jsx # Template selection
│   │   │   └── ...
│   │   ├── data/
│   │   │   └── emailTemplates.js # Template definitions
│   │   ├── hooks/
│   │   │   └── useDebounce.js # Custom hooks
│   │   ├── utils/
│   │   │   └── validation.js  # Form validation
│   │   └── index.css          # Global styles
│   └── package.json           # Frontend dependencies
└── README.md                  # This file
```

## 🔧 Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in your `.env` file

### MongoDB Setup
- **Local MongoDB**: Install MongoDB locally
- **MongoDB Atlas**: Create a free cluster and get connection string
- Update `MONGODB_URI` in `.env` file

## 📚 Usage Guide

### Composing Emails
1. Click the **"Compose"** button in the sidebar
2. Fill in recipient, subject, and message
3. Use the rich text editor for formatting
4. Attach files using the paperclip icon
5. Click **"Send"** to deliver the email

### Using Templates
1. Click the **template icon** (📝) in the compose toolbar
2. Browse templates by category
3. Preview templates before applying
4. Click **"Apply Template"** to use
5. Customize the content as needed

### Managing Labels
1. Click the **label icon** (🏷️) next to any email
2. Select labels from the dropdown
3. Use sidebar filters to view labeled emails
4. Click **"All Mails"** to clear filters

### Client Management
1. Click **"Add Client"** in the sidebar
2. Fill in client details
3. Select clients when composing emails
4. View client history and interactions

## 🎨 Customization

### Adding New Templates
1. Edit `frontend/src/data/emailTemplates.js`
2. Add new template object with:
   - `id`: Unique identifier
   - `name`: Display name
   - `category`: Template category
   - `subject`: Email subject with variables
   - `html`: HTML content with variables
   - `variables`: Array of variable names

### Styling
- Global styles: `frontend/src/index.css`
- Component styles: Inline Tailwind CSS classes
- Color scheme: Custom CSS variables defined

### Backend API
- RESTful API endpoints for all operations
- MongoDB integration for data persistence
- File upload handling with multer
- Email sending with nodemailer

## 🔒 Security Features

- **Input Validation** - All forms validated before submission
- **File Upload Security** - Type and size restrictions
- **Rate Limiting** - Prevents email spam
- **CORS Protection** - Cross-origin request security
- **Environment Variables** - Sensitive data protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder
3. Update API URLs to production backend

### Backend (Heroku/Railway)
1. Set environment variables in hosting platform
2. Deploy the backend directory
3. Ensure MongoDB connection is accessible

### Database
- Use MongoDB Atlas for production
- Set up proper security groups
- Enable authentication

## 🐛 Troubleshooting

### Common Issues

**Email not sending:**
- Check Gmail credentials in `.env`
- Verify App Password is correct
- Ensure 2FA is enabled

**Database connection failed:**
- Check MongoDB URI in `.env`
- Ensure MongoDB is running
- Verify network connectivity

**Templates not loading:**
- Check browser console for errors
- Verify template data structure
- Clear browser cache

**Labels not saving:**
- Check backend server is running
- Verify API endpoints are accessible
- Check browser network tab for errors

## 📊 API Endpoints

### Email Management
- `POST /api/send-email` - Send new email
- `GET /api/sent-emails` - Get all sent emails
- `GET /api/sent-emails/:id` - Get specific email
- `PUT /api/sent-emails/:id/labels` - Update email labels
- `DELETE /api/sent-emails/:id` - Delete email

### Draft Management
- `GET /api/drafts` - Get all drafts
- `POST /api/drafts` - Create new draft
- `PUT /api/drafts/:id` - Update draft
- `DELETE /api/drafts/:id` - Delete draft
- `PUT /api/drafts/autosave` - Auto-save draft

### Client Management
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Add new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### File Management
- `GET /api/attachments/:emailId/:index` - Download attachment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js for the frontend framework
- Node.js and Express for the backend
- MongoDB for data storage
- Nodemailer for email functionality
- Tailwind CSS for styling
- All open-source contributors

## 📞 Support

For support, questions, or feature requests:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for professional email management**