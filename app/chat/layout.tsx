'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { assistants } from "@/lib/assistants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NavNewChat } from "@/components/nav-new-chat"

interface Chat {
    chatId: string;
    assistantId: string;
}

function getLocalChats(): Chat[] {
    const storedChats = localStorage.getItem(`chats`);
    return storedChats ? JSON.parse(storedChats) : [];
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    localStorage.setItem(`chats`, JSON.stringify(
        [{ chatId: "12345678", assistantId: "sheldon" }, { chatId: "76543210", assistantId: "tech" }, { chatId: "123456378", assistantId: "sheldon" }, { chatId: "2343243210", assistantId: "genalpha" }]
    ))
    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden w-full">
                <Sidebar className="border-r">
                    <SidebarHeader className="h-14 border-b px-4 flex items-center">
                        <h2 className="font-semibold">Choose a Chatpartner</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        {getLocalChats().map((chat) => (
                            <a href={`/${chat.assistantId}/${chat.chatId}`} key={chat.chatId} className={`flex items-center w-full p-2 hover:bg-muted transition-colors`}>
                                <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback>{assistants.get(chat.assistantId)?.name[0]}</AvatarFallback>
                                </Avatar>
                                <span>{assistants.get(chat.assistantId)?.name}</span>
                            </a>
                        ))}
                    </SidebarContent>
                    <SidebarFooter className="h-14 border-t flex items-center justify-center">
                        <NavNewChat />
                    </SidebarFooter>
                </Sidebar>

                <div className="flex-1 flex flex-col">
                    {/* <header className="h-14 border-b flex items-center justify-between px-4">
                        <div className="flex items-center">
                            <SidebarTrigger className="lg:hidden mr-2">
                                <MenuIcon className="h-6 w-6" />
                            </SidebarTrigger>
                            <h1 className="font-semibold">Chat with {selectedAssistant.name}</h1>
                        </div>
                        <button className='text-red-600' onClick={() => {
                            localStorage.removeItem(`messages-${selectedAssistant.id}`)
                            setMessages([{ id: 1, text: selectedAssistant.greeting, sender: 'assistant' }])
                        }}>Delete History</button>
                    </header> */}
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
}
