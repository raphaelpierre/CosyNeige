import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('🧪 Test de la connexion admin...');
    
    const loginData = {
      email: 'admin@chalet-balmotte810.com',
      password: 'admin123!'
    };

    console.log('📤 Envoi de la requête de connexion...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    console.log('📥 Status de la réponse:', response.status);
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('✅ Connexion réussie !');
      console.log('- User ID:', responseData.user?.id);
      console.log('- Email:', responseData.user?.email);
      console.log('- Nom:', responseData.user?.firstName, responseData.user?.lastName);
      console.log('- Rôle:', responseData.user?.role);
      console.log('- Token présent:', !!responseData.token);
    } else {
      console.log('❌ Échec de la connexion:');
      console.log('- Erreur:', responseData.error || 'Erreur inconnue');
      console.log('- Réponse complète:', JSON.stringify(responseData, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testLogin();