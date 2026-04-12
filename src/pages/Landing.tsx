import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles, Zap, Shield, Globe, Mic, Users, Star, ChevronDown, Bot, Layers, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import mascot from '@/assets/vaijan-mascot.png';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const features = [
  { icon: MessageSquare, title: '১০০+ মোড', desc: 'রোমান্টিক থেকে কোডিং — যেকোনো মুডে আড্ডা দাও। প্রতিটা মোডে AI-এর personality আলাদা!' },
  { icon: Sparkles, title: 'AI পাওয়ারড', desc: 'Google Gemini ও GPT-5 এর শক্তিতে চলে। সবচেয়ে advanced AI তোমার ভাই হয়ে!' },
  { icon: Zap, title: 'রিয়েল-টাইম স্ট্রিমিং', desc: 'টাইপ করতে করতেই উত্তর আসে — ChatGPT-এর মতো smooth experience!' },
  { icon: Shield, title: 'সিকিউর & প্রাইভেট', desc: 'তোমার চ্যাট ডাটা সম্পূর্ণ নিরাপদ। Server-side security, কোনো ডাটা লিক নাই।' },
  { icon: Globe, title: 'পুরোপুরি বাংলায়', desc: 'ঢাকাইয়া স্ল্যাং থেকে শুদ্ধ বাংলা — তোমার ভাষায়, তোমার স্টাইলে AI!' },
  { icon: Mic, title: 'ভয়েস ইনপুট', desc: 'বাংলায় কথা বল, AI বুঝে নেবে। Chrome ও Edge এ বাংলা ভয়েস সাপোর্ট!' },
  { icon: Bot, title: 'বাংলাদেশি ফিল', desc: 'চায়ের দোকানের আড্ডা, ক্রিকেট নিয়ে তর্ক, বিরিয়ানির রেসিপি — সব বাংলাদেশি ফ্লেভারে!' },
  { icon: Layers, title: 'ক্যাটাগরি সিস্টেম', desc: '১৩টা ক্যাটাগরিতে সাজানো — Skills, Entertainment, Career, Lifestyle আরো অনেক!' },
  { icon: Lock, title: 'ফ্রি, কোনো লিমিট নাই', desc: 'গুগল একাউন্ট দিয়ে লগিন করো, ব্যস! কোনো পেমেন্ট, কোনো সীমাবদ্ধতা নাই!' },
];

const faqs = [
  { q: 'দেশি ভাই - AI কি ফ্রি?', a: 'হ্যাঁ, সম্পূর্ণ ফ্রি! গুগল একাউন্ট দিয়ে লগিন করলেই সব ফিচার ব্যবহার করতে পারবে। কোনো hidden charge নাই।' },
  { q: 'কোন কোন ভাষায় কথা বলতে পারে?', a: 'প্রধানত বাংলায়, তবে বাংলিশ (বাংলা+ইংরেজি মিক্স) এও কথা বলে। কোডিং মোডে ইংরেজিতেও হেল্প করে।' },
  { q: '১০০+ মোড কি? কীভাবে কাজ করে?', a: 'প্রতিটা মোডে AI-এর personality সম্পূর্ণ বদলে যায়! যেমন "রোস্ট" মোডে মজা করে রোস্ট করবে, "কোডিং" মোডে সিনিয়র ডেভেলপারের মতো হেল্প করবে। উপরে ক্যাটাগরি থেকে বেছে নাও!' },
  { q: 'আমার ডাটা কি নিরাপদ?', a: 'সম্পূর্ণ নিরাপদ! তোমার মেসেজ server-side processed হয়, কিন্তু permanently store হয় না। End-to-end secure connection ব্যবহার করি।' },
  { q: 'ভয়েস ইনপুট কি সব ব্রাউজারে কাজ করে?', a: 'Chrome ও Edge ব্রাউজারে সবচেয়ে ভালো কাজ করে। বাংলা (bn-BD) ভয়েস রিকগনিশন সাপোর্ট করে। Safari ও Firefox এ limited support আছে।' },
  { q: 'এটা কি ChatGPT-এর মতো?', a: 'একই ধরনের AI technology ব্যবহার করে, কিন্তু দেশি ভাই - AI পুরোপুরি বাংলাদেশি ফ্লেভারে! যেন তোমার সবচেয়ে কাছের বন্ধু কথা বলছে — রোবট না!' },
];

const stats = [
  { value: '১০০+', label: 'মোড' },
  { value: '১৩', label: 'ক্যাটাগরি' },
  { value: '24/7', label: 'সবসময় অ্যাভেইলেবল' },
  { value: '০', label: 'টাকা খরচ' },
];

