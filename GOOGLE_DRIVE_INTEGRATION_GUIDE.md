# Google Drive Integration Guide

## 🎯 New Feature: Google Drive Links

You can now use Google Drive links directly in your email templates! No need to download and re-upload files.

## ✨ How It Works

### For Images:
1. **Upload to Google Drive** - Upload your image to Google Drive
2. **Get Share Link** - Right-click → "Get link" → Copy link
3. **Paste in Visual Editor** - In the green "Google Drive Link" section
4. **Auto-Convert** - The system converts it to a direct image URL

### For Videos:
1. **Upload to Google Drive** - Upload your video to Google Drive  
2. **Get Share Link** - Right-click → "Get link" → Copy link
3. **Paste in Visual Editor** - In the green "Google Drive Video Link" section
4. **Auto-Convert** - The system converts it to a direct video URL

## 🔧 Step-by-Step Instructions

### Step 1: Upload to Google Drive
1. Go to [drive.google.com](https://drive.google.com)
2. Click "New" → "File upload"
3. Select your image or video file
4. Wait for upload to complete

### Step 2: Get Share Link
1. **Right-click** on your uploaded file
2. Select **"Get link"** or **"Share"**
3. Click **"Copy link"**
4. The link will look like: `https://drive.google.com/file/d/1ABC123.../view?usp=sharing`

### Step 3: Use in Visual Editor
1. **Open Visual Editor** in your email template
2. **Drag Image or Video component** to canvas
3. **Click the component** to select it
4. **Scroll down** in properties panel
5. **Find the green section** "Google Drive Link"
6. **Paste your Drive link** in the input field
7. **Click outside** the field (onBlur) to convert
8. **Save your template**

## ⚠️ Important Settings

### Make Files Public
Your Google Drive files must be set to **"Anyone with the link can view"**:

1. **Right-click** your file in Google Drive
2. Select **"Share"**
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, MOV, AVI, WebM

## 🔄 Link Conversion

The system automatically converts Google Drive links:

**From:** `https://drive.google.com/file/d/1ABC123DEF456/view?usp=sharing`

**To:** `https://drive.google.com/uc?export=view&id=1ABC123DEF456`

This direct link works better in email clients.

## 🎨 UI Features

### Image Component
- **Blue Section**: Upload from computer
- **Green Section**: Paste Google Drive link
- **URL Field**: Manual URL entry (still works)

### Video Component  
- **Blue Section**: Upload video from computer
- **Green Section**: Paste Google Drive video link
- **Gray Section**: Upload poster/thumbnail
- **URL Fields**: Manual URL entry (still works)

## 💡 Pro Tips

### For Images:
- **Use High Resolution**: Upload high-quality images for best results
- **Optimize File Size**: Keep under 10MB for faster loading
- **Use JPG/PNG**: Best compatibility with email clients
- **Test Different Sizes**: Try various dimensions

### For Videos:
- **Use MP4 Format**: Best compatibility across platforms
- **Keep Under 100MB**: Google Drive limit for direct viewing
- **Create Good Thumbnail**: Use an engaging poster image
- **Test Playback**: Verify video plays in browser

### For Templates:
- **Save Frequently**: Save your work as you build
- **Test Before Sending**: Always send test emails first
- **Check Mobile**: Test how templates look on mobile
- **Use Placeholders**: Test with placeholder images first

## 🔍 Troubleshooting

### Image Not Displaying?
1. **Check Share Settings**: Ensure file is "Anyone with the link can view"
2. **Test Direct Link**: Paste the converted URL in browser
3. **Check File Type**: Ensure it's a supported image format
4. **Try Different Browser**: Test in Chrome, Firefox, etc.

### Video Not Working?
1. **Check Share Settings**: Ensure file is "Anyone with the link can view"
2. **Test Direct Link**: Paste the converted URL in browser
3. **Check File Size**: Keep under 100MB
4. **Use MP4 Format**: Best compatibility

### Link Not Converting?
1. **Check URL Format**: Must contain `/file/d/` in the URL
2. **Remove Extra Parameters**: Use the basic share link
3. **Try Again**: Click outside the input field to trigger conversion
4. **Check Console**: Look for error messages in browser console

## 🚀 Benefits

### Convenience:
- **No Re-uploading**: Use files directly from Google Drive
- **Easy Sharing**: Just copy and paste the link
- **Cloud Storage**: Files stay in your Google Drive
- **Version Control**: Update files in Drive, templates update automatically

### Performance:
- **Fast Loading**: Google's CDN serves files quickly
- **Reliable**: Google's infrastructure is very stable
- **Scalable**: No server storage limits
- **Cached**: Files are cached globally

## 📊 Comparison

### Before (Manual Upload):
1. Upload to Google Drive
2. Download file to computer
3. Upload to email system
4. Copy URL to template
5. Repeat for each file

### After (Drive Links):
1. Upload to Google Drive
2. Copy share link
3. Paste in template
4. Done!

## ✅ Success Checklist

Before considering the feature complete:
- [ ] Can paste Google Drive image links
- [ ] Can paste Google Drive video links
- [ ] Links convert to direct URLs automatically
- [ ] Images display in email templates
- [ ] Videos show as file blocks with download
- [ ] Files are accessible to recipients
- [ ] Share settings are correct
- [ ] Different file types work
- [ ] Mobile display works
- [ ] Error handling works

---

**Status**: ✅ **IMPLEMENTED AND READY**
**Date**: October 28, 2025
**Impact**: High - Much easier workflow for using cloud files
**Risk**: Low - Backward compatible, manual uploads still work

**The Google Drive integration is now live! Try it out in the Visual Editor!** 🎉
