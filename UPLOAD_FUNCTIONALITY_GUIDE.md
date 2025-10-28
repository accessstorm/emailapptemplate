# Upload Functionality Guide - Visual Editor

## 🎯 What's New

You can now **upload images and videos directly** in the Visual Editor properties panel! No more need to manually upload to external services and copy URLs.

## ✨ Features Added

### 🖼️ Image Component Upload
- **Upload Button**: Click to select image from your computer
- **Auto-URL Generation**: Automatically generates public URL
- **Preview**: See uploaded image immediately in the editor
- **Fallback**: Still supports manual URL entry

### 🎥 Video Component Upload
- **Video Upload**: Upload video files directly
- **Poster Upload**: Upload custom thumbnail/poster image
- **Auto-URL Generation**: Both video and poster get public URLs
- **Fallback**: Still supports manual URL entry

## 🚀 How to Use

### For Images:
1. **Drag Image Component** to your canvas
2. **Click the Image** to select it
3. **In Properties Panel** (right side), scroll down
4. **Click "📁 Choose File"** in the blue upload section
5. **Select your image** from your computer
6. **Wait for upload** - URL will be filled automatically
7. **Save your template** - image will display in emails!

### For Videos:
1. **Drag Video Component** to your canvas
2. **Click the Video** to select it
3. **In Properties Panel**, scroll down to see two upload sections:
   - **"🎥 Choose Video"** - Upload your video file
   - **"🖼️ Choose Poster"** - Upload thumbnail image
4. **Upload both files** (or just one)
5. **URLs will be filled automatically**
6. **Save your template** - video poster will display in emails!

## 🔧 Technical Details

### Backend Changes
- **New Endpoint**: `POST /api/media/upload`
- **File Storage**: Files saved to `uploads/` directory
- **Public URLs**: Served at `http://localhost:5000/uploads/filename`
- **File Limits**: 20MB max for media files
- **Supported Types**: Images (jpg, png, gif, etc.) and Videos (mp4, mov, etc.)

### Frontend Changes
- **Upload Buttons**: Added to Image and Video component properties
- **File Handling**: Automatic file upload and URL generation
- **Error Handling**: User-friendly error messages
- **Progress Feedback**: Console logs for debugging

## 🧪 Testing the Feature

### Test 1: Image Upload
1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Open Visual Editor**: Mail Templates → Open Visual Editor
4. **Add Image Component**: Drag "Image" to canvas
5. **Select Image**: Click on the image component
6. **Upload Image**: Click "📁 Choose File" in properties
7. **Select Test Image**: Choose any image from your computer
8. **Verify**: Check that URL is filled automatically
9. **Save Template**: Click "Save Template"
10. **Test Email**: Use template in Compose Modal and send test email

### Test 2: Video Upload
1. **Add Video Component**: Drag "Video" to canvas
2. **Select Video**: Click on the video component
3. **Upload Video**: Click "🎥 Choose Video"
4. **Upload Poster**: Click "🖼️ Choose Poster"
5. **Verify URLs**: Both should be filled automatically
6. **Save Template**: Click "Save Template"
7. **Test Email**: Send test email and verify poster displays

### Test 3: Mixed Upload
1. **Create Template** with both Image and Video components
2. **Upload files** for both components
3. **Save Template**
4. **Send Test Email**
5. **Verify** both image and video poster display correctly

## 📁 File Structure

### Backend
```
backend/
├── uploads/           # New directory for uploaded files
│   ├── 1234567890-image.jpg
│   ├── 1234567891-video.mp4
│   └── 1234567892-poster.jpg
└── server.js          # Updated with upload endpoint
```

### Frontend
```
frontend/src/components/
└── VisualEditor.jsx   # Updated with upload UI
```

## 🔍 Troubleshooting

