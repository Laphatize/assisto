const OpenAI = require("openai");

const hasOpenAI = !!process.env.OPENAI_API_KEY;
const openai = hasOpenAI ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

module.exports = { openai, hasOpenAI };
