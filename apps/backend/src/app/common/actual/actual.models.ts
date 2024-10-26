export interface Account {
  id: string;
  name: string;
  amount: number;
}

export interface Transaction {
  id: string;
  date: string;
  payee: string;
  notes: string | null;
  category: string | null;
  amount: number;
}
