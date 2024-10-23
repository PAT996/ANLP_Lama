'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MenuIcon, Send } from 'lucide-react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'assistant'
}

type Assistant = {
  id: string
  name: string
  avatar: string
  greeting: string
}

const assistants: Assistant[] = [
  { id: 'general', name: 'General Assistant', avatar: '/avatars/robot-1.png', greeting: "Hello! I'm your general assistant. How can I help you today?" },
  { id: 'tech', name: 'Tech Support', avatar: '/avatars/robot-2.png', greeting: "Hi there! I'm your tech support assistant. What technical issue can I help you with?" },
  { id: 'creative', name: 'Creative Helper', avatar: '/avatars/robot-3.png', greeting: "Greetings! I'm your creative assistant. Let's brainstorm some ideas together!" },
]

export function ChatbotPageComponent() {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant>(assistants[0])
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: selectedAssistant.greeting, sender: 'assistant' }
  ])
  const [input, setInput] = useState('')

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
    setMessages([{ id: 1, text: assistant.greeting, sender: 'assistant' }])
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="h-14 border-b px-4 flex items-center">
            <h2 className="font-semibold">Choose an Assistant</h2>
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
                  <AvatarImage src={assistant.avatar} alt={assistant.name} />
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
                    <AvatarImage src={selectedAssistant.avatar} alt={selectedAssistant.name} />
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
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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