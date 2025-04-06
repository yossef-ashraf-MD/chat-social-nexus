
import React from 'react';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';

const ChatLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatInterface />
    </div>
  );
};

export default ChatLayout;
