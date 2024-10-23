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
  greeting: string
}

const assistants: Assistant[] = [
  { id: 'sheldon', name: 'Sheldon', greeting: "Ah, finally, an intelligent conversation! Let’s hope you possess a reasonable grasp of physics. If not, don’t worry—I can explain everything in excruciating detail. Bazinga!" },
  { id: 'tech', name: 'Crypto Tech Bro', greeting: "Yo! You ready to 10x your knowledge and dive into the future of decentralized finance? Let’s talk blockchain, NFTs, and how we’re all going to the moon—just HODL tight!" },
  { id: 'genalpha', name: 'Gen Alpha Skibbidi', greeting: "Hey! What’s up? You on TikTok? Wanna see something cool? I just got this new game—it’s lit! Oh, and I can teach you all about AI and stuff, like, super fast." },
]

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

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      setMessages(prev => [...prev, { id: prev.length + 1, text: input, sender: 'user' }])

      // Simulate assistant response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: `As ${selectedAssistant.name}, I acknowledge your message: "${input}". However, I'm a simple demo and can't provide a real response.`,
          sender: 'assistant'
        }])
      }, 1000)

      setInput('')
    }
  }

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
                className={`flex items-center w-full p-2 hover:bg-muted transition-colors ${
                  selectedAssistant.id === assistant.id ? 'bg-muted' : ''
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
          <header className="h-14 border-b flex items-center px-4">
            <SidebarTrigger className="lg:hidden mr-2">
              <MenuIcon className="h-6 w-6" />
            </SidebarTrigger>
            <h1 className="font-semibold">Chat with {selectedAssistant.name}</h1>
          </header>
          <ScrollArea className="flex-grow p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'assistant' && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>{selectedAssistant.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-2 rounded-lg max-w-[80%] ${
                    message.sender === 'user'
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
