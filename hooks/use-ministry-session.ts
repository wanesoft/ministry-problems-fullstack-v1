import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnalysisResponse,
  CharacterResult,
  DecisionResponse,
  InterviewResponse,
  Step,
} from "@/app/types";

const CONSILIUM_MESSAGES = [
  "Психолог изучает дело...",
  "Юрист ищет прецеденты...",
  "Философ размышляет о бытии...",
  "Скептик сомневается в реальности...",
  "Циник пишет едкий комментарий...",
  "Министр подписывает приказ...",
];

export function useMinistrySession() {
  const [step, setStep] = useState<Step>("reception");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Feature states
  const [generatedForm, setGeneratedForm] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<{ role: "assistant" | "user"; content: string }[]>([]);
  const [analysisStatusIndex, setAnalysisStatusIndex] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<CharacterResult[]>([]);
  const [decision, setDecision] = useState<string | null>(null);

  // Consilium animation effect
  useEffect(() => {
    if (step === "consilium") {
      const interval = setInterval(() => {
        setAnalysisStatusIndex((prev) => (prev + 1) % CONSILIUM_MESSAGES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const generateForm = useCallback(async (sid: string) => {
    try {
      const res = await fetch("/api/session/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid }),
      });
      if (!res.ok) throw new Error("Failed to generate form");
      const data = await res.json();
      setGeneratedForm(data.form);

      // Show form for a few seconds then move to interview
      setTimeout(() => {
        setStep("interview");
        startInterview(sid);
      }, 5000);
    } catch (err) {
      setError("Ошибка бюрократии. Форма утеряна.");
    }
  }, []);

  const startInterview = useCallback(async (sid: string) => {
    try {
      // Initial empty answer to get first question
      const res = await fetch("/api/session/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, answer: "Начать" }),
      });
      if (!res.ok) throw new Error("Failed to start interview");
      const data: InterviewResponse = await res.json();
      setCurrentQuestion(data.question);
    } catch (err) {
      setError("Интервьюер отошел на перерыв.");
    }
  }, []);

  const getDecision = useCallback(async (sid: string) => {
    try {
      const res = await fetch("/api/session/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid }),
      });
      if (!res.ok) throw new Error("Failed to get decision");
      const data: DecisionResponse = await res.json();
      setDecision(data.decision);
      setStep("verdict");
    } catch (err) {
      setError("Решение утеряно в архивах.");
    }
  }, []);

  const startAnalysis = useCallback(
    async (sid: string) => {
      try {
        // Trigger analysis
        const res = await fetch("/api/session/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid }),
        });

        if (!res.ok) throw new Error("Analysis failed");
        const data: AnalysisResponse = await res.json();
        setAnalysisResults(data.results || []);

        // Wait for a minimum time for effect, then verify decision
        setTimeout(() => {
          getDecision(sid);
        }, 5000);
      } catch (err) {
        setError("Консилиум не смог собраться.");
      }
    },
    [getDecision],
  );

  const startSession = async () => {
    if (!problem.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      if (!res.ok) throw new Error("Failed to start session");
      const data = await res.json();
      setSessionId(data.session_id);
      setStep("bureaucracy");
      // Auto-trigger form generation
      generateForm(data.session_id);
    } catch (err) {
      setError("Министерство временно недоступно. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !sessionId) return;
    const currentAns = answer;
    setAnswer("");
    setHistory((prev) => [
      ...prev,
      { role: "assistant", content: currentQuestion || "" },
      { role: "user", content: currentAns },
    ]);
    setCurrentQuestion(null); // Show loading state in chat

    try {
      const res = await fetch("/api/session/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answer: currentAns }),
      });

      if (!res.ok) throw new Error("Failed to send answer");

      const data: InterviewResponse = await res.json();

      if (data.is_complete) {
        setStep("consilium");
        startAnalysis(sessionId);
      } else {
        setCurrentQuestion(data.question);
      }
    } catch (err) {
      setError("Связь прервалась.");
    }
  };

  const resetSession = () => {
    setStep("reception");
    setSessionId(null);
    setProblem("");
    setGeneratedForm(null);
    setHistory([]);
    setCurrentQuestion(null);
    setAnalysisResults([]);
    setDecision(null);
    setError(null);
  };

  return {
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
  };
}
