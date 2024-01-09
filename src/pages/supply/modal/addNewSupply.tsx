/* eslint-disable indent */
import React, { FunctionComponent, useEffect, useState } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Box } from "../../onlinePresence/style.onlinePresence";
import { formatAmountIntl, formatNumber } from "../../../helper/format";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { getCurrentShop, increaseSyncCount } from "../../../app/slices/shops";
import { GET_ALL_SHOP_INVENTORY, SEARCH_INVENTORY } from "../../../schema/inventory.schema";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";

import cancelIcon from "../../../assets/cancel.svg";
import dropIcon from "../../../assets/dropIcon2.svg";

import { ModalBox, ModalContainer, CancelModalButton } from "../../settings/style";
import { Flex } from "../../../components/receipt/style";
import { InputField } from "../../../components/input-field/input";
import { Options } from "../../../components/custom-dropdown/style";
import {
  Span,
  Text,
  Button,
  Flex as FlexDiv,
} from "../../../GlobalStyles/CustomizableGlobal.style";
import { CustomSearchDropdown, InputContainer } from "../../sales/checkout-page/style";
import { IInventory } from "../../../interfaces/inventory.interface";
import { RadioInput, UserImage } from "../style";
import { TextArea } from "../../sales/style";
import { useCreateSupplier, useCreateSupplierRecord } from "../supply.utils";
import { SupplierAttr, SupplyItemAttr } from "../../../interfaces/supplies.interface";
import { MARK_SUPPLY_RECORD_COLLECTED } from "../../../schema/supplier.schema";
import preUserImage from "../../../assets/preUser.png";
import { TEmpty } from "../../home/style";
import emptyfile from "../../../assets/emptyfile.svg";
import { Colors } from "../../../GlobalStyles/theme";
import { validateInputNum } from "../../../utils/formatValues";

interface IModal {
  setShowModal: (value: boolean) => void;
  supplier?: SupplierAttr;
  setSupplier: React.Dispatch<React.SetStateAction<SupplierAttr>>;
  setEditSupplier: (value: boolean) => void;
  editSupplier: boolean;
  refetchSupplier: () => void;
  setShouldAddSupplies: React.Dispatch<React.SetStateAction<boolean>>;
  shouldAddSupplies: boolean;
}

interface IInventoryList {
  inventoryId?: string;
  inventoryName?: string;
  variationId?: string;
  shopId?: string;
  inventoryType?: "PIECES" | "PACK" | "VARIATION" | "PIECES_AND_PACK" | "NON_TRACKABLE";
}

interface IAddSupplies {
  product: IInventoryList;
  quantity: string;
  purchasePrice: string;
}

type IStatus = "UNPAID" | "PAID" | "PARTLY_PAID";
type IMethod = "CASH" | "POS" | "TRANSFER";

interface IPaymentStatus {
  label: string;
  value: IStatus;
}

interface IPaymentMethod {
  label: string;
  value: IMethod;
}

