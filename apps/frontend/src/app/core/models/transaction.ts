export interface Transaction {
  /**
   * Unique identifier
   */
  id: string;
  /**
   * Transaction date
   */
  date: string;
  /**
   * Transaction amount in cents
   */
  amount: number;
  /**
   * Transaction description
   */
  notes: string | null;
  /**
   * Transaction payee
   */
  payee: string;
  /**
   * Transaction category
   */
  category: string | null;
}
