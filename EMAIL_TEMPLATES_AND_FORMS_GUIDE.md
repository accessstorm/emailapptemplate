# Email Templates & Form Submission Feature Guide

## Overview
This guide explains the enhanced email template system and the new form submission feature that allows recipients to respond to emails via embedded forms.

## 📧 Email Template Improvements

### HTML Email Structure
All emails generated from the visual editor are now wrapped in a proper email-compatible HTML structure:
- Uses table-based layout for maximum email client compatibility
- Includes responsive design with max-width of 600px
- Proper DOCTYPE and meta tags for rendering
- Inline CSS for all styling (required for email clients)

### Image Handling
Images in email templates are now handled correctly:
- **Proper Image URLs**: Images must use publicly accessible URLs (not local file paths)
- **Max Width**: Images are automatically constrained to 600px max-width for email compatibility
- **Fallback**: Uses placeholder images by default if no source is provided
- **Responsive**: Images scale properly on mobile devices

**How to use images:**
1. Drag the "Image" component to your template
2. In the properties panel, enter a publicly accessible image URL (e.g., from your website, CDN, or image hosting service)
3. The image will display correctly in sent emails

**Example URLs:**
- `https://example.com/images/logo.png`
- `https://cdn.example.com/banner.jpg`
- `https://via.placeholder.com/600x400` (placeholder service)

### Video Handling
Since most email clients don't support embedded videos, videos are rendered as clickable poster images:
- **Poster Image**: Shows a thumbnail with a play button overlay
- **Click to Watch**: Links to the video URL
- **Universal Compatibility**: Works in all email clients
- **Professional Look**: Styled with a play button overlay

**How to use videos:**
1. Drag the "Video" component to your template
2. Set the video URL (e.g., YouTube, Vimeo, or your hosted video)
3. Set a poster image URL (the thumbnail that recipients will see)
4. Recipients click the image to open and watch the video

## 📋 Form Submission Feature

### Overview
Recipients can now fill out and submit forms directly from emails you send them. All responses are stored in the database and can be viewed in the application.

### How It Works

#### 1. Creating a Form in Your Email
1. Open the Visual Editor when creating a custom template
2. Drag the "Contact Form" component onto your canvas
3. Customize the form:
   - **Title**: Set a title for your form
   - **Fields**: Choose which fields to include (Name, Email, Phone, Message, etc.)
   - **Button Text**: Customize the submit button text
4. Save your template

#### 2. Form Submission by Recipients
When a recipient receives your email:
1. They fill out the form fields directly in their email
2. Click the submit button
3. The form data is sent securely to your backend server
4. They see a beautiful "Thank You" confirmation page
5. Their submission is stored in your database

#### 3. Viewing Form Responses
To view submissions:
1. Click "Form Responses" in the sidebar
2. See a list of all submissions with:
   - Submitter name/email (if provided)
   - Submission date and time
   - Preview of form data
3. Click any submission to view full details:
   - All form fields and responses
   - Submission metadata (IP address, user agent)
   - Timestamp information

### Backend API Endpoints

#### POST `/api/form-submission`
Handles form submissions from email recipients.

**Request Format**: `application/x-www-form-urlencoded` (standard HTML form)

**Request Body:**
- `formId`: Unique identifier for the form
- Additional fields depend on the form configuration (name, email, message, etc.)

**Response**: HTML page with success/error message

**Database Storage:**
```javascript
{
  formId: String,           // Unique form identifier
  submittedAt: Date,       // Submission timestamp
  data: Object,            // All form field data
  submitterEmail: String,  // Extracted from form
  submitterName: String,   // Extracted from form
  ipAddress: String,       // Submitter's IP
  userAgent: String        // Browser information
}
```

#### GET `/api/form-submissions`
Retrieves all form submissions or filter by formId.

**Query Parameters:**
- `formId` (optional): Filter submissions by specific form

**Response:**
```json
{
  "success": true,
  "submissions": [...],
  "count": 5
}
```

### Form Fields
The Contact Form component supports various field types:
- **Name**: Text input for names
- **Email**: Email validation
- **Phone**: Text input for phone numbers
- **Message**: Multi-line textarea for messages
- **Custom fields**: Can be added in the component

### Security Features
- **Rate Limiting**: Form submissions are monitored to prevent spam
- **IP Tracking**: Each submission records the IP address
- **User Agent Tracking**: Browser information is stored
- **Validation**: Required fields must be filled
- **MongoDB Storage**: Secure database storage with indexes

## 🎨 Visual Editor Features

### Component Library
20+ drag-and-drop components including:
- Text: Heading, Paragraph, Quote
- Layout: Container, Row, Column, Card, Spacer, Divider
- Media: Image, Video
- Interactive: Button, CTA Button, Contact Form
- Lists: Bullet List, Numbered List
- Data: Table, Progress Bar
- Other: Social Links, Alert

### Properties Panel
Edit component properties in real-time:
- Text content and styling
- Colors and alignment
- Sizes and spacing
- URLs and links
- Form configuration

### HTML Editor
- Toggle between visual and HTML editing modes
- Direct HTML code editing
- Syntax highlighting (via styling)
- Perfect for advanced customization

### Fullscreen Mode
- Expand editor to full screen for better workflow
- Toggle back to normal mode anytime

### Template Management
- **Save Templates**: Save your designs to "Your Templates"
- **Load Templates**: Reuse saved templates anytime
- **Preview**: See real-time preview of your email
- **No Refresh Needed**: Templates update instantly

