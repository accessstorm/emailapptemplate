# Image Hosting Guide for Email Templates

## Why Public URLs are Required

Email clients cannot access images from your local computer. Images must be hosted on the internet and accessible via a public URL (like `https://example.com/image.jpg`).

## Free Image Hosting Options

### 1. **ImgBB** (Recommended for Beginners)
- 🌐 Website: https://imgbb.com
- ✅ Free tier available
- ✅ No account required for basic use
- ✅ Direct image URLs
- ✅ No expiration
- 📝 How to use:
  1. Go to https://imgbb.com
  2. Upload your image
  3. Copy the "Direct link" URL
  4. Paste into Visual Editor image component

### 2. **Imgur**
- 🌐 Website: https://imgur.com
- ✅ Free and popular
- ✅ No account required
- ✅ Fast CDN
- 📝 How to use:
  1. Go to https://imgur.com
  2. Click "New post"
  3. Upload image
  4. Right-click image → Copy image address
  5. Paste URL into Visual Editor

### 3. **Cloudinary**
- 🌐 Website: https://cloudinary.com
- ✅ Free tier (25GB storage, 25GB bandwidth/month)
- ✅ Image optimization
- ✅ Transformations available
- ⚠️ Requires account
- 📝 How to use:
  1. Sign up at https://cloudinary.com
  2. Upload images via dashboard
  3. Copy the image URL
  4. Use in Visual Editor

### 4. **Postimages**
- 🌐 Website: https://postimages.org
- ✅ Free
- ✅ No account required
- ✅ Direct links
- 📝 How to use:
  1. Go to https://postimages.org
  2. Choose image
  3. Upload
  4. Copy "Direct link"
  5. Use in templates

### 5. **Your Own Website**
If you have a website or hosting:
- Upload images to `yourwebsite.com/images/`
- Use the full URL: `https://yourwebsite.com/images/photo.jpg`
- ✅ Full control
- ✅ No third-party dependencies
- ⚠️ Requires hosting

### 6. **GitHub**
For developers:
- Upload images to a public GitHub repository
- Use raw GitHub URLs
- Example: `https://raw.githubusercontent.com/username/repo/main/image.jpg`
- ✅ Free
- ✅ Version control
- ⚠️ Requires GitHub account

## Quick Start: Using ImgBB

**Step-by-step for beginners:**

1. **Upload Your Image**
   - Go to https://imgbb.com
   - Click "Start uploading"
   - Select your image file
   - Click "Upload"

2. **Get Direct Link**
   - After upload, scroll down
   - Find "Direct link" option
   - Click to copy URL
   - Example: `https://i.ibb.co/abc123/image.jpg`

3. **Use in Visual Editor**
   - Open Visual Editor in your email app
   - Drag "Image" component to canvas
   - Click on the image component
   - In Properties panel, paste URL in "Image URL" field
   - Image will now display in emails!

## Image Best Practices

### Size Guidelines
- **Width**: 600px maximum (email standard)
- **Height**: Keep proportional to width
- **File Size**: Under 200KB recommended
- **Format**: JPG for photos, PNG for graphics with transparency

### Optimization
Before uploading:
1. Resize images to appropriate dimensions
2. Compress images to reduce file size
3. Use tools like:
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)
   - ImageOptim (Mac)

### Accessibility
- Use descriptive alt text
- Ensure sufficient contrast
- Don't rely solely on images for important information

## Common Image URL Formats

✅ **Valid URLs:**
- `https://i.ibb.co/abc123/photo.jpg`
- `https://i.imgur.com/xyz789.jpg`
- `https://res.cloudinary.com/demo/image/upload/sample.jpg`
- `https://yourwebsite.com/images/logo.png`
- `https://cdn.example.com/banner.jpg`

❌ **Invalid URLs (will NOT work in emails):**
- `C:\Users\YourName\Pictures\photo.jpg` (local path)
- `/images/photo.jpg` (relative path)
- `file:///C:/Users/photo.jpg` (file protocol)
- `blob:http://localhost:3000/xyz` (blob URL)

## Video Poster Images

