import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { MotionContainer } from "@/components/motion-container";

interface BureaucracyStepProps {
  generatedForm: string | null;
}

export function BureaucracyStep({ generatedForm }: BureaucracyStepProps) {
  return (
    <MotionContainer key="bureaucracy" className="text-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-8"
      >
        <RefreshCcw className="w-12 h-12 text-stone-400" />
      </motion.div>
      <h2 className="text-2xl font-medium mb-4">Генерация формы #404-B...</h2>
      {generatedForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-stone-100 text-left opacity-75 max-h-60 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 pointer-events-none" />
          <div className="prose prose-sm font-mono text-stone-600">
            <ReactMarkdown>{generatedForm}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </MotionContainer>
  );
}
