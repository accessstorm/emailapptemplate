import fetch from 'node-fetch';

async function testEmailSending() {
  console.log('🧪 Testing email sending endpoint...');
  
  try {
    const formData = new FormData();
    formData.append('to', 'test@example.com');
    formData.append('subject', 'Test Email');
    formData.append('message', 'This is a test email from the email system.');
    
    const response = await fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    console.log('📧 Response:', data);
    
    if (data.success) {
      console.log('✅ Email sending test passed!');
    } else {
      console.log('❌ Email sending test failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testEmailSending();
