import ollama from "ollama";

const MODEL_NAME = "llama3.1:8b-instruct-q4_K_M"; // Ensure this matches `ollama list`

export async function streamChat(messages) {
    try {
        console.log("📡 Sending streaming request:", JSON.stringify({ model: MODEL_NAME, messages }, null, 2));

        // Initiating streaming request
        const response = await ollama.chat({
            model: MODEL_NAME,
            messages,
            stream: true, // ✅ Enable streaming mode
        });

        console.log("✅ Streaming Response:");
        let output = "";

        // ✅ Correct way to handle streaming responses
        for await (const part of response) {
            process.stdout.write(part.message.content);
            output += part.message.content;
        }

        console.log("\n✅ [Streaming Complete]");
        return { message: output };
    } catch (error) {
        console.error("❌ Streaming failed:", error.message);
        return { error: "Streaming request failed." };
    }
}
