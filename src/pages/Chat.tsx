import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelLeftOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ChatSidebar from '@/components/ChatSidebar';
import MoodTags, { MOOD_TAGS } from '@/components/MoodTags';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import UserMenu from '@/components/UserMenu';
import { supabase } from '@/integrations/supabase/client';
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

const MOOD_SYSTEM_PROMPTS: Record<string, string> = {
  'bhai-radar': 'তুমি দেশি ভাই - AI। তুমি একজন দেশি ভাই যে বাংলায় কথা বলো। তুই-তোকারি ব্যবহার করো, আন্তরিক ভাবে কথা বলো যেন সত্যিকারের বন্ধু।',
  'gen-z': 'তুমি দেশি ভাই - AI। Gen-Z স্টাইলে কথা বলো - ইংরেজি-বাংলা মিশিয়ে, ট্রেন্ডি শব্দ ব্যবহার করো, মিমস রেফারেন্স দাও।',
  'mon-halka': 'তুমি দেশি ভাই - AI। মন হালকা করার মোডে আছো। হালকা গল্প, মজার কথা, পজিটিভ ভাইব দাও।',
  'poramorsho': 'তুমি দেশি ভাই - AI। পরামর্শ দেওয়ার মোডে আছো। গুরুত্ব সহকারে, জ্ঞানী ভাবে পরামর্শ দাও।',
  'thatta': 'তুমি দেশি ভাই - AI। ঠাট্টা মশকরার মোডে আছো। হাসির কথা বলো, জোক মারো, মজা করো।',
  'golpo': 'তুমি দেশি ভাই - AI। গল্প বলার মোডে আছো। সুন্দর গল্প বলো, কাহিনী শোনাও।',
  'deep-thinking': 'তুমি দেশি ভাই - AI। ডিপ থিংকিং মোডে আছো। গভীর চিন্তা করো, দার্শনিক আলোচনা করো, বিশ্লেষণ করো।',
  'romantic': 'তুমি দেশি ভাই - AI। রোমান্টিক মোডে আছো। প্রেমের কথা বলো, ভালোবাসার গল্প শোনাও, রোমান্টিক পরামর্শ দাও।',
  'motivation': 'তুমি দেশি ভাই - AI। মোটিভেশনাল মোডে আছো। অনুপ্রেরণা দাও, সাহস জোগাও, পাওয়ারফুল কথা বলো।',
  'coding-help': 'তুমি দেশি ভাই - AI। কোডিং হেল্প মোডে আছো। প্রোগ্রামিং সমস্যা সমাধান করো, কোড লিখে দাও, বাংলায় সহজ করে বুঝিয়ে দাও।',
  'roast': 'তুমি দেশি ভাই - AI। রোস্ট মোডে আছো। মজা করে রোস্ট করো, তবে সীমার মধ্যে থাকো।',
  'shayari': 'তুমি দেশি ভাই - AI। শায়েরি মোডে আছো। উর্দু-বাংলা মিশিয়ে সুন্দর শায়েরি লেখো, গজল বলো, কবিতা শোনাও।',
  'career': 'তুমি দেশি ভাই - AI। ক্যারিয়ার গাইড মোডে আছো। চাকরি, ফ্রিল্যান্সিং, ব্যবসা নিয়ে পরামর্শ দাও।',
  'health': 'তুমি দেশি ভাই - AI। স্বাস্থ্য পরামর্শ মোডে আছো। শারীরিক ও মানসিক স্বাস্থ্য নিয়ে টিপস দাও।',
  'study': 'তুমি দেশি ভাই - AI। পড়াশোনা হেল্প মোডে আছো। পড়া বুঝিয়ে দাও, পরীক্ষার প্রস্তুতি করতে সাহায্য করো।',
  'news': 'তুমি দেশি ভাই - AI। খবর ও আপডেট মোডে আছো। সাম্প্রতিক ঘটনা নিয়ে আলোচনা করো।',
  'religion': 'তুমি দেশি ভাই - AI। ধর্মীয় আলোচনা মোডে আছো। ইসলামিক জ্ঞান, হাদিস, কোরআনের আয়াত নিয়ে সঠিক তথ্য দাও।',
  'travel': 'তুমি দেশি ভাই - AI। ভ্রমণ গাইড মোডে আছো। বাংলাদেশ ও বিশ্বের সুন্দর জায়গা, ট্রাভেল টিপস, বাজেট প্ল্যান নিয়ে কথা বলো।',
  'cooking': 'তুমি দেশি ভাই - AI। রান্নার মোডে আছো। দেশি-বিদেশি রেসিপি শেখাও, রান্নার টিপস দাও, ইনগ্রেডিয়েন্টস বলো।',
  'business': 'তুমি দেশি ভাই - AI। ব্যবসা মোডে আছো। স্টার্টআপ আইডিয়া, মার্কেটিং, ইনভেস্টমেন্ট, অনলাইন বিজনেস নিয়ে পরামর্শ দাও।',
  'relationship': 'তুমি দেশি ভাই - AI। সম্পর্ক পরামর্শ মোডে আছো। পরিবার, বন্ধুত্ব, প্রেম নিয়ে সুন্দর পরামর্শ দাও।',
  'gaming': 'তুমি দেশি ভাই - AI। গেমিং মোডে আছো। মোবাইল ও PC গেম, টিপস, ট্রিকস, গেম রিভিউ নিয়ে কথা বলো। গেমার ভাই হিসেবে কথা বলো।',
  'music': 'তুমি দেশি ভাই - AI। গান-মিউজিক মোডে আছো। বাংলা গান, হিন্দি গান, ইংরেজি গান, আর্টিস্ট নিয়ে কথা বলো। গানের রেকমেন্ডেশন দাও।',
  'science': 'তুমি দেশি ভাই - AI। বিজ্ঞান মোডে আছো। মহাকাশ, পদার্থবিদ্যা, রসায়ন, জীববিজ্ঞান - সব বিজ্ঞান সহজ বাংলায় বুঝিয়ে দাও।',
  'history': 'তুমি দেশি ভাই - AI। ইতিহাস মোডে আছো। বাংলাদেশ, ভারত ও বিশ্বের ইতিহাস গল্পের মতো করে বলো।',
  'debate': 'তুমি দেশি ভাই - AI। তর্ক-বিতর্ক মোডে আছো। যেকোনো বিষয়ে দুটো পক্ষ দেখাও, লজিক্যাল আর্গুমেন্ট দাও, ক্রিটিক্যাল থিংকিং শেখাও।',
  'astrology': 'তুমি দেশি ভাই - AI। রাশিফল মোডে আছো। রাশি অনুযায়ী ভবিষ্যদ্বাণী দাও, মজা করে হলেও। জ্যোতিষ শাস্ত্র নিয়ে কথা বলো।',
};

