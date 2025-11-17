import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const apiKeySection = document.getElementById('api-key-section');
const chatSection = document.getElementById('chat-section');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatHistoryContainer = document.querySelector('.chat-history-container');

let genAI;
let chat;

// Initialize the app
function init() {
    const apiKey = localStorage.getItem('gemini-api-key');
    if (apiKey) {
        apiKeySection.classList.add('hidden');
        chatSection.classList.remove('hidden');
        setupChat(apiKey);
    } else {
        apiKeySection.classList.remove('hidden');
        chatSection.classList.add('hidden');
    }
}

// Setup the chat with the provided API key
async function setupChat(apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 4000
            }
        });

        // A simple call to validate the API key.
        await model.countTokens("test");

        chat = model.startChat();
        appendMessage("你好！我是 Gemini，請問有什麼可以幫助你的嗎？", "model");

    } catch (error) {
        console.error("Failed to initialize Generative AI:", error);
        appendMessage("API 金鑰驗證失敗。請重新整理頁面，然後輸入一個有效的金鑰。", 'model');
        messageInput.disabled = true;
        sendBtn.disabled = true;
    }
}

// Save the API key and set up the chat
saveKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('gemini-api-key', apiKey);

        apiKeySection.classList.add('hidden');
        chatSection.classList.remove('hidden');

        setupChat(apiKey);
    } else {
        alert("請輸入有效的 API 金鑰。");
    }
});

// Send a message to the chatbot
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || sendBtn.disabled) return;

    appendMessage(message, 'user');
    messageInput.value = '';
    sendBtn.disabled = true;

    try {
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        appendMessage(text, 'model');
    } catch (error) {
        console.error("Error sending message:", error);
        appendMessage("糟糕，訊息傳送失敗。請檢查主控台以獲取更多資訊。", 'model');
    } finally {
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

// Append a message to the chat history
function appendMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');
    messageElement.innerHTML = formattedText;
    chatHistory.appendChild(messageElement);
    scrollToBottom();
}

// Scroll the chat history to the bottom
function scrollToBottom() {
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize the textarea
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = `${messageInput.scrollHeight}px`;
});

init();
