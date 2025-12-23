import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { CharacterResult } from "@/app/types";
import { MotionContainer } from "@/components/motion-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VerdictStepProps {
  analysisResults: CharacterResult[];
  decision: string | null;
  onReset: () => void;
}

export function VerdictStep({ analysisResults, decision, onReset }: VerdictStepProps) {
  return (
    <MotionContainer key="verdict" className="space-y-8 pb-16">
      {analysisResults && analysisResults.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full mb-4">
            <h3 className="text-xl font-serif text-stone-700">Мнения специалистов</h3>
          </div>
          {analysisResults.map((result, idx) => {
            const names: Record<string, string> = {
              psychologist: "Психолог",
              cynic: "Циник",
              skeptic: "Скептик",
              lawyer: "Юрист",
              philosopher: "Философ",
            };
            return (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: Chat history is append-only and lacks unique IDs
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full p-6 bg-stone-50 border-stone-200">
                  <h4 className="font-bold mb-3 text-stone-900 border-b border-stone-200 pb-2">
                    {names[result.character] || result.character}
                  </h4>
                  <div className="prose prose-sm prose-stone">
                    <ReactMarkdown>{result.analysis}</ReactMarkdown>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {decision && (
        <Card className="border-4 border-stone-900 shadow-2xl">
          <div className="mb-6 flex items-center gap-4 border-b border-stone-100 pb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold font-serif">Официальное решение</h2>
          </div>
          <div className="prose prose-lg prose-stone max-w-none">
            <ReactMarkdown>{decision}</ReactMarkdown>
          </div>
        </Card>
      )}

      <div className="flex justify-center pt-8">
        <Button variant="secondary" onClick={onReset}>
          Начать новую сессию
        </Button>
      </div>
    </MotionContainer>
  );
}
