import { ICustomer, ICustomerTransactions } from "../interfaces/inventory.interface";

export const getCustomerAmount = (
  id: string,
  transactionType: string,
  customerList: ICustomer[] | ICustomer
) => {
  let tempCustomer: ICustomer | undefined;

  if (Array.isArray(customerList)) {
    tempCustomer = customerList.find((entry) => entry.customerId === id);
  } else {
    tempCustomer = customerList;
  }

  if (!tempCustomer) {
    return null;
  }

  const { CustomerTransactions } = tempCustomer;

  return CustomerTransactions.reduce((total, transaction) => {
    const isCredit = transaction.isCredit;
    const amount = Math.abs(transaction.amount || 0); // Handle undefined amount

    if (
      (transactionType === "credit" && isCredit) ||
      (transactionType === "deposit" && !isCredit)
    ) {
      return total + amount;
    } else {
      return total;
    }
  }, 0);
};

export const customerDeposits = (
  prntCustTrxnId: string,
  transactions: [ICustomerTransactions] | undefined
) => {
  let deposits;
  let totalDeposits = 0;
  if (prntCustTrxnId) {
    deposits = transactions?.filter(
      (trxn) => !trxn?.isCredit && trxn?.parentCustomerTransactionId === prntCustTrxnId
    );
    totalDeposits =
      deposits?.reduce((accumulator, currentItem) => {
        return accumulator + (currentItem?.amount || 0);
      }, 0) || 0;
    return { deposits, total: totalDeposits };
  }
  return { deposits: [], total: totalDeposits };
};

export const getSingleCustomerAmount = (customer?: ICustomer, transactionType?: string) => {
  return customer?.CustomerTransactions?.reduce((total, transaction) => {
    const isCredit = transactionType === "credit" && transaction.isCredit;
    const isDeposit = transactionType === "deposit" && !transaction.isCredit;

    return isCredit || isDeposit ? total + Math.abs(transaction.amount!) : total;
  }, 0);
};
