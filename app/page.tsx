"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	AlertCircle,
	CheckCircle,
	FileText,
	RefreshCcw,
	Send,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MotionContainer, MotionWrapper } from "@/components/motion-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	type AnalysisResponse,
	type CharacterResult,
	type DecisionResponse,
	FormResponse,
	type InterviewResponse,
	type Step,
} from "./types";

const CONSILIUM_MESSAGES = [
	"Психолог изучает дело...",
	"Юрист ищет прецеденты...",
	"Философ размышляет о бытии...",
	"Скептик сомневается в реальности...",
	"Циник пишет едкий комментарий...",
	"Министр подписывает приказ...",
];

export default function Home() {
	const [step, setStep] = useState<Step>("reception");
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [problem, setProblem] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Feature states
	const [generatedForm, setGeneratedForm] = useState<string | null>(null);
	const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
	const [answer, setAnswer] = useState("");
	const [history, setHistory] = useState<
		{ role: "assistant" | "user"; content: string }[]
	>([]);
	const [analysisStatusIndex, setAnalysisStatusIndex] = useState(0);
	const [analysisResults, setAnalysisResults] = useState<CharacterResult[]>([]);
	const [decision, setDecision] = useState<string | null>(null);

	// Auto-scroll to bottom of chat
	const chatEndRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [history, currentQuestion]);

	// Consilium animation effect
	useEffect(() => {
		if (step === "consilium") {
			const interval = setInterval(() => {
				setAnalysisStatusIndex(
					(prev) => (prev + 1) % CONSILIUM_MESSAGES.length,
				);
			}, 4000);
			return () => clearInterval(interval);
		}
	}, [step]);

	// Handlers
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

	const generateForm = async (sid: string) => {
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
	};

	const startInterview = async (sid: string) => {
		// Initial empty answer to get first question
		try {
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

	const startAnalysis = async (sid: string) => {
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
			// Realistically we might need to poll, but let's assume analyze returns when done or we wait a fixed time
			// The plan suggests "Wait screen 30-60s".
			// We will wait 5s for demo purposes then call decision (since we already got results)
			setTimeout(() => {
				getDecision(sid);
			}, 5000);
		} catch (err) {
			setError("Консилиум не смог собраться.");
		}
	};

	const getDecision = async (sid: string) => {
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
					<p className="text-lg text-stone-500">
						Бюрократия на страже вашего спокойствия
					</p>
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
						<MotionContainer key="reception" className="space-y-8">
							<Card>
								<label
									htmlFor="problem"
									className="block text-xl font-medium mb-4 text-stone-800"
								>
									Опишите вашу проблему
								</label>
								<Textarea
									id="problem"
									value={problem}
									onChange={(e) => setProblem(e.target.value)}
									placeholder="Например: Я не могу выбрать между пиццей и суши..."
									className="mb-8"
								/>
								<Button
									size="xl"
									className="w-full"
									onClick={startSession}
									disabled={isLoading || !problem.trim()}
								>
									{isLoading ? "Подача заявления..." : "Подать обращение"}
								</Button>
							</Card>
						</MotionContainer>
					)}

					{step === "bureaucracy" && (
						<MotionContainer key="bureaucracy" className="text-center py-20">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
								className="inline-block mb-8"
							>
								<RefreshCcw className="w-12 h-12 text-stone-400" />
							</motion.div>
							<h2 className="text-2xl font-medium mb-4">
								Генерация формы #404-B...
							</h2>
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
					)}

					{step === "interview" && (
						<MotionContainer key="interview" className="space-y-6">
							<div className="space-y-6 mb-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
								{history.map((msg, idx) => (
									<motion.div
										key={idx}
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
											<div
												className={`prose ${msg.role === "user" ? "prose-invert" : ""}`}
											>
												<ReactMarkdown>{msg.content}</ReactMarkdown>
											</div>
										</div>
									</motion.div>
								))}
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
									onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
									placeholder="Ваш ответ..."
									className="flex-1"
									autoFocus
								/>
								<Button
									onClick={submitAnswer}
									size="lg"
									className="aspect-square px-0 w-14"
								>
									<Send className="w-6 h-6" />
								</Button>
							</div>
						</MotionContainer>
					)}

					{step === "consilium" && (
						<MotionContainer key="consilium" className="text-center py-24">
							<div className="mb-12 relative h-2 bg-stone-200 rounded-full w-64 mx-auto overflow-hidden">
								<motion.div
									className="absolute top-0 left-0 h-full bg-stone-900"
									animate={{ width: ["0%", "100%"] }}
									transition={{ duration: 15, ease: "linear" }}
								/>
							</div>
							<AnimatePresence mode="wait">
								<motion.h2
									key={analysisStatusIndex}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="text-2xl md:text-3xl font-serif text-stone-800"
								>
									{CONSILIUM_MESSAGES[analysisStatusIndex]}
								</motion.h2>
							</AnimatePresence>
						</MotionContainer>
					)}

					{step === "verdict" && (
						<MotionContainer key="verdict" className="space-y-8 pb-16">
							{analysisResults && analysisResults.length > 0 && (
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									<div className="col-span-full mb-4">
										<h3 className="text-xl font-serif text-stone-700">
											Мнения специалистов
										</h3>
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
										<h2 className="text-2xl font-bold font-serif">
											Официальное решение
										</h2>
									</div>
									<div className="prose prose-lg prose-stone max-w-none">
										<ReactMarkdown>{decision}</ReactMarkdown>
									</div>
								</Card>
							)}

							<div className="flex justify-center pt-8">
								<Button variant="secondary" onClick={resetSession}>
									Начать новую сессию
								</Button>
							</div>
						</MotionContainer>
					)}
				</MotionWrapper>
			</div>
		</main>
	);
}
