import { FunctionComponent, useEffect, useState } from "react";
import { Flex, Span, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { ModalBox, ModalContainer } from "../../settings/style";
import cancelIcon from "../../../assets/cancel.svg";
import { Button } from "../../../components/button/Button";
import { Colors } from "../../../GlobalStyles/theme";
import CalendarGrey from "../../../assets/invoice-calendar-grey.svg";
import CalendarRed from "../../../assets/invoice-calendar-red.svg";
import { ICustomer, IInventory, IInventoryCategory } from "../../../interfaces/inventory.interface";
import Customerlist from "./CustomerList";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ALL_CUSTOMERS } from "../../../schema/customer.schema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import ProfileIcon from "../../../assets/profile-icon-invoice.svg";
import SelectInvoiceDate from "./SelectInvoiceDate";
import moment from "moment";
import ShippingAddress from "./ShippingAddress";
import { GET_ALL_SHOP_INVENTORY, SEARCH_INVENTORY } from "../../../schema/inventory.schema";
import { GET_SHOP_INVENTORY_CATEGORIES } from "../../../schema/shops.schema";
import ProductList from "./ProductList";
import Checkout from "./Checkout/Checkout";

const ArrowRight = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="8" viewBox="0 0 6 8" fill="none">
      <path d="M5.5 3.13398C6.16667 3.51888 6.16667 4.48113 5.5 4.86603L1.75 7.03109C1.08333 7.41599 0.25 6.93486 0.25 6.16506L0.25 1.83493C0.25 1.06513 1.08333 0.584011 1.75 0.968911L5.5 3.13398Z" fill="#9EA8B7"/>
    </svg>
  );
};

const UserIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 5C7.10457 5 8 4.10457 8 3C8 1.89543 7.10457 1 6 1C4.89543 1 4 1.89543 4 3C4 4.10457 4.89543 5 6 5Z" fill="#E47D05"/>
      <path opacity="0.5" d="M6 10.5C7.933 10.5 9.5 9.60457 9.5 8.5C9.5 7.39543 7.933 6.5 6 6.5C4.067 6.5 2.5 7.39543 2.5 8.5C2.5 9.60457 4.067 10.5 6 10.5Z" fill="#E47D05"/>
    </svg>
  );
};

const InfoCircle = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.99935 1.66406C14.6027 1.66406 18.3344 5.39573 18.3344 9.99906C18.3344 14.6016 14.6027 18.3324 9.99935 18.3324C5.39602 18.3332 1.66602 14.6016 1.66602 9.99906C1.66518 5.39573 5.39602 1.66406 9.99935 1.66406ZM9.99935 2.91406C9.06252 2.9039 8.13298 3.07965 7.26453 3.43112C6.39608 3.7826 5.60596 4.30283 4.9399 4.9617C4.27384 5.62057 3.74507 6.40501 3.3842 7.2696C3.02333 8.13419 2.83751 9.06177 2.83751 9.99865C2.83751 10.9355 3.02333 11.8631 3.3842 12.7277C3.74507 13.5923 4.27384 14.3767 4.9399 15.0356C5.60596 15.6945 6.39608 16.2147 7.26453 16.5662C8.13298 16.9176 9.06252 17.0934 9.99935 17.0832C11.865 17.063 13.6473 16.3077 14.9595 14.9813C16.2716 13.6548 17.0075 11.8644 17.0075 9.99865C17.0075 8.1329 16.2716 6.34245 14.9595 5.01603C13.6473 3.68962 11.865 2.9343 9.99935 2.91406ZM9.99602 8.7474C10.1472 8.7472 10.2933 8.80181 10.4073 8.90109C10.5213 9.00038 10.5955 9.13763 10.616 9.2874L10.6218 9.3724L10.6252 13.9574C10.6268 14.1169 10.5674 14.2709 10.4591 14.388C10.3509 14.5052 10.2019 14.5764 10.0428 14.5873C9.88367 14.5982 9.72642 14.5478 9.60323 14.4465C9.48005 14.3452 9.40025 14.2006 9.38018 14.0424L9.37518 13.9582L9.37185 9.37323C9.37185 9.20747 9.4377 9.0485 9.55491 8.93129C9.67212 8.81408 9.83109 8.74823 9.99685 8.74823L9.99602 8.7474ZM10.0002 5.83323C10.1117 5.8297 10.2227 5.84861 10.3268 5.88884C10.4308 5.92907 10.5257 5.98979 10.6058 6.06741C10.6859 6.14502 10.7496 6.23794 10.7931 6.34065C10.8366 6.44337 10.859 6.55377 10.859 6.66531C10.859 6.77685 10.8366 6.88726 10.7931 6.98997C10.7496 7.09268 10.6859 7.1856 10.6058 7.26322C10.5257 7.34083 10.4308 7.40156 10.3268 7.44178C10.2227 7.48201 10.1117 7.50092 10.0002 7.4974C9.78406 7.49056 9.57907 7.39989 9.42861 7.24459C9.27815 7.08929 9.19402 6.88155 9.19402 6.66531C9.19402 6.44908 9.27815 6.24133 9.42861 6.08603C9.57907 5.93073 9.78406 5.84007 10.0002 5.83323Z" fill="#E47D05"/>
    </svg>
  );
};

