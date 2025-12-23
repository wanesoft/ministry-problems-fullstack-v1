"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileText } from "lucide-react";
import { BureaucracyStep } from "@/components/ministry/bureaucracy-step";
import { ConsiliumStep } from "@/components/ministry/consilium-step";
import { InterviewStep } from "@/components/ministry/interview-step";
import { ReceptionStep } from "@/components/ministry/reception-step";
import { VerdictStep } from "@/components/ministry/verdict-step";
import { MotionWrapper } from "@/components/motion-container";
import { useMinistrySession } from "@/hooks/use-ministry-session";

export default function Home() {
  const {
    step,
    problem,
    setProblem,
    isLoading,
    error,
    generatedForm,
    history,
    currentQuestion,
    answer,
    setAnswer,
    analysisStatusIndex,
    CONSILIUM_MESSAGES,
    analysisResults,
    decision,
    startSession,
    submitAnswer,
    resetSession,
  } = useMinistrySession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-stone-50 text-stone-900 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-stone-200">
            <FileText className="w-6 h-6 text-stone-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900 font-serif mb-2">
            Министерство Решения Проблем
          </h1>
          <p className="text-lg text-stone-500">Бюрократия на страже вашего спокойствия</p>
        </header>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <MotionWrapper>
          {step === "reception" && (
            <ReceptionStep
              problem={problem}
              setProblem={setProblem}
              onSubmit={startSession}
              isLoading={isLoading}
            />
          )}

          {step === "bureaucracy" && <BureaucracyStep generatedForm={generatedForm} />}

          {step === "interview" && (
            <InterviewStep
              history={history}
              currentQuestion={currentQuestion}
              answer={answer}
              setAnswer={setAnswer}
              onSubmit={submitAnswer}
            />
          )}

          {step === "consilium" && (
            <ConsiliumStep
              analysisStatusIndex={analysisStatusIndex}
              messages={CONSILIUM_MESSAGES}
            />
          )}

          {step === "verdict" && (
            <VerdictStep
              analysisResults={analysisResults}
              decision={decision}
              onReset={resetSession}
            />
          )}
        </MotionWrapper>
      </div>
    </main>
  );
}
