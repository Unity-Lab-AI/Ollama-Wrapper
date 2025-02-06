import { Ollama } from 'ollama';
import dotenv from 'dotenv';
dotenv.config();

const ollamaHost = process.env.OLLAMA_HOST;

const ollama = new Ollama({ host: ollamaHost });

const response = await ollama.chat({
  model: 'DeepSeek-R1-14B-Tooling:latest',
  messages: [{ role: 'user', content: 'Why is the sky blue?' }],
});

console.log(response.message.content);
