import { streamChat } from "../src/streaming.js";
import { jest } from "@jest/globals"; // ✅ Ensure Jest is available

const MODEL_NAME = "llama3.1:8b-instruct-q4_K_M"; // Ensure correct model name

test("should handle streaming chat requests", async () => {
    const response = await streamChat([{ role: "user", content: "Tell me a joke." }]);
    expect(response).toBeTruthy();
    expect(response).toHaveProperty("message");
    expect(response.message.length).toBeGreaterThan(5);
}, 90000);

afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Ensure API calls close properly
    jest.restoreAllMocks();
});
