import { useState, useCallback, useRef } from 'react';
import { useRecursiv } from '@/contexts/RecursivContext';
import { callAI } from '@/lib/ai';
import { AGENT_ID } from '@/lib/recursiv';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
}

export function useAiChat() {
  const { sdk } = useRecursiv();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (isStreaming) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const assistantId = 'assistant-' + Date.now();

    // Add user message + streaming placeholder immediately
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: new Date(),
      },
    ]);

    setIsStreaming(true);

    try {
      console.log('[chat] Sending to agent', AGENT_ID, 'conversation', conversationId);
      const result = await callAI(sdk, AGENT_ID, text, conversationId || undefined);
      if (result.conversationId) {
        setConversationId(result.conversationId);
      }

      // Replace streaming placeholder with actual response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, isStreaming: false, content: result.content }
            : m
        )
      );
    } catch (err: any) {
      console.error('[chat] Error:', err.message, err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, isStreaming: false, content: `Something went wrong: ${err.message}` }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [sdk, isStreaming, conversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  return { messages, isStreaming, sendMessage, clearMessages };
}
