async function testAdminLogin() {
  console.log('🧪 Testing Admin Login...\n');
  
  // Dynamic import for node-fetch
  const fetch = (await import('node-fetch')).default;
  
  const baseURL = 'http://localhost:3000';
  
  // Credentials admin
  const credentials = {
    email: 'admin@chalet-balmotte810.com',
    password: 'ChaletAdmin123!'
  };
  
  try {
    console.log('Attempting to login with admin credentials...');
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    console.log(`Login Status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log(`User: ${loginData.user.email} (${loginData.user.role})`);
      
      // Extract cookies for subsequent requests
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('Cookies received:', cookies);
      
      // Test admin endpoints with cookies
      if (cookies) {
        console.log('\n🔍 Testing admin endpoints with cookies...');
        
        const endpoints = [
          '/api/admin/reservations',
          '/api/admin/users',
          '/api/admin/invoices',
          '/api/messages'
        ];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`\nTesting ${endpoint}...`);
            const response = await fetch(`${baseURL}${endpoint}`, {
              headers: {
                'Cookie': cookies
              }
            });
            
            console.log(`  Status: ${response.status}`);
            
            if (response.ok) {
              const data = await response.json();
              console.log(`  Data length: ${Array.isArray(data) ? data.length : 'Not array'}`);
              if (Array.isArray(data) && data.length > 0) {
                console.log(`  Sample: ${JSON.stringify(data[0], null, 2).substring(0, 200)}...`);
              }
            } else {
              const errorText = await response.text();
              console.log(`  Error: ${errorText.substring(0, 200)}...`);
            }
          } catch (error) {
            console.log(`  Error: ${error.message}`);
          }
        }
      }
      
    } else {
      const errorData = await loginResponse.text();
      console.log('❌ Login failed!');
      console.log('Error:', errorData);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testAdminLogin();