// the data structure this app will use

const data = [
  {
    id: 'Sample',
    name: 'Plan number 1',
    dateCreated: '10/31/2023',
    targetDate: '11/31/2023',
    initialBudget: '20000',
    totalDebt: '1000',
    debtToPay: '100',
    plannedDaily: [
      {
        key: 'datetime-today1',
        amount: '100',
        start: '11/01/2023',
        end: '11/10/2023',
      },
      {
        key: 'datetime-today2',
        amount: '100',
        start: '11/11/2023',
        end: '11/20/2023',
      },
    ],
    incoming: [
      {
        key: 'datetime-today1',
        amount: '1000',
        date: '11/01/2023',
      },
      {
        key: 'datetime-today2',
        amount: '2000',
        date: '11/11/2023',
      },
    ],

    spent: [
      {
        key: 'datetime-today1',
        date: '10/31/2023',
        amount: '100',
        description: 'bought a snack',
      },
      {
        key: 'datetime-today2',
        date: '10/31/2023',
        amount: '200',
        description: 'bought a snack 2',
      },
    ],

    received: [
      {
        key: 'datetime-today1',
        date: '10/31/2023',
        amount: '100',
        description: 'gift from a friend',
      },
      {
        key: 'datetime-today2',
        date: '10/31/2023',
        amount: '200',
        description: 'gift from a friend 2',
      },
    ],
    debtPlan: [
      {
        key: 'datetime-today1',
        date: '10/31/2023',
        amount: '100',
        description: 'gift from a friend',
      },
    ],
    debtLog: [
      {
        key: 'datetime-today1',
        date: '10/31/2023',
        amount: '100',
        description: 'gift from a friend',
      },
    ],
  },
  {
    id: 'Sample2',
    name: 'Plan number 2',
    dateCreated: '10/31/2023',
    targetDate: '11/31/2023',
    initialBudget: '30000',
    plannedDaily: [
      {
        key: 'datetime-today1',
        amount: '100',
        start: '11/01/2023',
        end: '11/10/2023',
      },
      {
        key: 'datetime-today2',
        amount: '100',
        start: '11/11/2023',
        end: '11/20/2023',
      },
    ],
    incoming: [
      {
        key: 'datetime-today1',
        amount: '1000',
        date: '11/01/2023',
      },
      {
        key: 'datetime-today2',
        amount: '2000',
        date: '11/11/2023',
      },
    ],

    spent: [
      {
        key: 'datetime-today1',
        date: '10/31/2023 spent data record',
        amount: '100',
        description: 'bought a snack',
      },
      {
        key: 'datetime-today2',
        date: '10/31/2023 spent data record',
        amount: '200',
        description: 'bought a snack 2',
      },
    ],

    received: [
      {
        key: 'datetime-today1',
        date: '10/31/2023 received data record',
        amount: '100',
        description: 'gift from a friend',
      },
      {
        key: 'datetime-today2',
        date: '10/31/2023 received data record',
        amount: '200',
        description: 'gift from a friend 2',
      },
    ],
  },
];
