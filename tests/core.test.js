import { generateCompletion, chat, listModels, showModelInfo } from '../src/core.js';

test('should return a list of available models', async () => {
    const models = await listModels();
    expect(models).toBeInstanceOf(Array);
    expect(models.length).toBeGreaterThan(0);
});

test('should generate text completion', async () => {
    const result = await generateCompletion('Tell me a joke.');

    // Ensure the response is non-empty
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(5);
});

test('should handle chat requests', async () => {
    const response = await chat([{ role: 'user', content: 'How are you?' }]);

    // Ensure the response is non-empty
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(5);
});

test('should retrieve model information', async () => {
    const modelInfo = await showModelInfo('llama3.1:8b-instruct-q4_1');

    expect(modelInfo).toHaveProperty('name');
    expect(modelInfo).toHaveProperty('format');
});
