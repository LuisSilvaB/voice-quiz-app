export type Status = "idle" | "recording" | "transcribing" | "streaming";
export type ModalActions = "edit" | "delete" | "create" | null; 
export interface toggleProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export interface OpenAIMessage {
  content: string;
  role: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
    };
  }
  export interface tableSessionsShape {
    
  }
  export interface Session {
  id: string;
  title:string; 
  createAt:string; 
  placeholderImg: string;
}

export interface CourseShape {
  id: string;
  title: string;
  createAt: string;
  placeholderImg: string;
  sessions: Session[];
}
export interface fragmentShape {
  id:string, 
  content: string;
  title?: string | undefined;
  questions?: question[];
}
export interface question {
  id:string; 
  questionTitle:string;
  alternatives: string[];
  answer:string;
  kindQuestion: kindQuestion;
}

export type kindQuestion = "multiple answers" | "alternatives" | "question and answer"