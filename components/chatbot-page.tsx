'use client'

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { MenuIcon, Send } from 'lucide-react'

// type Message = {
//   id: number
//   text: string
//   sender: 'user' | 'assistant'
// }

// type Assistant = {
//   id: string
//   name: string
//   greeting: string,
//   systemPrompt: string
// }


// const getLocalStorageMessages = (chatId: string) => {
//   const storedMessages = localStorage.getItem(`messages-${chatId}`)
//   return storedMessages ? JSON.parse(storedMessages) : []
// }

export function ChatbotPageComponent() {
  // const [selectedAssistant, setSelectedAssistant] = useState<Assistant>(assistants[0])
  // const [messages, setMessages] = useState<Message[]>([])
  // const [input, setInput] = useState('')

  // // Load messages from localStorage when the assistant is selected
  // useEffect(() => {
  //   const storedMessages = getLocalStorageMessages(selectedAssistant.id)
  //   if (storedMessages.length > 0) {
  //     setMessages(storedMessages)
  //   } else {
  //     setMessages([{ id: 1, text: selectedAssistant.greeting, sender: 'assistant' }])
  //   }
  // }, [selectedAssistant])

  // // Store messages in localStorage whenever they change
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     localStorage.setItem(`messages-${selectedAssistant.id}`, JSON.stringify(messages))
  //   }
  // }, [messages, selectedAssistant])

  // const handleSend = async () => {
  //   if (input.trim()) {
  //     // Add user message
  //     setMessages(prev => [...prev, { id: prev.length + 1, text: input, sender: 'user' }]);

  //     // Prepare to receive assistant's response
  //     setMessages(prev => [...prev, { id: prev.length + 1, text: '...', sender: 'assistant' }]);

  //     // Make the API call to stream LLaMA's response
  //     const res = await fetch('/api/stream-llama', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ prompt: input, messages, systemPrompt: selectedAssistant.systemPrompt }),
  //     });

  //     if (res.body) {
  //       const reader = res.body.getReader();
  //       const decoder = new TextDecoder();
  //       let done = false;
  //       let assistantResponse = '';

  //       while (!done) {
  //         const { value, done: readerDone } = await reader.read();
  //         done = readerDone;
  //         assistantResponse += decoder.decode(value, { stream: true });

  //         // Update assistant message as chunks arrive
  //         setMessages((prev) => {
  //           // Find the index of the last assistant message
  //           const lastAssistantIndex = prev.length - 1 - prev.slice().reverse().findIndex(msg => msg.sender === 'assistant');

  //           // If there's a last assistant message, update it
  //           if (lastAssistantIndex >= 0) {
  //             return prev.map((msg, index) =>
  //               index === lastAssistantIndex ? { ...msg, text: assistantResponse } : msg
  //             );
  //           }

  //           // If no assistant message found, return previous messages
  //           return prev;
  //         });
  //       }

  //     }

  //     setInput(''); // Clear the input field
  //   }
  // };
  // const handleAssistantChange = (assistant: Assistant) => {
  //   setSelectedAssistant(assistant)
  // }

  return (
    <>
      {/* <ScrollArea className="flex-grow p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            {message.sender === 'assistant' && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{selectedAssistant.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`p-2 rounded-lg max-w-[80%] ${message.sender === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
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
          onKeyUp={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow mr-2"
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div> */}
    </>
  )
}
