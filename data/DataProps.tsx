// the data structure this app will use

export interface DataProps {
  key: string;
  name?: string;
  description?: string;
  dateCreated?: string;
  targetDate?: any;
  initialBudget?: string;
  currentDebt?: string; // auto calculated
  totalDebtsToPay?: string; // auto calculated from bills and debts to pay,
  currentBudget?: string; // auto calculated
  futureBudget?: string; //auto calculated with the incoming
  dailyBudgetLeft?: string; //auto calculated
  debtInfo?: {
    key: string;
    description: string;
    amount: string;
    dateOccured: string;
    dueDate: string;
    log: {
      key: string;
      amountPaid: string;
      datePaid: string;
    };
  }[];
  billsInfo?: {
    key: string;
    description: string;
    amount: string;
    dateOccured: string;
    dueDate: string;
    log: {
      key: string;
      amountPaid: string;
      datePaid: string;
    };
  }[];
  plannedDaily?: [
    {
      key: string;
      description: string;
      amount: string;
      start: string;
      end: string;
    }[]
  ];
  incoming?: [
    {
      key: string;
      description: string;
      amount: string;
      date: string;
      log: {
        key: string;
        amountReceived: Boolean;
        dateReceived: string;
      };
    }[]
  ];

  spent?: [
    {
      key: string;
      date: string;
      amount: string;
      description: string;
    }[]
  ];

  received?: [
    {
      key: string;
      date: string;
      amount: string;
      description: string;
    }[]
  ];
}
