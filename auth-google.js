// auth-google.js
// Логіка Google OAuth + надсилання даних у n8n → Google Sheets

// ------------------------
// CONFIG
// ------------------------
const GOOGLE_CLIENT_ID = "225496350184-4q6j2iqu5n9hkjt8u4age31bd4nkmedo.apps.googleusercontent.com";
const N8N_WEBHOOK_URL = "https://narodocnt.online:5678/webhook/google-signup";

// ------------------------
// Відкрити Google OAuth для входу
// ------------------------
function loginWithGoogle() {
    const redirectUri = `${window.location.origin}/oauth2callback.html`;

    const oauthUrl = 
        "https://accounts.google.com/o/oauth2/v2/auth" +
        `?client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${redirectUri}` +
        "&response_type=token" +
        "&scope=email profile" +
        "&include_granted_scopes=true";

    window.location.href = oauthUrl;
}

// ------------------------
// Отримання даних користувача з Google
// ------------------------
async function getGoogleUserInfo(accessToken) {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return await response.json();
}

// ------------------------
// Надсилання даних користувача у n8n
// ------------------------
async function sendUserToN8N(user) {
    try {
        await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        console.log("User sent to n8n:", user);
    } catch (err) {
        console.error("Error sending to n8n:", err);
    }
}

// ------------------------
// Обробка redirect після Google OAuth
// ------------------------
async function handleOAuthRedirect() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (!accessToken) {
        document.body.innerHTML = "<h3>Не вдалося авторизуватися</h3>";
        return;
    }

    const user = await getGoogleUserInfo(accessToken);

    await sendUserToN8N({
        email: user.email,
        name: user.name,
        picture: user.picture,
        login_time: new Date().toISOString()
    });

    // Повернення на головну сторінку після входу
    window.location.href = "/";
}
