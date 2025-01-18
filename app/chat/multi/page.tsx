"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { assistants, getAssistantById } from "@/lib/assistants";
import useChatStore, { Message } from "@/lib/chatStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export default function Page() {
  const resetMessages = useChatStore((state) => state.resetMessages);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateLastAssistantMessage = useChatStore(
    (state) => state.updateLastAssistantMessage
  );
  const chatStore = useChatStore;

  const messages: Message[] = useChatStore(
    (state: { messages: Message[] }) => state.messages
  );

  const [isShort, setIsShort] = useState(false);
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [numberOfMessages, setNumberOfMessages] = useState("");

  const handleAssistantToggle = (assistantId: string) => {
    setSelectedAssistants((prev) =>
      prev.includes(assistantId)
        ? prev.filter((id) => id !== assistantId)
        : [...prev, assistantId]
    );
  };

  const handleChange = (event: { target: { value: any } }) => {
    const value = event.target.value;

    if (!isNaN(value)) {
      setNumberOfMessages(value.replace(/^0+/, ""));
    }
  };

  const handleShortChange = (event: any) => {
    setIsShort(!isShort);
  };

  const handleSubmit = async () => {
    if (message.trim() === "" || selectedAssistants.length <= 1) {
      return;
    }

    resetMessages();

    console.log("Selected Assistants:", selectedAssistants);
    console.log("Starting Message:", message);


    addMessage("multi", message, "user");
    const numberOfMessagesInt = parseInt(numberOfMessages) || 5;
    for (let i = 0; i < numberOfMessagesInt; i++) {
      const currentAssistantId = selectedAssistants[i % selectedAssistants.length];
      const assistant = getAssistantById(currentAssistantId);
      let copyMessages = [...chatStore.getState().messages];
      const lastMessage = copyMessages[copyMessages.length - 1];
      addMessage(
        "multi",
        "...",
        "assistant",
        currentAssistantId,
        assistant.name
      );
      console.log(assistant);
      copyMessages = copyMessages.map((msg) => ({
        ...msg,
        sender: msg.assistantId === currentAssistantId ? "assistant" : "user",
      }));

      const res = await fetch("/api/stream-llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: lastMessage.text,
          messages: copyMessages.slice(0, -1),
          assistantId: isShort ? `short-${currentAssistantId}` : currentAssistantId,
        }),
      });

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let assistantResponse = "";

        setMessage("");

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });

          if (!chunk) continue;

          assistantResponse += chunk;
          updateLastAssistantMessage("multi", assistantResponse);
        }
      }
    }
  };

  useEffect(() => {
    resetMessages();
  }, [resetMessages]);

  return (
    <>
      <div className="w-full mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Select your assistants</h2>
          <div className="flex flex-wrap gap-4">
            {Array.from(assistants.values()).map((assistant) => (
              <div key={assistant.id} className="flex items-center space-x-2">
                <Checkbox
                  id={assistant.id}
                  checked={selectedAssistants.includes(assistant.id)}
                  onCheckedChange={() => handleAssistantToggle(assistant.id)}
                />
                <Label htmlFor={assistant.id}>{assistant.name}</Label>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="short"
              checked={isShort}
              onCheckedChange={handleShortChange}
            />
            <Label htmlFor="short">Only short answers</Label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">
            Starting message and numbers of messages to generate
          </Label>
          <div className="flex w-full">
            <Input
              id="message"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Input
              className="w-16 ml-2"
              id="numberOfMessages"
              placeholder="5"
              value={numberOfMessages}
              onChange={handleChange}
            />
            <Button className="ml-2" onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
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
              {message.senderName && (
                <h4 className="font-semibold">{message.senderName}</h4>
              )}
              {message.text}
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
}
