
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Message, DirectConversation, ChatRoom, FriendRequest } from '@/models/types';
import { mockUsers, mockDirectConversations, mockChatRooms, mockMessages, mockFriendRequests } from '@/services/mockData';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

type ChatContextType = {
  friends: User[];
  friendRequests: FriendRequest[];
  conversations: DirectConversation[];
  chatRooms: ChatRoom[];
  activeChat: { type: 'direct' | 'room', id: string } | null;
  messages: Message[];
  sendMessage: (content: string, type: 'text' | 'image' | 'voice' | 'video') => void;
  setActiveChat: (type: 'direct' | 'room', id: string) => void;
  sendFriendRequest: (userId: string) => void;
  respondToFriendRequest: (requestId: string, accept: boolean) => void;
  createChatRoom: (name: string, description?: string) => void;
};

const ChatContext = createContext<ChatContextType>({
  friends: [],
  friendRequests: [],
  conversations: [],
  chatRooms: [],
  activeChat: null,
  messages: [],
  sendMessage: () => {},
  setActiveChat: () => {},
  sendFriendRequest: () => {},
  respondToFriendRequest: () => {},
  createChatRoom: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [conversations, setConversations] = useState<DirectConversation[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChat, setActiveChatState] = useState<{ type: 'direct' | 'room', id: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load initial data
  useEffect(() => {
    if (user) {
      // In a real app, these would be API calls
      setFriends(mockUsers.filter(u => u.id !== user.id).slice(0, 3));
      setFriendRequests(mockFriendRequests.filter(fr => 
        fr.receiverId === user.id || fr.senderId === user.id
      ));
      setConversations(mockDirectConversations);
      setChatRooms(mockChatRooms);
    }
  }, [user]);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      const chatMessages = mockMessages[activeChat.id] || [];
      setMessages(chatMessages);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  const setActiveChat = (type: 'direct' | 'room', id: string) => {
    setActiveChatState({ type, id });
  };

  const sendMessage = (content: string, type: 'text' | 'image' | 'voice' | 'video' = 'text') => {
    if (!activeChat || !user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      content,
      type,
      createdAt: new Date(),
    };

    // Add message to current chat
    setMessages(prev => [...prev, newMessage]);

    // Update last message in the conversation/room
    if (activeChat.type === 'direct') {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeChat.id 
            ? { ...conv, lastMessage: newMessage, unreadCount: 0 }
            : conv
        )
      );
    } else {
      setChatRooms(prev => 
        prev.map(room => 
          room.id === activeChat.id 
            ? { ...room, lastMessage: newMessage, unreadCount: 0 }
            : room
        )
      );
    }

    // In a real app, this would send the message to an API
    toast({
      title: 'Message sent',
      description: type === 'text' ? content : `${type} message sent`,
    });
  };

  const sendFriendRequest = (userId: string) => {
    if (!user) return;

    // In a real app, this would send the request to an API
    const newRequest: FriendRequest = {
      id: `fr-${Date.now()}`,
      senderId: user.id,
      receiverId: userId,
      status: 'pending',
      createdAt: new Date(),
    };

    setFriendRequests(prev => [...prev, newRequest]);
    toast({
      title: 'Friend request sent',
      description: 'Your friend request has been sent.',
    });
  };

  const respondToFriendRequest = (requestId: string, accept: boolean) => {
    // Find the request
    const request = friendRequests.find(fr => fr.id === requestId);
    if (!request) return;

    // Update the request status
    setFriendRequests(prev => 
      prev.map(fr => 
        fr.id === requestId 
          ? { ...fr, status: accept ? 'accepted' : 'rejected' }
          : fr
      )
    );

    // If accepted, add to friends list
    if (accept && user) {
      const newFriend = mockUsers.find(u => 
        u.id === (request.senderId === user.id ? request.receiverId : request.senderId)
      );
      
      if (newFriend) {
        setFriends(prev => [...prev, newFriend]);
        
        // Create a new conversation with this friend
        const newConversation: DirectConversation = {
          id: `conv-${Date.now()}`,
          participants: [user, newFriend],
        };
        
        setConversations(prev => [...prev, newConversation]);
      }
    }

    toast({
      title: accept ? 'Friend request accepted' : 'Friend request rejected',
      description: accept 
        ? 'You are now friends!' 
        : 'The friend request has been rejected.',
    });
  };

  const createChatRoom = (name: string, description?: string) => {
    if (!user) return;

    // In a real app, this would create a room via API
    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      name,
      description,
      ownerId: user.id,
      members: [user, ...friends.slice(0, 2)], // Add the user and some friends
      createdAt: new Date(),
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=400&auto=format&fit=crop',
    };

    setChatRooms(prev => [...prev, newRoom]);
    toast({
      title: 'Chat room created',
      description: `"${name}" has been created successfully.`,
    });
  };

  return (
    <ChatContext.Provider value={{
      friends,
      friendRequests,
      conversations,
      chatRooms,
      activeChat,
      messages,
      sendMessage,
      setActiveChat,
      sendFriendRequest,
      respondToFriendRequest,
      createChatRoom,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
