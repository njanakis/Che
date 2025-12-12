// Постав сюди свій правильний webhook від n8n
const N8N_WEBHOOK = "https://n8n.narodocnt.online/webhook/email-signup";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!name || !email || !password) {
        return alert("Всі поля обов'язкові!");
    }

    try {
        const res = await fetch(N8N_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                password,
                ts: new Date().toISOString()
            })
        });

        if (res.ok) {
            alert("Реєстрація успішна! Дані збережено.");
            form.reset();
        } else {
            alert("Помилка реєстрації. Спробуйте ще раз.");
        }
    } catch (err) {
        console.error(err);
        alert("Помилка з'єднання з сервером. Спробуйте пізніше.");
    }
});
