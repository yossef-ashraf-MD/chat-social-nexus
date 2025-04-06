
import { User, FriendRequest, Message, DirectConversation, ChatRoom } from '@/models/types';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'john_doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&auto=format&fit=crop',
    status: 'online'
  },
  {
    id: 'user-2',
    username: 'jane_smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop',
    status: 'online'
  },
  {
    id: 'user-3',
    username: 'alex_wilson',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop',
    status: 'away'
  },
  {
    id: 'user-4',
    username: 'sam_taylor',
    email: 'sam@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop',
    status: 'offline'
  },
  {
    id: 'user-5',
    username: 'tyler_brown',
    email: 'tyler@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop',
    status: 'busy'
  },
];

// Mock friend requests
export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'fr-1',
    senderId: 'user-3',
    receiverId: 'user-1',
    status: 'pending',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 'fr-2',
    senderId: 'user-4',
    receiverId: 'user-1',
    status: 'pending',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
  },
  {
    id: 'fr-3',
    senderId: 'user-1',
    receiverId: 'user-5',
    status: 'pending',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000)
  },
];

// Mock messages
export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      senderId: 'user-2',
      content: 'Hi John, how are you today?',
      type: 'text',
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 'msg-2',
      senderId: 'user-1',
      content: "I'm doing great! Working on that new project. How about you?",
      type: 'text',
      createdAt: new Date(Date.now() - 29 * 60 * 1000)
    },
    {
      id: 'msg-3',
      senderId: 'user-2',
      content: 'Same here! The deadline is approaching fast though.',
      type: 'text',
      createdAt: new Date(Date.now() - 28 * 60 * 1000)
    },
    {
      id: 'msg-4',
      senderId: 'user-1',
      content: "Don't worry, I'm sure we'll finish on time!",
      type: 'text',
      createdAt: new Date(Date.now() - 27 * 60 * 1000)
    },
  ],
  'conv-2': [
    {
      id: 'msg-5',
      senderId: 'user-3',
      content: 'John, did you see the latest design update?',
      type: 'text',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'msg-6',
      senderId: 'user-1',
      content: 'Not yet, can you send it to me?',
      type: 'text',
      createdAt: new Date(Date.now() - 110 * 60 * 1000)
    },
  ],
  'room-1': [
    {
      id: 'msg-7',
      senderId: 'user-2',
      content: 'Welcome everyone to the Project X group!',
      type: 'text',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'msg-8',
      senderId: 'user-3',
      content: 'Thanks for creating this group, Jane!',
      type: 'text',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000)
    },
    {
      id: 'msg-9',
      senderId: 'user-1',
      content: 'Looking forward to collaborating with all of you!',
      type: 'text',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000)
    },
  ],
  'room-2': [
    {
      id: 'msg-10',
      senderId: 'user-5',
      content: 'Has anyone started on the backend integration?',
      type: 'text',
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
      id: 'msg-11',
      senderId: 'user-1',
      content: "I've made some progress. Will share an update tomorrow.",
      type: 'text',
      createdAt: new Date(Date.now() - 55 * 60 * 1000)
    },
  ],
};

// Mock direct conversations
export const mockDirectConversations: DirectConversation[] = [
  {
    id: 'conv-1',
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: mockMessages['conv-1'][mockMessages['conv-1'].length - 1],
  },
  {
    id: 'conv-2',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: mockMessages['conv-2'][mockMessages['conv-2'].length - 1],
    unreadCount: 1,
  },
];

// Mock chat rooms
export const mockChatRooms: ChatRoom[] = [
  {
    id: 'room-1',
    name: 'Project X Team',
    description: 'Discussion group for Project X development',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=400&auto=format&fit=crop',
    ownerId: 'user-2',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastMessage: mockMessages['room-1'][mockMessages['room-1'].length - 1],
  },
  {
    id: 'room-2',
    name: 'Backend Devs',
    description: 'Group for backend developers',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&auto=format&fit=crop',
    ownerId: 'user-5',
    members: [mockUsers[0], mockUsers[4], mockUsers[3]],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastMessage: mockMessages['room-2'][mockMessages['room-2'].length - 1],
    unreadCount: 2,
  },
];
