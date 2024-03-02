export type Status = "idle" | "recording" | "transcribing" | "streaming";
export interface OpenAIMessage {
    content: string;
    role: string;
    name?: string;
    function_call?: {
      name: string;
      arguments: string;
    };
  }
export interface Session {
  id: string;
  title:string; 
  createAt:string; 
  placeholderImg: string;
}

export interface ClassRecord {
  id: string;
  title: string;
  createAt: string;
  placeholderImg: string;
  sessions: Session[];
}