const AddNewSupplyModal: FunctionComponent<IModal> = ({
  setShowModal,
  supplier,
  setSupplier,
  editSupplier,
  setEditSupplier,
  refetchSupplier,
  setShouldAddSupplies,
  shouldAddSupplies,
}) => {
  const supplierFirstName = supplier?.firstName;
  const supplierLastName = supplier?.lastName;
  const supplierPhone = supplier?.mobileNumber;
  const supplierEmail = supplier?.email;
  const supplierAddress = supplier?.address;
  const supplierId = supplier?.supplierId;

  const [edit, setEdit] = useState<boolean>(false);
  const [supplierQuantity, setSupplierQuantity] = useState<string>("");
  const [supplierComment, setSupplierComment] = useState<string>("");
  const [supplierPrice, setSupplierPrice] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [productSelected, setProductSelected] = useState<IInventoryList | undefined>();
  const [filteredProducts, setFilteredProducts] = useState<IInventoryList[]>([]);
  const [productOption, setProductOption] = useState<IInventoryList[]>([]);
  const [addedSupplies, setAddedSupplies] = useState<IAddSupplies[]>([]);
  const [step, setStep] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<IStatus>("PAID");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("CASH");
  const [depositedAmount, setDepositedAmount] = useState<string>("");
  const [isMarkAsCollected, setIsMarkAsCollected] = useState<boolean>(false);

  const paymentStatus: IPaymentStatus[] = [
    { label: "Paid Fully", value: "PAID" },
    { label: "Unpaid", value: "UNPAID" },
    { label: "Partly Paid", value: "PARTLY_PAID" },
  ];

  const paymentMethod: IPaymentMethod[] = [
    { label: "CASH", value: "CASH" },
    { label: "POS", value: "POS" },
    { label: "TRANSFER", value: "TRANSFER" },
  ];

  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();

  const { createNewSupplier } = useCreateSupplier();
  const { createNewSupplierRecord } = useCreateSupplierRecord();

  const { data: inventoryData, refetch } = useQuery<{
    getAllShopInventory: {
      inventories: [IInventory];
      totalInventory: number;
    };
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      shopId: currentShop?.shopId as string,
      limit: 20,
    },
    fetchPolicy: "cache-and-network",
    onError(err) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  const [searchInventory] = useLazyQuery<{ searchUserInventory: [IInventory] }>(SEARCH_INVENTORY, {
    variables: {
      shopId: currentShop.shopId,
      searchString: searchTerm,
    },
    onError(err) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    if (editSupplier) {
      setSupplier(supplier!);
    } else {
      setSupplier({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        address: "",
        supplierId: "",
      });
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      searchInventory({
        variables: {
          shopId: currentShop.shopId,
          searchString: searchTerm,
        },
      }).then((res) => {
        if (res.data) {
          const inventoryList: IInventoryList[] = [];
          res.data.searchUserInventory?.forEach((inventory) => {
            if (inventory.inventoryType !== "NON_TRACKABLE") {
              if (inventory.inventoryType === "PIECES_AND_PACK") {
                const types = ["pieces", "pack"];
                for (let index = 0; index < types.length; index++) {
                  const type = types[index];
                  inventoryList.push({
                    inventoryId: inventory.inventoryId,
                    inventoryName: `${inventory.inventoryName} (${type})`,
                    shopId: inventory?.shopId,
                    inventoryType: type === types[0] ? "PIECES" : "PACK",
                  });
                }
              } else if (inventory.inventoryType === "VARIATION" && inventory.Variations?.length) {
                inventory.Variations.map((variation) =>
                  inventoryList.push({
                    inventoryId: variation.inventoryId,
                    inventoryName: variation.variationName,
                    variationId: variation.variationId,
                    shopId: variation.shopId,
                    inventoryType: inventory.inventoryType,
                  })
                );
              } else {
                inventoryList.push({
                  inventoryId: inventory.inventoryId,
                  inventoryName: inventory.inventoryName,
                  shopId: inventory.shopId,
                  inventoryType: inventory.inventoryType,
                });
              }
            }
          });
          setProductOption(inventoryList);
        }
      });
    }

    if (searchTerm.length < 1) {
      if (inventoryData) {
        const inventoryList: IInventoryList[] = [];
        inventoryData.getAllShopInventory?.inventories?.forEach((inventory) => {
          if (inventory.inventoryType !== "NON_TRACKABLE") {
            if (inventory.inventoryType === "PIECES_AND_PACK") {
              const types = ["pieces", "pack"];
              for (let index = 0; index < types.length; index++) {
                const type = types[index];
                inventoryList.push({
                  inventoryId: inventory.inventoryId,
                  inventoryName: `${inventory.inventoryName} (${type})`,
                  shopId: inventory?.shopId,
                  inventoryType: type === types[0] ? "PIECES" : "PACK",
                });
              }
            } else if (inventory.inventoryType === "VARIATION" && inventory.Variations?.length) {
              inventory.Variations.map((variation) =>
                inventoryList.push({
                  inventoryId: variation.inventoryId,
                  inventoryName: `${variation.variationName} (variation) `,
                  variationId: variation.variationId,
                  shopId: variation.shopId,
                  inventoryType: inventory.inventoryType,
                })
              );
            } else {
              inventoryList.push({
                inventoryId: inventory.inventoryId,
                inventoryName: inventory.inventoryName,
                shopId: inventory.shopId,
                inventoryType: inventory.inventoryType,
              });
            }
          }
        });
        setProductOption(inventoryList);
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    if (inventoryData) {
      const inventoryList: IInventoryList[] = [];
      inventoryData.getAllShopInventory?.inventories?.forEach((inventory) => {
        if (inventory.inventoryType !== "NON_TRACKABLE") {
          if (inventory.inventoryType === "PIECES_AND_PACK") {
            const types = ["pieces", "pack"];
            for (let index = 0; index < types.length; index++) {
              const type = types[index];
              inventoryList.push({
                inventoryId: inventory.inventoryId,
                inventoryName: `${inventory.inventoryName} (${type})`,
                shopId: inventory?.shopId,
                inventoryType: type === types[0] ? "PIECES" : "PACK",
              });
            }
          } else if (inventory.inventoryType === "VARIATION" && inventory.Variations?.length) {
            inventory.Variations.map((variation) =>
              inventoryList.push({
                inventoryId: variation.inventoryId,
                inventoryName: `${variation.variationName} (variation) `,
                variationId: variation.variationId,
                shopId: variation.shopId,
                inventoryType: inventory.inventoryType,
              })
            );
          } else {
            inventoryList.push({
              inventoryId: inventory.inventoryId,
              inventoryName: inventory.inventoryName,
              shopId: inventory.shopId,
              inventoryType: inventory.inventoryType,
            });
          }
        }
      });
      setProductOption(inventoryList);
    }
  }, [inventoryData]);

  useEffect(() => {
    setFilteredProducts(
      productOption.filter((product) => {
        return product.inventoryName?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  useEffect(() => {
    setValue(searchTerm);
    if (!searchTerm && !productSelected?.inventoryName) {
      setShowDropDown(false);
    }
  }, [searchTerm, productSelected]);

  const handleSearchProduct = (e: any) => {
    e.preventDefault();
    if (searchTerm.length > 0) {
      setShowDropDown(true);
    }

    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm.length > 0) {
      setShowDropDown(true);
    }
    if (productSelected?.inventoryName && newSearchTerm !== "") {
      setValue(productSelected?.inventoryName);
    } else if (newSearchTerm !== "") {
      setValue(newSearchTerm);
    } else {
      setValue("");
      setProductSelected(undefined);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.length < 1) {
      setShowDropDown(true);
      setFilteredProducts(productOption.slice(0, 10).sort());
    }
  };

  const handleSaveSupplies = () => {
    const shoulddAdd = addedSupplies.find(
      (supply) =>
        supply.product?.inventoryId === productSelected?.inventoryId &&
        supply.product?.inventoryName === productSelected?.inventoryName
    );

    if (shoulddAdd && !edit) {
      dispatch(
        toggleSnackbarOpen(
          "The product you are trying to supply has already been added. Please edit the existing supply."
        )
      );
      return;
    }

    setAddedSupplies([
      ...addedSupplies,
      {
        product: productSelected!,
        quantity: supplierQuantity,
        purchasePrice: supplierPrice,
      },
    ]);

    setProductSelected(undefined);
    setSearchTerm("");
    setSupplierPrice("");
    setSupplierQuantity("");
    setEdit(false);
  };

  const handleDeletesupplies = (productToDelete: IInventoryList) => {
    productToDelete?.inventoryType !== "VARIATION"
      ? setAddedSupplies((prev) =>
          prev.filter(
            (inventory) =>
              inventory.product?.inventoryId !== productToDelete?.inventoryId &&
              inventory.product?.inventoryName !== productToDelete?.inventoryName
          )
        )
      : setAddedSupplies((prev) =>
          prev.filter(
            (inventory) => inventory.product?.inventoryName !== productToDelete?.inventoryName
          )
        );
  };

  const handleEditsupplies = (productToEdit: IInventoryList) => {
    const product =
      productToEdit?.inventoryType !== "VARIATION"
        ? addedSupplies.filter(
            (inventory) =>
              inventory.product?.inventoryId === productToEdit?.inventoryId &&
              inventory.product?.inventoryName === productToEdit?.inventoryName
          )[0]
        : addedSupplies.filter(
            (inventory) => inventory.product?.inventoryName === productToEdit?.inventoryName
          )[0];

    setProductSelected(product?.product);
    setSearchTerm(product?.product?.inventoryName!);
    setSupplierPrice(product?.purchasePrice);
    setSupplierQuantity(product?.quantity);
    setEdit(true);
    handleDeletesupplies(product.product as IInventoryList);
  };

  const handleChangeStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleMethodSelect = (event: any) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { value } = event.target;
    setSelectedPaymentMethod(value);
  };

  const handleCreateNewSupplier = async () => {
    await createNewSupplier({
      firstName: supplierFirstName || "",
      lastName: supplierLastName || "",
      shopId: currentShop?.shopId!,
      mobileNumber: supplierPhone as string,
      address: supplierAddress as string,
      email: supplierEmail as string,
    })
      .then((res) => {
        console.log("res:", res);
        dispatch(toggleSnackbarOpen("Supplier created successfully"));
        setStep(1);
        refetchSupplier();
        setSupplier({
          firstName: "",
          lastName: "",
          mobileNumber: "",
          email: "",
          address: "",
        });
        setEditSupplier(false);
        setShowModal(false);
        setSupplierComment("");
        setSupplierPrice("");
        setSupplierQuantity("");
        setAddedSupplies([]);
      })
      .catch((err) => {
        console.log("err:", err);
        dispatch(toggleSnackbarOpen(`${err}`));
      });
  };

  const handleCreateSupplierRecord = async () => {
    const supplyItemInput: SupplyItemAttr[] = addedSupplies.map((supply) => {
      return {
        inventoryId: supply?.product?.inventoryId,
        variationId: supply?.product?.variationId,
        quantity: parseInt(supply?.quantity),
        purchasePrice: parseFloat(supply?.purchasePrice),
      };
    });

    const totalPurchasePrice = addedSupplies.reduce((total, supply) => {
      const purchasePrice = parseFloat(supply.purchasePrice);
      const quantity = parseFloat(supply.quantity);
      const subtotal = purchasePrice * quantity;
      return total + subtotal;
    }, 0);

    await createNewSupplierRecord({
      shopId: currentShop?.shopId!,
      supplierId: supplierId!,
      comment: supplierComment,
      paymentStatus: selectedStatus,
      totalAmount: totalPurchasePrice,
      amountPaid:
        selectedStatus === "PAID"
          ? totalPurchasePrice
          : selectedStatus === "PARTLY_PAID"
          ? Number(depositedAmount)
          : 0,
      SupplyItems: supplyItemInput,
      isCollected: isMarkAsCollected,
    }).then((res) => {
      dispatch(toggleSnackbarOpen("Supplier records created successfully"));
      dispatch(increaseSyncCount(["SupplierRecords"]));
      setStep(1);
      refetchSupplier();
      setSupplier({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        address: "",
      });
      setEditSupplier(false);
      setShowModal(false);
      setSupplierComment("");
      setSupplierPrice("");
      setSupplierQuantity("");
      setAddedSupplies([]);
      setShouldAddSupplies(false);
    });
  };

  const handleCancelModal = () => {
    setSupplier({});
    setEditSupplier(false);
    setShowModal(false);
  };

  const handleClearInput = () => {
    setSearchTerm("");
    setProductSelected(undefined);
    setValue("");
    setSupplierPrice("");
    setSupplierQuantity("");
  };

  const inputFieldWidth = "350px";

  return (
    <ModalContainer>
      <ModalBox style={{ height: "auto" }} padding="0px">
        {step === 1 &&
          (!shouldAddSupplies ? (
            <Flex
              width="100%"
              justifyContent="space-between"
              alignItems="flex-start"
              padding="1.25rem 1.875rem"
            >
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
                gap="0.625rem 0px"
              >
                <Flex justifyContent="space-between" alignItems="center" margin="0 0 1.25rem">
                  <Span fontSize="1.375rem" fontWeight="600">
                    Add New Supplier
                  </Span>

                  <CancelModalButton
                    onClick={() => {
                      setShowModal(false);
                      setEditSupplier(false);
                      setShouldAddSupplies(false);
                    }}
                  >
                    <img src={cancelIcon} alt="" />
                  </CancelModalButton>
                </Flex>

                <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                  <label htmlFor="supplierName">First Name</label>
                  <InputField
                    placeholder="Enter supplier firstname"
                    type="text"
                    size="lg"
                    backgroundColor="#F4F6F9"
                    color="#353e49"
                    borderRadius="0.75rem"
                    borderSize="1px"
                    border
                    fontSize="1rem"
                    width={inputFieldWidth}
                    value={supplierFirstName as string}
                    onChange={(e) =>
                      setSupplier({
                        ...supplier,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </Flex>

                <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                  <label htmlFor="supplierName">Last Name</label>
                  <InputField
                    placeholder="Enter supplier lastname"
                    type="text"
                    size="lg"
                    backgroundColor="#F4F6F9"
                    color="#353e49"
                    borderRadius="0.75rem"
                    borderSize="1px"
                    border
                    fontSize="1rem"
                    width={inputFieldWidth}
                    value={supplierLastName as string}
                    onChange={(e) =>
                      setSupplier({
                        ...supplier,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </Flex>

                <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                  <label htmlFor="">Phone Number</label>
                  <InputField
                    noFormat
                    placeholder="Enter phone Number"
                    type="tel"
                    size="lg"
                    backgroundColor="#F4F6F9"
                    color="#353e49"
                    borderRadius="0.75rem"
                    borderSize="1px"
                    border
                    fontSize="1rem"
                    width={inputFieldWidth}
                    value={supplierPhone as string}
                    onChange={(e) =>
                      setSupplier({
                        ...supplier,
                        mobileNumber: e.target.value,
                      })
                    }
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      const key = e.key;
                      const isNumericKey = /^[0-9]$/.test(key);
                      if (!isNumericKey) {
                        e.preventDefault();
                      }
                    }}
                    required
                  />
                </Flex>

                <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                  <label htmlFor="">Email (Optional)</label>
                  <InputField
                    placeholder="Enter email (Optional)"
                    type="email"
                    size="lg"
                    backgroundColor="#F4F6F9"
                    color="#353e49"
                    borderRadius="0.75rem"
                    borderSize="1px"
                    border
                    fontSize="1rem"
                    width={inputFieldWidth}
                    value={supplierEmail as string}
                    onChange={(e) =>
                      setSupplier({
                        ...supplier,
                        email: e.target.value,
                      })
                    }
                  />
                </Flex>

                <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                  <label htmlFor="">Address (Optional)</label>
                  <InputField
                    placeholder="Enter address (Optional)"
                    type="text"
                    size="lg"
                    backgroundColor="#F4F6F9"
                    color="#353e49"
                    borderRadius="0.75rem"
                    borderSize="1px"
                    border
                    fontSize="1rem"
                    width={inputFieldWidth}
                    value={supplierAddress as string}
                    onChange={(e) =>
                      setSupplier({
                        ...supplier,
                        address: e.target.value,
                      })
                    }
                  />
                </Flex>

                <FlexDiv
                  height="100%"
                  justifyContent="center"
                  alignItems="flex-end"
                  margin="6px 0"
                  width="100%"
                >
                  <button
                    style={{
                      backgroundColor: Colors.primaryColor,
                      outline: "none",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      width: "100%",
                      padding: "0.75rem 0",
                    }}
                    onClick={handleCreateNewSupplier}
                  >
                    Save
                  </button>
                </FlexDiv>
              </Flex>
            </Flex>
          ) : (
            <Flex
              height="100%"
              width="100%"
              justifyContent="space-between"
              alignItems="flex-start"
              padding="1.25rem 1.875rem"
              backgroundColor="linear-gradient(90deg, #F4F6F9 50%, white 50%);"
            >
              <Flex
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                padding="0 0px 0 0.625rem"
                height="auto"
                width="530px"
              >
                <Flex justifyContent="flex-start" alignItems="center" margin="0.625rem 0 1.25rem">
                  <Span fontSize="1.375rem" fontWeight="600">
                    Record Supplies
                  </Span>
                </Flex>

                <FlexDiv
                  justifyContent="flex-start"
                  alignItems="center"
                  padding="0.625rem 0px 0.625rem"
                  // borderBottom="1px solid #9EA8B7"
                  width="100%"
                  gap="0px 0.625rem"
                >
                  <UserImage height="3.75rem" src={preUserImage} alt="" />
                  <FlexDiv
                    justifyContent="center"
                    alignItems="flex-start"
                    padding="0.625rem 0px 1.25rem"
                    direction="column"
                    width="100%"
                  >
                    <Text
                      fontWeight="400"
                      fontSize="0.875rem"
                      color="#607087"
                      padding="0px 0px 0.625rem"
                    >
                      {`${supplierFirstName} ${supplierLastName}` || "Supplier name"}
                    </Text>
                    <Span fontSize="0.75rem" fontWeight="500" color={Colors.secondaryColor}>
                      {supplierPhone}
                    </Span>
                  </FlexDiv>
                </FlexDiv>

                <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                  <label htmlFor="">Starting Supplies (Optional)</label>

                  <Box
                    border="2px dashed #607087"
                    p="0.625rem"
                    borderRadius="0.875rem"
                    bgColor="#F4F6F9"
                  >
                    <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                      <CustomSearchDropdown style={{ width: "100%" }}>
                        <label>Product</label>
                        <InputContainer>
                          <input
                            type="text"
                            value={value}
                            placeholder="Search or select product"
                            onChange={(e) => handleSearchProduct(e)}
                            onClick={handleSearchClick}
                            style={{ backgroundColor: "#F4F6F9" }}
                          />
                          <div
                            className="image-container"
                            onClick={() => setShowDropDown(!showDropDown)}
                          >
                            <img src={dropIcon} alt="select product" />
                          </div>
                          {showDropDown && (
                            <>
                              <Options
                                className="options"
                                height="100%"
                                containerColor="#F4F6F9"
                                color="#8596b3"
                                borderRadius="0.5rem"
                                overflowY="scroll"
                              >
                                {filteredProducts.map((product) => {
                                  return (
                                    <button
                                      key={product?.inventoryName}
                                      onClick={() => {
                                        setProductSelected(product);
                                        setShowDropDown(!showDropDown);
                                        setSearchTerm(product?.inventoryName!);
                                      }}
                                    >
                                      {product.inventoryName}
                                    </button>
                                  );
                                })}
                              </Options>
                              <div
                                className="closeDiv"
                                onClick={() => setShowDropDown(false)}
                              ></div>
                            </>
                          )}
                        </InputContainer>
                      </CustomSearchDropdown>
                    </Flex>

                    <Flex gap="0 0.625rem" margin="2em 0 0 0">
                      <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                        <InputField
                          label="Enter quantity"
                          placeholder="Enter quantity"
                          type="text"
                          size="lg"
                          backgroundColor="#fff"
                          color="#353e49"
                          borderRadius="0.75rem"
                          borderSize="1px"
                          borderColor="#8196B3"
                          border
                          fontSize="1rem"
                          width="180px"
                          value={supplierQuantity}
                          onChange={(e) => validateInputNum(setSupplierQuantity, e.target.value)}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const key = e.key;
                            const isNumericKey = /^[0-9]$/.test(key);

                            if (!isNumericKey) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Flex>
                      <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                        <InputField
                          placeholder="Enter price"
                          label="Enter price"
                          type="text"
                          size="lg"
                          backgroundColor="#fff"
                          color="#353e49"
                          borderRadius="0.75rem"
                          borderSize="1px"
                          borderColor="#8196B3"
                          border
                          fontSize="1rem"
                          width="180px"
                          value={supplierPrice}
                          onChange={(e) => validateInputNum(setSupplierPrice, e.target.value)}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const key = e.key;
                            const isNumericKey = /^[0-9]$/.test(key);

                            if (!isNumericKey) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>

                <FlexDiv
                  height="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  margin="0.9375rem 0 6px"
                  width="100%"
                >
                  <button
                    style={{
                      backgroundColor: "#607087",
                      outline: "none",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      width: "46%",
                      padding: "0.75rem 0",
                    }}
                    onClick={handleClearInput}
                  >
                    Clear
                  </button>

                  <button
                    style={{
                      backgroundColor: "#219653",
                      outline: "none",
                      color: "#fff",
                      border: "none",
                      cursor:
                        productSelected?.inventoryId === undefined ||
                        Number(supplierQuantity) < 1 ||
                        Number(supplierPrice) < 1
                          ? "not-allowed"
                          : "pointer",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      width: "46%",
                      padding: "0.75rem 0",
                      opacity:
                        productSelected?.inventoryId === undefined ||
                        Number(supplierQuantity) < 1 ||
                        Number(supplierPrice) < 1
                          ? "0.4"
                          : "1",
                    }}
                    disabled={
                      productSelected?.inventoryId === undefined ||
                      Number(supplierQuantity) < 1 ||
                      Number(supplierPrice) < 1
                    }
                    onClick={handleSaveSupplies}
                  >
                    Add to List
                  </button>
                </FlexDiv>
              </Flex>
              <Flex
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                padding="0 0 0 2.5rem"
                height="auto"
              >
                <Flex justifyContent="flex-end" alignItems="center" margin="0 0 1.25rem">
                  <CancelModalButton
                    onClick={() => {
                      setShowModal(false);
                      setEditSupplier(false);
                      setShouldAddSupplies(false);
                    }}
                  >
                    <img src={cancelIcon} alt="" />
                  </CancelModalButton>
                </Flex>

                {/* list of added supplies */}
                {addedSupplies?.length > 0 ? (
                  <FlexDiv
                    height="310px"
                    overflow="scroll"
                    width="100%"
                    direction="column"
                    gap="0.625rem 0px"
                  >
                    {addedSupplies?.map((supplies) => (
                      <FlexDiv
                        direction="column"
                        bg="#F4F6F9"
                        borderRadius="0.75rem"
                        justifyContent="center"
                        alignItems="flex-start"
                        padding="0.625rem"
                        width="100%"
                        height="55px"
                        minHeight="55px"
                      >
                        <FlexDiv alignItems="center" margin="0 0 6px">
                          <Text fontSize="13px" fontWeight="400" color="#607087">
                            {supplies.product?.inventoryName}
                          </Text>
                        </FlexDiv>
                        <FlexDiv
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                          height="auto"
                        >
                          <FlexDiv alignItems="center" width="auto">
                            <Text fontSize="0.75rem" fontWeight="400" color="#9EA8B7">
                              Purchase Price:&nbsp;
                            </Text>
                            <Span fontSize="0.75rem" fontWeight="400" color="#607087">
                              {" "}
                              {formatAmountIntl(undefined, Number(supplies?.purchasePrice))}
                            </Span>
                          </FlexDiv>
                          <FlexDiv alignItems="center" width="auto">
                            <Text fontSize="0.75rem" fontWeight="400" color="#9EA8B7">
                              Quantity:&nbsp;
                            </Text>
                            <Span fontSize="0.75rem" fontWeight="400" color="#607087">
                              {" "}
                              {supplies?.quantity}
                            </Span>
                          </FlexDiv>
                          <FlexDiv
                            alignItems="center"
                            justifyContent="space-evenly"
                            width="auto"
                            gap="0px 0.625rem"
                          >
                            <Button
                              borderSize="0px"
                              borderColor="transparent"
                              backgroundColor="transparent"
                              margin="0px"
                              padding="0"
                              height="auto"
                              onClick={() => handleEditsupplies(supplies.product)}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M11.7482 3.25859C12.1685 3.59179 12.456 4.02998 12.5564 4.49337C12.6686 5.01067 12.5446 5.53566 12.208 5.96965L6.46747 13.3727C6.17729 13.7472 5.74098 13.9656 5.26936 13.9719L3.05458 13.9999H3.04835C2.80665 13.9999 2.5968 13.8319 2.54209 13.5939L2.04069 11.4142C1.93403 10.9501 2.0393 10.4692 2.33017 10.0947L3.08367 9.1224C3.26027 8.89421 3.58715 8.85361 3.81292 9.03351C4.03869 9.212 4.07817 9.5424 3.90088 9.77059L3.14738 10.7429C3.05181 10.8661 3.01718 11.0236 3.0525 11.1762L3.45903 12.9443L5.2562 12.9219C5.41064 12.9198 5.554 12.8484 5.64957 12.7252L11.3901 5.32216C11.5369 5.13316 11.5875 4.93017 11.5418 4.71737C11.4926 4.49267 11.3389 4.26798 11.1076 4.08528L10.1449 3.32159C9.77232 3.0276 9.24668 2.8764 8.88794 3.34049L8.12959 4.31768L9.33325 5.29346C9.55694 5.47406 9.59295 5.80515 9.41358 6.03055C9.31108 6.16075 9.16011 6.22795 9.00775 6.22795C8.89417 6.22795 8.77921 6.19015 8.68363 6.11245L7.48898 5.14436L5.52491 7.67763C5.34762 7.90582 5.02142 7.94712 4.79496 7.76652C4.56988 7.58803 4.53041 7.25763 4.70701 7.02944L8.07003 2.6923C8.72242 1.84951 9.86513 1.76692 10.7855 2.4956L11.7482 3.25859ZM9.06419 12.95H13.4806C13.7673 12.95 14 13.1852 14 13.475C14 13.7648 13.7673 14 13.4806 14H9.06419C8.77678 14 8.54478 13.7648 8.54478 13.475C8.54478 13.1852 8.77678 12.95 9.06419 12.95Z"
                                  fill="#130F26"
                                />
                              </svg>
                            </Button>
                            <Button
                              borderSize="0px"
                              borderColor="transparent"
                              backgroundColor="transparent"
                              margin="0px"
                              padding="0"
                              height="auto"
                              onClick={() => handleDeletesupplies(supplies.product)}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.8825 6.3125C12.8825 6.3125 12.5205 10.8025 12.3105 12.6938C12.2105 13.5972 11.6525 14.1265 10.7385 14.1432C8.99921 14.1745 7.25788 14.1765 5.51921 14.1398C4.63987 14.1218 4.09121 13.5858 3.99321 12.6985C3.78188 10.7905 3.42188 6.3125 3.42188 6.3125"
                                  stroke="#FF5050"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M13.8053 4.15951H2.5"
                                  stroke="#FF5050"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M11.6274 4.15998C11.104 4.15998 10.6534 3.78998 10.5507 3.27732L10.3887 2.46665C10.2887 2.09265 9.95004 1.83398 9.56404 1.83398H6.74204C6.35604 1.83398 6.01738 2.09265 5.91738 2.46665L5.75538 3.27732C5.65271 3.78998 5.20204 4.15998 4.67871 4.15998"
                                  stroke="#FF5050"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Button>
                          </FlexDiv>
                        </FlexDiv>
                      </FlexDiv>
                    ))}
                  </FlexDiv>
                ) : (
                  <TEmpty height="310px">
                    <img src={emptyfile} width="6.25rem" alt="empty-img" />
                    <h3>No Supply Input added</h3>
                    <p>Your inputed supply records will appear here</p>
                  </TEmpty>
                )}

                {addedSupplies?.length > 0 && (
                  <FlexDiv
                    height="100%"
                    justifyContent="center"
                    alignItems="flex-end"
                    margin="6px 0"
                    width="100%"
                  >
                    <button
                      style={{
                        backgroundColor: Colors.primaryColor,
                        outline: "none",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        width: "100%",
                        padding: "0.75rem 0",
                      }}
                      onClick={handleChangeStep}
                    >
                      Proceed
                    </button>
                  </FlexDiv>
                )}
              </Flex>
            </Flex>
          ))}
        {step === 2 && (
          <Flex
            height="100%"
            width="auto"
            justifyContent="space-between"
            alignItems="flex-start"
            backgroundColor="linear-gradient(90deg, #F4F6F9 50%, white 50%);"
          >
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
              borderRight="1px solid #F0F3F8"
              padding="1.25rem 0.625rem 1.25rem 1.25rem"
              width="420px"
            >
              <Flex justifyContent="flex-start" alignItems="center" margin="0.625rem 0 2.5rem">
                <Span fontSize="1.375rem" fontWeight="600">
                  Record Supplies
                </Span>
              </Flex>
              <FlexDiv
                justifyContent="center"
                alignItems="flex-start"
                padding="0.625rem 0px 1.25rem"
                // borderBottom="1px solid #9EA8B7"
                direction="column"
                width="100%"
              >
                <Text
                  fontWeight="400"
                  fontSize="0.875rem"
                  color="#607087"
                  padding="0px 0px 0.625rem"
                >
                  {`${supplierFirstName} ${supplierLastName}` || "Supplier name"}
                </Text>
                <Span fontSize="0.75rem" fontWeight="500" color={Colors.secondaryColor}>
                  {supplierPhone}
                </Span>
              </FlexDiv>
              <FlexDiv
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                padding="1.25rem 0 0 0"
                height="18.75rem"
                width="100%"
                overflow="scroll"
              >
                <ol style={{ paddingLeft: "1.25rem" }}>
                  {addedSupplies?.map((supplies) => (
                    <Flex flexDirection="column" gap="0.3125rem 0px" margin="0 0 0.625rem">
                      <li
                        style={{
                          lineHeight: "19px",
                          fontSize: "1rem",
                          fontWeight: 400,
                          color: "#607087",
                        }}
                      >
                        {supplies?.product?.inventoryName}
                      </li>
                      <FlexDiv justifyContent="space-between" alignItems="center" width="350px">
                        <Span fontSize="1rem" fontWeight="400" color="#9EA8B7">
                          Quantity: {supplies?.quantity}
                        </Span>
                        <Span fontSize="1rem" fontWeight="400" color="#9EA8B7">
                          {formatAmountIntl(
                            undefined,
                            Number(supplies?.purchasePrice) * Number(supplies?.quantity)
                          )}
                        </Span>
                      </FlexDiv>
                    </Flex>
                  ))}
                </ol>
              </FlexDiv>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              height="auto"
              padding="1.25rem 0.625rem 1.25rem 2.5rem"
              width="420px"
            >
              <Flex justifyContent="flex-end" alignItems="center" margin="0 0 1.25rem">
                <CancelModalButton onClick={handleCancelModal}>
                  <img src={cancelIcon} alt="" />
                </CancelModalButton>
              </Flex>

              <FlexDiv width="100%" direction="column" gap="0.625rem 0px">
                <FlexDiv
                  borderRadius="0.75rem"
                  justifyContent="justify-between"
                  alignItems="center"
                  padding="0.625rem"
                  width="100%"
                  height="55px"
                  minHeight="55px"
                  gap="0px 0.625rem"
                >
                  {paymentStatus?.map((status) => (
                    <label
                      key={status?.value}
                      htmlFor={status?.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "auto",
                        backgroundColor: selectedStatus === status?.value ? "#DBF9E8" : "#F4F6F9",
                        padding: "0.625rem",
                        borderRadius: "0.75rem",
                        gap: "0px 0.625rem",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedStatus(status?.value)}
                    >
                      <RadioInput
                        type="radio"
                        name="paymentStatus"
                        id={status?.value}
                        value={status?.value}
                        onChange={() => setSelectedStatus(status?.value)}
                        checked={selectedStatus === status?.value}
                      />
                      <Span
                        fontSize="13px"
                        fontWeight="400"
                        color={selectedStatus === status?.value ? "#219653" : "#607087"}
                      >
                        {status?.label}
                      </Span>
                    </label>
                  ))}
                </FlexDiv>

                {selectedStatus === "PARTLY_PAID" && (
                  <Flex justifyContent="space-between" alignItems="center" width="100%">
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                      width="47%"
                      height="2rem"
                    >
                      <label htmlFor="supplierName">Payment Method</label>
                      <select
                        value={selectedPaymentMethod}
                        style={{
                          backgroundColor: "#F4F6F9",
                          color: "#353e49",
                          borderRadius: "0.75rem",
                          padding: "0.5rem 0.625rem",
                          outline: "none",
                        }}
                        onChange={handleMethodSelect}
                      >
                        {paymentMethod?.map((method) => (
                          <option key={method?.value} value={method?.value}>
                            {method?.label}
                          </option>
                        ))}
                      </select>
                    </Flex>
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                      width="47%"
                    >
                      <label htmlFor="supplierName">Amount Deposited</label>
                      <InputField
                        placeholder="₦ 0.00"
                        type="text"
                        size="md"
                        backgroundColor="#F4F6F9"
                        color="#353e49"
                        borderRadius="0.75rem"
                        borderSize="1px"
                        borderColor="#8196B3"
                        border
                        width="90%"
                        fontSize="1rem"
                        value={depositedAmount}
                        onChange={(e) => validateInputNum(setDepositedAmount, e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          const key = e.key;
                          const isNumericKey = /^[0-9]$/.test(key);

                          if (!isNumericKey) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Flex>
                  </Flex>
                )}

                <Flex flexDirection="column" justifyContent="center" alignItems="flex-start">
                  <label htmlFor="">Comment (Optional)</label>
                  <TextArea
                    placeholder="comment (Optional)"
                    color="#353e49"
                    style={{ height: "120px" }}
                    value={supplierComment}
                    onChange={(e) => setSupplierComment(e.target.value)}
                  />
                </Flex>

                <FlexDiv direction="column" justifyContent="center" alignItems="flex-start">
                  <FlexDiv>
                    <label
                      htmlFor="addInventory"
                      style={{ display: "flex", alignItems: "center", gap: "0px 0.75rem" }}
                    >
                      <input
                        type="checkbox"
                        name="addInventory"
                        id="addInventory"
                        style={{ color: "#000" }}
                        checked={isMarkAsCollected}
                        onChange={() => setIsMarkAsCollected(!isMarkAsCollected)}
                      />
                      <Span fontSize="0.875rem" fontWeight="400" color="#607087">
                        Mark as Collected
                      </Span>
                    </label>
                  </FlexDiv>
                  <Span fontSize="0.875rem" fontWeight="400" color="#9EA8B7" margin="0 0 0.625rem">
                    Check to add collected items to supplies
                  </Span>
                </FlexDiv>
              </FlexDiv>

              <FlexDiv
                height="100%"
                justifyContent="space-between"
                alignItems="center"
                margin="6px 0"
                width="100%"
              >
                <button
                  style={{
                    backgroundColor: "#607087",
                    outline: "none",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    width: "48%",
                    padding: "0.75rem 0",
                  }}
                  onClick={() => setStep(1)}
                >
                  Back to Inputs
                </button>
                <button
                  style={{
                    backgroundColor: Colors.primaryColor,
                    outline: "none",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    width: "48%",
                    padding: "0.75rem 0",
                  }}
                  onClick={handleCreateSupplierRecord}
                >
                  Save Supplies
                </button>
              </FlexDiv>
            </Flex>
          </Flex>
        )}
      </ModalBox>
    </ModalContainer>
  );
};

export default AddNewSupplyModal;