### Upload Not Working?
1. **Check Backend**: Ensure backend server is running on port 5000
2. **Check Console**: Look for error messages in browser console
3. **Check Network**: Verify upload request in Network tab
4. **Check File Size**: Ensure file is under 20MB
5. **Check File Type**: Only images and videos are allowed

### Images Not Displaying in Email?
1. **Check URL**: Verify the generated URL works in browser
2. **Check Backend**: Ensure backend is serving files correctly
3. **Test URL**: Paste URL directly in browser address bar
4. **Check Email Client**: Test in different email clients

### Video Not Working?
1. **Check Video URL**: Ensure video file is accessible
2. **Check Poster URL**: Ensure poster image is accessible
3. **Test Both URLs**: Both should open in browser
4. **Check Email Client**: Video posters work in most clients

## 💡 Pro Tips

### For Images:
- **Use High Quality**: Upload high-resolution images for best results
- **Optimize Size**: Keep under 2MB for faster loading
- **Use JPG/PNG**: Best compatibility with email clients
- **Test Different Sizes**: Try various image dimensions

### For Videos:
- **Use MP4 Format**: Best compatibility across platforms
- **Keep Under 20MB**: Backend limit for uploads
- **Create Good Poster**: Use an engaging thumbnail image
- **Test Poster**: Make sure poster image is clear and attractive

### For Templates:
- **Save Frequently**: Save your work as you build
- **Test Before Sending**: Always send test emails to yourself first
- **Check Mobile**: Test how templates look on mobile devices
- **Use Placeholders**: Test with placeholder images first

## 🎨 UI Features

### Upload Sections:
- **Blue Section**: For main content (image/video)
- **Gray Section**: For video poster/thumbnail
- **Clear Labels**: Easy to understand what each button does
- **File Type Icons**: Visual indicators for different file types
- **Helpful Text**: "or paste URL above" for manual entry

### Error Handling:
- **User-Friendly Messages**: Clear error descriptions
- **Console Logging**: Detailed logs for debugging
- **File Validation**: Automatic file type and size checking
- **Graceful Fallback**: Manual URL entry still available

## 🔄 Workflow Comparison

### Before (Manual):
1. Upload image to ImgBB/Imgur
2. Copy direct link
3. Paste URL in Visual Editor
4. Repeat for each image/video

### After (Upload):
1. Drag component to canvas
2. Click "Choose File"
3. Select file from computer
4. Done! URL filled automatically

## 📊 Performance

### Upload Speed:
- **Local Files**: Fast upload from computer
- **Server Processing**: Quick file processing
- **URL Generation**: Instant public URL creation

### File Management:
- **Automatic Naming**: Timestamp-based filenames
- **Safe Names**: Special characters removed
- **Organized Storage**: All files in `uploads/` directory

## 🚀 Future Enhancements

Potential improvements:
- **Drag & Drop**: Drag files directly onto components
- **Bulk Upload**: Upload multiple files at once
- **Image Editing**: Basic crop/resize in editor
- **Cloud Storage**: Integration with AWS S3, etc.
- **Progress Bars**: Visual upload progress
- **File Preview**: Thumbnail previews in properties

## ✅ Success Checklist

Before considering the feature complete:
- [ ] Can upload images to Image components
- [ ] Can upload videos to Video components
- [ ] Can upload poster images for videos
- [ ] URLs are generated automatically
- [ ] Files are accessible via public URLs
- [ ] Images display in email templates
- [ ] Video posters display in email templates
- [ ] Error handling works for invalid files
- [ ] File size limits are enforced
- [ ] File type validation works
- [ ] Manual URL entry still works
- [ ] Templates save correctly
- [ ] Emails send successfully
- [ ] Recipients see images/videos

---

**Status**: ✅ **IMPLEMENTED AND READY FOR TESTING**
**Date**: October 28, 2025
**Impact**: High - Much easier workflow for adding media to templates
**Risk**: Low - Backward compatible, manual URLs still work

**The upload functionality is now live! Try it out in the Visual Editor!** 🎉
