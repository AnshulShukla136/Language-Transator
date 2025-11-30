
    async function sendMessage() {
        const userInput = document.getElementById("user-input");
        const chatBox = document.getElementById("chat-box");
        const fromLang = document.getElementById("from-language").value;
        const toLang = document.getElementById("to-language").value;

        const message = userInput.value.trim();
        if (message === "") return;

        const userMsg = document.createElement("div");
        userMsg.classList.add("message", "user-message");
        userMsg.innerText = message;
        chatBox.appendChild(userMsg);

        const botMsg = document.createElement("div");
        botMsg.classList.add("message", "bot-message");
        botMsg.innerText = "Translating...";
        chatBox.appendChild(botMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(message)}&langpair=${fromLang}|${toLang}`);
            const data = await response.json();

            botMsg.innerText = data.responseData.translatedText || "Translation error!";
        } catch (error) {
            botMsg.innerText = "Error: Could not translate message.";
            console.error("Translation error:", error);
        }

        userInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }