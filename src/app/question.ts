export interface Question {
  question_id: string;
  category_id: number;
  question_content: string;
  correct_answer: string;
  incorrect1: string;
  incorrect2: string;
  incorrect3: string;
  question_picture_path: string;
}
