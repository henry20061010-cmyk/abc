document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const recommendedQuestions = document.getElementById('recommended-questions');

    // Function to check if chat history is empty and toggle recommended questions
    const checkChatHistory = () => {
        if (chatHistory.children.length === 0) {
            recommendedQuestions.style.display = 'block';
        } else {
            recommendedQuestions.style.display = 'none';
        }
    };

    // Initial check when the page loads
    checkChatHistory();

    // Example of how to add a message to the chat history
    // and hide the recommended questions.
    // In a real application, this would be triggered by user input.
    const addMessage = (message) => {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        chatHistory.appendChild(messageElement);
        checkChatHistory();
    };

    // Add click event listeners to the recommended question buttons
    const buttons = recommendedQuestions.getElementsByTagName('button');
    for (const button of buttons) {
        button.addEventListener('click', () => {
            addMessage(button.textContent);
        });
    }
});
