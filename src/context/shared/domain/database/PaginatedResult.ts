export interface PaginatedResult<T> {
  items: T[];
  nextToken: string | null;
  total?: number;
}
