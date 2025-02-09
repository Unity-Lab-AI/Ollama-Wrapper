import { Ollama } from "ollama";

const ollama = new Ollama();
const MODEL_NAME = "llama3.1:8b-instruct-q4_K_M"; // Ensure this matches `ollama list`

export async function generateCompletion(prompt) {
    try {
        console.log(`📡 Sending completion request for: ${prompt}`);
        const response = await ollama.chat({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }]
        });

        console.log("✅ API Response:", response);
        return response.message.content;
    } catch (error) {
        console.error("❌ Error generating completion:", error.message);
        return "Error: Generation failed.";
    }
}

export async function chatWithJSON(messages) {
    try {
        console.log("📡 Sending structured chat request:", JSON.stringify({ model: MODEL_NAME, messages }, null, 2));
        const response = await ollama.chat({
            model: MODEL_NAME,
            messages,
            format: "json"
        });

        console.log("✅ API Response:", response);
        return response;
    } catch (error) {
        console.error("❌ Error fetching structured chat response:", error.message);
        return { error: "❌ Failed to retrieve JSON output. Defaulting to text response." };
    }
}

export async function listModels() {
    try {
        const models = await ollama.list();
        console.log("✅ Available models:", models.models);
        return models.models;
    } catch (error) {
        console.error("❌ Failed to retrieve model list:", error.message);
        return [];
    }
}

export async function showModelInfo(modelName) {
    try {
        console.log(`📡 Fetching model info for: ${modelName}`);
        const response = await ollama.show({ model: modelName });

        console.log("✅ Model Info:", response);

        // Ensure `name` and `format` exist
        return {
            name: modelName, // Use the requested model name
            format: response.details?.format || "unknown",
            details: response.details
        };
    } catch (error) {
        console.error(`❌ Failed to retrieve model info for ${modelName}:`, error.message);
        return null;
    }
}
