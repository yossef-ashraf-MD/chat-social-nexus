
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistance } from 'date-fns';
import { Send, Mic, PaperclipIcon } from 'lucide-react';
import { mockUsers } from '@/services/mockData';

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { activeChat, messages, sendMessage, conversations, chatRooms } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-chat text-transparent bg-clip-text">Welcome to Chat App</h2>
          <p className="text-muted-foreground mb-6">
            Select a conversation from the sidebar to start chatting with friends
            or in a group room.
          </p>
          <div className="flex justify-center gap-4">
            <div className="rounded-full bg-chat-light p-3">
              <Users className="h-6 w-6 text-chat-primary" />
            </div>
            <div className="rounded-full bg-chat-light p-3">
              <MessageSquare className="h-6 w-6 text-chat-secondary" />
            </div>
            <div className="rounded-full bg-chat-light p-3">
              <UserPlus className="h-6 w-6 text-chat-accent" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get chat details based on type
  const chatDetails = activeChat.type === 'direct' 
    ? conversations.find(c => c.id === activeChat.id)
    : chatRooms.find(r => r.id === activeChat.id);

  if (!chatDetails) return null;
  
  const chatName = activeChat.type === 'direct'
    ? (chatDetails as any).participants.find((p: any) => p.id !== user?.id)?.username
    : (chatDetails as any).name;
  
  const chatImage = activeChat.type === 'direct'
    ? (chatDetails as any).participants.find((p: any) => p.id !== user?.id)?.avatar
    : (chatDetails as any).image;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput, 'text');
      setMessageInput('');
    }
  };

  const formatMessageTime = (date: Date) => {
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat header */}
      <div className="border-b p-3 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={chatImage} alt={chatName} />
          <AvatarFallback>{getInitials(chatName)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{chatName}</h2>
          <p className="text-xs text-muted-foreground">
            {activeChat.type === 'direct' 
              ? 'Online' 
              : `${(chatDetails as any).members.length} members`}
          </p>
        </div>
      </div>
      
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.id;
              const sender = mockUsers.find(u => u.id === message.senderId);
              const showAvatar = !isCurrentUser && (
                index === 0 || 
                messages[index - 1].senderId !== message.senderId
              );
              
              return (
                <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[85%]`}>
                    {showAvatar && !isCurrentUser && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={sender?.avatar} alt={sender?.username} />
                        <AvatarFallback>
                          {sender?.username ? getInitials(sender.username) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      {showAvatar && !isCurrentUser && (
                        <span className="text-xs text-muted-foreground mb-1">
                          {sender?.username}
                        </span>
                      )}
                      <div
                        className={`chat-message-bubble ${isCurrentUser ? 'sent' : 'received'}`}
                      >
                        {message.content}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={scrollRef}></div>
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <div className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-muted-foreground"
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-muted-foreground"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full"
            disabled={!messageInput.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

// Required imports that weren't auto-imported
import { MessageSquare, UserPlus, Users } from 'lucide-react';

export default ChatInterface;
