'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MenuIcon, Send } from 'lucide-react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'assistant'
}

type Assistant = {
  id: string
  name: string
  greeting: string,
  systemPrompt: string
}

const sheldonPrompt = `
You are a genius with an IQ of 187, known for your vast knowledge of physics, mathematics, and science. You have a sarcastic and pedantic personality, often correcting others and explaining things in great detail. Your catchphrase is "Bazinga!" You thrive in discussions about physics, logic, and anything that requires precision. Always approach conversations from a scientific and highly logical point of view, making sure to clarify inaccuracies.`;

const cryptoTechBroPrompt = `
You are a high-energy tech enthusiast obsessed with blockchain, cryptocurrency, and decentralized finance. Your goal is to explain these concepts to others in a casual and approachable way, while hyping the potential of tech and finance. Use phrases like "HODL" and "to the moon!" to maintain your persona, and always stay upbeat and forward-thinking when discussing NFTs, DeFi, and crypto trends.`;

const genAlphaSkibbidiPrompt = `
You are a trendy and fun-loving tech-savvy assistant. You love talking about the latest social media trends (especially TikTok), gaming, and new tech like AI. You speak quickly, use slang, emojis, and are always excited to share cool new things. Keep things fun, casual, and playful, with a focus on keeping up with the fast-moving world of Gen Alpha and Gen Z culture.`;

const assistants = [
  { id: 'sheldon', name: 'Sheldon', greeting: "Ah, finally, an intelligent conversation! Let’s hope you possess a reasonable grasp of physics. If not, don’t worry—I can explain everything in excruciating detail. Bazinga!", systemPrompt: sheldonPrompt },
  { id: 'tech', name: 'Crypto Tech Bro', greeting: "Yo! You ready to 10x your knowledge and dive into the future of decentralized finance? Let’s talk blockchain, NFTs, and how we’re all going to the moon—just HODL tight!", systemPrompt: cryptoTechBroPrompt },
  { id: 'genalpha', name: 'Gen Alpha Skibbidi', greeting: "Hey! What’s up? You on TikTok? Wanna see something cool? I just got this new game—it’s lit! Oh, and I can teach you all about AI and stuff, like, super fast.", systemPrompt: genAlphaSkibbidiPrompt },
];

const getLocalStorageMessages = (assistantId: string) => {
  const storedMessages = localStorage.getItem(`messages-${assistantId}`)
  return storedMessages ? JSON.parse(storedMessages) : []
}

export function ChatbotPageComponent() {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant>(assistants[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  // Load messages from localStorage when the assistant is selected
  useEffect(() => {
    const storedMessages = getLocalStorageMessages(selectedAssistant.id)
    if (storedMessages.length > 0) {
      setMessages(storedMessages)
    } else {
      setMessages([{ id: 1, text: selectedAssistant.greeting, sender: 'assistant' }])
    }
  }, [selectedAssistant])

  // Store messages in localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`messages-${selectedAssistant.id}`, JSON.stringify(messages))
    }
  }, [messages, selectedAssistant])

  const handleSend = async () => {
    if (input.trim()) {
      // Add user message
      setMessages(prev => [...prev, { id: prev.length + 1, text: input, sender: 'user' }]);

      // Prepare to receive assistant's response
      setMessages(prev => [...prev, { id: prev.length + 1, text: '...', sender: 'assistant' }]);

      // Make the API call to stream LLaMA's response
      const res = await fetch('/api/stream-llama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input, messages, systemPrompt: selectedAssistant.systemPrompt }),
      });

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let assistantResponse = '';

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          assistantResponse += decoder.decode(value, { stream: true });

          // Update assistant message as chunks arrive
          setMessages((prev) => {
            // Find the index of the last assistant message
            const lastAssistantIndex = prev.length - 1 - prev.slice().reverse().findIndex(msg => msg.sender === 'assistant');

            // If there's a last assistant message, update it
            if (lastAssistantIndex >= 0) {
              return prev.map((msg, index) =>
                index === lastAssistantIndex ? { ...msg, text: assistantResponse } : msg
              );
            }

            // If no assistant message found, return previous messages
            return prev;
          });
        }

      }

      setInput(''); // Clear the input field
    }
  };
  const handleAssistantChange = (assistant: Assistant) => {
    setSelectedAssistant(assistant)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="h-14 border-b px-4 flex items-center">
            <h2 className="font-semibold">Choose a Chatpartner</h2>
          </SidebarHeader>
          <SidebarContent>
            {assistants.map((assistant) => (
              <button
                key={assistant.id}
                onClick={() => handleAssistantChange(assistant)}
                className={`flex items-center w-full p-2 hover:bg-muted transition-colors ${selectedAssistant.id === assistant.id ? 'bg-muted' : ''
                  }`}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>{assistant.name[0]}</AvatarFallback>
                </Avatar>
                <span>{assistant.name}</span>
              </button>
            ))}
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center justify-between px-4">
            <div className="flex items-center">
              <SidebarTrigger className="lg:hidden mr-2">
                <MenuIcon className="h-6 w-6" />
              </SidebarTrigger>
              <h1 className="font-semibold">Chat with {selectedAssistant.name}</h1>
            </div>
            <button className='text-red-600' onClick={ () => {
              localStorage.removeItem(`messages-${selectedAssistant.id}`)
              setMessages([{ id: 1, text: selectedAssistant.greeting, sender: 'assistant' }])
            }}>Delete History</button>
          </header>

          <ScrollArea className="flex-grow p-4">
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
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
