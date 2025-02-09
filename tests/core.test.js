import { generateCompletion, chatWithJSON, listModels, showModelInfo } from "../src/core.js";
import { jest } from "@jest/globals"; // ✅ Ensure Jest is available

const MODEL_NAME = "llama3.1:8b-instruct-q4_K_M"; // Ensure correct model name

test("should generate a completion", async () => {
    const response = await generateCompletion("Tell me a joke.");
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(5);
}, 90000);

test("should handle chat requests", async () => {
    const response = await chatWithJSON([{ role: "user", content: "What day is it?" }]);
    expect(response).toBeDefined();
    expect(response).toHaveProperty("message");
}, 90000);

test("should list available models", async () => {
    const models = await listModels();
    expect(models.length).toBeGreaterThan(0);
}, 90000);

test("should retrieve model information", async () => {
    const modelInfo = await showModelInfo(MODEL_NAME);
    expect(modelInfo).toHaveProperty("name");
    expect(modelInfo).toHaveProperty("format");
}, 90000);

afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Ensure API calls close properly
    jest.restoreAllMocks();
});
