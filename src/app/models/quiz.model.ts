export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  questions?: Question[];
}
