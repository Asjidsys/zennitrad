import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-cyan-500/10 border border-cyan-500/30 text-gray-200 rounded-l-lg rounded-br-lg shadow-[0_0_15px_rgba(0,255,255,0.1)]'
    : 'bg-gray-700/20 border border-gray-600/30 text-gray-300 rounded-r-lg rounded-bl-lg shadow-lg';
  
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`${containerClasses} animate-fade-in`}>
      <div className={`p-3 max-w-sm md:max-w-md lg:max-w-lg ${bubbleClasses}`}>
        <p className="text-base whitespace-pre-wrap font-mono">{message.text}</p>
        <p className={`text-xs mt-2 ${isUser ? 'text-cyan-400/60' : 'text-gray-400/60'} text-right font-sans`}>
          {time}
        </p>
      </div>
    </div>
  );
};