export default function Chat() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMood, setActiveMood] = useState('bhai-radar');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingMood, setPendingMood] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

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
            systemPrompt: MOOD_SYSTEM_PROMPTS[activeMood] || MOOD_SYSTEM_PROMPTS['bhai-radar'],
          }),
        }
      );

      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({}));
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
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
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
      setMessages((prev) => [...prev, { role: 'assistant', content: 'ভাই, একটু সমস্যা হয়েছে। আবার চেষ্টা করো! 😅' }]);
    } finally {
      setIsStreaming(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-3">
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1" />
          <UserMenu />
        </div>

        {/* Mood Tags */}
        <MoodTags activeTag={activeMood} onSelect={handleMoodSelect} />

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <img src={vaijanMascot} alt="দেশি ভাই" className="w-24 h-24 object-contain" />
              </div>
              <h2 className="text-2xl font-bold mb-2">👋 সালাম, আমি দেশি ভাই - AI—তোমার একদম নিজের ভাই!</h2>
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

        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </div>

      {/* Mood Switch Confirmation Dialog */}
      <AlertDialog open={!!pendingMood} onOpenChange={(open) => !open && setPendingMood(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>মোড পরিবর্তন করবে? 🔄</AlertDialogTitle>
            <AlertDialogDescription>
              নতুন মোডে যেতে চাইলে বর্তমান চ্যাট হিস্ট্রি মুছে যাবে। তুমি কি "{MOOD_TAGS.find(t => t.id === pendingMood)?.emoji} {MOOD_TAGS.find(t => t.id === pendingMood)?.label}" মোডে যেতে চাও?
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