export const AddCircle = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
      <g clip-path="url(#clip0_29355_74778)">
        <path d="M6 12.5C2.68631 12.5 0 9.81369 0 6.5C0 3.18612 2.68631 0.5 6 0.5C9.31388 0.5 12 3.18612 12 6.5C12 9.81369 9.31388 12.5 6 12.5ZM6 1.23819C3.10519 1.23819 0.75 3.60519 0.75 6.50002C0.75 9.39484 3.10519 11.75 6 11.75C8.89481 11.75 11.25 9.39482 11.25 6.50002C11.25 3.60522 8.89481 1.23819 6 1.23819ZM8.625 6.875H6.375V9.125C6.375 9.332 6.207 9.5 6 9.5C5.793 9.5 5.625 9.332 5.625 9.125V6.875H3.375C3.168 6.875 3 6.707 3 6.5C3 6.293 3.168 6.125 3.375 6.125H5.625V3.875C5.625 3.668 5.793 3.5 6 3.5C6.207 3.5 6.375 3.668 6.375 3.875V6.125H8.625C8.832 6.125 9 6.293 9 6.5C9 6.707 8.832 6.875 8.625 6.875Z" fill="#E47D05"/>
      </g>
      <defs>
        <clipPath id="clip0_29355_74778">
          <rect width="12" height="12" fill="white" transform="matrix(1 0 0 -1 0 12.5)"/>
        </clipPath>
      </defs>
    </svg>
  );
};

export const AddCircleFilled = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="11" fill="#FFF6EA"/>
      <path d="M15.16 11.848H11.928V15.16H10.232V11.848H7V10.312H10.232V7H11.928V10.312H15.16V11.848Z" fill="#E47D05"/>
    </svg>
  );
};

const PenIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
      <path d="M2.21097 10.7893C2.1416 10.7892 2.07302 10.7747 2.00957 10.7466C1.94613 10.7185 1.88923 10.6776 1.84247 10.6263C1.79487 10.5755 1.75855 10.5152 1.73589 10.4494C1.71322 10.3836 1.70473 10.3137 1.71097 10.2443L1.83347 8.89733L7.49247 3.24033L9.26097 5.00833L3.60347 10.6648L2.25647 10.7873C2.24135 10.7887 2.22616 10.7894 2.21097 10.7893ZM9.61397 4.65483L7.84597 2.88683L8.90647 1.82633C8.95291 1.77984 9.00805 1.74296 9.06875 1.7178C9.12945 1.69264 9.19451 1.67969 9.26022 1.67969C9.32593 1.67969 9.39099 1.69264 9.45169 1.7178C9.51239 1.74296 9.56753 1.77984 9.61397 1.82633L10.6745 2.88683C10.721 2.93327 10.7578 2.98841 10.783 3.04911C10.8082 3.10981 10.8211 3.17487 10.8211 3.24058C10.8211 3.30629 10.8082 3.37135 10.783 3.43205C10.7578 3.49275 10.721 3.54789 10.6745 3.59433L9.61447 4.65433L9.61397 4.65483Z" fill="#E47D05"/>
    </svg>
  );
};

const BlackPenIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.6843 17.1495C3.56868 17.1493 3.45437 17.1251 3.34864 17.0783C3.24291 17.0315 3.14806 16.9633 3.07013 16.8779C2.9908 16.7932 2.93026 16.6927 2.89249 16.583C2.85472 16.4732 2.84057 16.3568 2.85097 16.2412L3.05513 13.9962L12.4868 4.56787L15.4343 7.51454L6.00513 16.942L3.76013 17.1462C3.73492 17.1485 3.70962 17.1496 3.6843 17.1495ZM16.0226 6.92537L13.076 3.9787L14.8435 2.2112C14.9209 2.13372 15.0128 2.07226 15.1139 2.03032C15.2151 1.98838 15.3235 1.9668 15.4331 1.9668C15.5426 1.9668 15.651 1.98838 15.7522 2.03032C15.8533 2.07226 15.9452 2.13372 16.0226 2.2112L17.7901 3.9787C17.8676 4.0561 17.9291 4.148 17.971 4.24917C18.013 4.35033 18.0345 4.45877 18.0345 4.56829C18.0345 4.6778 18.013 4.78624 17.971 4.8874C17.9291 4.98857 17.8676 5.08047 17.7901 5.15787L16.0235 6.92454L16.0226 6.92537Z" fill="#130F26"/>
      <path d="M3.6843 17.1495C3.56868 17.1493 3.45437 17.1251 3.34864 17.0783C3.24291 17.0315 3.14806 16.9633 3.07013 16.8779C2.9908 16.7932 2.93026 16.6927 2.89249 16.583C2.85472 16.4732 2.84057 16.3568 2.85097 16.2412L3.05513 13.9962L12.4868 4.56787L15.4343 7.51454L6.00513 16.942L3.76013 17.1462C3.73492 17.1485 3.70962 17.1496 3.6843 17.1495ZM16.0226 6.92537L13.076 3.9787L14.8435 2.2112C14.9209 2.13372 15.0128 2.07226 15.1139 2.03032C15.2151 1.98838 15.3235 1.9668 15.4331 1.9668C15.5426 1.9668 15.651 1.98838 15.7522 2.03032C15.8533 2.07226 15.9452 2.13372 16.0226 2.2112L17.7901 3.9787C17.8676 4.0561 17.9291 4.148 17.971 4.24917C18.013 4.35033 18.0345 4.45877 18.0345 4.56829C18.0345 4.6778 18.013 4.78624 17.971 4.8874C17.9291 4.98857 17.8676 5.08047 17.7901 5.15787L16.0235 6.92454L16.0226 6.92537Z" fill="black" fill-opacity="0.2"/>
    </svg>
  );
};

const BinRed = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4.16732 15.8333C4.16732 16.75 4.91732 17.5 5.83398 17.5H12.5007C13.4173 17.5 14.1673 16.75 14.1673 15.8333V5.83333H4.16732V15.8333ZM15.0007 3.33333H12.084L11.2507 2.5H7.08398L6.25065 3.33333H3.33398V5H15.0007V3.33333Z" fill="#F65151"/>
    </svg>
  );
};

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ShippingAddressType {
  state: string;
  city: string;
  location: string;
}

export interface InventoryListType extends IInventory {
  unitPrice: string;
  discount: string;
  listQuantity: string;
  discription: string;
}

