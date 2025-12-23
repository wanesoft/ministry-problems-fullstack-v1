"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { FadeCard } from "../../components/FadeCard";

export default function DemoPage() {
	const [showCard, setShowCard] = useState(false);

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4 transition-colors">
			<div className="relative flex max-w-lg flex-col items-center text-center">
				<div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
				<div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

				<h1 className="relative mb-6 text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
					Smooth{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
						Reveal
					</span>
				</h1>

				<p className="relative mb-10 max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
					Click the button below to see the component animate in. It handles
					both mounting and unmounting transitions gracefully.
				</p>

				<button
					type="button"
					onClick={() => setShowCard(true)}
					className="group relative z-10 overflow-hidden rounded-full bg-zinc-900 px-8 py-4 font-semibold text-white shadow-xl transition-all hover:scale-105 hover:bg-zinc-800 hover:shadow-2xl hover:shadow-zinc-900/20 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:shadow-white/10"
				>
					<span className="flex items-center gap-2">
						<span>Open Magic Card</span>
						<ArrowRight
							className="h-4 w-4 transition-transform group-hover:translate-x-1"
							aria-hidden="true"
						/>
					</span>
				</button>
			</div>

			<FadeCard
				isOpen={showCard}
				onClose={() => setShowCard(false)}
				title="Animation Success"
			>
				<p>
					You have successfully implemented a state-driven mount/unmount
					animation. The component waits for the exit transition to complete
					before removing itself from the DOM.
				</p>
			</FadeCard>
		</div>
	);
}
