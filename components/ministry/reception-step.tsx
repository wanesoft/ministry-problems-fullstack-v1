import { MotionContainer } from "@/components/motion-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ReceptionStepProps {
	problem: string;
	setProblem: (value: string) => void;
	onSubmit: () => void;
	isLoading: boolean;
}

export function ReceptionStep({
	problem,
	setProblem,
	onSubmit,
	isLoading,
}: ReceptionStepProps) {
	return (
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
					onClick={onSubmit}
					disabled={isLoading || !problem.trim()}
				>
					{isLoading ? "Подача заявления..." : "Подать обращение"}
				</Button>
			</Card>
		</MotionContainer>
	);
}
