export default interface GetOrdersRequest {
  status?: string;
  limit?: number;
  nextToken?: string | null;
}