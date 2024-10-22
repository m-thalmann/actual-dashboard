export interface PaginationMeta {
  /**
   * The total number of items.
   */
  total: number;
  /**
   * The number of items per page.
   */
  perPage: number;
  /**
   * The current page.
   */
  currentPage: number;
  /**
   * The last page.
   */
  lastPage: number;
}
