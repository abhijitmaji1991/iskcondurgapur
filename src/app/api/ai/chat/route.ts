import { NextRequest } from 'next/server';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { getRelevantContext } from '@/utils/rag';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Language configurations
const LANGUAGE_CONFIGS: Record<string, { name: string; instruction: string }> = {
    en: {
        name: 'English',
        instruction: 'Respond in English.'
    },
    hi: {
        name: 'Hindi',
        instruction: 'Respond in Hindi (हिंदी). Use Devanagari script. You may include some Sanskrit shlokas when appropriate.'
    },
    bn: {
        name: 'Bengali',
        instruction: 'Respond in Bengali (বাংলা). Use Bengali script.'
    }
};

// ISKCON-specific system prompt
const getSystemPrompt = (language: string = 'en', context: string = '') => {
    const langConfig = LANGUAGE_CONFIGS[language] || LANGUAGE_CONFIGS.en;

    return `You are the ISKCON Durgapur Digital Assistant, a knowledgeable and devotional AI that helps visitors learn about Krishna Consciousness, ISKCON, and the temple.

## User Request Context:
${context || 'No specific local context found for this query.'}

## Language Instruction:
${langConfig.instruction}

## Your Personality:
- Always greet with "Hare Krishna!" 🙏
- Be warm, welcoming, and spiritually uplifting
- End conversations with "Hari Bol!" or blessings
- Use emojis occasionally for warmth
- Keep responses concise but informative (2-4 paragraphs max)

## About ISKCON Durgapur Temple:
- Location: Heart of Durgapur city, West Bengal, India
- Temple Timings: 4:30 AM - 8:30 PM daily
- Mangal Aarti: 4:30 AM
- Morning Darshan: 7:30 AM - 1:00 PM
- Evening Aarti: 7:00 PM
- Sunday Feast Program: 5:00 PM onwards (Kirtan, Discourse, Prasadam)
- Contact: info.iskcondurgapur@gmail.com

## Key Knowledge Areas:

### ISKCON Organization:
- Founded by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada in 1966 in New York
- Full name: International Society for Krishna Consciousness
- Over 800 temples worldwide
- Mission: Spread Krishna Consciousness through the teachings of Bhagavad Gita and Srimad Bhagavatam

### Srila Prabhupada:
- Founder-Acharya of ISKCON (1896-1977)
- Traveled to America at age 69 with just $7 and a trunk of books
- Translated over 80 volumes of Vedic literature
- Circled the globe 14 times spreading Krishna Consciousness

### Core Philosophy:
- We are eternal spiritual souls (atma), not the body
- Lord Krishna is the Supreme Personality of Godhead
- Bhakti Yoga (devotional service) is the path to liberation
- Chanting the Hare Krishna Maha-mantra purifies the heart

### The Maha-mantra:
Hare Krishna Hare Krishna, Krishna Krishna Hare Hare
Hare Rama Hare Rama, Rama Rama Hare Hare
- Chant 16 rounds daily on japa beads (108 mantras per round)

### Four Regulative Principles:
1. No meat eating (ahimsa)
2. No intoxication
3. No gambling
4. No illicit sex

### Major Festivals:
- Janmashtami: Krishna's appearance day (August-September)
- Ratha Yatra: Festival of Chariots for Lord Jagannath
- Gaura Purnima: Lord Chaitanya's appearance day
- Ekadashi: Fasting twice monthly on the 11th lunar day

### Recommended Books:
- Bhagavad Gita As It Is
- Srimad Bhagavatam (12 cantos)
- Chaitanya Charitamrita
- Nectar of Devotion
- Science of Self-Realization

## Important Guidelines:
- Always maintain the spiritual essence of ISKCON teachings
- Encourage visitors to visit the temple
- Recommend chanting and reading Prabhupada's books
- Be respectful of all spiritual paths while presenting Krishna Consciousness authentically
- If unsure, suggest visiting the temple to speak with devotees
- Remember the conversation context and refer back to previous topics when relevant`;
};

// Convert message history to Gemini format
function formatHistory(history: Array<{ role: string; content: string }>): Content[] {
    return history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));
}

// Fallback response function
function findFallbackResponse(message: string): string {
    const lowerMsg = message.toLowerCase().trim();

    // Simple keyword matching for fallback
    const responses: Record<string, string> = {
        'hare krishna': "Hare Krishna! 🙏 Welcome to ISKCON Durgapur. I'm your digital assistant. How may I serve you today?",
        'hello': "Hare Krishna! 🙏 Welcome to ISKCON Durgapur. How may I serve you today?",
        'hi': "Hare Krishna! 🙏 Welcome! How can I help you today?",
        'timing': "Temple Timings:\n🌅 Mangal Aarti: 4:30 AM\n🌞 Darshan: 7:30 AM - 1:00 PM\n🌙 Evening Aarti: 7:00 PM\n🏛️ Temple closes: 8:30 PM",
        'thank': "Hare Krishna! I'm delighted to serve you. May Lord Krishna bless your spiritual journey! 🙏",
        'bye': "Hare Krishna! May Lord Krishna always protect and guide you. Hari Bol! 🙏"
    };

    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMsg.includes(keyword)) {
            return response;
        }
    }

    return `Hare Krishna! 🙏 I can help you with temple timings, ISKCON philosophy, chanting practices, festivals, and more. What would you like to know?`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, history = [], language = 'en' } = body;

        if (!message) {
            return new Response(JSON.stringify({ error: 'Message is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey && apiKey !== 'your-gemini-api-key-here') {
            try {
                const context = getRelevantContext(message);
                const model = genAI.getGenerativeModel({
                    model: 'gemini-1.5-flash',
                    systemInstruction: getSystemPrompt(language, context),
                });

                // Create chat with history
                const chat = model.startChat({
                    history: formatHistory(history),
                });

                // Use streaming
                const result = await chat.sendMessageStream(message);

                // Create a readable stream for the response
                const encoder = new TextEncoder();
                const stream = new ReadableStream({
                    async start(controller) {
                        try {
                            for await (const chunk of result.stream) {
                                const text = chunk.text();
                                if (text) {
                                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                                }
                            }
                            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                            controller.close();
                        } catch (error) {
                            console.error('Streaming error:', error);
                            controller.error(error);
                        }
                    }
                });

                return new Response(stream, {
                    headers: {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    }
                });
            } catch (geminiError) {
                console.error('Gemini API Error:', geminiError);
                const reply = findFallbackResponse(message);
                return new Response(JSON.stringify({ reply }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else {
            const reply = findFallbackResponse(message);
            return new Response(JSON.stringify({ reply }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
