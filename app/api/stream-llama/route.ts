import ollama, { ChatRequest } from "ollama";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { assistantId, prompt, messages } = await req.json();
  const message = { role: "user", content: prompt };

  const messagesOllamaFormat = messages
    .map((msg: { sender: string; text: string }) => {
      return { role: msg.sender, content: msg.text };
    }).slice(-10);

  const requestPayload: ChatRequest & { stream: true } = {
    model: assistantId,
    messages: [...messagesOllamaFormat, message],
    stream: true,
    keep_alive: "5m",
  };

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  try {
    const response = await ollama.chat(requestPayload);

    for await (const part of response) {
      const chunk = part.message?.content ?? "";

      if (chunk) {
        writer.write(chunk);
      }
    }

    writer.close();
  } catch (error) {
    console.error("Error during Ollama prompt:", error);
    writer.abort(error);
  }

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
