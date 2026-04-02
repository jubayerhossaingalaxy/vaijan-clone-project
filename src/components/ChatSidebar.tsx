import { Home, Settings, Facebook, Users, MessageSquare, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import vaijanTea from '@/assets/vaijan-tea.png';

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: MessageSquare, label: 'আলাপ', path: '/chat' },
];

const optionItems = [
  { icon: Home, label: 'হোম', path: '/' },
  { icon: Settings, label: 'সেটিংস', path: '/settings' },
  { icon: Facebook, label: 'ফেসবুক গ্রুপ', path: '#', external: true },
  { icon: Users, label: 'টিম দেশি ভাই - AI', path: '/team' },
];

export default function ChatSidebar({ collapsed, onToggle }: ChatSidebarProps) {
  const location = useLocation();

  return (
    <aside className={`flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${collapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-primary">দেশি ভাই - AI</h1>
        <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
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
      </nav>

      <div className="px-3 mt-4">
        <p className="px-3 text-xs text-muted-foreground uppercase tracking-wider mb-2">Options</p>
        <div className="space-y-1">
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

      <div className="mt-auto p-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <img src={vaijanTea} alt="ভাইজান" className="w-24 h-24 mx-auto mb-2 object-contain" loading="lazy" />
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
