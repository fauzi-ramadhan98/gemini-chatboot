document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  // The backend API endpoint
  const API_URL = '/api/chat';

  /**
   * Appends a message to the chat box.
   * @param {string} message - The message content.
   * @param {string} sender - The sender of the message ('user' or 'bot').
   * @returns {HTMLElement} The created message element.
   */
  const addMessage = (message, sender) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement;
  };

  /**
   * Handles the form submission to send a message to the chatbot.
   * @param {Event} event - The form submission event.
   */
  const handleChatSubmit = async (event) => {
    event.preventDefault();
    const userMessage = userInput.value.trim();

    if (!userMessage) {
      return;
    }

    // 1. Add user's message to the chat box
    addMessage(userMessage, 'user');
    userInput.value = ''; // Clear the input field

    // 2. Show a temporary "Thinking..." bot message
    const thinkingMessageElement = addMessage('Thinking...', 'bot');

    try {
      // 3. Send the user's message to the backend API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // 4. Replace "Thinking..." with the AI's reply
      if (data.result) {
        thinkingMessageElement.textContent = data.result;
      } else {
        // 5. Handle cases where no result is received
        thinkingMessageElement.textContent = 'Sorry, no response was received.';
      }
    } catch (error) {
      // 5. Handle fetch errors or server errors
      console.error('Failed to get response from server:', error);
      thinkingMessageElement.textContent = 'Failed to get response from the server.';
      thinkingMessageElement.classList.add('error');
    }
  };

  chatForm.addEventListener('submit', handleChatSubmit);
});