const moodExamples = [
  { emoji: '🏠', name: 'ভাই-রাদার', desc: 'চায়ের দোকানের আড্ডা' },
  { emoji: '💻', name: 'কোডিং হেল্প', desc: 'সিনিয়র ডেভ ভাই' },
  { emoji: '🔥', name: 'রোস্ট', desc: 'ক্লিন ক্লাসি রোস্ট' },
  { emoji: '💕', name: 'রোমান্টিক', desc: 'প্রেমের পরামর্শ' },
  { emoji: '🏏', name: 'ক্রিকেট', desc: 'ম্যাচ আলোচনা' },
  { emoji: '🍳', name: 'রান্না', desc: 'কাচ্চি বিরিয়ানি রেসিপি' },
  { emoji: '📖', name: 'পড়াশোনা', desc: 'পরীক্ষার প্রিপ' },
  { emoji: '💪', name: 'মোটিভেশন', desc: 'উৎসাহ ও অনুপ্রেরণা' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors"
      >
        <h4 className="font-semibold pr-4">{faq.q}</h4>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground animate-fade-in">
          {faq.a}
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">ভ</div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">দেশি ভাই - AI</h1>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">ফিচারস</a>
              <a href="#moods" className="hover:text-foreground transition-colors">মোড</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              <Link to="/team" className="hover:text-foreground transition-colors">টিম</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/chat" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  চ্যাট শুরু <ArrowRight className="w-4 h-4" />
                </Link>
                <UserMenu />
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                শুরু করো <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> ১০০+ মোডে বাংলায় AI চ্যাটবট
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
                  এইটা AI না ভাই,<br />
                  <span className="text-primary">এইটা আসলেই ভাই!</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto lg:mx-0">
                  কোডিং, পড়াশোনা, রোমান্স, ক্যারিয়ার, ক্রিকেট — যেকোনো বিষয়ে তোমার নিজের ভাই আছে!
                  চায়ের দোকানের আড্ডার মতো — বাংলাদেশি ফ্লেভারে AI।
                </p>
                <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                  ✅ ফ্রি ✅ কোনো সীমাবদ্ধতা নাই ✅ গুগল একাউন্ট দিয়ে শুরু করো
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    to={user ? '/chat' : '/login'}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                  >
                    আড্ডা শুরু করো <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-xl font-medium text-lg hover:bg-secondary transition-colors"
                  >
                    জানতে চাই
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex-1 flex justify-center"
              >
                <div className="relative">
                  <div className="w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-primary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <img src={mascot} alt="দেশি ভাই - AI মাসকট" className="relative z-10 w-56 sm:w-72 lg:w-96 drop-shadow-2xl" width={512} height={640} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mood Examples */}
        <section id="moods" className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">যেকোনো মুডে, যেকোনো টপিকে 🎭</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                প্রতিটা মোডে AI-এর কথা বলার ধরন, personality সম্পূর্ণ বদলে যায়। 
                ঠিক যেন আলাদা আলাদা বন্ধুর সাথে কথা বলছো!
              </p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {moodExamples.map((mood, i) => (
                <motion.div
                  key={mood.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-4 sm:p-5 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-default"
                >
                  <span className="text-3xl sm:text-4xl">{mood.emoji}</span>
                  <h4 className="font-semibold mt-2 text-sm sm:text-base">{mood.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{mood.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to={user ? '/chat' : '/login'}
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                সব ১০০+ মোড দেখো <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-4 sm:px-6 py-16 sm:py-20 bg-card/30 border-y border-border">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">কেন দেশি ভাই - AI? 🤔</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                শুধু AI চ্যাটবট না — তোমার নিজের ভাই! বাংলাদেশি ফ্লেভারে, তোমার ভাষায়।
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 via-card to-primary/5 border border-primary/20 rounded-2xl p-8 sm:p-12"
            >
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">তোমার ভাই তোমার জন্য অপেক্ষা করছে! 👋</h3>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                গুগল একাউন্ট দিয়ে লগিন করো, মোড সিলেক্ট করো, আর আড্ডা শুরু করো। 
                ফ্রি, সিম্পল, বাংলায়।
              </p>
              <Link
                to={user ? '/chat' : '/login'}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                এখনই শুরু করো <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-4 sm:px-6 py-16 sm:py-20 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">সচরাচর জিজ্ঞাসা (FAQ) ❓</h3>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} faq={faq} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-xs">ভ</div>
              <span className="font-semibold">দেশি ভাই - AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/team" className="hover:text-foreground transition-colors">টিম</Link>
              <a href="#features" className="hover:text-foreground transition-colors">ফিচারস</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 দেশি ভাই - AI • Made with ♥ by <a href="#" className="text-primary hover:underline">Ritto360</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
