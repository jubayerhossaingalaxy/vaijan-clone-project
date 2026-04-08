import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice input
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('তোমার ব্রাউজার ভয়েস ইনপুট সাপোর্ট করে না 😅');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="border-t border-border bg-card p-3 sm:p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto bg-secondary rounded-xl px-3 py-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="দেশি ভাই সব জানে, জিজ্ঞাসা করেই দেখনা..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-2 resize-none min-h-[40px] max-h-[150px]"
          disabled={disabled}
          rows={1}
        />

        {/* Voice button */}
        <button
          onClick={toggleVoice}
          disabled={disabled}
          className={`p-2 rounded-lg transition-colors shrink-0 ${
            isListening
              ? 'bg-destructive text-destructive-foreground animate-pulse'
              : 'text-muted-foreground hover:text-foreground hover:bg-background'
          }`}
          title={isListening ? 'বন্ধ করো' : 'ভয়েসে বলো'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
        >
          {disabled ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> ভাবছে...
            </>
          ) : (
            <>
              সেন্ড <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      <p className="text-center text-[10px] text-muted-foreground mt-1.5">Shift+Enter নতুন লাইন • Enter পাঠাও</p>
    </div>
  );
}
