import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';

const teamMembers = [
  {
    name: 'মোঃ রাইসুল আলম রাতুল',
    role: 'Lead Graphic Designer',
    company: 'Ritto360',
  },
  {
    name: 'ফুয়াদ হাসান দ্বীপ্র',
    role: 'Lead Web Developer',
    company: 'Ritto360',
  },
];

export default function Team() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary">ভাইজান AI</Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/team" className="text-foreground">টিম - ভাইজান AI</Link>
            <a href="#" className="hover:text-foreground transition-colors">ফেসবুক গ্রুপ</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={user ? '/chat' : '/login'} className="flex items-center gap-2 px-5 py-2 border border-border rounded-full text-sm hover:bg-secondary transition-colors">
            আলাপ শুরু করুন <ArrowRight className="w-4 h-4" />
          </Link>
          <UserMenu />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">কোর টিম</h1>
        <div className="w-16 h-1 bg-destructive mx-auto mb-12 rounded-full" />

        <div className="grid md:grid-cols-2 gap-12">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-destructive/30 border-4 border-destructive flex items-center justify-center mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.role}</p>
              <a href="#" className="text-destructive text-sm hover:underline">{member.company}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
