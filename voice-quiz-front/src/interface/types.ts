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