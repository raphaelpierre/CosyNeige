// Script de test pour les API du chalet
const BASE_URL = 'http://localhost:3000';

async function testAPI(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`\n🔍 Testing ${method} ${endpoint}`);
    console.log('Data:', data);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('✅ Success');
    } else {
      console.log('❌ Error');
    }
    
    return { success: response.ok, data: result, status: response.status };
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests for Chalet Les Sires\n');

  // Test 1: Register a new user
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '+33123456789'
  };

  const registerResult = await testAPI('/api/auth/register', 'POST', testUser);

  // Test 2: Try to register the same user (should fail)
  await testAPI('/api/auth/register', 'POST', testUser);

  // Test 3: Login
  const loginResult = await testAPI('/api/auth/login', 'POST', {
    email: testUser.email,
    password: testUser.password
  });

  // Test 4: Contact form
  await testAPI('/api/contact', 'POST', {
    name: 'Marie Martin',
    email: 'marie@example.com',
    subject: 'Demande de réservation',
    message: 'Bonjour, je souhaiterais réserver le chalet pour le weekend du 25-26 novembre.'
  });

  // Test 5: Create a reservation
  await testAPI('/api/reservations', 'POST', {
    guestName: 'Pierre Durand',
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre@example.com',
    phone: '+33987654321',
    checkIn: '2024-12-15T14:00:00Z',
    checkOut: '2024-12-17T11:00:00Z',
    guests: 4,
    totalPrice: 350.00,
    message: 'Réservation pour un weekend en famille'
  });

  // Test 6: Get reservations
  await testAPI('/api/reservations', 'GET');

  // Test 7: Create booked period
  await testAPI('/api/booked-periods', 'POST', {
    startDate: '2024-12-20T00:00:00Z',
    endDate: '2024-12-25T23:59:59Z'
  });

  // Test 8: Get booked periods
  await testAPI('/api/booked-periods', 'GET');

  // Test 9: Send a message
  await testAPI('/api/messages', 'POST', {
    subject: 'Question sur les équipements',
    content: 'Bonjour, y a-t-il une machine à laver dans le chalet ?',
    fromEmail: 'client@example.com',
    fromName: 'Sophie Leblanc'
  });

  // Test 10: Get messages
  await testAPI('/api/messages', 'GET');

  console.log('\n🏁 Tests completed!');
}

// Run the tests
runTests().catch(console.error);