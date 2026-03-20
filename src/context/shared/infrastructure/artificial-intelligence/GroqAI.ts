import OpenAI from "openai";
import AI, { AIMessage, AIOptions } from "../../domain/artificial-intelligence/ai";
import { Injectable } from "../di";
import Environment from "../../../../services/artificial-intelligence/config/Environment";
import Logger from "../../domain/logger/Logger";

@Injectable()
export default class GroqAI extends AI {
  private client: OpenAI;

  constructor() {
    const apiKey = Environment.GROQ_API_KEY;
    const model = Environment.GROQ_MODEL;
    const apiUrl = Environment.GROQ_API_URL;

    super(apiKey, apiUrl, model);

    this.client = new OpenAI({
      apiKey,
      baseURL: this.apiUrl
    });
  }

  async chat(messages: AIMessage[], options?: AIOptions): Promise<string> {
    Logger.init('GroqAI chat');

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      response_format: { type: "json_object" },
      ...options
    });

    Logger.log('GroqAI chat finished');

    return response.choices[0].message.content ?? "";
  }
}