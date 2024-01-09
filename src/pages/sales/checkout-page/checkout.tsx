/* eslint-disable indent */
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { CancelButton, Label, TextArea } from "../style";
import { CartList, Container, Left, Right, RightContent, Totals } from "./style";
import cancelIcon from "../../../assets/cancel.svg";
import toggleOff from "../../../assets/toggleOff.svg";
import toggleOn from "../../../assets/toggleOn.svg";
import { ToggleButton } from "../../staffs/style";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import dropIcon from "../../../assets/dropIcon2.svg";
import { Button } from "../../../components/button/Button";
import { ICustomer, IInventory } from "../../../interfaces/inventory.interface";
import { ISalesReceipt } from "../../../interfaces/sales.interface";
import { CREATE_SALES } from "../../../schema/sales.schema";
import { useMutation, useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { increaseSyncCount } from "../../../app/slices/shops";
import { isLoading } from "../../../app/slices/status";
import { ModalContainer } from "../../settings/style";
import NewCustomer from "../../customers/new-customer";
import Chev from "../../../assets/chevRightRed.svg";
import BackdateIcon from "../../../assets/backdate.svg";
import { GET_ALL_CUSTOMERS } from "../../../schema/customer.schema";
import { GET_ALL_USER } from "../../../schema/auth.schema";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { formatAmountIntl } from "../../../helper/format";
import { IShop } from "../../../interfaces/shop.interface";
import { GET_SHOP } from "../../../schema/shops.schema";
import { CountryAttr } from "../../settings/sub-page/business";
import { UsersAttr } from "../../../interfaces/user.interface";
import { hasPermission, syncTotalTableCount } from "../../../helper/comparisons";
import { getDefaultPrinter, printReceipt } from "../../../helper/printing";
import { rpcClient } from "../../../helper/rpcClient";
import { ITax } from "../../../interfaces/tax.interface";
import { GET_ALL_TAXES } from "../../../schema/tax.schema";
import { Colors } from "../../../GlobalStyles/theme";
import { getUserPermissions } from "../../../app/slices/roles";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { getCurrentUser } from "../../../app/slices/userInfo";
import SelectCustomer from "./selectCustomer";
import Credit from "./credit";
import Change from "../../../assets/change.svg";
import { setHours } from "../../../helper/date";
import { IFilteredDate } from "../sales";
import moment from "moment";
import AddTax from "./tax";
import Add from "../../../assets/circular_add.svg";
import Cancel from "../../../assets/cancel-red.svg";
import BackDate from "./backdate";
import MultiplePayment from "./multiplePayment";

type Cart = IInventory & {
  stock: number;
  price: number;
  image: string;
  count: number;
  discount: number;
  sellInPieces?: boolean;
  showDropdown: boolean;
  sellInVariant?: string;
};

interface TabStruct {
  [key: string]: {
    name: string;
    items: Cart[];
    id: number;
  };
}

interface CheckoutProps {
  handleClose: React.Dispatch<React.SetStateAction<boolean>>;
  cart: Cart[];
  refetchInventory: () => void;
  clearCart: Function;
  currentTab: string;
  handleCloseTab: (index: string, tabs: TabStruct) => void;
}

export interface IPaymentMethod {
  paymentMethod: string;
  amount: any;
}

const Checkout: FunctionComponent<CheckoutProps> = ({
  handleClose,
  cart,
  refetchInventory,
  currentTab,
  handleCloseTab,
}) => {
  const today = new Date();
  const todayStart = new Date(today);
  const todayEnd = new Date(today);
  const initialDateRange = setHours(todayStart, todayEnd);

  const defaultDueDate = new Date(today);
  defaultDueDate.setDate(today.getDate() + 7);

  const paymentMethodOption = ["Cash", "Pos", "Transfer", "Multiple Payment"];

  const [filteredDate] = useState<IFilteredDate>(initialDateRange);
  const [dateRange, setDateRange] = useState<IFilteredDate>(filteredDate as IFilteredDate);
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [enableSurplus, setEnableSurplus] = useState(false);
  const [showMultiplePayment, setShowMultiplePayment] = useState(false);
  // const [sellOnCredit, setSellOnCredit] = useState(false);
  const [paymentIdx, setPaymentIdx] = useState(0);
  const [creditPaymentIdx, setCreditPaymentIdx] = useState(-1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [addComment, setAddComment] = useState(false);
  const [cashierSelected, setCashierSelected] = useState(-1);
  const [customerOption, setCustomerOption] = useState<ICustomer[]>([]);
  // const [taxSelected, setTaxSelected] = useState(-1);
  const [taxOption, setTaxOption] = useState<string[]>([]);
  const [taxList, setTaxList] = useState<ITax[]>([]);
  const [customerSelected, setCustomerSelected] = useState<ICustomer | undefined>();
  const [depositAmount, setDepositAmount] = useState("0");
  const [comment, setComment] = useState("");
  const [saleDiscount, setSaleDiscount] = useState<number>(0);
  const [showDropdown, setShowDropDown] = useState(false);
  const [showAddTax, setShowAddTax] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState<undefined | string>("");
  const [autoPrinterCheck, setAutoPrinterCheck] = useState<boolean>(true);
  const [showPrinterWarning, setShowPrinterWarning] = useState<boolean>(false);
  const userPermissions = useAppSelector(getUserPermissions);
  const shouldSellOnCredit = hasPermission("MANAGE_SELL_ON_CREDIT", userPermissions);
  const shouldSellWithDiscount = hasPermission("MANAGE_DISCOUNT", userPermissions);
  const { shouldMakeSalesWithoutCashier } = useAppSelector((state) => state.shopPreference);
  const [selectedTax, setSelectedTax] = useState<ITax>();
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showNewCredit, setShowNewCredit] = useState(false);
  const [showSelectCustomer, setShowSelectCustomer] = useState(false);
  const [showCustomerField, setShowCustomerField] = useState(false);
  const [showBackdate, setShowBackdate] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(defaultDueDate);
  const [page, setPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [backDate, setBackDate] = useState<Date>();
  const [paymentsArr, setPaymentsArr] = useState<IPaymentMethod[]>([]);

  const {
    sales: { tabs: reduxTabs },
    shops: { currentShop },
  } = useAppSelector((state) => state);
  const currentUser = useAppSelector(getCurrentUser);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [enableDiscount, enableSurplus]);

  const handlePaymentMethod = (val: number) => {
    setPaymentMethod(paymentMethodOption[val]);
    setPaymentIdx(val);
    val === 3 && setShowMultiplePayment(true);
  };

  const handleCreditPaymentMethod = (val: number) => {
    setPaymentMethod(paymentMethodOption[val]);
    setCreditPaymentIdx(val);

    handlePaymentMethod(val);
  };

  const [makeSales] = useMutation<{ makeSale: ISalesReceipt }>(CREATE_SALES, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const shopData = useQuery<{
    getShop: {
      countries: CountryAttr[];
      result: IShop;
    };
  }>(GET_SHOP, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const getTotalCartPrice = () => {
    return cart.reduce((prev, curr) => {
      return prev + curr.count * curr.price;
    }, 0);
  };

  const handleDiscount = (discount: number) => {
    if (enableDiscount) {
      if (
        discount <=
        (Number(shopData?.data?.getShop?.result?.maximumDiscount) / 100) * getTotalCartPrice()
      ) {
        setSaleDiscount(discount);
      } else {
        dispatch(
          toggleSnackbarOpen(
            `The discount is greater than the maximum discount ${
              shopData?.data?.getShop?.result?.currencyCode
            } ${
              (Number(shopData?.data?.getShop?.result?.maximumDiscount) / 100) * getTotalCartPrice()
            }`
          )
        );
      }
    } else {
      setSaleDiscount(discount);
    }
  };

  const { data: allUserData } = useQuery<{
    getAllUsers: UsersAttr[];
  }>(GET_ALL_USER, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const cashiers = allUserData?.getAllUsers;
  const cashierOption: string[] =
    (allUserData?.getAllUsers?.map((users) => users.fullName) as string[]) || [];

  useEffect(() => {
    let selectCashierIndex: number = 0;
    cashierOption.forEach((cashier, index) => {
      if (cashier === currentUser.fullName) {
        selectCashierIndex = index;
      }
    });

    setCashierSelected(selectCashierIndex);
  }, [currentUser]);

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["CustomerTransaction", "Customer"])
  );

  const { data: taxesData } = useQuery<{ getAllTaxes: [ITax] }>(GET_ALL_TAXES, {
    fetchPolicy: "network-only",
    variables: {
      shopId: currentShop?.shopId,
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const { data, refetch } = useQuery<{
    getAllCustomers: {
      customers: [ICustomer];
      totalCustomers: number;
    };
  }>(GET_ALL_CUSTOMERS, {
    variables: {
      shopId: currentShop?.shopId,
      limit: 10,
      searchString,
      page,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  useEffect(() => {
    if (data) {
      const nameList: ICustomer[] = [];
      data.getAllCustomers.customers.forEach((customer) => {
        nameList.push(customer);
      });
      setCustomerOption(nameList);
      setTotalCustomers(data.getAllCustomers.totalCustomers);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [syncTableUpdateCount]);

  const getDiscountAmount = () => {
    return cart.reduce((prev, curr) => {
      return prev + curr.discount;
    }, 0);
  };

  const generateTotalTax = (salesAmount: number) => {
    const isInclusive = selectedTax?.isInclusive as boolean;
    const totalGeneratedTax = isInclusive
      ? salesAmount - salesAmount / (1 + (selectedTax?.value as number) / 100)
      : ((selectedTax?.value ?? 0) / 100) * salesAmount;
    return selectedTax?.value ? parseFloat(totalGeneratedTax.toFixed(2)) : 0;
  };

  const generateSalesItem = () => {
    const salesItem: any[] = [];
    cart.forEach((item) => {
      salesItem.push({
        paymentMethod,
        inventoryId: item.inventoryId,
        inventoryName: item.inventoryName,
        inventoryType: item.sellInPieces ? "PIECES" : "PACK",
        quantity: Number(item.count),
        discount: item.discount,
        variationId: item.sellInVariant,
        amountLeft: (item.price - item.discount) * item.count,
        amount: item.price,
        pack: !item?.sellInPieces,
        taxAmount: generateTotalTax(item.price),
        isTaxInclusive: selectedTax?.isInclusive,
        taxId: selectedTax?.taxId,
        taxName: selectedTax?.name,
      });
    });
    return salesItem;
  };

  const handlePrintReceipt = async (sales: any, userShop: any) => {
    printReceipt(sales, userShop);
  };

  const getTotal = () => {
    return (
      getTotalCartPrice() -
      (enableDiscount
        ? saleDiscount + Number(getDiscountAmount())
        : enableSurplus
        ? -(saleDiscount + Number(getDiscountAmount()))
        : Number(getDiscountAmount())) +
      (selectedTax?.isInclusive
        ? 0
        : generateTotalTax(getTotalCartPrice() - Number(getDiscountAmount())))
    );
  };

  const getMultiplePaymentMethod = () => {
    const method = paymentMethodOption[paymentIdx];
    const isMultiple = method === "Multiple Payment";
    const singlePaymentMethod: IPaymentMethod[] = [{ paymentMethod: method, amount: getTotal() }];

    return isMultiple ? paymentsArr : singlePaymentMethod;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!shouldMakeSalesWithoutCashier && cashierSelected < 0) {
      dispatch(toggleSnackbarOpen("Please Select a cashier before checkout."));
      return;
    }

    // if (!customerSelected) {
    //   dispatch(toggleSnackbarOpen("Please Select a customer to make sales on credit"));
    //   return;
    // }

    if (customerSelected?.customerName && Number(depositAmount) > getTotalCartPrice()) {
      dispatch(toggleSnackbarOpen("Credit amount can not be more than total available Amount"));
      return;
    }

    const saleItemsDiscount = enableDiscount
      ? saleDiscount + Number(getDiscountAmount())
      : enableSurplus
      ? saleDiscount + Number(getDiscountAmount())
      : Number(getDiscountAmount());

    if (saleItemsDiscount < 1) {
      if (enableDiscount) {
        dispatch(toggleSnackbarOpen("Enter discount amount or toggle it off"));

        return;
      }
      if (enableSurplus) {
        dispatch(toggleSnackbarOpen("Enter surplus amount or toggle it off"));

        return;
      }
    }

    dispatch(isLoading(true));

    const totalSaleAmount =
      getTotalCartPrice() -
      (enableSurplus ? -saleItemsDiscount : saleItemsDiscount) +
      (selectedTax?.isInclusive
        ? 0
        : generateTotalTax(getTotalCartPrice() - Number(getDiscountAmount())));

    makeSales({
      variables: {
        shopId: currentShop?.shopId,
        customerName: customerSelected?.customerName,
        onCredit: !!customerSelected?.customerName,
        discount: enableSurplus ? -saleItemsDiscount : saleItemsDiscount,
        comment,
        paymentMethod: paymentMethod || "Cash",
        dueDate,
        createdAt: backDate,
        totalAmount: totalSaleAmount,
        salesItems: generateSalesItem(),
        amountPaid: totalSaleAmount,
        creditAmount: customerSelected?.customerName
          ? Number(depositAmount) > 0 || totalSaleAmount !== Number(depositAmount)
            ? totalSaleAmount - Number(depositAmount)
            : totalSaleAmount
          : 0,
        cashierId: cashiers?.[cashierSelected]?.userId,
        customerId: customerSelected?.customerId,
        isTaxInclusive: selectedTax?.isInclusive,
        taxId: selectedTax?.taxId,
        taxName: selectedTax?.name,
        multiplePaymentMethod: getMultiplePaymentMethod(),
        totalTaxAmount: Number(generateTotalTax(getTotalCartPrice() - Number(getDiscountAmount()))),
      },
    })
      .then(async (res) => {
        if (!res.data) {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen("Error Occurred. Please check sales before trying again"));
          return;
        }
        autoPrinterCheck && handlePrintReceipt(res.data.makeSale as any, currentShop);
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen("Products sold Successfully!"));
        setCustomerSelected(undefined);
        handleClose(false);
        handleCloseTab(currentTab, reduxTabs);
        refetchInventory();
        dispatch(increaseSyncCount(["Sales"]));
        setSearchTerm("");
      })
      .catch((e) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(e));
      });
  };

  const reloadCustomers = () => {
    refetch();
  };

  useEffect(() => {
    if (taxesData) {
      const fTaxOption: string[] = [];
      taxesData.getAllTaxes.forEach((tax) => {
        fTaxOption.push(`${tax.name}`);
      });
      setTaxList(taxesData.getAllTaxes);
      setTaxOption(fTaxOption);
    }
  }, [taxesData]);

  useEffect(() => {
    setValue(searchTerm);
    if (!searchTerm && !customerSelected?.customerName) {
      setShowDropDown(false);
    }
  }, [searchTerm, customerSelected]);

  useEffect(() => {
    (async () => {
      try {
        const result = await rpcClient.request("getDefaultPrinter", {});
        if (result) {
          setAutoPrinterCheck(JSON.parse(result?.value)?.autoPrintOnCheckout);
        }
      } catch (error) {
        console.error(error);
        dispatch(toggleSnackbarOpen(error));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = (await getDefaultPrinter()) === null;
        if (result) {
          setShowPrinterWarning(result);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const saveNewCredit = () => {
    setShowNewCredit(false);
    setShowCustomerField(true);
  };

  const handleAddTax = () => {
    if (!taxList.length) {
      dispatch(toggleSnackbarOpen("First go to settings and add a tax."));

      return;
    }
    setShowAddTax(true);
  };

  return (
    <Container>
      <Left>
        <Span fontSize="1.3rem" fontWeight="600" color={Colors.primaryColor} margin="1rem 0">
          Confirm Checkout
        </Span>
        <Span fontSize="0.9rem" fontWeight="600" color={Colors.secondaryColor} margin="0 0 1rem 0">
          {`${cart.length} Item${cart.length > 1 ? "s" : ""}`}
        </Span>

        <CartList>
          {cart.map((val, i) => (
            <Flex justifyContent="space-between" alignItems="center" padding="3px 0" key={i}>
              <Span fontSize="1rem" color={Colors.blackLight}>
                {i + 1}. {val.inventoryName} <span>x {val.count}</span>
              </Span>
              <Span fontSize="1rem" fontWeight="600" color={Colors.blackLight}>
                <span>{formatAmountIntl(undefined, val.price * val.count)}</span>
              </Span>
            </Flex>
          ))}
        </CartList>
        <Totals>
          <Flex
            direction="column"
            alignItems="end"
            style={{ width: "90%", borderBottom: "1px solid #607087", paddingBottom: "0.625rem" }}
          >
            <Span
              fontSize="0.9375rem"
              fontWeight="600"
              style={{ padding: "0.9375rem 0 0.3125rem 0" }}
              color={Colors.primaryColor}
            >
              Sub Total
              <span style={{ paddingLeft: "1.5625rem" }}>
                {formatAmountIntl(
                  undefined,
                  getTotalCartPrice() -
                    getDiscountAmount() -
                    (selectedTax?.isInclusive
                      ? generateTotalTax(getTotalCartPrice() - Number(getDiscountAmount()))
                      : 0)
                )}
              </span>
            </Span>

            <Flex alignItems="center" width="100%" justifyContent="space-between" gap="0.6rem">
              <Flex alignItems="center" width="30%">
                {shouldSellOnCredit && (
                  <ToggleButton
                    onClick={() => {
                      const {
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        data,
                      } = shopData;
                      if (data) {
                        const { discountEnabled } = data?.getShop?.result;
                        if (!discountEnabled) {
                          dispatch(
                            toggleSnackbarOpen("Please enable discount from business settings!")
                          );
                        } else {
                          setEnableDiscount(!enableDiscount);
                          setEnableSurplus((prev) => (prev ? false : prev));
                        }
                      }
                    }}
                  >
                    <img src={enableDiscount ? toggleOn : toggleOff} alt="" />
                    <span>Discount</span>
                  </ToggleButton>
                )}
              </Flex>
              {shouldSellWithDiscount && (
                <Flex alignItems="center" width="30%">
                  <ToggleButton
                    onClick={() => {
                      const {
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        data,
                      } = shopData;
                      if (data) {
                        const { isSurplusEnabled } = data?.getShop?.result;
                        if (!isSurplusEnabled) {
                          dispatch(
                            toggleSnackbarOpen("Please enable surplus from business settings!")
                          );
                        } else {
                          setEnableSurplus(!enableSurplus);
                          setEnableDiscount((prev) => (prev ? false : prev));
                        }
                      }
                    }}
                  >
                    <img src={enableSurplus ? toggleOn : toggleOff} alt="" />
                    <span>Surplus</span>
                  </ToggleButton>
                </Flex>
              )}

              <Flex alignItems="center" width="40%">
                {enableDiscount || enableSurplus ? (
                  <input
                    type="text"
                    value={saleDiscount}
                    onChange={(e) => handleDiscount(Number(e.target.value))}
                    name=""
                    id=""
                    min={0}
                    style={{
                      border: "1px solid white",
                      backgroundColor: "white",
                      padding: "0.625rem 0.5rem",
                      borderRadius: "0.625rem",
                      width: "8rem",
                    }}
                  />
                ) : (
                  <Span color={Colors.secondaryColor} fontWeight="600">
                    <em>Toggle option to add</em>
                  </Span>
                )}
              </Flex>
            </Flex>

            {!shouldSellWithDiscount && (
              <Span color={Colors.red} margin="0.625rem 0px" fontSize="0.75rem">
                You do not have permission to add "Surplus" or "Discount" to sales, contact your
                manager.
              </Span>
            )}
          </Flex>
          <Span
            fontSize="1.5rem"
            fontWeight="600"
            style={{ padding: "0.9375rem 0 0.3125rem 0" }}
            color={Colors.primaryColor}
          >
            Total{" "}
            <span style={{ paddingLeft: "1.5625rem", fontWeight: "600" }}>
              {formatAmountIntl(undefined, getTotal())}
            </span>
          </Span>
        </Totals>
      </Left>
      <Right>
        <CancelButton onClick={() => handleClose(false)}>
          <img src={cancelIcon} alt="" />
        </CancelButton>
        <RightContent>
          <Flex width="100%" gap="1rem">
            <div style={{ width: "50%" }}>
              <Label>Payment Method</Label>
              <CustomDropdown
                width="100%"
                height="40px"
                color="#607087"
                borderRadius="12px"
                containerColor="#F4F6F9"
                dropdownIcon={dropIcon}
                border="none"
                fontSize="16px"
                selected={paymentIdx}
                setValue={handlePaymentMethod}
                options={paymentMethodOption}
                padding="0 10px"
              />
            </div>
            <div style={{ width: "50%" }}>
              <Label>Select Cashier</Label>
              <CustomDropdown
                width="100%"
                height="40px"
                color="#607087"
                borderRadius="12px"
                border="none"
                containerColor="#F4F6F9"
                dropdownIcon={dropIcon}
                fontSize="16px"
                selected={cashierSelected}
                setValue={setCashierSelected}
                options={cashierOption}
                padding="0 10px"
                placeholder="Select Cashier"
              />
            </div>
          </Flex>

          <Flex margin="15px 0" alignItems="flex-start">
            {shouldSellOnCredit && (
              <>
                {showCustomerField ? (
                  <Flex width="100%" direction="column" gap="0.5rem">
                    <Span color={Colors.blackLight}>Balance and Repayment</Span>
                    <Flex
                      width="100%"
                      direction="column"
                      gap="0.5rem"
                      bg={Colors.lightSecondaryColor}
                      borderRadius="1rem"
                      padding="0.5rem"
                    >
                      <Flex width="100%" alignItems="center" justifyContent="space-between">
                        <Span>
                          {formatAmountIntl(undefined, getTotal() - Number(depositAmount))}
                          <Span color={Colors.blackLight} margin="0 0 0 0.5rem">
                            Remaining
                          </Span>
                        </Span>
                        <Span color={Colors.blackLight}>
                          Paying on{" "}
                          <Span color={Colors.primaryColor} fontWeight="600">
                            {moment(dueDate).format("Do MMM YYYY")}
                          </Span>
                        </Span>
                      </Flex>
                      <Flex
                        width="100%"
                        alignItems="center"
                        justifyContent="space-between"
                        onClick={() => setShowSelectCustomer(true)}
                        cursor="pointer"
                      >
                        <Span
                          color={Colors.secondaryColor}
                          style={{
                            background: "white",
                            borderRadius: "2rem",
                            padding: "0.4rem 1.1rem",
                          }}
                        >
                          <em>{customerSelected?.customerName}</em>
                        </Span>
                        <img src={Chev} alt="" width={"10px"} />
                      </Flex>
                    </Flex>
                  </Flex>
                ) : (
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    bg={Colors.tabBg}
                    border={`1px solid ${Colors.offRed}`}
                    borderRadius="1rem"
                    height="3rem"
                    padding="0 1rem"
                    cursor="pointer"
                    onClick={() => setShowSelectCustomer(true)}
                  >
                    <Span fontSize="1.2rem" color={Colors.offRed}>
                      Click here to sell on credit
                    </Span>
                    <img src={Chev} alt="" />
                  </Flex>
                )}
              </>
            )}
          </Flex>

          <Flex width="100%">
            {selectedTax?.value ? (
              <Flex alignItems="flex-start" gap="0.5rem" direction="column">
                <Span color={Colors.blackLight}>Tax</Span>
                <Flex
                  bg={Colors.tabBg}
                  borderRadius="0.6rem"
                  alignItems="center"
                  width="fit-content"
                  padding="0.8rem 1rem"
                  gap="0.7rem"
                >
                  <img
                    src={Cancel}
                    alt=""
                    onClick={() => setSelectedTax(undefined)}
                    style={{ cursor: "pointer" }}
                  />
                  <Span color={Colors.blackLight} fontWeight="600" margin="0 1rem 0 0 ">{`${
                    selectedTax?.name
                  } (${selectedTax?.value}% ${selectedTax?.isInclusive ? "Inclusive" : ""})`}</Span>
                  <img
                    src={Change}
                    alt=""
                    onClick={() => setShowAddTax(true)}
                    style={{ cursor: "pointer", width: "1rem" }}
                  />
                </Flex>
              </Flex>
            ) : (
              <Flex alignItems="center" gap="0.5rem" cursor="pointer" onClick={handleAddTax}>
                <img src={Add} alt="" />
                <Span color={Colors.secondaryColor}>Add Tax to sale</Span>
              </Flex>
            )}
          </Flex>
          <Flex margin="15px 0">
            <div style={{ width: "50%", padding: "0px 5px" }}>
              <ToggleButton onClick={() => setAddComment(!addComment)}>
                <img src={addComment ? toggleOn : toggleOff} alt="" />
                <span>Add a comment</span>
              </ToggleButton>
            </div>
            {addComment && (
              <div style={{ width: "65%", marginTop: "10px" }}>
                <TextArea
                  placeholder="Comment (Optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}
          </Flex>
        </RightContent>

        <Flex direction="column" width="100%">
          <Flex justifyContent="space-between" padding="10px 0" gap="0.5rem">
            <Flex
              width="60%"
              alignItems="center"
              gap="0.5rem"
              cursor="pointer"
              onClick={() => setShowBackdate(true)}
            >
              <img src={BackdateIcon} alt="" />
              <Flex
                alignItems="flex-start"
                justifyContent="space-between"
                width="100%"
                direction="column"
              >
                {backDate ? (
                  <Flex alignItems="center" justifyContent="flex-start">
                    <Span color={Colors.blackLight} fontWeight="600" margin="0 0.3rem 0 0">
                      Sale Date:
                    </Span>
                    <Span color={Colors.primaryColor}>
                      <em>{moment(backDate).format("YYYY-MMM-DD h:mm a")}</em>
                    </Span>
                  </Flex>
                ) : (
                  <Span color={Colors.primaryColor}>Do you know you can backdate sale?</Span>
                )}
                <Span color={Colors.secondaryColor}>Click to change sale date</Span>
              </Flex>
            </Flex>

            <Button
              label="Checkout"
              onClick={(e) => handleSubmit(e)}
              backgroundColor={Colors.green}
              size="lg"
              fontSize="16px"
              borderRadius="12px"
              width="40%"
              color="#fff"
              borderColor="transparent"
              borderSize="0px"
            />
          </Flex>
        </Flex>
      </Right>
      {showAddCustomer && (
        <ModalContainer>
          <NewCustomer setShowModal={setShowAddCustomer} refetch={reloadCustomers} />
        </ModalContainer>
      )}

      {showSelectCustomer && !showNewCredit && !showAddCustomer && (
        <ModalContainer>
          <SelectCustomer
            {...{
              setShowNewCredit,
              setShowAddCustomer,
              customerOption,
              value,
              page,
              setPage,
              setCustomerSelected,
              setShowSelectCustomer,
              searchString,
              setSearchString,
              totalCustomers,
            }}
          />
        </ModalContainer>
      )}

      {showNewCredit && (
        <ModalContainer>
          <Credit
            {...{
              getTotal,
              customerSelected,
              setShowNewCredit,
              setShowSelectCustomer,
              depositAmount,
              setDepositAmount,
              setCustomerSelected,
              saveNewCredit,
              dueDate,
              setDueDate,
              paymentMethodOption,
              handleCreditPaymentMethod,
              creditPaymentIdx,
            }}
          />
        </ModalContainer>
      )}
      {showAddTax && (
        <ModalContainer>
          <AddTax
            {...{
              setShowAddTax,
              taxList,
              setSelectedTax,
              selectedTax,
            }}
          />
        </ModalContainer>
      )}

      {showBackdate && (
        <ModalContainer>
          <BackDate
            {...{
              setShowBackdate,
              backDate,
              setBackDate,
            }}
          />
        </ModalContainer>
      )}

      {showMultiplePayment && (
        <ModalContainer>
          <MultiplePayment
            {...{
              getTotal,
              setShowMultiplePayment,
              setPaymentsArr,
              paymentMethodOption,
            }}
          />
        </ModalContainer>
      )}
    </Container>
  );
};

export default Checkout;
