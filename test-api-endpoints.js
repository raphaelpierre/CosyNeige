const fetch = require('node-fetch');

async function testAdminAPIs() {
  console.log('🧪 Testing Admin API endpoints...\n');
  
  const baseURL = 'http://localhost:3000';
  
  // Test endpoints without auth (should fail with 401/403)
  const endpoints = [
    '/api/admin/reservations',
    '/api/admin/users', 
    '/api/admin/messages',
    '/api/messages'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await fetch(`${baseURL}${endpoint}`);
      const data = await response.text();
      
      console.log(`  Status: ${response.status}`);
      console.log(`  Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
      console.log('');
    } catch (error) {
      console.log(`  Error: ${error.message}`);
      console.log('');
    }
  }
  
  // Test with a sample auth token (this will fail but shows the flow)
  console.log('Testing with sample auth token...');
  try {
    const response = await fetch(`${baseURL}/api/admin/reservations`, {
      headers: {
        'Authorization': 'Bearer sample-token'
      }
    });
    const data = await response.text();
    console.log(`  Status: ${response.status}`);
    console.log(`  Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
  } catch (error) {
    console.log(`  Error: ${error.message}`);
  }
}

testAdminAPIs();