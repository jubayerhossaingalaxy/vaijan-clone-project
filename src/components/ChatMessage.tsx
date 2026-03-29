import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-4"
      >
        <div className="max-w-2xl bg-chat-user rounded-2xl rounded-br-sm px-5 py-3 text-foreground">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        <div className="ml-2 mt-1 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
          😊
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="max-w-3xl bg-chat-ai rounded-2xl rounded-bl-sm px-5 py-3">
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
