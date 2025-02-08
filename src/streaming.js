import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = 'llama3.1:8b-instruct-q4_1';

/**
 * Stream chat responses in real-time with retry logic and error handling.
 * @param {Array} messages - Conversation history (user/system)
 * @param {object} config - Additional options (e.g., temperature, max tokens)
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<string>}
 */
export async function streamChat(messages, config = {}, retries = 3) {
    if (!Array.isArray(messages)) throw new Error('Messages must be an array.');

    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
                model: DEFAULT_MODEL,
                messages,
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
                        console.error('❌ Error parsing chat chunk:', error.message);
                    }
                });

                response.data.on('end', () => {
                    if (!process.env.JEST_WORKER_ID) { // ✅ Suppress logs when running Jest
                        console.log("\n✅ [Streaming Complete]");
                    }
                    response.data.destroy(); // ✅ Ensure proper cleanup
                    resolve(fullResponse.trim().length > 0 ? fullResponse.trim() : "❌ Error: No response received.");
                });

                response.data.on('error', error => {
                    reject(`❌ Error during chat streaming: ${error.message}`);
                });
            });

        } catch (error) {
            console.error(`❌ Attempt ${i + 1}: Streaming chat failed -`, error.message);
            if (i === retries - 1) console.error('❌ Maximum retry attempts reached.');
        }
    }
}

/**
 * Fetch a structured JSON response from a chat model with error handling.
 * @param {Array} messages - User messages
 * @returns {Promise<object>}
 */
export async function chatWithJSON(messages) {
    try {
        const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
            model: DEFAULT_MODEL,
            messages,
            format: 'json',
            stream: false,
            max_tokens: 200 // ✅ Limits response length to prevent hallucinations
        });

        if (!response.data || !response.data.message) {
            throw new Error('❌ Empty response received.');
        }

        // ✅ Ensure content is not empty
        let parsedContent;
        const rawContent = response.data.message?.content;

        if (typeof rawContent === 'string' && rawContent.trim() !== "") {
            try {
                parsedContent = JSON.parse(rawContent);
            } catch (error) {
                console.error("❌ Error parsing JSON response:", error.message);
                parsedContent = { error: "Failed to parse JSON response" };
            }
        } else if (typeof rawContent === 'object' && Object.keys(rawContent).length > 0) {
            parsedContent = rawContent; // ✅ Use existing structured JSON if available
        } else {
            parsedContent = { error: "No structured data returned. Defaulting to text response." };
        }

        return { ...response.data, message: { ...response.data.message, content: parsedContent } };
    } catch (error) {
        console.error("❌ Error fetching structured chat response:", error.message);
        return { error: '❌ Failed to retrieve JSON output. Defaulting to text response.' };
    }
}
