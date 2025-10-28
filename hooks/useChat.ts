import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { N8N_WEBHOOK_URL } from '../constants';

const getSessionId = (): string => {
  let sessionId = localStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
};

const getWelcomeMessage = (): Message => ({
  id: crypto.randomUUID(),
  text: `Hello! I am the ZenniTrade AI Agent. How can I assist you with your trading queries today?`,
  sender: 'bot',
  timestamp: Date.now(),
});

const getInitialMessages = (): Message[] => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
        try {
            const parsedMessages = JSON.parse(savedMessages);
            if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                return parsedMessages;
            }
        } catch (error) {
            console.error("Failed to parse messages from localStorage", error);
        }
    }
    return [getWelcomeMessage()];
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(getSessionId());

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([getWelcomeMessage()]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const payload = {
      user_message: text,
      session_id: sessionId,
    };

    const makeRequest = async () => {
        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseText = await response.text();
            let replyText: string;

            if (responseText) {
              try {
                const data = JSON.parse(responseText);
                // Prioritize the 'output' key as suggested, then fall back to 'reply'.
                replyText = data.output || data.reply || "Sorry, I couldn't find a valid message in the agent's response.";
              } catch (e) {
                console.error('Failed to parse JSON from webhook:', e);
                // If JSON parsing fails, the response might be plain text.
                replyText = responseText;
              }
            } else {
              replyText = "Sorry, I received an empty response from the agent.";
            }

            const botMessage: Message = {
                id: crypto.randomUUID(),
                text: replyText,
                sender: 'bot',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Webhook request failed:', error);
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                text: '⚠️ Sorry, I couldn’t reach the AI agent.',
                sender: 'bot',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // The existing request logic does not need a retry wrapper like this.
    // The `catch` block in `makeRequest` already handles failures.
    await makeRequest();

  }, [sessionId]);

  return { messages, sendMessage, isLoading, clearChat };
};