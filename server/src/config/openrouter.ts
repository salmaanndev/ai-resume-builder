import { OpenRouter } from '@openrouter/sdk';

const PLACEHOLDER_KEY = 'your-openrouter-api-key-here';
const DEFAULT_MODEL = 'cohere/north-mini-code:free';

export const isOpenRouterConfigured = (): boolean => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  return Boolean(apiKey && apiKey !== PLACEHOLDER_KEY);
};

export const getOpenRouter = (): OpenRouter | null => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === PLACEHOLDER_KEY) return null;

  return new OpenRouter({
    apiKey,
    httpReferer: process.env.CLIENT_URL || 'http://localhost:5173',
    appTitle: 'AI-Resume Builder',
  });
};

export const getModel = (): string => process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

export const chatComplete = async (prompt: string, jsonMode = false): Promise<string> => {
  const openrouter = getOpenRouter();
  if (!openrouter) {
    throw new Error('OpenRouter API key not configured');
  }

  const result = await openrouter.chat.send({
    chatRequest: {
      model: getModel(),
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      temperature: 0.7,
      ...(jsonMode ? { responseFormat: { type: 'json_object' as const } } : {}),
    },
  });

  const content = result.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('No response from AI');
  }

  return content;
};

export const parseJsonResponse = (content: string): unknown => {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) return JSON.parse(codeBlock[1].trim());

    const objectMatch = trimmed.match(/\{[\s\S]*\}/);
    if (objectMatch) return JSON.parse(objectMatch[0]);

    const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);

    throw new Error('Invalid JSON response from AI');
  }
};
