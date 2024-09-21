export interface Account {
  id: string;
  name: string;
  amount: number;
}

export interface Transaction {
  id: string;
  date: string;
  payee: string;
  notes?: string;
  category: string | null;
  amount: number;
}

export interface ActualConfig {
  serverUrl: string;
  password: string;
  syncId: string;
  filePassword: string | undefined;
  dataDir: string;
  allowedAccounts: Array<string> | null;
}
