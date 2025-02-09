import { generateCompletion, chatWithJSON, listModels, showModelInfo } from "./core.js";
import { streamChat } from "./streaming.js";

const MODEL_NAME = "llama3.1:8b-instruct-q4_K_M";

async function main() {
    console.log("🚀 Running Ollama Wrapper Test");

    const models = await listModels();
    console.log("✅ Available Models:", models);

    const modelInfo = await showModelInfo(MODEL_NAME);
    console.log("✅ Model Info:", modelInfo);

    const completion = await generateCompletion("Tell me a fun fact.");
    console.log("💡 Fun Fact:", completion);

    const chatResponse = await chatWithJSON([{ role: "user", content: "What day is it?" }]);
    console.log("🗨️ Chat Response:", chatResponse);

    console.log("📡 Streaming Chat:");
    await streamChat([{ role: "user", content: "Tell me a joke." }]);

    console.log("✅ All Tests Complete!");
}

main();
