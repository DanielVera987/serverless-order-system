export default interface IngredientsRepository {
  getAll(): Promise<string[]>;
}