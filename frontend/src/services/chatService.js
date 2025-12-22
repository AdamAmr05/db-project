import api from './api';

export const chatService = {
    /**
     * Send a message to the AI chat endpoint
     * @param {string} message - The user's message
     * @param {Array} history - Previous conversation history
     * @returns {Promise} API response with AI's reply
     */
    sendMessage: async (message, history = []) => {
        return api.post('/chat', { message, history });
    }
};
