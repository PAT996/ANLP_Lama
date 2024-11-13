import { createHistory } from '@/lib/llamaHistory';
import { NextRequest, NextResponse } from 'next/server';
import { LlamaChatSession } from "node-llama-cpp";
import { fileURLToPath } from "url";
import path from "path";
import { LlamaModel, LlamaContext } from "node-llama-cpp";


export async function POST(req: NextRequest) {
    const { prompt, messages, systemPrompt } = await req.json();

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const model = new LlamaModel({
        modelPath: path.join(__dirname, "..", "..", "..", "models", "Chronos-Gold-12B-1.0.i1-IQ1_S.gguf")
    });


    const session = new LlamaChatSession({
        context: new LlamaContext({ model }),
        conversationHistory: createHistory(messages),
        systemPrompt
    });

    // Create a TransformStream to handle chunked streaming
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // Stream the LLaMA response back chunk by chunk
    session.prompt(prompt, {
        onToken(token: number[]) {
            const decoded = session.context.decode(token);
            // const decoded = new TextDecoder("utf-8").decode(new Uint8Array(token));
            writer.write(decoded);
        },
        signal: req.signal,
    }).then(() => {
        writer.close();
    }).catch((error) => {
        console.error('Error during LLaMA prompt:', error);
        writer.abort(error);
    });

    return new NextResponse(readable, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
        }
    });
}