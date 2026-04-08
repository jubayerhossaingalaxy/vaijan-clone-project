import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles, Zap, Shield, Globe, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import mascot from '@/assets/vaijan-mascot.png';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';

const features = [
  { icon: MessageSquare, title: '১০০+ মোড', desc: 'রোমান্টিক থেকে কোডিং — যেকোনো মুডে আড্ডা দাও' },
  { icon: Sparkles, title: 'AI পাওয়ারড', desc: 'সর্বাধুনিক AI দিয়ে তোমার প্রশ্নের উত্তর' },
  { icon: Zap, title: 'স্ট্রিমিং', desc: 'রিয়েল-টাইম স্ট্রিমিং — টাইপ করতে করতেই উত্তর পাও' },
  { icon: Shield, title: 'সিকিউর', desc: 'তোমার ডাটা সম্পূর্ণ নিরাপদ ও এনক্রিপ্টেড' },
  { icon: Globe, title: 'বাংলায় সব', desc: 'পুরোপুরি বাংলায় — তোমার নিজের ভাষায় AI' },
  { icon: Mic, title: 'ভয়েস ইনপুট', desc: 'বলো, লেখো, যেভাবে চাও সেভাবে ইনপুট দাও' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4 sm:gap-8">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">দেশি ভাই - AI</h1>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/team" className="hover:text-foreground transition-colors">টিম</Link>
            <a href="#features" className="hover:text-foreground transition-colors">ফিচারস</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/chat" className="flex items-center gap-2 px-4 sm:px-5 py-2 border border-border rounded-full text-sm hover:bg-secondary transition-colors">
                আলাপ শুরু <ArrowRight className="w-4 h-4" />
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-4 sm:px-5 py-2 border border-border rounded-full text-sm hover:bg-secondary transition-colors">
              আলাপ শুরু <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-8 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4">দেশি ভাই - AI</h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-4">এইটা AI না ভাই, এইটা আসলেই ভাই!</p>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
                ১০০+ মোডে বাংলায় আড্ডা দাও। কোডিং, পড়াশোনা, রোমান্স, ক্যারিয়ার — সব বিষয়ে তোমার নিজের ভাই আছে!
              </p>
              <Link
                to={user ? '/chat' : '/login'}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity"
              >
                আলাপ শুরু করুন <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 flex justify-center"
            >
              <div className="relative">
                <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/80 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <img src={mascot} alt="দেশি ভাই - AI মাসকট" className="relative z-10 w-56 sm:w-72 md:w-96" width={512} height={640} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-4 sm:px-6 py-12 sm:py-20 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">কেন দেশি ভাই - AI? 🤔</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                >
                  <f.icon className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold text-lg mb-2">{f.title}</h4>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-4 sm:px-6 py-12 sm:py-20 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">সচরাচর জিজ্ঞাসা (FAQ) ❓</h3>
            <div className="space-y-4">
              {[
                { q: 'দেশি ভাই - AI কি ফ্রি?', a: 'হ্যাঁ! গুগল একাউন্ট দিয়ে লগিন করেই শুরু করতে পারো। কোনো পেমেন্ট লাগবে না।' },
                { q: 'কোন কোন ভাষায় কথা বলতে পারে?', a: 'প্রধানত বাংলায়, তবে প্রয়োজনে ইংরেজি, হিন্দি মিশিয়ে কথা বলে।' },
                { q: '১০০+ মোড কি?', a: 'প্রতিটা মোড AI এর কথা বলার স্টাইল পরিবর্তন করে — যেমন রোমান্টিক, কোডিং, মোটিভেশন, রোস্ট ইত্যাদি।' },
                { q: 'আমার ডাটা কি নিরাপদ?', a: 'সম্পূর্ণ নিরাপদ! চ্যাট ডাটা সার্ভারে সেভ হয় না, শুধু তোমার ব্রাউজারে থাকে।' },
                { q: 'ভয়েস ইনপুট কি সব ব্রাউজারে কাজ করে?', a: 'Chrome ও Edge ব্রাউজারে সবচেয়ে ভালো কাজ করে। বাংলা ভয়েস রিকগনিশন সাপোর্ট করে।' },
              ].map((faq) => (
                <div key={faq.q} className="bg-card border border-border rounded-xl p-5">
                  <h4 className="font-semibold mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border">
        Designed and Developed with ♥ by <a href="#" className="underline hover:text-foreground">Ritto360</a>
      </footer>
    </div>
  );
}
