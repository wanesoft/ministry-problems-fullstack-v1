import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { MotionContainer } from "@/components/motion-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InterviewStepProps {
  history: { role: "assistant" | "user"; content: string }[];
  currentQuestion: string | null;
  answer: string;
  setAnswer: (value: string) => void;
  onSubmit: () => void;
}

export function InterviewStep({
  history,
  currentQuestion,
  answer,
  setAnswer,
  onSubmit,
}: InterviewStepProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Auto-scroll should trigger on history change, but we don't need to depend on the ref
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, currentQuestion]);

  return (
    <MotionContainer key="interview" className="space-y-6">
      <div className="space-y-6 mb-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((msg, idx) => {
          return (
            <motion.div
              key={
                // biome-ignore lint/suspicious/noArrayIndexKey: Chat history is append-only and lacks unique IDs
                idx
              }
              initial={{
                opacity: 0,
                x: msg.role === "assistant" ? -20 : 20,
              }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-stone-900 text-stone-50 rounded-tr-sm"
                    : "bg-white border border-stone-200 text-stone-800 rounded-tl-sm shadow-sm"
                }`}
              >
                <div className={`prose ${msg.role === "user" ? "prose-invert" : ""}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          );
        })}
        {currentQuestion && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] p-6 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 rounded-tl-sm shadow-md">
              <div className="prose text-lg font-medium">
                <ReactMarkdown>{currentQuestion}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-4 items-end bg-stone-50 p-2 sticky bottom-0 z-10">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Ваш ответ..."
          className="flex-1"
          autoFocus
        />
        <Button onClick={onSubmit} size="lg" className="aspect-square px-0 w-14">
          <Send className="w-6 h-6" />
        </Button>
      </div>
    </MotionContainer>
  );
}
