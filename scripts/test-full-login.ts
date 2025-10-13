import fetch from 'node-fetch';

async function testFullLoginFlow() {
  try {
    console.log('🧪 Test du flux de connexion complet...\n');
    
    // 1. Test de connexion
    console.log('1️⃣ Connexion...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@chalet-balmotte810.com',
        password: 'admin123!'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.log('❌ Échec de la connexion:', error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Connexion réussie');
    
    // Récupérer le cookie de session
    const cookies = loginResponse.headers.get('set-cookie') || '';
    console.log('🍪 Cookies reçus:', cookies ? 'OUI' : 'NON');

    // 2. Test de /api/auth/me avec le cookie
    console.log('\n2️⃣ Test de /api/auth/me...');
    const meResponse = await fetch('http://localhost:3000/api/auth/me', {
      headers: {
        'Cookie': cookies
      }
    });

    console.log('📥 Status /api/auth/me:', meResponse.status);

    if (meResponse.ok) {
      const userData = await meResponse.json();
      console.log('✅ Données utilisateur récupérées:');
      console.log('- ID:', userData.id);
      console.log('- Email:', userData.email);
      console.log('- Nom:', userData.firstName, userData.lastName);
      console.log('- Rôle:', userData.role);
      console.log('- Phone:', userData.phone);
      
      if (userData.role === 'admin') {
        console.log('\n🎉 L\'utilisateur a bien le rôle ADMIN - Le menu admin devrait apparaître !');
      }
    } else {
      const error = await meResponse.json();
      console.log('❌ Erreur /api/auth/me:', error);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testFullLoginFlow();