const NewInvoice: FunctionComponent<IProps> = ({ setShowModal }) => {
  const [customer, setCustomer] = useState<ICustomer>();
  const [customerList, setCustomerList] = useState<ICustomer[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressType>();
  const [selectedProducts, setSelectedProducts] = useState<[InventoryListType]>();
  const [search, setSearch] = useState("");

  const [showCustomerList, setShowCustomerList] = useState<boolean>(false);
  const [showShippingForm, setShowShippingForm] = useState<boolean>(false);
  const [showProductList, setShowProductList] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(true);

  const newDate = new Date();
  const today = moment(newDate).format("YYYY-MM-DD");

  const [invoiceDate, setInvoiceDate] = useState<string>(today);
  const [dueDate, setDueDate] = useState<string>();
  const [dateType, setDateType] = useState<"due-date" | "invoice-date">();

  const handleSetDate = (type: "due-date" | "invoice-date", date: string) => {
    if (type === "due-date") {
      setDueDate(date);
    }
    if (type === "invoice-date") {
      setInvoiceDate(date);
    }
  };

  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();

  const { data, refetch } = useQuery<{
    getAllCustomers: {
      customers: [ICustomer];
      totalCustomers: number;
    };
  }>(GET_ALL_CUSTOMERS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  useEffect(() => {
    if (data?.getAllCustomers) {
      setCustomerList(data.getAllCustomers.customers);
    }
  }, [data]);

  const { data: inventories, refetch: refetchInventories } = useQuery<{
    getAllShopInventory: {
      inventories: [IInventory];
      totalInventory: number;
      pagination: number;
    };
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      removeBatchProducts: true,
      shopId: currentShop?.shopId as string,
    },
    fetchPolicy: "cache-and-network",
    onError(err) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  const [getInventoryCategories, { data: categories }] = useLazyQuery<{
    getAllShopInventoryCategory: IInventoryCategory[];
  }>(GET_SHOP_INVENTORY_CATEGORIES, {
    variables: {
      shopId: currentShop?.shopId as string,
    },
    fetchPolicy: "cache-and-network",
    onError(err) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  const [searchInventory] = useLazyQuery<{ searchUserInventory: [IInventory] }>(SEARCH_INVENTORY, {
    variables: {
      shopId: currentShop.shopId,
      searchString: search,
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const handleSubmit = () => {};

  return (
    <>
      <ModalBox width="35%">
        <h3
          style={{
            marginBottom: "32px",
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
            color: Colors.primaryColor,
          }}
        >
          <span>New Invoice</span>
          <button
            onClick={() => setShowModal(false)}
            style={{ background: "transparent", border: "1px solid black" }}
          >
            <img src={cancelIcon} alt="" />
          </button>
        </h3>
        <Flex gap="3em" direction="column">

          <Flex direction="column" gap="1.5rem">
            <Text color={Colors.grey}>Invoice Dates</Text>
            <Flex width="100%" justifyContent="space-between" alignItems="center" cursor="pointer" onClick={() => setDateType("invoice-date")}>
              <Flex gap="1rem" alignItems="center">
                <img src={CalendarGrey} alt="icon of a calendar" />
                <div>
                  <Text fontSize="1rem" color={Colors.blackishBlue}>Invoice Date</Text>
                  <Text fontSize="0.75rem" color={Colors.secondaryColor}>{invoiceDate === today ? "Today" : invoiceDate}</Text>
                </div>
              </Flex>
              <ArrowRight />
            </Flex>
            <Flex width="100%" justifyContent="space-between" alignItems="center" cursor="pointer" onClick={() => setDateType("due-date")}>
              <Flex gap="1rem" alignItems="center">
                <img src={CalendarRed} alt="icon of a calendar" />
                <div>
                  <Text fontSize="1rem" color={Colors.blackishBlue}>Due Date</Text>
                  <Text fontSize="0.75rem" color={Colors.secondaryColor}>{dueDate || "Click to select date"}</Text>
                </div>
              </Flex>
              <ArrowRight />
            </Flex>
          </Flex>

          <Flex direction="column" gap="1.5rem">
            <Text color={Colors.grey}>Customer/Client</Text>
            <Flex justifyContent="space-between" alignItems="center">
              {customer
                ? <Flex cursor="pointer" gap="0.5rem" alignItems="center">
                    <img src={ProfileIcon} />
                    <div>
                      <Text color={Colors.blackishBlue} fontSize="1rem">{customer?.customerName}</Text>
                      <Text color={Colors.blackLight} fontSize="0.75rem">{customer?.phoneNumber || "N/A"}</Text>
                    </div>
                  </Flex>
                : <div>
                    <Text fontSize="1rem" color={Colors.blackishBlue}>Add a Customer/Client</Text>
                    <Text fontSize="0.75rem" color={Colors.secondaryColor}>Tap on browse to add</Text>
                  </div>
              }
              <Flex onClick={() => setShowCustomerList(true)} alignItems="center" padding="0 0.435rem" borderRadius="1px" gap="0.3rem" bg={Colors.lightPrimary} cursor="pointer">
                <UserIcon />
                <Text fontSize="0.75rem" color={Colors.secondaryColor}>Browse</Text>
              </Flex>
            </Flex>

            {customer &&
              <div style={{ cursor: "pointer" }} onClick={() => setShowShippingForm(true)}>
              {!shippingAddress
                ? <Flex gap="0.75rem" margin="1rem 0" alignItems="center">
                    <AddCircle />
                    <Text fontSize="0.75rem" color={Colors.secondaryColor} style={{ fontStyle: "italic" }}>Add Shipping Address</Text>
                  </Flex>
                : <Flex alignItems="flex-end" gap="0.5rem">
                    <PenIcon />
                    <Text color={Colors.blackLight}>
                      {shippingAddress?.location}, {shippingAddress?.city}, {shippingAddress?.state}
                    </Text>
                  </Flex>
              }
              </div>
            }
          </Flex>

          {!customer &&
            <Flex gap="1rem" alignItems="center" bg={Colors.lightBg} padding="0.75rem" borderRadius="10px">
              <InfoCircle />
              <Text color={Colors.blackLight}>
                <Span color={Colors.blackishBlue} fontWeight="500">TIPS: </Span>
                This is the customer you&apos;re currently generating this invoice for.
                Please input accurate information.
              </Text>
            </Flex>
          }

          {customer &&
            <>
              <Flex direction="column" gap="1.5rem">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color={Colors.grey}>Products or Services</Text>
                  {selectedProducts &&
                    <Flex alignItems="center" gap="0.5rem" cursor="pointer" onClick={() => setShowProductList(true)}>
                      <AddCircle />
                      <Text fontSize="0.75rem" color={Colors.secondaryColor}>Add More</Text>
                    </Flex>
                  }
                </Flex>
                {selectedProducts
                  ? <Flex direction="column" gap="1rem">
                      {selectedProducts.map((prod) => {
                        const { inventoryName, unitPrice, discription } = prod || {};
                        return (
                          <Flex direction="column" gap="0.5rem" alignItems="flex-start" margin="0.5rem 0">
                            <Text color={Colors.blackishBlue} fontSize="1rem" fontWeight="500">{inventoryName}</Text>
                            <Flex alignItems="center" justifyContent="space-between" width="100%">
                              <Text color={Colors.grey} fontSize="0.825rem">{unitPrice || "N/A"}</Text>
                              <Flex alignItems="center" gap="0.5rem">
                                <BlackPenIcon />
                                <BinRed />
                              </Flex>
                            </Flex>
                            <Text color={Colors.blackLight} fontSize="0.835rem">{discription || "No description"}</Text>
                          </Flex>
                        );
                      })}
                      <hr style={{ height: "1px", width: "100%", backgroundColor: Colors.grey }} />
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text fontSize="1rem" color={Colors.blackishBlue} fontWeight="500">Items Total</Text>
                        <Text fontSize="1rem" color={Colors.blackishBlue} fontWeight="500">₦15,000</Text>
                      </Flex>
                    </Flex>
                  : <Button
                      label={"Add Product/Services"}
                      onClick={() => setShowProductList(true)}
                      backgroundColor={"transparent"}
                      size="lg"
                      color={Colors.primaryColor}
                      borderColor={Colors.primaryColor}
                      borderRadius="0.75rem"
                      borderSize="0px"
                      fontSize="1rem"
                      width="100%"
                      style={{ border: `2px dashed ${Colors.primaryColor}` }}
                      border={true}
                    />
                }
              </Flex>
            </>
          }
        </Flex>
        {isReady &&
          <Button
            label={"Proceed to Checkout"}
            onClick={() => setShowCheckout(true)}
            backgroundColor={Colors.primaryColor}
            size="lg"
            color="#fff"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            margin="2rem 0 0 0 "
          />
        }
      </ModalBox>
      {showCustomerList &&
        <ModalContainer>
          <Customerlist
            setShowCustomerList={setShowCustomerList}
            customerList={customerList}
            setCustomer={setCustomer}
          />
        </ModalContainer>
      }

      {showProductList &&
        <ModalContainer>
          <ProductList
            setShowProductList={setShowProductList}
            setSearch={setSearch}
            inventories={inventories?.getAllShopInventory.inventories}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        </ModalContainer>
      }

      {showShippingForm &&
        <ModalContainer>
          <ShippingAddress
            setShowShippingForm={setShowShippingForm}
            setShippingAddress={setShippingAddress}
            cityValue={shippingAddress?.city}
            stateValue={shippingAddress?.state}
            location={shippingAddress?.location}
          />
        </ModalContainer>
      }

      {dateType &&
        <ModalContainer>
          <SelectInvoiceDate
            type={dateType}
            handleChange={handleSetDate}
            label={dateType === "due-date" ? "Due Date" : "Invoice Date"}
            close={() => setDateType(undefined)}
          />
        </ModalContainer>
      }

      {showCheckout &&
        <Checkout setShowCheckout={setShowCheckout} />
      }
    </>
  );
};

export default NewInvoice;
