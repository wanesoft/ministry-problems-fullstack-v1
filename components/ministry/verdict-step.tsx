import { motion } from "framer-motion";
import { CheckCircle, FileText, User } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { CharacterResult } from "@/app/types";
import { MotionContainer } from "@/components/motion-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

interface VerdictStepProps {
  analysisResults: CharacterResult[];
  decision: string | null;
  onReset: () => void;
}

export function VerdictStep({ analysisResults, decision, onReset }: VerdictStepProps) {
  const [selectedAdvisor, setSelectedAdvisor] = useState<CharacterResult | null>(null);

  const names: Record<string, string> = {
    psychologist: "Психолог",
    cynic: "Циник",
    skeptic: "Скептик",
    lawyer: "Юрист",
    philosopher: "Философ",
  };

  return (
    <MotionContainer key="verdict" className="space-y-8 pb-16">
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

      {analysisResults && analysisResults.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full mb-4">
            <h3 className="text-xl font-serif text-stone-700">Мнения специалистов</h3>
            <p className="text-stone-500">
              Нажмите на карточку специалиста, чтобы прочитать его доклад
            </p>
          </div>
          {analysisResults.map((result, idx) => {
            return (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: Chat history is append-only and lacks unique IDs
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedAdvisor(result)}
              >
                <Card className="h-full p-6 bg-white border-2 border-stone-200 hover:border-stone-900 transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center gap-4 py-4">
                    <div className="p-4 rounded-full bg-stone-100 group-hover:bg-stone-900 transition-colors">
                      <User className="w-8 h-8 text-stone-600 group-hover:text-stone-50 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-stone-900">
                        {names[result.character] || result.character}
                      </h4>
                      <div className="flex items-center justify-center gap-2 mt-2 text-stone-500 text-sm group-hover:text-stone-900">
                        <FileText className="w-4 h-4" />
                        <span>Читать доклад</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!selectedAdvisor}
        onClose={() => setSelectedAdvisor(null)}
        title={selectedAdvisor ? names[selectedAdvisor.character] || selectedAdvisor.character : ""}
      >
        {selectedAdvisor && (
          <div className="prose prose-stone max-w-none">
            <ReactMarkdown>{selectedAdvisor.analysis}</ReactMarkdown>
          </div>
        )}
      </Modal>

      <div className="flex justify-center pt-8">
        <Button variant="secondary" onClick={onReset}>
          Начать новую сессию
        </Button>
      </div>
    </MotionContainer>
  );
}
