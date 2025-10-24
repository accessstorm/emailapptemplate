import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testEmailSending() {
  console.log('🧪 Testing Email Sending...\n');

  try {
    // Test 1: Check server health
    console.log('1. Checking server health...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    if (!healthData.emailConfigured) {
      console.log('❌ Email not configured - missing EMAIL_USER or EMAIL_PASS');
      return;
    }

    // Test 2: Try sending a test email
    console.log('\n2. Testing email sending...');
    const formData = new FormData();
    formData.append('to', 'test@example.com');
    formData.append('subject', 'Test Email');
    formData.append('message', 'This is a test email from the email system');

    const sendResponse = await fetch(`${BASE_URL}/send-email`, {
      method: 'POST',
      body: formData
    });
    
    const sendData = await sendResponse.json();
    console.log('Send email response:', sendData);
    
    if (sendData.success) {
      console.log('✅ Email sending test passed!');
    } else {
      console.log('❌ Email sending failed:', sendData.message);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testEmailSending();
