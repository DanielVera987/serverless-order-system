export type MessageRole = "system" | "user" | "assistant";

export interface AIMessage {
  role: MessageRole;
  content: string;
}

export interface AIOptions {
    temperature?: number;
  }

export default abstract class AI {
  protected readonly apiKey: string;
  protected readonly apiUrl: string;
  protected readonly model: string;

  constructor(apiKey: string, apiUrl: string, model: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.model = model;
  }

  abstract chat(messages: AIMessage[], options?: AIOptions): Promise<string>;
}