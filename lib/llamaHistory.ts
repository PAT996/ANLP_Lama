import { ConversationInteraction } from "node-llama-cpp";

type Message = {
    id: number
    text: string
    sender: 'user' | 'assistant'
  }

export const createHistory = (messages: Message[]): ConversationInteraction[] => {
    const conversationHistory: ConversationInteraction[] = [];

    messages?.forEach((message, index) => {
        if (message.sender === "assistant")
            return;

        const nextMessage = messages[index + 1];
        const isLastMessage = index === messages.length - 1;

        const interaction: ConversationInteraction = {
            prompt: message.text,
            response: isLastMessage ? "" : nextMessage?.text ?? "",
        };

        if (isLastMessage || nextMessage?.sender === "assistant") {
            conversationHistory.push(interaction);
        }
    });

    return conversationHistory;
}