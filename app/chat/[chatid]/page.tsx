"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { assistants } from '@/lib/assistants';
import useChatStore from '@/lib/chatStore';
import { Chat } from '@/lib/types';
import { MenuIcon } from 'lucide-react';
import { redirect, useParams } from 'next/navigation';
import { useEffect } from 'react';


export default function Page() {
  const { chatid } = useParams()
  const chatIdString = ( Array.isArray(chatid) ? chatid[0] : chatid ) || '';

  const chats: Chat[] = useChatStore((state: { chats: Chat[] }) => state.chats);
  const loadChats = useChatStore((state) => state.loadChats);
  const deleteChat = useChatStore((state) => state.deleteChat);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const selectedChat = chats.find(chat => chat.chatId === chatIdString)
  const selectedAssistant = selectedChat ? assistants.get(selectedChat.assistantId) || { name: "Unknown"} : { name: 'Unknown' }

  return <>
    <header className="h-14 border-b flex items-center justify-between px-4">
      <div className="flex items-center">
        <SidebarTrigger className="lg:hidden mr-2">
          <MenuIcon className="h-6 w-6" />
        </SidebarTrigger>
        <h1 className="font-semibold">Chat with {selectedAssistant.name}</h1>
      </div>
      <button className='text-red-600' onClick={() => {
        deleteChat(chatIdString)
        redirect(`/chat`)
      }}>Delete Chat</button>
    </header>
    My Post: {chatid}</>
}