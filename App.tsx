import React, { useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { APP_NAME } from './constants';

const App: React.FC = () => {
  const { messages, sendMessage, isLoading, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation history? This action cannot be undone.')) {
      clearChat();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D1117] text-gray-200 font-sans">
      <header className="bg-[#161B22] text-white p-4 shadow-lg flex items-center justify-between z-10 border-b border-cyan-500/30">
        <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mr-4 border border-cyan-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z" />
                <path d="M10 16h4" />
                <circle cx="8.5" cy="11.5" r=".5" fill="currentColor" />
                <circle cx="15.5" cy="11.5" r=".5" fill="currentColor" />
                <path d="M9 7l-1 -4" />
                <path d="M15 7l1 -4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider">{APP_NAME}</h1>
              <p className="text-sm text-cyan-400 opacity-80">Online</p>
            </div>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 rounded-full hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
          aria-label="Clear chat history"
          title="Clear chat history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </header>

      <main 
        className="flex-1 overflow-y-auto p-4 md:p-6"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23161B22' fill-opacity='0.4' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.99-7.5L26 15v18.5l-13 7.5L0 33.5V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-[#161B22] p-2 md:p-4 border-t border-cyan-500/30">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;