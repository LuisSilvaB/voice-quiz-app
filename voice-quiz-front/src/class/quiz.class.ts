import { Question } from "./questions.class";

export interface Quiz {
  ID: string;
  title: string;
  description: string;
  USER_ID: string;
  SESSION_ID: string;
  COURSE_ID: string;
  initial_time: string;
  final_time: string;
  is_active: boolean;
  questions?: Question[];
}

export interface QuizQuestion {
  ID: string;
  QUESTION_ID: string;
  QUIZ_ID: string;
}

export type QuizType = "local" | "global";