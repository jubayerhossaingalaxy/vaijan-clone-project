import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Settings, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  const initials = (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="font-semibold text-sm">{user.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="p-2">
            <Link to="/chat" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
              <MessageSquare className="w-4 h-4" /> Chat
            </Link>
            <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <button onClick={() => { signOut(); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors text-left">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
