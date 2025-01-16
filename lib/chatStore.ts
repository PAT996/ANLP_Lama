import { create } from 'zustand';

export interface Chat {
    chatId: string;
    assistantId: string;
}

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'assistant';
}

interface ChatStore {
    chats: Chat[];
    messages: Message[];
    loadChats: () => void;
    createChat: (assistantId: string) => string;
    deleteChat: (chatId: string) => void;
    loadMessages: (chatId: string) => void;
    addMessage: (chatId: string, message: Message) => void;
    resetMessages: () => void;
}

const useChatStore = create<ChatStore>((set) => ({
    chats: [],
    messages: [],

    loadChats: () => {
        if (typeof window === 'undefined')
            return;

        set({
            chats: JSON.parse(localStorage.getItem('chats') || '[]'),
        });
    },

    createChat: (assistantId: string) => {
        const chatId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const newChat = { chatId, assistantId };

        set((state) => {
            const updatedChats = [...state.chats, newChat];
            localStorage.setItem('chats', JSON.stringify(updatedChats));
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

    addMessage: (chatId: string, message: Message) => {
        set((state) => {
            const updatedMessages = [...state.messages, message];
            localStorage.setItem(`messages-${chatId}`, JSON.stringify(updatedMessages));
            return { messages: updatedMessages };
        });
    },

    resetMessages: () => {
        set({ messages: [] });
    },

}));

export default useChatStore;
