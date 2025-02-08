import { jest } from '@jest/globals';
import { generateCompletion, chat, listModels, showModelInfo } from '../src/core.js';

jest.setTimeout(90000); // ⏳ Extend Jest timeout globally to 90s

describe("Core API Tests", () => {
    test('should return a list of available models', async () => {
        const models = await listModels();
        expect(models).toBeInstanceOf(Array);
        expect(models.length).toBeGreaterThan(0);
    }, 90000); // ✅ Increased timeout

    test('should generate text completion', async () => {
        const result = await generateCompletion('Tell me a joke.');
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(5);
    }, 90000); // ✅ Increased timeout

    test('should handle chat requests', async () => {
        const response = await chat([{ role: 'user', content: 'What day is it?' }]);
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(5);
    }, 90000); // ✅ Increased timeout

    test('should retrieve model information', async () => {
        const modelInfo = await showModelInfo('llama3.1:8b-instruct-q4_1');
        expect(modelInfo).toHaveProperty('name');
        expect(modelInfo).toHaveProperty('format');
    }, 90000);
});
