export interface multipleAnswers {
    title: string; 
    questions: quetionsMultipleAnswers[]; 
  }  
export interface quetionsMultipleAnswers {
    questionTitle:string;
    alternatives:string[];
    answer:string;
  }
  