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
      <ChatSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-3">
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1" />
          <UserMenu />
        </div>

        <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage account and website settings.</p>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-1">Your Name</h2>
            <p className="text-muted-foreground text-sm mb-4">Please enter a display name you are comfortable with.</p>
            <div className="flex gap-3">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={32}
                className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="px-6 py-2 bg-secondary text-muted-foreground rounded-lg text-sm">Save Changes</button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Max 32 characters</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-1">Delete Account</h2>
            <p className="text-muted-foreground text-sm mb-4">This is a danger zone - Be careful !</p>
            <div className="border border-destructive/30 rounded-xl p-6 bg-destructive/5">
              <h3 className="font-semibold mb-2">Are you sure ?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your ভাইজান AI account. This action cannot be undone - please proceed with caution.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-destructive/20 text-destructive rounded-lg text-sm hover:bg-destructive/30 transition-colors">
                🗑 Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
