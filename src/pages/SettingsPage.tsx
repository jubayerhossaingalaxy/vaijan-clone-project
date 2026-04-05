import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ChatSidebar from '@/components/ChatSidebar';
import { PanelLeftOpen } from 'lucide-react';
import UserMenu from '@/components/UserMenu';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (user) setDisplayName(user.user_metadata?.full_name || '');
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(false)} onNewChat={() => navigate('/chat')} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-3">
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-lg font-semibold">সেটিংস ⚙️</h2>
          <div className="flex-1" />
          <UserMenu />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">প্রোফাইল</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">ইমেইল</label>
                  <p className="text-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">নাম</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                    placeholder="তোমার নাম"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              লগ আউট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
