/** One page of a list, matching the API's `PagedResponse<T>`. */
export interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}
