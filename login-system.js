// === login-system.js (FULLY FIXED VERSION) ===
// Google OAuth + Facebook OAuth + n8n integration
// Works for domains:
// https://narodocnt.online
// https://www.narodocnt.online

// ---------------------------
// CONFIG
// ---------------------------
const GOOGLE_CLIENT_ID = "225496350184-2v39q3dt1p9k22g52q6ko4vqri7h7tqr.apps.googleusercontent.com";

// n8n webhook URL (PUT YOURS HERE!)
const N8N_WEBHOOK = "https://n8n.yourdomain.com/webhook/login"; // <--- replace

// Facebook App ID (REPLACE!)
const FB_APP_ID = "YOUR_FACEBOOK_APP_ID";

// ---------------------------
// GOOGLE LOGIN
// ---------------------------
function initGoogleLogin() {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleLogin,
  });

  google.accounts.id.renderButton(
    document.getElementById("google-login-btn"),
    { theme: "outline", size: "large", width: "100%" }
  );
}

async function handleGoogleLogin(response) {
  const token = response.credential;

  const payload = JSON.parse(atob(token.split(".")[1]));

  const userData = {
    provider: "google",
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };

  sendToN8N(userData);
}

// ---------------------------
// FACEBOOK LOGIN
// ---------------------------
window.fbAsyncInit = function () {
  FB.init({ appId: FB_APP_ID, cookie: true, xfbml: true, version: "v21.0" });
};

function facebookLogin() {
  FB.login(
    function (response) {
      if (response.authResponse) {
        FB.api("/me", { fields: "name,email,picture" }, function (user) {
          const userData = {
            provider: "facebook",
            name: user.name,
            email: user.email,
            picture: user.picture?.data?.url,
          };
          sendToN8N(userData);
        });
      }
    },
    { scope: "email,public_profile" }
  );
}

// ---------------------------
// SEND TO N8N
// ---------------------------
async function sendToN8N(data) {
  try {
    await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    window.location.href = "/index.html"; // success
  } catch (error) {
    console.error("n8n error", error);
    alert("Помилка збереження даних.");
  }
}

// ---------------------------
// EXPORT
// ---------------------------
window.initGoogleLogin = initGoogleLogin;
window.facebookLogin = facebookLogin;
