/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Loader2 } from 'lucide-react';
import { Logo } from './Logo';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hello. I am the ResolveIQ Policy & Documentation Assistant. Ask about refund rules, delivery fee reversals, escalation criteria, or the Supabase PostgreSQL integration.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: newMessages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', text: data.reply || 'I am here to help.' }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: 'Our refund policy provides instant automated refunds within 2 seconds for failed transactions. For orders, you can track or cancel directly through the Issue Resolution tab.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-lg border border-neutral-700/80 font-medium text-xs transition-colors group"
        >
          <Logo size="sm" showWordmark={false} />
          <span className="font-semibold text-neutral-100">ResolveIQ Assistant</span>
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-88 sm:w-96 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden flex flex-col h-[460px] animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Header */}
          <div className="bg-neutral-900 px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" showWordmark={false} />
              <div>
                <h4 className="text-xs font-semibold leading-tight flex items-center gap-1">
                  <span>Resolve</span>
                  <span className="text-red-500 font-bold">IQ</span>
                  <span className="text-neutral-400 font-normal">Assistant</span>
                </h4>
                <p className="text-[10px] text-neutral-400">Policy & Technical Inquiries</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-neutral-50/60 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-5 h-5 rounded bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 text-[10px] font-mono font-medium mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-md max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-800 border border-neutral-200/90 shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-neutral-500 text-xs py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                <span>Generating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-neutral-200 flex gap-2">
            <input
              type="text"
              placeholder="Ask about refund policy, tracking, or Postgres..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-md transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