For video components, you also need a poster image (thumbnail):
1. Take a screenshot of your video at an interesting moment
2. Upload to an image hosting service (same as above)
3. Use the URL as the poster image
4. Set video URL to YouTube/Vimeo link

**Example:**
- Poster Image: `https://i.ibb.co/abc123/video-thumb.jpg`
- Video URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

## Troubleshooting

### Image Not Showing in Email
**Problem**: Blank space where image should be

**Solutions**:
1. ✅ Verify URL is accessible (paste in browser)
2. ✅ Ensure URL starts with `https://`
3. ✅ Check image hosting service is online
4. ✅ Confirm URL points directly to image file (ends with .jpg, .png, etc.)
5. ✅ Try a different hosting service

### Image Shows in Editor but Not in Email
**Problem**: Works in preview but not in sent email

**Solutions**:
1. ✅ Make sure URL is public (not behind login)
2. ✅ Check if URL expires (some services have time limits)
3. ✅ Use permanent hosting services
4. ✅ Avoid "hotlink protection" hosts

### Image Too Large/Small
**Problem**: Image doesn't fit properly

**Solutions**:
1. ✅ Set width to 600px or less
2. ✅ Use "width: 100%" in properties
3. ✅ Resize original image before uploading
4. ✅ Let height be "auto" to maintain aspect ratio

## Testing Your Images

Before sending emails to recipients:

1. **Test in Editor**
   - Paste URL in Visual Editor
   - Verify image loads

2. **Test in Browser**
   - Paste URL directly in browser address bar
   - Image should open and display

3. **Test Email to Yourself**
   - Send test email to your own address
   - Check on multiple devices (desktop, mobile)
   - Check in different email clients (Gmail, Outlook, etc.)

## Free Tools for Image Preparation

### Resize Images
- **Squoosh**: https://squoosh.app (browser-based)
- **ILoveIMG**: https://www.iloveimg.com/resize-image
- **Pixlr**: https://pixlr.com/x/ (online editor)

### Compress Images
- **TinyPNG**: https://tinypng.com
- **Compressor.io**: https://compressor.io
- **Squoosh**: https://squoosh.app

### Create Graphics
- **Canva**: https://canva.com (free tier)
- **Pixlr**: https://pixlr.com
- **Photopea**: https://www.photopea.com (free Photoshop alternative)

### Placeholder Images (for testing)
- **Placeholder.com**: https://placeholder.com
  - Example: `https://via.placeholder.com/600x400`
- **LoremFlickr**: https://loremflickr.com
  - Example: `https://loremflickr.com/600/400`
- **Unsplash Source**: https://source.unsplash.com
  - Example: `https://source.unsplash.com/600x400/?nature`

## Quick Reference

| Service | Free? | Account Required? | Best For |
|---------|-------|-------------------|----------|
| ImgBB | ✅ Yes | ❌ No | Beginners |
| Imgur | ✅ Yes | ❌ No | Quick uploads |
| Cloudinary | ⚠️ Free tier | ✅ Yes | Professional |
| Postimages | ✅ Yes | ❌ No | Simple hosting |
| Your Website | ⚠️ Need hosting | ✅ Yes | Full control |
| GitHub | ✅ Yes | ✅ Yes | Developers |

## Example Workflow

**Complete workflow for adding an image:**

1. **Prepare Image**
   - Open in image editor
   - Resize to 600px width
   - Compress to under 200KB
   - Save as JPG or PNG

2. **Upload to ImgBB**
   - Go to https://imgbb.com
   - Upload image
   - Copy direct link

3. **Add to Template**
   - Open Visual Editor
   - Drag "Image" component
   - Click image to select
   - Paste URL in properties
   - Adjust alignment (center, left, right)

4. **Test**
   - Preview in editor
   - Save template
   - Send test email to yourself
   - Check on phone and desktop

5. **Send**
   - Create email using template
   - Add recipients
   - Send!

---

**Need Help?**
- Check the main guide: `EMAIL_TEMPLATES_AND_FORMS_GUIDE.md`
- Test with placeholder images first: `https://via.placeholder.com/600x400`
- Send test emails to yourself before sending to recipients

**Pro Tip**: Keep all your email images in one place (one hosting service or folder) so they're easy to manage and update.

