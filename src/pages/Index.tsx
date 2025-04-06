
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import ChatLayout from '@/components/chat/ChatLayout';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-chat-primary to-chat-secondary">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? (
        <ChatLayout />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-chat-primary to-chat-secondary p-4">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white p-6">
              <h1 className="text-4xl font-bold mb-4">Chat App</h1>
              <p className="text-xl mb-6">
                Connect with friends, create rooms, and chat in real-time.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-white bg-opacity-20 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Direct messaging with friends</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white bg-opacity-20 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Create and join group chat rooms</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white bg-opacity-20 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Send friend requests</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white bg-opacity-20 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Real-time messaging</span>
                </li>
              </ul>
            </div>
            <div>
              <LoginForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
