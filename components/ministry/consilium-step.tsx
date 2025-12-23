import { AnimatePresence, motion } from "framer-motion";
import { MotionContainer } from "@/components/motion-container";

interface ConsiliumStepProps {
	analysisStatusIndex: number;
	messages: string[];
}

export function ConsiliumStep({
	analysisStatusIndex,
	messages,
}: ConsiliumStepProps) {
	return (
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
					{messages[analysisStatusIndex]}
				</motion.h2>
			</AnimatePresence>
		</MotionContainer>
	);
}
