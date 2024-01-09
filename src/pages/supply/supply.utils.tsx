import { useMutation } from "@apollo/client";
import { CREATE_SUPPLIER, CREATE_SUPPLY_RECORD } from "../../schema/supplier.schema";
import {
  SupplierAttr,
  SupplyItemAttr,
  SupplyRecordAttr,
} from "../../interfaces/supplies.interface";

interface SupplierVariables {
  firstName: string;
  lastName: string;
  shopId: string;
  mobileNumber: string;
  address: string;
  email: string;
}

interface SupplierRecordVariables {
  supplierId: string;
  comment: string;
  shopId: string;
  paymentStatus: "UNPAID" | "PAID" | "PARTLY_PAID";
  totalAmount: number;
  amountPaid: number;
  isCollected: boolean;
  SupplyItems: SupplyItemAttr[];
}

type CreateSupplierMutation = (
  variables: SupplierVariables
) => Promise<SupplierAttr | null | undefined>;

type CreateSupplierRecordsMutation = (
  variables: SupplierRecordVariables
) => Promise<SupplyRecordAttr | null | undefined>;

export const useCreateSupplier = (): {
  createNewSupplier: CreateSupplierMutation;
  supplierLoading: boolean;
  supplierError: any;
  supplierData: SupplierAttr | null | undefined;
} => {
  const [createSupplier, { loading: supplierLoading, error: supplierError, data: supplierData }] =
    useMutation<SupplierAttr, SupplierVariables>(CREATE_SUPPLIER);

  const createNewSupplier: CreateSupplierMutation = async (variables) => {
    try {
      const response = await createSupplier({
        variables,
      });
      return response?.data ?? {};
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  return { createNewSupplier, supplierLoading, supplierError, supplierData };
};

export const useCreateSupplierRecord = (): {
  createNewSupplierRecord: CreateSupplierRecordsMutation;
  supplierRecordLoading: boolean;
  supplierRecordError: any;
  supplierRecordData: SupplyRecordAttr | null | undefined;
} => {
  const [
    createSupplierRecord,
    { loading: supplierRecordLoading, error: supplierRecordError, data: supplierRecordData },
  ] = useMutation<SupplyRecordAttr, SupplierRecordVariables>(CREATE_SUPPLY_RECORD);

  const createNewSupplierRecord: CreateSupplierRecordsMutation = async (variables) => {
    try {
      const response = await createSupplierRecord({
        variables,
      });
      return response?.data ?? {};
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  return {
    createNewSupplierRecord,
    supplierRecordLoading,
    supplierRecordError,
    supplierRecordData,
  };
};

export const numberToWord: any = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
  30: "thirty",
  40: "forty",
  50: "fifty",
  60: "sixty",
  70: "seventy",
  80: "eighty",
  90: "ninety",
  100: "one hundred",
};
