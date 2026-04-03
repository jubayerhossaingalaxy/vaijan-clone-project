import { MessageSquare, PanelLeftClose, Plus, Trash2, Home, Settings, Facebook, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ChatSession } from '@/hooks/useChatHistory';
import { MOOD_TAGS } from '@/components/MoodTags';
import vaijanTea from '@/assets/vaijan-tea.png';

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

const optionItems = [
  { icon: Home, label: 'হোম', path: '/' },
  { icon: Settings, label: 'সেটিংস', path: '/settings' },
  { icon: Facebook, label: 'ফেসবুক গ্রুপ', path: '#', external: true },
  { icon: Users, label: 'টিম দেশি ভাই - AI', path: '/team' },
];

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'আজ';
  if (diffDays === 1) return 'গতকাল';
  return `${diffDays} দিন আগে`;
}

export default function ChatSidebar({
  collapsed, onToggle, sessions, activeSessionId,
  onSelectSession, onNewChat, onDeleteSession,
}: ChatSidebarProps) {
  const location = useLocation();
  const getMoodEmoji = (mood: string) => MOOD_TAGS.find(t => t.id === mood)?.emoji || '💬';

  // Group sessions by date
  const grouped: Record<string, ChatSession[]> = {};
  sessions.forEach(s => {
    const label = formatRelativeDate(s.created_at);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(s);
  });

  return (
    <aside className={`flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${collapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-primary">দেশি ভাই - AI</h1>
        <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 mb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          নতুন চ্যাট
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 space-y-3">
        {Object.entries(grouped).map(([label, items]) => (
          <div key={label}>
            <p className="px-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <div className="space-y-0.5">
              {items.map(session => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                    activeSessionId === session.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <span className="text-xs">{getMoodEmoji(session.mood)}</span>
                  <span className="flex-1 truncate">{session.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">কোনো চ্যাট হিস্ট্রি নেই</p>
        )}
      </div>

      {/* Options */}
      <div className="px-3 py-2 border-t border-sidebar-border">
        <div className="space-y-0.5">
          {optionItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <img src={vaijanTea} alt="দেশি ভাই" className="w-24 h-24 mx-auto mb-2 object-contain" loading="lazy" />
          <h3 className="font-semibold text-center">এক কাপ চা! ☕</h3>
          <p className="text-xs text-muted-foreground text-center mt-1">
            ভাই, একটু চায়ের পয়সা দে! আমি তোর সাথে সবসময় আড্ডা দিচ্ছি, একটু সাপোর্ট করলে পুরা দেশি মুডে আরো মজা হবে! 😇
          </p>
          <button className="w-full mt-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors">
            চায়ের খরচ 🍵
          </button>
        </div>
      </div>
    </aside>
  );
}
