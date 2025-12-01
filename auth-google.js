/* auth-google.js */
// Google OAuth 2.0 для вашого сайту

const GOOGLE_CLIENT_ID = '225496350184-4q6j2iqu5n9hkjt8u4age31bd4nkmedo.apps.googleusercontent.com';
const N8N_WEBHOOK = 'https://narodocnt.online:5678/webhook/google-signup';

// Функція для початку входу через Google
function startGoogleSignIn() {
  const redirectUri = 'https://narodocnt.online/oauth2callback'; // має точно збігатися з Google Cloud
  const scope = encodeURIComponent('openid email profile');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&prompt=select_account`;
  window.location.href = url;
}

// Обробка Google redirect
async function handleGoogleRedirect() {
  const hash = window.location.hash.substr(1); // отримуємо все після #
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');

  if (token) {
    console.log('Google Access Token:', token);

    // Надсилаємо токен на n8n для обробки
    try {
      await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'google', access_token: token, ts: new Date().toISOString() })
      });
      alert('Вхід через Google успішний! Дані відправлено на сервер.');
    } catch (err) {
      console.error('Помилка відправки на n8n:', err);
      alert('Помилка відправки даних на сервер.');
    }

    // Очищаємо URL
    window.history.replaceState(null, '', window.location.pathname);
  }
}

// Якщо ми на сторінці oauth2callback — обробляємо redirect
if (window.location.pathname === '/oauth2callback') {
  handleGoogleRedirect();
}
