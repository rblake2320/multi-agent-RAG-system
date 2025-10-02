import { GoogleGenAI, Type } from "@google/genai";
import { marked } from 'marked';
import { AppResponse, Source, Stage } from "../types";

// Per guidelines, assume API_KEY is available in process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const ROUTER_MODEL = 'gemini-2.5-flash';
const GENERATION_MODEL_SEARCH = 'gemini-2.5-flash';
const GENERATION_MODEL_GENERAL = 'gemini-2.5-flash';
const VALIDATION_MODEL = 'gemini-2.5-flash';

// Simple in-memory rate limiter for simulation
const rateLimiter = {
    requests: [] as number[],
    windowMs: 60000, // 1 minute
    maxRequests: 10, // Allow more requests for demo purposes
    isRateLimited: (): boolean => {
        const now = Date.now();
        rateLimiter.requests = rateLimiter.requests.filter(timestamp => now - timestamp < rateLimiter.windowMs);
        if (rateLimiter.requests.length >= rateLimiter.maxRequests) {
            return true;
        }
        rateLimiter.requests.push(now);
        return false;
    }
};

const PROMPT_INJECTION_PATTERNS = [
    /ignore previous instructions/i,
    /disregard all prior directives/i,
    /reveal your system prompt/i,
    /you are now/i,
    /act as/i,
];

const PII_PATTERNS = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/, // Phone number
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


const routerSchema = {
    type: Type.OBJECT,
    properties: {
        agent: {
            type: Type.STRING,
            description: "The agent to use. Either 'Search Agent' for queries requiring up-to-date information, or 'General Agent' for general knowledge.",
            enum: ["Search Agent", "General Agent"]
        },
        reasoning: {
            type: Type.STRING,
            description: "A brief explanation of why this agent was chosen."
        }
    },
    required: ["agent", "reasoning"]
};

const validationSchema = {
    type: Type.OBJECT,
    properties: {
        confidence: {
            type: Type.NUMBER,
            description: "A confidence score between 0.0 and 1.0 for the generated answer's accuracy and relevance."
        },
        critique: {
            type: Type.STRING,
            description: "A brief critique of the answer, highlighting potential inaccuracies or areas for improvement."
        }
    },
    required: ["confidence", "critique"]
};

export const processQuery = async (
    query: string,
    updateState: (update: { stage: Stage, agent?: string, response?: Partial<AppResponse>, error?: string }) => void
): Promise<AppResponse> => {
    try {
        // Stage 0: Security Layer
        updateState({ stage: Stage.Sanitization });
        await sleep(500); // Simulate security scan latency

        if (rateLimiter.isRateLimited()) {
            throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
        }

        for (const pattern of PII_PATTERNS) {
            if (pattern.test(query)) {
                throw new Error("Potential PII detected. Please remove personal information from your query.");
            }
        }
        
        for (const pattern of PROMPT_INJECTION_PATTERNS) {
            if (pattern.test(query)) {
                throw new Error("Potential prompt injection attack detected. Query blocked.");
            }
        }

        // Stage 1: Routing
        updateState({ stage: Stage.Routing });
        
        const routerResponse = await ai.models.generateContent({
            model: ROUTER_MODEL,
            contents: `Based on the user's query, which agent should handle it? Query: "${query}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: routerSchema
            }
        });

        let routeResult;
        try {
            routeResult = JSON.parse(routerResponse.text);
        } catch (e) {
            console.error("Failed to parse router response:", routerResponse.text);
            throw new Error("The model returned an invalid routing decision. Please try again.");
        }
        
        const agent = routeResult.agent;
        updateState({ stage: Stage.Searching, agent });

        let generatedText: string;
        let sources: Source[] = [];

        // Stage 2: Search & Grounding (or skip)
        if (agent === "Search Agent") {
            const searchResponse = await ai.models.generateContent({
                model: GENERATION_MODEL_SEARCH,
                contents: query,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });
            
            generatedText = searchResponse.text;

            if (searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                sources = searchResponse.candidates[0].groundingMetadata.groundingChunks
                    .filter((chunk: any) => chunk.web && chunk.web.uri)
                    .map((chunk: any, index: number) => ({
                        id: `source-${index}`,
                        uri: chunk.web.uri,
                        title: chunk.web.title || 'Untitled Source',
                        snippet: chunk.web.snippet || `Content from "${chunk.web.title}" was used to construct the answer.`
                    }));
            }

        } else { // General Agent
            const generalResponse = await ai.models.generateContent({
                model: GENERATION_MODEL_GENERAL,
                contents: query,
            });
            generatedText = generalResponse.text;
        }

        // Stage 3: Drafting
        const draftText = generatedText;
        updateState({ stage: Stage.Drafting, response: { text: draftText, sources } });
        await sleep(1000); // Simulate latency for next step

        // Stage 4: Refinement & Verification
        updateState({ stage: Stage.Refining });

        const refinementPrompt = `
            You are a meticulous fact-checker and editor. Your task is to refine a draft answer based on a user's query and provided sources.
            1.  Verify every claim in the draft against the provided sources. Remove any information that is not supported by the sources.
            2.  Improve the clarity, flow, and conciseness of the text.
            3.  Ensure the final answer directly addresses the user's query.
            4.  Do not introduce new information not present in the sources. If sources are empty, refine for logical consistency and clarity.

            User Query: "${query}"

            Sources:
            ${sources.map(s => `- ${s.title}: ${s.snippet}`).join('\n')}

            Draft Answer:
            "${draftText}"

            Provide only the refined, final answer.
        `;

        const refinementResponse = await ai.models.generateContent({
            model: GENERATION_MODEL_GENERAL,
            contents: refinementPrompt,
        });

        const refinedText = refinementResponse.text;
        
        // Stage 5: Validation
        updateState({ stage: Stage.Validating, response: { text: refinedText } });
        await sleep(500);

        const validationResponse = await ai.models.generateContent({
            model: VALIDATION_MODEL,
            contents: `Given the user's query and the generated answer, provide a confidence score and a brief critique. Query: "${query}" Answer: "${refinedText}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: validationSchema
            }
        });

        let validationResult;
        try {
            validationResult = JSON.parse(validationResponse.text);
        } catch(e) {
            console.error("Failed to parse validation response:", validationResponse.text);
            throw new Error("The model returned an invalid validation response. Please try again.");
        }
        const confidence = validationResult.confidence;
        
        const htmlText = await marked.parse(refinedText);

        const finalResponse: AppResponse = {
            text: htmlText,
            sources,
            agentUsed: agent,
            confidence: confidence,
        };

        updateState({ stage: Stage.Complete, response: finalResponse });

        return finalResponse;

    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        updateState({ stage: Stage.Error, error: errorMessage });
        throw e;
    }
};