## 🚀 Getting Started

### For Sending Emails with Forms

1. **Create a Template**:
   - Click "Mail Templates" in sidebar
   - Click "Open Visual Editor"
   - Drag components to build your email
   - Add a "Contact Form" component
   - Customize the form fields
   - Click "Save Template"

2. **Use the Template**:
   - Click "Compose" to create a new email
   - Click the template icon in the compose toolbar
   - Select your template with the form
   - Add recipient and subject
   - Send!

3. **View Responses**:
   - Click "Form Responses" in sidebar
   - Browse all submissions
   - Click to view details

### For Recipients

1. **Receive Email**: Open the email in any email client
2. **Fill Form**: Complete the form fields
3. **Submit**: Click the submit button
4. **Confirmation**: See the thank you page

## 💡 Tips & Best Practices

### Images
- ✅ Use publicly hosted images (not local files)
- ✅ Use appropriate image sizes (600px width recommended)
- ✅ Test images in different email clients
- ❌ Don't use base64 images (they increase email size significantly)
- ❌ Don't use animated GIFs (limited support)

### Forms
- ✅ Keep forms short (3-5 fields ideal)
- ✅ Mark important fields as required
- ✅ Use clear field labels
- ✅ Test form submission before sending to recipients
- ❌ Don't ask for sensitive information (passwords, SSN, etc.)
- ❌ Don't use complex validation (email clients have limitations)

### Templates
- ✅ Test templates by sending to yourself first
- ✅ Use responsive design (mobile-friendly)
- ✅ Keep email width at 600px maximum
- ✅ Use web-safe fonts (Arial, Helvetica, etc.)
- ❌ Don't use JavaScript (not supported in emails)
- ❌ Don't use external CSS files (use inline styles only)

### Videos
- ✅ Use high-quality poster images
- ✅ Host videos on reliable platforms (YouTube, Vimeo)
- ✅ Include a call-to-action ("Click to watch")
- ❌ Don't try to embed actual video players (not supported)

## 🔧 Technical Requirements

### Backend
- Node.js & Express
- MongoDB (for storing submissions)
- Nodemailer (for sending emails)
- Environment variables configured (EMAIL_USER, EMAIL_PASS)

### Frontend
- React
- React DnD (for drag-and-drop)
- Tailwind CSS

### Email Server
- SMTP access (Gmail, SendGrid, etc.)
- App passwords configured (for Gmail)

## 🐛 Troubleshooting

### Images Not Showing
- **Check URL**: Ensure the image URL is publicly accessible
- **Test URL**: Open the image URL in a browser
- **HTTPS**: Use HTTPS URLs when possible
- **CDN**: Consider using a CDN for better delivery

### Forms Not Working
- **Backend Running**: Make sure backend server is running on port 5000
- **MongoDB**: Verify MongoDB connection
- **Network**: Check if recipient can reach your backend
- **CORS**: Ensure CORS is enabled for form submissions

### Template Not Saving
- **LocalStorage**: Check if browser localStorage is enabled
- **Space**: Ensure sufficient localStorage space
- **Console**: Check browser console for errors

### Responses Not Appearing
- **Refresh**: Click the refresh button in Form Responses view
- **Database**: Verify MongoDB is connected
- **Backend Logs**: Check backend console for errors

## 📊 Database Schema

### FormSubmission Model
```javascript
{
  formId: String,           // Required - links to form in email
  submittedAt: Date,       // Auto-generated timestamp
  data: Mixed,             // Flexible - stores all form fields
  submitterEmail: String,  // Extracted from 'email' field
  submitterName: String,   // Extracted from 'name' field
  ipAddress: String,       // Submitter's IP address
  userAgent: String        // Browser/client information
}
```

### Indexes
- `formId`: For filtering submissions by form
- `submittedAt`: For chronological sorting

## 🎯 Use Cases

### 1. Client Proposals
Create a proposal email with a contact form for client feedback:
- Include project details
- Add images/mockups
- Embed feedback form
- Track responses

### 2. Event Invitations
Send event invites with RSVP form:
- Event details and images
- RSVP form with dietary preferences
- Track attendees

### 3. Product Launches
Announce new products with interest form:
- Product images and videos
- Feature highlights
- Early access signup form

### 4. Customer Surveys
Gather feedback via email forms:
- Rating scales (using text inputs)
- Open-ended questions
- Quick response collection

### 5. Lead Generation
Marketing emails with lead capture:
- Compelling visuals
- Clear value proposition
- Contact information form

## 🔐 Security Considerations

1. **Data Privacy**: Form submissions contain personal information
2. **Storage**: All data is stored in MongoDB
3. **Access Control**: Only you can view submissions (via your app)
4. **IP Logging**: IPs are logged for security/spam prevention
5. **No Authentication**: Recipients don't need to log in to submit

## 🚀 Future Enhancements

Potential improvements for the system:
- Email notifications when forms are submitted
- Export submissions to CSV
- Custom form validation rules
- File upload support in forms
- Conditional form fields
- Integration with CRM systems
- Analytics dashboard for submissions
- Automated response emails
- Form builder with custom fields
- Webhook support for integrations

## 📝 Support

If you encounter issues:
1. Check this guide for solutions
2. Review backend console logs
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Ensure MongoDB is running
6. Test with a simple form first

---

**Created**: October 28, 2025
**Version**: 1.0
**Last Updated**: October 28, 2025

