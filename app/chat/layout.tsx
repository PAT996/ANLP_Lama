"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar"
import { assistants } from "@/lib/assistants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NavNewChat } from "@/components/nav-new-chat"
import Link from "next/link";
import useChatStore from "@/lib/chatStore";
import { useEffect } from "react";

interface Chat {
    chatId: string;
    assistantId: string;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const chats: Chat[] = useChatStore((state: { chats: Chat[] }) => state.chats);
    const loadChats = useChatStore((state) => state.loadChats);

    useEffect(() => {
      loadChats();
    }, [loadChats]);

    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden w-full">
                <Sidebar className="border-r">
                    <SidebarHeader className="h-14 border-b px-4 flex items-center">
                        <h2 className="font-semibold">Choose a Chatpartner</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        {chats.map((chat) => (
                            <Link href={`/chat/${chat.chatId}`} key={chat.chatId} className={`flex items-center w-full p-2 hover:bg-muted transition-colors`}>
                                <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback>{assistants.get(chat.assistantId)?.name[0]}</AvatarFallback>
                                </Avatar>
                                <span>{assistants.get(chat.assistantId)?.name}</span>
                            </Link>
                        ))}
                    </SidebarContent>
                    <SidebarFooter className="h-14 border-t flex items-center justify-center">
                        <NavNewChat />
                    </SidebarFooter>
                </Sidebar>

                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
}
