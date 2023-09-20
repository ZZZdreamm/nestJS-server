import { Question } from './question';

export interface GameTemplate {
  id: string;
  templateName: string;
  questionTime: number;
  allQuestions: Question[];
}
