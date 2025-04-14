import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
// It will automatically look for the GROQ_API_KEY environment variable
let groq: Groq;
try {
    groq = new Groq();
} catch (error) {
    console.error("Failed to initialize Groq SDK:", error);
    // Groq client might throw if API key is invalid format immediately,
    // though usually it happens on first request.
}


export const POST = async (request: Request) => {
    // Check if Groq client initialized properly
    if (!groq) {
         return NextResponse.json(
             { error: 'Groq SDK not initialized. Check API key format or server logs.' },
             { status: 500 }
         );
    }

    const { question } = await request.json();

    // Basic validation
    if (!process.env.GROQ_API_KEY) {
        console.error('Groq API key not configured.');
        return NextResponse.json(
            { error: 'AI service API key not configured.' }, // User-friendly message
            { status: 500 }
        );
    }

    if (!question || typeof question !== 'string' || question.trim() === '') {
        return NextResponse.json(
            { error: 'Question is required and must be a non-empty string.' },
            { status: 400 }
        );
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    // Tailor this system prompt for better results on a Q&A platform
                    content: 'You are an expert assistant for a programming Q&A platform like Stack Overflow. Provide helpful, accurate, and well-formatted answers to user questions. Use Markdown for code blocks (e.g., ```javascript ... ```). Be concise but complete.',
                },
                {
                    role: 'user',
                    // Add context for the model
                    content: `Please provide an answer to the following programming question:\n\n"${question}"`,
                },
            ],
            // Choose a model - llama-3.1-8b-instant is fast
            // Or use llama-3.3-70b-versatile for potentially higher quality (slower/more expensive)
            model: 'llama-3.1-8b-instant',
            temperature: 0.7, // Adjust creativity (0=deterministic, 1=more random)
            max_completion_tokens: 1024, // Max length of the generated answer
            top_p: 1, // Nucleus sampling; 1 means consider all likely tokens
            stream: false, // Set to true if you want to stream the response later
        });

        const reply = chatCompletion.choices[0]?.message?.content;

        if (!reply) {
             console.error('Groq response missing content:', chatCompletion);
             return NextResponse.json({ error: 'AI failed to generate a response content.' }, { status: 500 });
        }

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Groq API Error:", error);
        let errorMessage = 'Failed to generate AI answer due to an internal error.';
        let statusCode = 500;

        if (error instanceof Groq.APIError) {
             errorMessage = `AI Service Error (${error.status}): ${error.message}`;
             statusCode = error.status || 500; // Use status from Groq error if available
             // Handle specific statuses if needed
             if (statusCode === 401) errorMessage = "AI Service Error: Invalid API Key.";
             if (statusCode === 429) errorMessage = "AI Service Error: Rate limit exceeded.";
        } else if (error instanceof Error) {
            errorMessage = `Error generating answer: ${error.message}`;
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
};