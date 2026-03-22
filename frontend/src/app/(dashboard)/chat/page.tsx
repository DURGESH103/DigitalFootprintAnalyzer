'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { chatService } from '@/services/platform.service';
import { useReportStore } from '@/store/report.store';
import { ChatMessage } from '@/utils/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  'How can I improve my hireability score?',
  'What are my biggest weaknesses?',
  'Which skills should I learn next?',
  'How do I increase my visibility?',
  'Am I growing as a developer?',
];

export default function ChatPage() {
  const { currentReport } = useReportStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.getHistory(currentReport?.id)
      .then(r => setMessages(r.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [currentReport?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await chatService.send(text, currentReport?.id);
      setMessages(m => [...m, { role: 'assistant', content: res.data.reply }]);
    } catch {
      toast.error('Failed to get response');
      setMessages(m => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    await chatService.clear(currentReport?.id).catch(() => {});
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
          <Bot className="h-5 w-5 text-brand" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-text-primary">AI Assistant</h1>
          <p className="text-xs text-text-muted">
            {currentReport ? `Context: @${currentReport.github_username}` : 'Run an analysis for personalized advice'}
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} aria-label="Clear chat">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass-card p-4 space-y-4 mb-4">
        {fetching ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 text-brand animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-brand" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-primary mb-1">Ask me anything about your profile</p>
              <p className="text-xs text-text-muted">I'll give you personalized advice based on your data</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-bg-tertiary border border-border text-text-secondary hover:border-brand/30 hover:text-brand transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                <div className={cn('h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  msg.role === 'user' ? 'bg-brand/10 border border-brand/20' : 'bg-accent-purple/10 border border-accent-purple/20')}>
                  {msg.role === 'user' ? <User className="h-3.5 w-3.5 text-brand" /> : <Bot className="h-3.5 w-3.5 text-accent-purple" />}
                </div>
                <div className={cn('max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-brand/10 border border-brand/20 text-text-primary rounded-tr-sm'
                    : 'bg-bg-tertiary border border-border text-text-secondary rounded-tl-sm')}>
                  {msg.content.split('\n').map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-accent-purple" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-bg-tertiary border border-border">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your profile, skills, or career…"
          className="flex-1 bg-bg-tertiary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
          disabled={loading}
        />
        <Button type="submit" loading={loading} disabled={!input.trim()} className="h-[42px] w-[42px] p-0 flex-shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
