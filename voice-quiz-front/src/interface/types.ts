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
  questionTitle:string;
  alternatives: string[] | null;
  answer:string;
}

export type kindQuestion = "multiple_answer" | "open_answer" | "true_or_false"