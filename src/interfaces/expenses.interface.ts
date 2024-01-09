export interface IExpenditureCategory {
  expenditureCategoryId?: string;
  expenditureCategoryName?: string;
  shopId?: string;
  createdAt?: string;
}
export interface IExpenditure {
  expenditureId?: string;
  expenditureName?: string;
  amount?: number;
  remark?: string;
  expenditureCategoryId?: string;
  ExpenditureCategory?: IExpenditureCategory;
  shopId?: string;
  createdAt?: string;
  userId?: string;
  type?: string;
}
export interface ICashInflow {
  cashInflowId?: string;
  income?: string;
  amount?: number;
  incomeSource?: string;
  remark?: string;
  shopId?: string;
  createdAt?: string;
  type?: string;
}
