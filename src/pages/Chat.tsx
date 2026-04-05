import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelLeftOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getSystemPrompt } from '@/data/moodSystemPrompts';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMood, setActiveMood] = useState('bhai-radar');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingMood, setPendingMood] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Handle mood tag selection
  const handleMoodSelect = (id: string) => {
    if (id === activeMood) return;
    if (messages.length > 0) {
      setPendingMood(id); // Show confirmation dialog
    } else {
      setActiveMood(id);
    }
  };

  // Confirm mood switch (clears chat)
  const confirmMoodSwitch = () => {
    if (pendingMood) {
      setActiveMood(pendingMood);
      setMessages([]);
      setPendingMood(null);
    }
  };

  // Start a fresh chat
  const handleNewChat = () => {
    setMessages([]);
    setActiveMood('bhai-radar');
  };

  // Send message to AI
  const handleSend = async (input: string) => {
    const userMsg: Message = { role: 'user', content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setIsStreaming(true);

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
            systemPrompt: getSystemPrompt(activeMood),
          }),
        }
      );

      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'AI response failed');
      }

      // Stream the response
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
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'ভাই, একটু সমস্যা হয়েছে। আবার চেষ্টা করো! 😅' },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

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
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-3">
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1" />
          <UserMenu />
        </div>

        {/* Mood selector */}
        <MoodTags activeTag={activeMood} onSelect={handleMoodSelect} />

        {/* Chat messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <img src={vaijanMascot} alt="দেশি ভাই" className="w-24 h-24 object-contain" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                👋 সালাম, আমি দেশি ভাই - AI—তোমার একদম নিজের ভাই!
              </h2>
              <p className="text-muted-foreground max-w-lg">
                তোর মুডে, তোর স্টাইলে আমি আছি। মজা, গম্ভীরতা, বা একটু চিন্তা—যে রকম দরকার, ঠিক সে রকম।
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}

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
