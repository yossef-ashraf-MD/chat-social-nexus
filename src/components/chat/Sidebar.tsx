
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LogOut, User, Users, MessageSquare, PlusCircle, UserPlus, Bell } from 'lucide-react';
import { FriendRequest } from '@/models/types';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    friends, 
    conversations, 
    chatRooms, 
    setActiveChat, 
    activeChat,
    createChatRoom,
    friendRequests,
    respondToFriendRequest
  } = useChat();
  
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  
  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createChatRoom(newRoomName.trim(), newRoomDescription.trim() || undefined);
      setNewRoomName('');
      setNewRoomDescription('');
      setIsCreatingRoom(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const pendingRequests = friendRequests.filter(
    fr => fr.receiverId === user?.id && fr.status === 'pending'
  );

  return (
    <div className="w-80 border-r bg-sidebar h-screen flex flex-col">
      {/* Header with user info */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback>{user?.username ? getInitials(user.username) : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user?.username}</div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} title="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 px-4 py-2">
          <TabsTrigger value="chats">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="friends">
            <User className="h-4 w-4 mr-2" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="groups" className="relative">
            <Users className="h-4 w-4 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>

        {/* Chats tab - direct conversations */}
        <TabsContent value="chats" className="flex-1 p-0 m-0 flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">Direct Messages</h3>
            {pendingRequests.length > 0 && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5">
                  {pendingRequests.length}
                </Badge>
              </Button>
            )}
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {conversations.map(conv => {
                // Find the other user (not the current user)
                const otherUser = conv.participants.find(p => p.id !== user?.id);
                
                if (!otherUser) return null;
                
                return (
                  <button
                    key={conv.id}
                    className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors ${
                      activeChat?.id === conv.id ? 'bg-sidebar-accent' : ''
                    }`}
                    onClick={() => setActiveChat('direct', conv.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={otherUser.avatar} alt={otherUser.username} />
                        <AvatarFallback>{getInitials(otherUser.username)}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                        otherUser.status === 'online' ? 'bg-green-500' : 
                        otherUser.status === 'away' ? 'bg-yellow-500' : 
                        otherUser.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                      } border-2 border-sidebar`}></span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{otherUser.username}</div>
                      {conv.lastMessage && (
                        <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {conv.lastMessage.senderId === user?.id ? 'You: ' : ''}
                          {conv.lastMessage.content}
                        </div>
                      )}
                    </div>
                    {conv.unreadCount && conv.unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Friends tab */}
        <TabsContent value="friends" className="flex-1 p-0 m-0 flex flex-col">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Friend Requests</h3>
            {pendingRequests.length > 0 ? (
              <div className="space-y-2">
                {pendingRequests.map(request => (
                  <FriendRequestItem 
                    key={request.id} 
                    request={request} 
                    onRespond={respondToFriendRequest} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No pending requests</div>
            )}
          </div>
          
          <Separator />
          
          <div className="p-4">
            <h3 className="text-sm font-medium">Your Friends</h3>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={friend.avatar} alt={friend.username} />
                      <AvatarFallback>{getInitials(friend.username)}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      friend.status === 'online' ? 'bg-green-500' : 
                      friend.status === 'away' ? 'bg-yellow-500' : 
                      friend.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                    } border-2 border-sidebar`}></span>
                  </div>
                  <div>
                    <div className="font-medium">{friend.username}</div>
                    <div className="text-xs text-muted-foreground capitalize">{friend.status}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-auto" 
                    onClick={() => {
                      // Find conversation with this friend or create new one
                      const conv = conversations.find(c => 
                        c.participants.some(p => p.id === friend.id)
                      );
                      
                      if (conv) {
                        setActiveChat('direct', conv.id);
                      } else {
                        // In a real app, we would create a new conversation here
                        console.log('Would create new conversation with', friend.id);
                      }
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t">
            <Button variant="outline" className="w-full" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </Button>
          </div>
        </TabsContent>

        {/* Groups tab */}
        <TabsContent value="groups" className="flex-1 p-0 m-0 flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">Chat Rooms</h3>
            
            <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Chat Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input 
                      id="room-name" 
                      placeholder="e.g., Project Team" 
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-description">Description (optional)</Label>
                    <Textarea 
                      id="room-description" 
                      placeholder="What's this room about?" 
                      value={newRoomDescription}
                      onChange={(e) => setNewRoomDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateRoom} className="w-full">
                    Create Room
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {chatRooms.map(room => (
                <button
                  key={room.id}
                  className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors ${
                    activeChat?.id === room.id ? 'bg-sidebar-accent' : ''
                  }`}
                  onClick={() => setActiveChat('room', room.id)}
                >
                  <Avatar>
                    <AvatarImage src={room.image} alt={room.name} />
                    <AvatarFallback>{getInitials(room.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{room.name}</div>
                    {room.lastMessage && (
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {room.lastMessage.senderId === user?.id ? 'You: ' : ''}
                        {room.lastMessage.content}
                      </div>
                    )}
                  </div>
                  {room.unreadCount && room.unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {room.unreadCount}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component for displaying a friend request
const FriendRequestItem: React.FC<{ 
  request: FriendRequest, 
  onRespond: (id: string, accept: boolean) => void 
}> = ({ request, onRespond }) => {
  // This would normally fetch the sender info from the context or a service
  const sender = {
    username: 'User ' + request.senderId.split('-')[1],
    avatar: `https://avatars.dicebear.com/api/initials/${request.senderId}.svg`,
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-card">
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender.avatar} alt={sender.username} />
        <AvatarFallback>{sender.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="text-sm font-medium">{sender.username}</div>
        <div className="text-xs text-muted-foreground">Wants to be friends</div>
      </div>
      <div className="flex gap-1">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 px-2"
          onClick={() => onRespond(request.id, true)}
        >
          Accept
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 px-2"
          onClick={() => onRespond(request.id, false)}
        >
          Decline
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
