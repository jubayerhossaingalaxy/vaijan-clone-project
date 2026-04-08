import { useState, useRef, useEffect, memo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface MoodTag {
  id: string;
  label: string;
  emoji: string;
}

export interface MoodCategory {
  name: string;
  emoji: string;
  tags: MoodTag[];
}

export const MOOD_CATEGORIES: MoodCategory[] = [
  {
    name: 'মূল মোড',
    emoji: '🏠',
    tags: [
      { id: 'bhai-radar', label: 'ভাই-রাদার', emoji: '🏠' },
      { id: 'gen-z', label: 'Gen-Z', emoji: '🔥' },
      { id: 'mon-halka', label: 'মন হালকা', emoji: '💦' },
      { id: 'poramorsho', label: 'পরামর্শ', emoji: '📍' },
      { id: 'thatta', label: 'ঠাট্টা', emoji: '😜' },
      { id: 'golpo', label: 'গল্প', emoji: '📚' },
      { id: 'deep-thinking', label: 'ডিপ থিংকিং', emoji: '🧠' },
      { id: 'romantic', label: 'রোমান্টিক', emoji: '💕' },
      { id: 'motivation', label: 'মোটিভেশন', emoji: '💪' },
    ],
  },
  {
    name: 'আবেগ ও অনুভূতি',
    emoji: '💖',
    tags: [
      { id: 'lonely', label: 'একাকীত্ব', emoji: '🥺' },
      { id: 'angry', label: 'রাগ', emoji: '😤' },
      { id: 'sad', label: 'দুঃখী', emoji: '😢' },
      { id: 'excited', label: 'উত্তেজিত', emoji: '🎉' },
      { id: 'confused', label: 'কনফিউজড', emoji: '😵' },
      { id: 'nostalgic', label: 'নস্টালজিক', emoji: '🕰️' },
    ],
  },
  {
    name: 'স্কিল ও শিক্ষা',
    emoji: '📖',
    tags: [
      { id: 'coding-help', label: 'কোডিং হেল্প', emoji: '💻' },
      { id: 'study', label: 'পড়াশোনা', emoji: '📖' },
      { id: 'exam-tips', label: 'পরীক্ষা টিপস', emoji: '📝' },
      { id: 'language', label: 'ভাষা শেখা', emoji: '🗣️' },
      { id: 'science', label: 'বিজ্ঞান', emoji: '🔬' },
      { id: 'history', label: 'ইতিহাস', emoji: '🏛️' },
      { id: 'math', label: 'গণিত', emoji: '🔢' },
      { id: 'english-grammar', label: 'ইংরেজি গ্রামার', emoji: '🇬🇧' },
      { id: 'essay-writing', label: 'রচনা লেখা', emoji: '✍️' },
      { id: 'gk-quiz', label: 'সাধারণ জ্ঞান', emoji: '🧠' },
    ],
  },
  {
    name: 'এন্টারটেইনমেন্ট',
    emoji: '🎬',
    tags: [
      { id: 'roast', label: 'রোস্ট', emoji: '🔥' },
      { id: 'shayari', label: 'শায়েরি', emoji: '🌹' },
      { id: 'memes', label: 'মিমস', emoji: '🤣' },
      { id: 'movie', label: 'মুভি-সিরিজ', emoji: '🎬' },
      { id: 'music', label: 'গান-মিউজিক', emoji: '🎵' },
      { id: 'gaming', label: 'গেমিং', emoji: '🎮' },
      { id: 'horror', label: 'ভৌতিক গল্প', emoji: '👻' },
      { id: 'storytelling', label: 'গল্প লেখা', emoji: '✍️' },
      { id: 'anime', label: 'অ্যানিমে', emoji: '🎌' },
      { id: 'standup', label: 'স্ট্যান্ড-আপ', emoji: '🎤' },
      { id: 'riddle', label: 'ধাঁধা', emoji: '🧩' },
      { id: 'drama', label: 'নাটক', emoji: '🎭' },
    ],
  },
  {
    name: 'ক্যারিয়ার ও ব্যবসা',
    emoji: '💼',
    tags: [
      { id: 'career', label: 'ক্যারিয়ার', emoji: '🎯' },
      { id: 'business', label: 'ব্যবসা', emoji: '💰' },
      { id: 'freelancing', label: 'ফ্রিল্যান্সিং', emoji: '💼' },
      { id: 'finance', label: 'টাকা-পয়সা', emoji: '🏦' },
      { id: 'interview-prep', label: 'ইন্টারভিউ', emoji: '🤝' },
      { id: 'resume', label: 'রেজিউমে', emoji: '📄' },
      { id: 'startup', label: 'স্টার্টআপ', emoji: '🚀' },
      { id: 'stock-market', label: 'শেয়ার বাজার', emoji: '📈' },
    ],
  },
  {
    name: 'লাইফস্টাইল',
    emoji: '🌿',
    tags: [
      { id: 'health', label: 'স্বাস্থ্য', emoji: '🏥' },
      { id: 'cooking', label: 'রান্না', emoji: '🍳' },
      { id: 'travel', label: 'ভ্রমণ', emoji: '✈️' },
      { id: 'fashion', label: 'ফ্যাশন', emoji: '👗' },
      { id: 'meditation', label: 'মেডিটেশন', emoji: '🧘' },
      { id: 'gardening', label: 'বাগান', emoji: '🌱' },
      { id: 'pet-care', label: 'পোষা প্রাণী', emoji: '🐱' },
      { id: 'diy', label: 'DIY হ্যাক্স', emoji: '🔧' },
      { id: 'parenting', label: 'প্যারেন্টিং', emoji: '👶' },
      { id: 'fitness', label: 'ফিটনেস', emoji: '🏋️' },
      { id: 'skincare', label: 'স্কিনকেয়ার', emoji: '✨' },
      { id: 'self-care', label: 'সেলফ-কেয়ার', emoji: '🧖' },
      { id: 'home-decor', label: 'হোম ডেকোর', emoji: '🏡' },
      { id: 'nutrition', label: 'নিউট্রিশন', emoji: '🥗' },
    ],
  },
  {
    name: 'সম্পর্ক ও সমাজ',
    emoji: '❤️',
    tags: [
      { id: 'relationship', label: 'সম্পর্ক', emoji: '💑' },
      { id: 'religion', label: 'ধর্মীয়', emoji: '🕌' },
      { id: 'politics', label: 'রাজনীতি', emoji: '🏛️' },
      { id: 'debate', label: 'তর্ক-বিতর্ক', emoji: '⚔️' },
      { id: 'psychology', label: 'মনোবিজ্ঞান', emoji: '🧩' },
      { id: 'social-skills', label: 'সোশ্যাল স্কিল', emoji: '🤝' },
      { id: 'marriage', label: 'বিয়ে-শাদী', emoji: '💍' },
      { id: 'feminism', label: 'নারী অধিকার', emoji: '♀️' },
    ],
  },
  {
    name: 'টেক ও AI',
    emoji: '🤖',
    tags: [
      { id: 'news', label: 'খবর', emoji: '📰' },
      { id: 'tech-review', label: 'টেক রিভিউ', emoji: '📱' },
      { id: 'ai-ml', label: 'AI/ML', emoji: '🤖' },
      { id: 'cybersecurity', label: 'সাইবার সিকিউরিটি', emoji: '🔒' },
      { id: 'web-dev', label: 'ওয়েব ডেভ', emoji: '🌐' },
      { id: 'app-dev', label: 'অ্যাপ ডেভ', emoji: '📲' },
    ],
  },
  {
    name: 'ক্রিয়েটিভ',
    emoji: '🎨',
    tags: [
      { id: 'photography', label: 'ফটোগ্রাফি', emoji: '📸' },
      { id: 'art', label: 'আর্ট-ড্রয়িং', emoji: '🎨' },
      { id: 'astrology', label: 'রাশিফল', emoji: '🌙' },
      { id: 'calligraphy', label: 'ক্যালিগ্রাফি', emoji: '🖋️' },
      { id: 'crafts', label: 'হস্তশিল্প', emoji: '🧶' },
      { id: 'video-editing', label: 'ভিডিও এডিটিং', emoji: '🎥' },
      { id: 'content-creation', label: 'কন্টেন্ট ক্রিয়েশন', emoji: '📢' },
      { id: 'graphic-design', label: 'গ্রাফিক ডিজাইন', emoji: '🖌️' },
    ],
  },
  {
    name: 'খেলাধুলা',
    emoji: '⚽',
    tags: [
      { id: 'sports', label: 'খেলাধুলা', emoji: '⚽' },
      { id: 'cricket', label: 'ক্রিকেট', emoji: '🏏' },
      { id: 'football', label: 'ফুটবল', emoji: '⚽' },
      { id: 'chess', label: 'দাবা', emoji: '♟️' },
      { id: 'esports', label: 'ই-স্পোর্টস', emoji: '🕹️' },
    ],
  },
  {
    name: 'প্র্যাকটিক্যাল হেল্প',
    emoji: '🛠️',
    tags: [
      { id: 'translator', label: 'অনুবাদক', emoji: '🌍' },
      { id: 'email-writer', label: 'ইমেইল লেখা', emoji: '📧' },
      { id: 'math-solver', label: 'অংক সমাধান', emoji: '🧮' },
      { id: 'summarizer', label: 'সারসংক্ষেপ', emoji: '📋' },
      { id: 'brainstorm', label: 'ব্রেইনস্টর্ম', emoji: '💡' },
      { id: 'planner', label: 'প্ল্যানার', emoji: '📅' },
    ],
  },
  {
    name: 'কালচার ও সাহিত্য',
    emoji: '📜',
    tags: [
      { id: 'bangla-sahitto', label: 'বাংলা সাহিত্য', emoji: '📜' },
      { id: 'islamic-qa', label: 'ইসলামিক Q&A', emoji: '☪️' },
      { id: 'bengali-culture', label: 'বাঙালি সংস্কৃতি', emoji: '🪷' },
      { id: 'world-culture', label: 'বিশ্ব সংস্কৃতি', emoji: '🌎' },
    ],
  },
  {
    name: 'পরিবেশ ও আইন',
    emoji: '🌍',
    tags: [
      { id: 'environmental', label: 'পরিবেশ', emoji: '🌍' },
      { id: 'volunteer', label: 'স্বেচ্ছাসেবী', emoji: '🤲' },
      { id: 'legal', label: 'আইন-কানুন', emoji: '⚖️' },
    ],
  },
];

// Flatten for export
export const MOOD_TAGS: MoodTag[] = MOOD_CATEGORIES.flatMap((c) => c.tags);

interface MoodTagsProps {
  activeTag: string;
  onSelect: (id: string) => void;
}

const TagButton = memo(({ tag, isActive, onClick }: { tag: MoodTag; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
      isActive
        ? 'bg-primary text-primary-foreground shadow-lg scale-105'
        : 'bg-secondary text-foreground hover:bg-secondary/80'
    }`}
  >
    <span>{tag.emoji}</span>
    <span>{tag.label}</span>
  </button>
));
TagButton.displayName = 'TagButton';

export default function MoodTags({ activeTag, onSelect }: MoodTagsProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenCategory(null);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Find active tag's category
  const activeCat = MOOD_CATEGORIES.find((c) => c.tags.some((t) => t.id === activeTag));
  const activeTagData = MOOD_TAGS.find((t) => t.id === activeTag);

  // Filter tags by search
  const filteredCategories = search.trim()
    ? MOOD_CATEGORIES.map((c) => ({
        ...c,
        tags: c.tags.filter((t) => t.label.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search.toLowerCase())),
      })).filter((c) => c.tags.length > 0)
    : MOOD_CATEGORIES;

  return (
    <div className="border-b border-border px-3 py-2" ref={dropdownRef}>
      {/* Active mood display + category buttons */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
        {/* Active tag indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-bold whitespace-nowrap shrink-0">
          <span>{activeTagData?.emoji}</span>
          <span>{activeTagData?.label}</span>
        </div>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Category buttons */}
        {MOOD_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => {
              setOpenCategory(openCategory === cat.name ? null : cat.name);
              setSearch('');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
              openCategory === cat.name
                ? 'bg-accent text-accent-foreground'
                : activeCat?.name === cat.name
                ? 'bg-secondary text-primary'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            }`}
          >
            <span>{cat.emoji}</span>
            <span className="hidden sm:inline">{cat.name}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${openCategory === cat.name ? 'rotate-180' : ''}`} />
          </button>
        ))}
      </div>

      {/* Expanded category dropdown */}
      {openCategory && (
        <div className="mt-2 bg-card border border-border rounded-xl p-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search */}
          <div className="flex items-center gap-2 mb-3 bg-secondary rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="মোড খুঁজো..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Tags */}
          {filteredCategories.map((cat) => (
            <div key={cat.name} className={search ? 'mb-3' : openCategory === cat.name ? '' : 'hidden'}>
              {search && (
                <p className="text-xs text-muted-foreground mb-1.5">
                  {cat.emoji} {cat.name}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {cat.tags.map((tag) => (
                  <TagButton
                    key={tag.id}
                    tag={tag}
                    isActive={activeTag === tag.id}
                    onClick={() => {
                      onSelect(tag.id);
                      setOpenCategory(null);
                      setSearch('');
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">কোনো মোড পাওয়া যায়নি 😕</p>
          )}
        </div>
      )}
    </div>
  );
}

export type { MoodTag as MoodTagType };
