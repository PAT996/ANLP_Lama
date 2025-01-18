import { create } from 'zustand';
import { getAssistantById } from './assistants';

export interface Chat {
    chatId: string;
    assistantId: string;
}

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'assistant';
    assistantId?: string;
    senderName?: string;
}

interface ChatStore {
    chats: Chat[];
    messages: Message[];
    loadChats: () => void;
    createChat: (assistantId: string) => string;
    deleteChat: (chatId: string) => void;
    loadMessages: (chatId: string) => void;
    addMessage: (chatId: string, text: string, sender: 'user' | 'assistant', assistantId?: string, senderName?: string) => void;
    updateLastAssistantMessage: (chatId: string, assistantResponse: string) => void;
    resetMessages: () => void;
}

const useChatStore = create<ChatStore>((set) => ({
    chats: [],
    messages: [],

    loadChats: () => {
        set({
            chats: JSON.parse(localStorage.getItem('chats') || '[]'),
        });
    },

    createChat: (assistantId: string) => {
        const chatId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const newChat = { chatId, assistantId };
        const assistant = getAssistantById(assistantId);
        const initialMessages = [{text: assistant.greeting, sender: 'assistant', id: 1}];

        set((state) => {
            const updatedChats = [...state.chats, newChat];
            localStorage.setItem('chats', JSON.stringify(updatedChats));
            localStorage.setItem(`messages-${chatId}`, JSON.stringify(initialMessages));
            return { chats: updatedChats };
        });

        return chatId;
    },

    deleteChat: (chatId: string) => {
        set((state) => {
            const updatedChats = state.chats.filter((chat) => chat.chatId !== chatId);
            localStorage.setItem('chats', JSON.stringify(updatedChats));
            localStorage.removeItem(`messages-${chatId}`);

            return { chats: updatedChats, messages: [] };
        });
    },

    loadMessages: (chatId: string) => {
        if (typeof window === 'undefined')
            return;

        const storedMessages = localStorage.getItem(`messages-${chatId}`);
        const parsedMessages = storedMessages ? JSON.parse(storedMessages) : [];
        set({ messages: parsedMessages });
    },

    addMessage: (chatId: string, text: string, sender: 'user' | 'assistant', assistantId?: string, senderName?: string) => {
        set((state) => {
            const message = { id: state.messages.length + 1, text, sender, assistantId, senderName };
            const updatedMessages = [...state.messages, message];
            localStorage.setItem(`messages-${chatId}`, JSON.stringify(updatedMessages));
            return { messages: updatedMessages };
        });
    },

    updateLastAssistantMessage: (chatId: string, assistantResponse: string) => {
        set((state) => {
            const lastAssistantIndex = state.messages.length - 1 - state.messages.slice().reverse().findIndex((msg) => msg.sender === 'assistant');

            if (lastAssistantIndex >= 0) {
                const updatedMessages = state.messages.map((msg, index) =>
                    index === lastAssistantIndex ? { ...msg, text: assistantResponse } : msg
                );
                localStorage.setItem(`messages-${chatId}`, JSON.stringify(updatedMessages));
                return { messages: updatedMessages };
            }

            return state;
        })
    },

    resetMessages: () => {
        set({ messages: [] });
    },

}));

export default useChatStore;
