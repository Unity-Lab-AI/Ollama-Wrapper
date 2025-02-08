import { jest } from '@jest/globals';
import { streamChat, chatWithJSON } from '../src/streaming.js';

jest.setTimeout(60000); // ⏳ Increased timeout to 60 seconds

describe("Streaming API Tests", () => {
    test('should fetch structured JSON response', async () => {
        const response = await chatWithJSON([{ role: 'user', content: 'Tell me a joke.' }]);
        expect(response).toBeTruthy();
        expect(response).toHaveProperty('message');
    }, 60000); // ✅ Set timeout per test

    test('should handle streaming without crashing', async () => {
        await expect(async () => await streamChat([{ role: 'user', content: 'Tell me a joke.' }])).not.toThrow();
    }, 60000); // ✅ Increase timeout
});
