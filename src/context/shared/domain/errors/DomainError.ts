export default class DomainError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class QueryError extends DomainError {}
export class CreateError extends DomainError {}
export class CommandError extends DomainError {}