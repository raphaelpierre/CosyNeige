// Test simple de l'API
async function testSimple() {
  try {
    console.log('🧪 Test simple de l\'API...');
    
    // Test 1: Créer un utilisateur
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'simple-test@example.com',
        password: 'password123',
        firstName: 'Simple',
        lastName: 'Test'
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Utilisateur créé avec succès:', result);
    } else {
      console.log('⚠️  Erreur (normale si utilisateur existe déjà):', result);
    }

    // Test 2: Login
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'simple-test@example.com',
        password: 'password123'
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Connexion réussie pour:', loginResult.user.email);
    } else {
      console.log('❌ Erreur de connexion:', loginResult);
    }

    // Test 3: Créer une réservation
    const reservationResponse = await fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestName: 'Test Reservation',
        firstName: 'Test',
        lastName: 'Reservation', 
        email: 'test-reservation@example.com',
        phone: '+33123456789',
        checkIn: '2024-12-20T15:00:00Z',
        checkOut: '2024-12-22T11:00:00Z',
        guests: 2,
        totalPrice: 250.00,
        message: 'Test de réservation via API'
      })
    });

    const reservationResult = await reservationResponse.json();
    
    if (reservationResponse.ok) {
      console.log('✅ Réservation créée avec succès:', reservationResult.id);
    } else {
      console.log('❌ Erreur de réservation:', reservationResult);
    }

    // Test 4: Récupérer les réservations
    const getReservationsResponse = await fetch('http://localhost:3000/api/reservations');
    const reservations = await getReservationsResponse.json();
    
    if (getReservationsResponse.ok) {
      console.log(`✅ ${reservations.length} réservation(s) trouvée(s) dans la base`);
    } else {
      console.log('❌ Erreur récupération réservations:', reservations);
    }

  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }
}

testSimple();