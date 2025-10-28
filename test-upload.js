// Test script to verify media upload functionality
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  console.log('🧪 Testing Media Upload Functionality');
  console.log('=====================================');
  
  // Test 1: Check if server is running
  console.log('\n1. Testing server health...');
  try {
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Server is running:', healthData.message);
  } catch (error) {
    console.log('❌ Server is not running:', error.message);
    console.log('💡 Please start the backend server: cd backend && npm start');
    return;
  }
  
  // Test 2: Check media upload endpoint
  console.log('\n2. Testing media upload endpoint...');
  try {
    const testResponse = await fetch('http://localhost:5000/api/media/test');
    const testData = await testResponse.json();
    console.log('✅ Media endpoint is working:', testData.message);
  } catch (error) {
    console.log('❌ Media endpoint error:', error.message);
    return;
  }
  
  // Test 3: Create a test image file
  console.log('\n3. Creating test image...');
  const testImagePath = 'test-image.txt';
  const testImageContent = 'This is a test image file for upload testing.';
  fs.writeFileSync(testImagePath, testImageContent);
  console.log('✅ Test file created:', testImagePath);
  
  // Test 4: Upload test file
  console.log('\n4. Testing file upload...');
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-image.txt',
      contentType: 'text/plain'
    });
    
    const uploadResponse = await fetch('http://localhost:5000/api/media/upload', {
      method: 'POST',
      body: form
    });
    
    console.log('Upload response status:', uploadResponse.status);
    console.log('Upload response headers:', Object.fromEntries(uploadResponse.headers));
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Upload successful:', uploadData);
    
    // Test 5: Verify file is accessible
    console.log('\n5. Testing file access...');
    const fileResponse = await fetch(uploadData.url);
    if (fileResponse.ok) {
      console.log('✅ File is accessible at:', uploadData.url);
    } else {
      console.log('❌ File is not accessible:', fileResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Upload failed:', error.message);
  } finally {
    // Cleanup
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('🧹 Test file cleaned up');
    }
  }
  
  console.log('\n🎯 Test completed!');
  console.log('\nIf all tests passed, the upload functionality should work in the Visual Editor.');
  console.log('If tests failed, check the backend server logs for more details.');
}

// Run the test
testUpload().catch(console.error);
