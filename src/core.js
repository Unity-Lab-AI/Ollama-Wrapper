import axios from 'axios';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

/**
 * Generate text completion from a prompt with streaming support.
 * @param {string} text - The input text prompt
 * @param {object} config - Optional config parameters
 * @returns {Promise<string>}
 */
export async function generateCompletion(text, config = {}) {
    try {
        if (typeof text !== 'string') throw new Error('Text prompt must be a string.');

        const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
            model: 'llama3.1:8b-instruct-q4_1',
            messages: [{ role: 'user', content: text }],
            stream: true,
            ...config
        }, { responseType: 'stream' });

        return new Promise((resolve, reject) => {
            let fullResponse = '';

            response.data.on('data', chunk => {
                try {
                    const data = chunk.toString().trim();
                    const parsedData = JSON.parse(data);

                    if (parsedData.message && parsedData.message.content) {
                        process.stdout.write(parsedData.message.content);
                        fullResponse += parsedData.message.content;
                    }
                } catch (error) {
                    console.error('Error parsing chunk:', error.message);
                }
            });

            response.data.on('end', () => {
                console.log("\n[Streaming Complete]");
                resolve(fullResponse.trim().length > 0 ? fullResponse.trim() : "Error: No response received."); // ✅ Ensures response is not empty
            });

            response.data.on('error', error => {
                reject(`Error during streaming: ${error.message}`);
            });
        });

    } catch (error) {
        console.error("Error generating completion:", error.message);
        return "Error: Generation failed.";
    }
}

/**
 * Conduct a chat conversation with real-time streaming response.
 * @param {Array} messages - Array of user/system messages
 * @param {object} config - Optional config parameters
 * @returns {Promise<string>}
 */
export async function chat(messages, config = {}) {
    try {
        if (!Array.isArray(messages)) throw new Error('Messages must be an array.');

        const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
            model: 'llama3.1:8b-instruct-q4_1',
            messages,
            stream: true,
            ...config
        }, { responseType: 'stream' });

        return new Promise((resolve, reject) => {
            let fullResponse = '';
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

            response.data.on('data', chunk => {
                try {
                    const data = chunk.toString().trim();
                    const parsedData = JSON.parse(data);

                    if (parsedData.message && parsedData.message.content) {
                        process.stdout.write(parsedData.message.content);
                        fullResponse += parsedData.message.content;
                    }
                } catch (error) {
                    console.error('Error parsing chat chunk:', error.message);
                }
            });

            response.data.on('end', () => {
                console.log("\n[Chat Streaming Complete]");
                rl.close();
                resolve(fullResponse.trim().length > 0 ? fullResponse.trim() : "Error: No response received."); // ✅ Ensures response is not empty
            });

            response.data.on('error', error => {
                reject(`Error during chat streaming: ${error.message}`);
            });
        });

    } catch (error) {
        console.error("Chat request failed:", error.message);
        return "Error: Chat failed.";
    }
}

/**
 * Get list of available models by querying the correct API endpoint.
 * @returns {Promise<Array>}
 */
export async function listModels() {
    try {
        // Direct API call for listing models
        const response = await axios.get(`${OLLAMA_HOST}/api/tags`);
        
        // Ensure response structure is valid
        if (response.data && response.data.models) {
            return response.data.models.map(model => model.name);
        }

        console.warn("Unexpected response structure from /api/tags:", response.data);
        return [];
    } catch (error) {
        console.error("Failed to list models:", error.message);
        return [];
    }
}

/**
 * Get model metadata, returning only essential details.
 * @param {string} modelName - The name of the model
 * @returns {Promise<object>}
 */
export async function showModelInfo(modelName) {
    try {
        if (!modelName) throw new Error('Model name is required.');
        
        const response = await axios.post(`${OLLAMA_HOST}/api/show`, { model: modelName });

        if (!response.data) {
            throw new Error("API returned empty response.");
        }

        return {
            name: modelName,
            format: response.data.details?.format || "Unknown",
            parameter_size: response.data.details?.parameter_size || "Unknown",
            supported_families: response.data.details?.families || []
        };

    } catch (error) {
        console.error(`Failed to retrieve model info for ${modelName}:`, error.message);
        return null;
    }
}
