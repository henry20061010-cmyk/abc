document.addEventListener('DOMContentLoaded', () => {
    const apiKeySection = document.getElementById('api-key-section');
    const chatSection = document.getElementById('chat-section');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveKeyButton = document.getElementById('save-key-button');
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    let genAI;
    let chat;

    // Initialize the UI based on API key availability
    function initializeUI() {
        const apiKey = localStorage.getItem('gemini-api-key');
        if (apiKey) {
            try {
                genAI = new google.generativeai.GoogleGenerativeAI(apiKey);
                showChat();
                initializeChat();
            } catch (error) {
                console.error('Invalid API Key:', error);
                alert('您的 API 金鑰無效，請重新輸入。');
                localStorage.removeItem('gemini-api-key');
                showApiKeySection();
            }
        } else {
            showApiKeySection();
        }
    }

    function showApiKeySection() {
        apiKeySection.classList.remove('hidden');
        chatSection.classList.add('hidden');
    }

    function showChat() {
        apiKeySection.classList.add('hidden');
        chatSection.classList.remove('hidden');
    }

    function initializeChat() {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                maxOutputTokens: 4000
            }
        });
        chat = model.startChat();
    }

    // Save API key
    saveKeyButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            try {
                // Test the key by creating a new instance
                new google.generativeai.GoogleGenerativeAI(apiKey);
                localStorage.setItem('gemini-api-key', apiKey);
                genAI = new google.generativeai.GoogleGenerativeAI(apiKey);
                showChat();
                initializeChat();
            } catch (error) {
                console.error('Invalid API Key:', error);
                alert('您提供的 API 金鑰無效，請檢查後再試。');
            }
        } else {
            alert('請輸入您的 API 金鑰。');
        }
    });

    // Send message
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        addMessageToChat('user', message);
        messageInput.value = '';

        try {
            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();
            addMessageToChat('model', text);
        } catch (error) {
            console.error('Error sending message:', error);
            addMessageToChat('model', '發生錯誤，請稍後再試。');
        }
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'model-message');
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the latest message
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    initializeUI();
});
