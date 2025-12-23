"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import type React from "react";

interface FadeCardProps {
	isOpen: boolean;
	onClose?: () => void;
	title?: string;
	children?: React.ReactNode;
}

export function FadeCard({
	isOpen,
	onClose,
	title = "Magic Refresh",
	children,
}: FadeCardProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					onClick={onClose}
					aria-hidden={!isOpen}
				>
					<motion.div
						onClick={(e) => e.stopPropagation()}
						className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/90 dark:bg-zinc-900/90 p-8 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-xl"
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{
							duration: 0.4,
							ease: [0.32, 0.72, 0, 1],
						}}
					>
						<button
							type="button"
							onClick={onClose}
							className="absolute top-5 right-5 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
							aria-label="Close"
						>
							<X className="h-5 w-5" aria-hidden="true" />
						</button>

						<div className="flex flex-col items-center text-center">
							<div className="mb-6 rounded-full bg-blue-50 p-4 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
								<Sparkles className="h-8 w-8" aria-hidden="true" />
							</div>

							<h2 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
								{title}
							</h2>

							<div className="mb-8 text-zinc-500 dark:text-zinc-400">
								{children || (
									<p>
										Experience the smooth flow of this modal. It uses Framer
										Motion to handle entry and exit animations effortlessly.
									</p>
								)}
							</div>

							<div className="flex w-full gap-3">
								<button
									type="button"
									onClick={onClose}
									className="flex-1 rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-transform active:scale-95 dark:bg-white dark:text-black dark:shadow-white/20"
								>
									Got it
								</button>
								<button
									type="button"
									onClick={onClose}
									className="flex-1 rounded-xl bg-zinc-100 px-4 py-3.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
								>
									Close
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
