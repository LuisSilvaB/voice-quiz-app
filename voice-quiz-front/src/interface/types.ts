export type Status = "idle" | "recording" | "transcribing" | "streaming";
export type ModalActions = "edit" | "delete" | "create" | null; 
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

export interface ClassRecordShape {
  id: string;
  title: string;
  createAt: string;
  placeholderImg: string;
  sessions: Session[];
}