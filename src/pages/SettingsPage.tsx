import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ChatSidebar from '@/components/ChatSidebar';
import { PanelLeftOpen, Save, Check } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (user) setDisplayName(user.user_metadata?.full_name || '');
  }, [user, loading, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName },
      });
      if (error) throw error;
      toast.success('প্রোফাইল আপডেট হয়েছে! ✅');
    } catch (err: any) {
      toast.error('আপডেট করতে সমস্যা হয়েছে 😅');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(false)} onNewChat={() => navigate('/chat')} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-3">
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-lg font-semibold">সেটিংস ⚙️</h2>
          <div className="flex-1" />
          <UserMenu />
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Profile */}
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
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? (
                    <><Save className="w-4 h-4 animate-spin" /> সেভ হচ্ছে...</>
                  ) : (
                    <><Check className="w-4 h-4" /> সেভ করো</>
                  )}
                </button>
              </div>
            </div>

            {/* Keyboard shortcuts */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">কীবোর্ড শর্টকাট ⌨️</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">নতুন চ্যাট</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">Ctrl + N</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">সাইডবার টগল</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">Ctrl + /</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">মেসেজ পাঠাও</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">নতুন লাইন</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">Shift + Enter</kbd>
                </div>
              </div>
            </div>

            {/* Logout */}
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
