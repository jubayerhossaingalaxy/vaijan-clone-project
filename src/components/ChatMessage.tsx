import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  onRegenerate?: () => void;
  isLast?: boolean;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, onRegenerate, isLast, isStreaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-4 group"
      >
        <div className="max-w-2xl bg-chat-user rounded-2xl rounded-br-sm px-5 py-3 text-foreground">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        <div className="ml-2 mt-1 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm shrink-0">
          😊
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4 group"
    >
      <div className="max-w-3xl">
        <div className="bg-chat-ai rounded-2xl rounded-bl-sm px-5 py-3">
          <div className="prose prose-invert prose-sm max-w-none [&_pre]:bg-background [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_code]:text-primary [&_pre_code]:text-foreground [&_pre_code]:text-xs">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>

        {/* Action buttons - show on hover or for last message */}
        {!isStreaming && (
          <div className={`flex items-center gap-1 mt-1 ${isLast ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="কপি করো"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'কপি হয়েছে!' : 'কপি'}
            </button>

            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="আবার জেনারেট করো"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                পুনরায়
              </button>
            )}

            <div className="flex items-center gap-0.5 ml-2">
              <button
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`p-1 rounded transition-colors ${
                  feedback === 'up' ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
                title="ভালো উত্তর"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`p-1 rounded transition-colors ${
                  feedback === 'down' ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
                title="খারাপ উত্তর"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
