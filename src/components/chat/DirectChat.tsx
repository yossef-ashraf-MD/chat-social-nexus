
import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import { DirectConversation } from '@/models/types';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface DirectChatProps {
  conversation: DirectConversation;
  isActive: boolean;
}

const DirectChat: React.FC<DirectChatProps> = ({ conversation, isActive }) => {
  const { setActiveChat } = useChat();
  const { user } = useAuth();
  
  // Find the other participant in the conversation (not the current user)
  const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
  
  const handleClick = () => {
    setActiveChat('direct', conversation.id);
  };
  
  if (!otherParticipant) return null;
  
  return (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${
        isActive ? 'bg-accent' : ''
      }`}
      onClick={handleClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.username} />
        <AvatarFallback>{otherParticipant.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium truncate">{otherParticipant.username}</h3>
          {conversation.unreadCount ? (
            <Badge variant="destructive" className="ml-1 text-xs">
              {conversation.unreadCount}
            </Badge>
          ) : null}
        </div>
        {conversation.lastMessage && (
          <p className="text-xs text-muted-foreground truncate">
            {conversation.lastMessage.content}
          </p>
        )}
      </div>
      <div className="h-2 w-2 rounded-full ml-2" 
        style={{
          backgroundColor: 
            otherParticipant.status === 'online' ? 'green' : 
            otherParticipant.status === 'away' ? 'orange' : 
            otherParticipant.status === 'busy' ? 'red' : 'gray'
        }}
      />
    </div>
  );
};

export default DirectChat;
