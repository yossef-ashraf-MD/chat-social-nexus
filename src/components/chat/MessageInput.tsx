
import React, { useState, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageType } from '@/models/types';
import { Mic, Send, Image, Video } from 'lucide-react';

const MessageInput: React.FC = () => {
  const { sendMessage, activeChat } = useChat();
  const [message, setMessage] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const handleSendMessage = () => {
    if (message.trim() && activeChat) {
      sendMessage(message, 'text');
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChat) {
      // In a real app, we would upload the file and get a URL
      // For now, we'll just use the file name as the message
      sendMessage(`Sent an image: ${file.name}`, 'image');
    }
  };
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChat) {
      // In a real app, we would upload the file and get a URL
      // For now, we'll just use the file name as the message
      sendMessage(`Sent a video: ${file.name}`, 'video');
    }
  };
  
  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // In a real app, we would start recording
      // For now, we'll just simulate sending a voice message after a second
      setTimeout(() => {
        if (activeChat) {
          sendMessage('Voice message', 'voice');
          setIsRecording(false);
        }
      }, 1000);
    }
  };
  
  if (!activeChat) return null;
  
  return (
    <div className="p-4 border-t flex flex-col">
      <div className="flex items-center gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 min-h-[60px] max-h-[120px] resize-none"
        />
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => videoInputRef.current?.click()}
          >
            <Video className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoUpload}
            accept="video/*"
            className="hidden"
          />
          
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "ghost"}
            onClick={toggleVoiceRecording}
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Button type="button" onClick={handleSendMessage} disabled={!message.trim()}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
