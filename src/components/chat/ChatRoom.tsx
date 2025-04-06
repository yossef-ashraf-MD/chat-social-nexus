
import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { ChatRoom as ChatRoomType } from '@/models/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ChatRoomProps {
  room: ChatRoomType;
  isActive: boolean;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ room, isActive }) => {
  const { setActiveChat } = useChat();
  
  const handleClick = () => {
    setActiveChat('room', room.id);
  };
  
  return (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${
        isActive ? 'bg-accent' : ''
      }`}
      onClick={handleClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={room.image} alt={room.name} />
        <AvatarFallback>{room.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium truncate">{room.name}</h3>
          {room.unreadCount ? (
            <Badge variant="destructive" className="ml-1 text-xs">
              {room.unreadCount}
            </Badge>
          ) : null}
        </div>
        {room.lastMessage && (
          <p className="text-xs text-muted-foreground truncate">
            {room.lastMessage.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
