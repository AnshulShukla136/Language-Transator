async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const fromLang = document.getElementById("from-language").value;
    const toLang = document.getElementById("to-language").value;

    const message = userInput.value.trim();
    if (message === "") return;

    // ── User bubble ──────────────────────────────
    const userMsg = document.createElement("div");
    userMsg.classList.add("message", "user-message");
    userMsg.innerHTML = `
        <span class="message-label">You</span>
        <div class="message-bubble">${escapeHTML(message)}</div>
    `;
    chatBox.appendChild(userMsg);
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // ── Bot typing indicator ─────────────────────
    const botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot-message");
    botMsg.innerHTML = `
        <span class="message-label">Bot</span>
        <div class="message-bubble">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // ── Fetch translation ────────────────────────
    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(message)}&langpair=${fromLang}|${toLang}`
        );
        const data = await response.json();
        const translated = data.responseData?.translatedText || "Translation error!";

        botMsg.innerHTML = `
            <span class="message-label">Bot</span>
            <div class="message-bubble">${escapeHTML(translated)}</div>
        `;
    } catch (error) {
        botMsg.innerHTML = `
            <span class="message-label">Bot</span>
            <div class="message-bubble" style="color:#f87171;">⚠️ Could not translate. Check your connection.</div>
        `;
        console.error("Translation error:", error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Prevent XSS from user input or API response
function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Allow sending with Enter key
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("user-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
