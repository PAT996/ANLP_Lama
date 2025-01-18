"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getAssistantById } from "@/lib/assistants";
import useChatStore, { Message } from "@/lib/chatStore";
import { Chat } from "@/lib/types";
import { MenuIcon, Send } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const { chatid } = useParams();
  const chatIdString = (Array.isArray(chatid) ? chatid[0] : chatid) || "";

  const chats: Chat[] = useChatStore((state: { chats: Chat[] }) => state.chats);
  const loadChats = useChatStore((state) => state.loadChats);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const messages: Message[] = useChatStore(
    (state: { messages: Message[] }) => state.messages
  );
  const loadMessages = useChatStore((state) => state.loadMessages);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateLastAssistantMessage = useChatStore(
    (state) => state.updateLastAssistantMessage
  );

  const selectedChat = chats.find((chat) => chat.chatId === chatIdString);
  const selectedAssistant = selectedChat
    ? getAssistantById(selectedChat.assistantId)
    : { name: "Unknown" };

  const handleSend = async () => {
    if (input.trim()) {
      addMessage(chatIdString, input, "user");
      addMessage(chatIdString, "...", "assistant");

      const res = await fetch("/api/stream-llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          messages: messages.slice(1),
          assistantId: selectedChat?.assistantId,
        }),
      });

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let assistantResponse = "";

        setInput("");

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });

          if (!chunk) continue;

          assistantResponse += chunk;
          updateLastAssistantMessage(chatIdString, assistantResponse);
        }
      }
    }
  };

  useEffect(() => {
    loadMessages(chatIdString);
  }, [loadMessages, chatIdString]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return (
    <>
      <header className="h-14 p-4 border-b flex items-center justify-between px-4">
        <div className="flex items-center">
          <SidebarTrigger className="lg:hidden mr-2">
            <MenuIcon className="h-6 w-6" />
          </SidebarTrigger>
          <h1 className="font-semibold">Chat with {selectedAssistant.name}</h1>
        </div>
        <button
          className="text-red-600"
          onClick={() => {
            deleteChat(chatIdString);
            redirect(`/chat`);
          }}
        >
          Delete Chat
        </button>
      </header>
      <ScrollArea className="flex-grow p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="border-t p-4 flex">
        <Input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSend()}
          className="flex-grow mr-2"
        />
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </>
  );
}
