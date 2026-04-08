import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelLeftOpen, Keyboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ChatSidebar from '@/components/ChatSidebar';
import MoodTags, { MOOD_TAGS } from '@/components/MoodTags';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import UserMenu from '@/components/UserMenu';
import vaijanMascot from '@/assets/vaijan-mascot.png';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMood, setActiveMood] = useState('bhai-radar');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingMood, setPendingMood] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check screen size for default sidebar state
  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'n') { e.preventDefault(); handleNewChat(); }
        if (e.key === '/') { e.preventDefault(); setSidebarOpen((p) => !p); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleMoodSelect = (id: string) => {
    if (id === activeMood) return;
    if (messages.length > 0) {
      setPendingMood(id);
    } else {
      setActiveMood(id);
    }
  };

  const confirmMoodSwitch = () => {
    if (pendingMood) {
      setActiveMood(pendingMood);
      setMessages([]);
      setPendingMood(null);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveMood('bhai-radar');
    setError(null);
  };

  const handleSend = useCallback(async (input: string) => {
    const userMsg: Message = { role: 'user', content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setIsStreaming(true);
    setError(null);

    let assistantContent = '';

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vaijan-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: allMessages,
            mood: activeMood,
          }),
        }
      );

      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) throw new Error('rate-limit');
        if (response.status === 402) throw new Error('payment');
        throw new Error(errData.error || 'AI response failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || !line.trim()) continue;
          if (!line.startsWith('data: ')) continue;

          const json = line.slice(6).trim();
          if (json === '[DONE]') break;

          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg =
        err.message === 'rate-limit'
          ? 'ভাই, অনেক বেশি মেসেজ পাঠাচ্ছো! একটু অপেক্ষা করো। ⏳'
          : err.message === 'payment'
          ? 'ভাই, ক্রেডিট শেষ হয়ে গেছে! 💳'
          : 'ভাই, একটু সমস্যা হয়েছে। আবার চেষ্টা করো! 😅';
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMsg },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, activeMood]);

  // Regenerate last response
  const handleRegenerate = useCallback(() => {
    if (messages.length < 2) return;
    // Remove last assistant message, resend last user message
    const lastUserIdx = messages.map((m) => m.role).lastIndexOf('user');
    if (lastUserIdx === -1) return;
    const lastUserMsg = messages[lastUserIdx].content;
    const newMessages = messages.slice(0, lastUserIdx);
    setMessages(newMessages);
    setTimeout(() => handleSend(lastUserMsg), 100);
  }, [messages, handleSend]);

  // Retry on error
  const handleRetry = useCallback(() => {
    if (messages.length < 1) return;
    const lastUserIdx = messages.map((m) => m.role).lastIndexOf('user');
    if (lastUserIdx === -1) return;
    const lastUserMsg = messages[lastUserIdx].content;
    // Remove error message
    const newMessages = messages.slice(0, lastUserIdx);
    setMessages(newMessages);
    setError(null);
    setTimeout(() => handleSend(lastUserMsg), 100);
  }, [messages, handleSend]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatSidebar
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-3">
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground mr-3">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Ctrl+N নতুন চ্যাট • Ctrl+/ সাইডবার</span>
          </div>
          <UserMenu />
        </div>

        {/* Mood selector */}
        <MoodTags activeTag={activeMood} onSelect={handleMoodSelect} />

        {/* Chat messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-3 sm:px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <img src={vaijanMascot} alt="দেশি ভাই" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                👋 সালাম, আমি দেশি ভাই - AI—তোমার একদম নিজের ভাই!
              </h2>
              <p className="text-muted-foreground max-w-lg text-sm sm:text-base">
                তোর মুডে, তোর স্টাইলে আমি আছি। মজা, গম্ভীরতা, বা একটু চিন্তা—যে রকম দরকার, ঠিক সে রকম।
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                ১০০+ মোড থেকে বেছে নাও ☝️ তারপর আড্ডা শুরু করো!
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              isLast={i === messages.length - 1 && msg.role === 'assistant'}
              isStreaming={isStreaming && i === messages.length - 1}
              onRegenerate={handleRegenerate}
            />
          ))}

          {/* Error retry */}
          {error && !isStreaming && (
            <div className="flex justify-center mt-2">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm hover:bg-destructive/20 transition-colors"
              >
                🔄 আবার চেষ্টা করো
              </button>
            </div>
          )}

          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm animate-pulse-glow">
              দেশি ভাই ভাবছে...
            </div>
          )}
        </div>

        {/* Chat input */}
        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </div>

      {/* Mood switch confirmation dialog */}
      <AlertDialog open={!!pendingMood} onOpenChange={(open) => !open && setPendingMood(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>মোড পরিবর্তন করবে? 🔄</AlertDialogTitle>
            <AlertDialogDescription>
              নতুন মোডে যেতে চাইলে বর্তমান চ্যাট হিস্ট্রি মুছে যাবে। তুমি কি "
              {MOOD_TAGS.find((t) => t.id === pendingMood)?.emoji}{' '}
              {MOOD_TAGS.find((t) => t.id === pendingMood)?.label}" মোডে যেতে চাও?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>না, থাক</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMoodSwitch}>হ্যাঁ, পরিবর্তন করো</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
