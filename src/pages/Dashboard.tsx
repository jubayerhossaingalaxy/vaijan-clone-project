import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Sparkles, ArrowRight, Clock, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import UserMenu from '@/components/UserMenu';
import { MOOD_CATEGORIES } from '@/components/MoodTags';

const quickMoods = [
  { id: 'bhai-radar', emoji: '🏠', label: 'ভাই-রাদার' },
  { id: 'coding-help', emoji: '💻', label: 'কোডিং' },
  { id: 'study', emoji: '📖', label: 'পড়াশোনা' },
  { id: 'roast', emoji: '🔥', label: 'রোস্ট' },
  { id: 'romantic', emoji: '💕', label: 'রোমান্টিক' },
  { id: 'motivation', emoji: '💪', label: 'মোটিভেশন' },
  { id: 'cooking', emoji: '🍳', label: 'রান্না' },
  { id: 'cricket', emoji: '🏏', label: 'ক্রিকেট' },
];

const tips = [
  '💡 "রোস্ট" মোডে গেলে AI মজার রোস্ট করবে!',
  '💡 Ctrl+N দিয়ে নতুন চ্যাট শুরু করো',
  '💡 ভয়েস বাটন দিয়ে বাংলায় কথা বলতে পারো',
  '💡 "কোডিং" মোডে বাংলায় কোড শিখতে পারো',
  '💡 Shift+Enter দিয়ে নতুন লাইন দিতে পারো',
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'ভাই';
  const totalMoods = MOOD_CATEGORIES.reduce((sum, c) => sum + c.tags.length, 0);

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'সুপ্রভাত' : greetingHour < 17 ? 'শুভ বিকেল' : greetingHour < 20 ? 'শুভ সন্ধ্যা' : 'শুভ রাত্রি';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">ভ</div>
            <h1 className="text-lg font-bold text-foreground">দেশি ভাই - AI</h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/chat" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              চ্যাট <ArrowRight className="w-4 h-4" />
            </Link>
            <UserMenu />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">
            {greeting}, {displayName}! 👋
          </h2>
          <p className="text-muted-foreground">তোমার দেশি ভাই তোমার জন্য রেডি। কী নিয়ে আড্ডা দিবি?</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { icon: MessageSquare, label: 'মোট মোড', value: `${totalMoods}+`, color: 'text-primary' },
            { icon: Sparkles, label: 'ক্যাটাগরি', value: `${MOOD_CATEGORIES.length}`, color: 'text-primary' },
            { icon: Clock, label: 'সবসময়', value: '24/7', color: 'text-primary' },
            { icon: Zap, label: 'স্ট্রিমিং', value: 'রিয়েল-টাইম', color: 'text-primary' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 mb-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> দ্রুত শুরু করো
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {quickMoods.map((mood) => (
              <Link
                key={mood.id}
                to={`/chat?mood=${mood.id}`}
                className="flex items-center gap-2 p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors text-sm"
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="font-medium truncate">{mood.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Tip + CTA */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-6"
          >
            <h3 className="font-semibold mb-2">আজকের টিপ 📌</h3>
            <p className="text-sm text-muted-foreground">{tip}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold mb-2">আড্ডা শুরু করো! 💬</h3>
              <p className="text-sm text-muted-foreground mb-4">মোড সিলেক্ট করো আর চ্যাট শুরু করো — তোমার দেশি ভাই রেডি!</p>
            </div>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity w-fit"
            >
              চ্যাট করো <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Categories overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4">সব ক্যাটাগরি</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {MOOD_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to="/chat"
                className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/60 rounded-lg transition-colors text-sm"
              >
                <span>{cat.emoji}</span>
                <span className="truncate">{cat.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{cat.tags.length}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
