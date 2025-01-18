'use client'

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AssistantSelector() {
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([])
  const [message, setMessage] = useState('')

  const assistants = [
    { id: 'assistant1', label: 'Assistant 1' },
    { id: 'assistant2', label: 'Assistant 2' },
    { id: 'assistant3', label: 'Assistant 3' },
  ]

  const handleAssistantToggle = (assistantId: string) => {
    setSelectedAssistants(prev =>
      prev.includes(assistantId)
        ? prev.filter(id => id !== assistantId)
        : [...prev, assistantId]
    )
  }

  const handleSubmit = () => {
    console.log('Selected Assistants:', selectedAssistants)
    console.log('Starting Message:', message)
    // Here you would typically send this data to your backend or perform some action
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Select your assistants</h2>
        <div className="flex flex-wrap gap-4">
          {assistants.map((assistant) => (
            <div key={assistant.id} className="flex items-center space-x-2">
              <Checkbox 
                id={assistant.id} 
                checked={selectedAssistants.includes(assistant.id)}
                onCheckedChange={() => handleAssistantToggle(assistant.id)}
              />
              <Label htmlFor={assistant.id}>{assistant.label}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Starting message</Label>
        <Input 
          id="message" 
          placeholder="Type your message here" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">Send</Button>
    </div>
  )
}

