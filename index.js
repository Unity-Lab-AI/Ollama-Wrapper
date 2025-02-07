import { generateCompletion } from './src/core.js';

async function main() {
    console.log("Generating response...");
    const response = await generateCompletion('Why is the sky blue?');
    console.log("AI Response:", response);
}

main();
