import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testDraftSystem() {
  console.log('🧪 Testing Draft System...\n');

  try {
    // Test 1: Create a draft
    console.log('1. Creating a draft...');
    const createResponse = await fetch(`${BASE_URL}/drafts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test Draft',
        message: 'This is a test draft message',
        messageHtml: '<p>This is a test draft message</p>'
      })
    });
    
    const createData = await createResponse.json();
    if (createData.success) {
      console.log('✅ Draft created successfully:', createData.draft._id);
      const draftId = createData.draft._id;
      
      // Test 2: Fetch drafts
      console.log('\n2. Fetching drafts...');
      const fetchResponse = await fetch(`${BASE_URL}/drafts`);
      const fetchData = await fetchResponse.json();
      
      if (fetchData.success) {
        console.log('✅ Drafts fetched successfully:', fetchData.drafts.length, 'drafts found');
        
        // Test 3: Update draft
        console.log('\n3. Updating draft...');
        const updateResponse = await fetch(`${BASE_URL}/drafts/${draftId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'test@example.com',
            subject: 'Updated Test Draft',
            message: 'This is an updated test draft message',
            messageHtml: '<p>This is an updated test draft message</p>'
          })
        });
        
        const updateData = await updateResponse.json();
        if (updateData.success) {
          console.log('✅ Draft updated successfully');
          
          // Test 4: Delete draft
          console.log('\n4. Deleting draft...');
          const deleteResponse = await fetch(`${BASE_URL}/drafts/${draftId}`, {
            method: 'DELETE'
          });
          
          const deleteData = await deleteResponse.json();
          if (deleteData.success) {
            console.log('✅ Draft deleted successfully');
            console.log('\n🎉 All draft system tests passed!');
          } else {
            console.log('❌ Draft deletion failed:', deleteData.message);
          }
        } else {
          console.log('❌ Draft update failed:', updateData.message);
        }
      } else {
        console.log('❌ Draft fetch failed:', fetchData.message);
      }
    } else {
      console.log('❌ Draft creation failed:', createData.message);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testDraftSystem();
