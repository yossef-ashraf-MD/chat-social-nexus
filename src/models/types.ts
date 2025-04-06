
// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// Friend request statuses
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: Date;
}

// Message types
export type MessageType = 'text' | 'image' | 'voice' | 'video';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: Date;
  readBy?: string[];
}

// Conversation types
export interface DirectConversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
}

// Group/Room types
export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  image?: string;
  ownerId: string;
  members: User[];
  createdAt: Date;
  lastMessage?: Message;
  unreadCount?: number;
}
