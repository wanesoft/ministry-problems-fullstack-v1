export type Step = "reception" | "bureaucracy" | "interview" | "consilium" | "verdict";

export interface SessionResponse {
  session_id: string;
  message?: string;
}

export interface FormResponse {
  form: string; // Markdown content
}

export interface InterviewResponse {
  question: string;
  is_complete: boolean;
}

export interface CharacterResult {
  character: "psychologist" | "cynic" | "skeptic" | "lawyer" | "philosopher";
  analysis: string;
}

export interface AnalysisResponse {
  completed_characters: number;
  results: CharacterResult[];
}

export interface DecisionResponse {
  decision: string; // Markdown
}
