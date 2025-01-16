"use client"

import {
  ChevronsUpDown,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { assistants } from "@/lib/assistants"
import { redirect } from 'next/navigation'
// import { Chat } from "@/lib/types"
import useChatStore from "@/lib/chatStore"


// function createNewChat(assistantId: string, setChats: (chats: Chat[]) => void) {
//   // Get array of previous chats from localStorage
//   const storedChats: Chat[] = JSON.parse(localStorage.getItem(`chats`) || "[]")

//   const chatData = {
//     assistantId: assistantId,
//     chatId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
//   }
//   localStorage.setItem(`chats`, JSON.stringify([...storedChats, chatData]))
//   setChats([...storedChats, chatData])
//   redirect(`/chat/${chatData.chatId}`)
// }


export function NavNewChat() {
  const { isMobile } = useSidebar()


  const createChat = useChatStore((state) => state.createChat);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">New Chat</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Start a new Chat with</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {Array.from(assistants.values()).map((assistant) => (
                <DropdownMenuItem key={assistant.id} onClick={() => {
                  const chatId = createChat(assistant.id)
                  redirect(`/chat/${chatId}`)
                }
                }>
                  {assistant.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Multiple Assistants
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
