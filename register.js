// URL твого webhook у n8n
const N8N_WEBHOOK = "https://n8n.narodocnt.online/webhook/email-signup";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone ? form.phone.value.trim() : '';
    const password = form.password.value; // за бажанням можна хешувати

    // Валідація на стороні клієнта
    if (!name || !email || !password) {
        return alert("Всі обов'язкові поля повинні бути заповнені!");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return alert("Введено некоректний email!");
    }

    try {
        const res = await fetch(N8N_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password, ts: new Date().toISOString() })
        });

        if (res.ok) {
            alert("Реєстрація успішна! Перевірте пошту для підтвердження (якщо налаштовано).");
            form.reset();
        } else {
            const text = await res.text();
            alert("Помилка реєстрації: " + text);
        }
    } catch (err) {
        console.error(err);
        alert("Помилка з'єднання з сервером. Спробуйте пізніше.");
    }
});
