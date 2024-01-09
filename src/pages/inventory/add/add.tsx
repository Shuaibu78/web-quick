/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/button/Button";
import toggleOn from "../../../assets/toggleOn.svg";
import toggleOff from "../../../assets/toggleOff.svg";
import { Column, Container } from "./style";
import { ToggleButton } from "../../staffs/style";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_INVENTORY,
  GET_ALL_SHOP_INVENTORY_CATEGORY,
  UPDATE_INVENTORY,
} from "../../../schema/inventory.schema";
import {
  IInventory,
  IInventoryCategory,
  IInventoryImage,
} from "../../../interfaces/inventory.interface";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop, getShops, increaseSyncCount } from "../../../app/slices/shops";
import { isLoading } from "../../../app/slices/status";
import { useNavigate } from "react-router-dom";
import { ModalContainer } from "../../settings/style";
import NewCategory from "../new-category";
import { syncTotalTableCount } from "../../../helper/comparisons";
import { REMOVE_IMAGE, UPLOAD_IMAGE } from "../../../schema/image.schema";
import { IImage } from "../../../interfaces/image.interface";
import { upload, getImageUrl as getLocalImgUrl } from "../../../helper/image.helper";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { Colors } from "../../../GlobalStyles/theme";
import { getSingleInventory } from "../../../app/slices/inventory";
import {
  getInventoryCostPrice,
  getInventoryPrice,
  getInventoryType,
  getQuantity,
} from "../../../helper/inventory.helper";
import { getIsEdit } from "../../../app/slices/isEdit";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import TopNav from "../../../components/top-nav/top-nav";
import { headerContent, getBarcode } from "./addUtils";
import ProductInformation from "./productInformation";
import Quantities from "./quantities";
import ImageUpload from "./imageUpload";
import AdditionalOptions from "./additionalOptions";
import { getSessions } from "../../../app/slices/session";
import ConfirmAction from "../../../components/modal/confirmAction";
import { GET_FEATURE_COUNT } from "../../../schema/subscription.schema";
import { setFeatureCount } from "../../../app/slices/subscriptionslice";
import { allowDecimalMeasurementUnitList, validateMeasurementUnit } from "./measurementUnit";

export interface BulkOption {
  quantity: number;
  price: string;
}
export interface ProductVariation {
  [key: string]: string[];
}
export interface IVariationList {
  [key: string]: {
    quantity: string;
    price: string;
    cost: string;
    variationId?: string;
  };
}

const { blackLight, white, darkGreen, primaryColor } = Colors;
type ITab = "SINGLE" | "PACK" | "PIECES_AND_PACK" | "VARIATION";

const AddInventory = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [sellType, setSellType] = useState<number>(0);
  const [categoryOption, setCategoryOption] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [publish, setPublish] = useState(false);
  const [trackQuantity, setTrackQuantity] = useState(true);
  const [maxDiscount] = useState(false);
  const [bulkSales] = useState(false);
  const [lowAlert, setLowAlert] = useState(false);
  const [showProductVariation, setShowProductVariation] = useState(false);
  const [newVariationName, setNewVariationName] = useState("");
  const [newVariationOption, setNewVariationOption] = useState<string[]>([""]);
  const [productVariation, setProductVariation] = useState<ProductVariation>({});
  const [bulkOptions, setBulkOptions] = useState<BulkOption[]>([{ quantity: 0, price: "" }]);
  const [productName, setProductName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [lowAlertQuantity, setLowAlertQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantityInPacks, setQuantityInPacks] = useState("");
  const [quantityInPieces, setQuantityInPieces] = useState("");
  const [fixedUnitPrice, setFixedUnitPrice] = useState("");
  const [fixedPackPrice, setFixedPackPrice] = useState("");
  const [piecesCostPrice, setPiecesCostPrice] = useState("");
  const [packCostPrice, setPackCostPrice] = useState("");
  const [fixedSellingPrice, setFixedSellingPrice] = useState(false);
  const [perPack, setPerPack] = useState("");
  const [variationList, setVariationList] = useState<IVariationList>({});
  const [type, setType] = useState<"product" | "service">("product");
  const [spublish, setSpublish] = useState(false);
  const [serviceCharge, setServiceCharge] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [fixedServiceCharge, setFixedServiceCharge] = useState(false);
  const [images, setImages] = useState<(File | IInventoryImage)[] | []>([]);
  const [serviceImages, setServiceImages] = useState<File[] | []>([]);
  const [variationTypeList, setVariationTypeList] = useState<string[]>([]);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [selectedStore, setSelectedStore] = useState<number>();
  const [storeOptions, setStoreOptions] = useState<any[]>([]);
  const [sellInPP, setSellInPP] = useState<boolean>(sellType === 2);
  const [barcode, setBarcode] = useState<string>("");
  const [navBarHeight, setNavBarHeight] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<ITab>("SINGLE");
  const [batchNo, setBatchNo] = useState("");
  const [brand, setBrand] = useState("");
  const [weightType, setWeightType] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [returnPolicy, setReturnPolicy] = useState("");
  const [productDiscount, setProductDiscount] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState<{ label: string; value: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentShop = useAppSelector(getCurrentShop);

  const shops = useAppSelector(getShops);
  const currentInventory = useAppSelector(getSingleInventory);
  const { isEdit } = useAppSelector(getIsEdit);

  const sellTypeOption = [
    "Sell Single",
    "Sell in Pack",
    "Sell in Pieces & Pack",
    "Sell in Variation",
  ];

  useEffect(() => {
    if (isEdit) {
      const index = categories.findIndex(
        (cat) => cat.inventoryCategoryId === currentInventory.inventoryCategoryId
      );
      setSelectedCategory(index);
      const inventoryType = getInventoryType(currentInventory);
      const inventoryCostPrice = getInventoryCostPrice(currentInventory);
      const inventorySellingPrice = getInventoryPrice(currentInventory);
      const inventoryQuantity = getQuantity(currentInventory);
      const isPiecesAndPack = inventoryType === "PIECES_AND_PACK";

      const packPurchasedPrice = isPiecesAndPack
        ? inventoryCostPrice.pack
        : inventoryType !== "PACK"
        ? 0
        : inventoryCostPrice;
      const packSellingPrice = isPiecesAndPack
        ? inventorySellingPrice.pack
        : inventoryType !== "PACK"
        ? 0
        : inventorySellingPrice;
      const piecesPurchasedPrice = isPiecesAndPack
        ? inventoryCostPrice.pieces
        : inventoryType !== "PIECES"
        ? 0
        : inventoryCostPrice;
      const piecesSellingPrice = isPiecesAndPack
        ? inventorySellingPrice.pieces
        : inventoryType !== "PIECES"
        ? 0
        : inventorySellingPrice;
      const packQuantity = isPiecesAndPack
        ? inventoryQuantity.pack
        : inventoryType !== "PACK"
        ? 0
        : inventoryQuantity;
      const piecesQuantity = isPiecesAndPack
        ? inventoryQuantity.pieces
        : inventoryType !== "PIECES"
        ? 0
        : inventoryQuantity;

      const pack = currentInventory?.inventoryType === "PACK";
      const pieces = currentInventory?.inventoryType === "PIECES";
      const piecesAndPack = currentInventory?.inventoryType === "PIECES_AND_PACK";

      setSellType(pieces ? 0 : pack ? 1 : piecesAndPack ? 2 : 3);
      setPiecesCostPrice(piecesPurchasedPrice);
      setFixedUnitPrice(piecesSellingPrice);
      setPackCostPrice(packPurchasedPrice);
      setFixedPackPrice(packSellingPrice);
      setServiceCharge(getInventoryPrice(currentInventory) ?? "");
      setQuantityInPacks(packQuantity);
      setQuantityInPieces(piecesQuantity);
      setPublish(currentInventory.isPublished ?? false);
      setSpublish(currentInventory.isPublished ?? false);
      setTrackQuantity(currentInventory.trackable ?? true);
      setVariationTypeList(currentInventory?.Variations?.map((obj) => obj.variationName!)!);

      setImages(currentInventory?.Images!);

      setPerPack(String(currentInventory?.TrackableItem?.perPack) ?? "");
      setProductName(currentInventory.inventoryName ?? "");
      setServiceName(currentInventory.inventoryName ?? "");
      setType(currentInventory.trackable === false ? "service" : "product");
      setDescription(currentInventory.inventoryDescription ?? "");
      setLowAlert(currentInventory.isLowProductAlertEnabled ?? false);
      setLowAlertQuantity(String(currentInventory.TrackableItem?.lowAlertQuantity) ?? "");
      setShowProductVariation(currentInventory.isVariation ?? false);

      setBarcode(currentInventory?.barcode ?? "");
      setBatchNo(currentInventory?.batchNo ?? "");
      setReturnPolicy(currentInventory?.returnPolicy ?? "");
      setBrand(currentInventory?.brand ?? "");

      const list: IVariationList = {};
      const variations = currentInventory?.Variations;
      const variationQty = currentInventory?.InventoryQuantity;

      variations?.forEach((variation) => {
        const { variationId, price, cost, variationName } = variation;
        const quantity =
          variationQty?.find((qty) => qty.variationId === variationId)?.quantity ?? "0";
        list[variationName!] = {
          quantity: quantity.toString(),
          price: price!.toString(),
          cost: cost!.toString(),
          variationId,
        };
      });
      setVariationList(list);

      // TODO: Add variation name on the backend so it can be used here
      setNewVariationName("_");
    }
  }, [currentInventory, categories]);

  const [errorMessage, setErrorMessage] = useState({
    nameError: "",
    priceError: "",
  });

  const [uploadImage] = useMutation<{ uploadImage: IImage }>(UPLOAD_IMAGE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const [createInventory] = useMutation<{ createInventory: IInventory }>(CREATE_INVENTORY, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const [updateInventory] = useMutation<{ updateInventory: IInventory }>(UPDATE_INVENTORY, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const { refetch: refetchFeatureCount } = useQuery<{
    getFeatureCount: { inventoriesCount: number; debtCount: number };
  }>(GET_FEATURE_COUNT, {
    variables: {
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "cache-and-network",
    onCompleted(arrData) {
      dispatch(setFeatureCount(arrData?.getFeatureCount ?? {}));
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  // const [trackable, setTrackable] = useState<ITrackableItem>({});

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["InventoryCategory"])
  );

  const [getAllInventoryCategory, { data, refetch }] = useLazyQuery<{
    getAllShopInventoryCategory: [IInventoryCategory];
  }>(GET_ALL_SHOP_INVENTORY_CATEGORY, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  // const { data: productImageSearchData } = useQuery(PRODUCT_IMAGE_SEARCH, {
  //   variables: {
  //     searchQuery: productName,
  //   },
  //   skip: !productName,
  //   onError(error) {
  //     dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
  //   },
  // });

  useEffect(() => {
    getAllInventoryCategory();
  }, [syncTableUpdateCount]);

  const handleAddBulkPrice = () => {
    setBulkOptions((prevBulkOption: BulkOption[]) => {
      const copyOfOldBulkOption = [...prevBulkOption];
      copyOfOldBulkOption.push({
        quantity: 0,
        price: "",
      });
      return copyOfOldBulkOption;
    });
  };

  const updateBulkOption = (
    index: number,
    property: "quantity" | "price",
    value: string | number
  ) => {
    setBulkOptions((prevBulkOption: BulkOption[]) => {
      const copyOfOldBulkOption = [...prevBulkOption];
      if (typeof value === "number" && property === "price") {
        copyOfOldBulkOption[index].quantity = value;
      } else if (property === "price" && typeof value === "string") {
        copyOfOldBulkOption[index].price = value;
      }

      return copyOfOldBulkOption;
    });
  };

  const handleBulkOptionDelete = (index: number) => {
    setBulkOptions((prevBulkOption: BulkOption[]) => {
      if (prevBulkOption.length > 1) {
        const copyOfOldBulkOption = [...prevBulkOption];
        copyOfOldBulkOption.splice(index, 1);
        return copyOfOldBulkOption;
      } else {
        return prevBulkOption;
      }
    });
  };

  const resetAddVariationField = () => {
    setNewVariationName("");
    setNewVariationOption([""]);
  };

  const saveNewVariation = () => {
    setProductVariation((oldVariation) => {
      let copyOfOldVariation = { ...oldVariation };
      if (newVariationName) {
        copyOfOldVariation = { ...copyOfOldVariation, [newVariationName]: newVariationOption };
        return copyOfOldVariation;
      } else {
        return copyOfOldVariation;
      }
    });
    resetAddVariationField();
  };

  const addNewOptionField = () => {
    setNewVariationOption((oldOption) => {
      const copyOfOldOption: string[] = [...oldOption];
      copyOfOldOption.push("");
      return copyOfOldOption;
    });
  };

  const updateVariationOption = (index: number, value: string) => {
    setNewVariationOption((oldOption) => {
      const copyOfOldOption: string[] = [...oldOption];
      copyOfOldOption[index] = value;
      return copyOfOldOption;
    });
  };

  const deleteVariation = (key: string) => {
    setProductVariation((oldVariation) => {
      const copyOfOldVariation = { ...oldVariation };
      delete copyOfOldVariation[key];
      return copyOfOldVariation;
    });
  };

  const deleteVariationOption = (index: number, key: string, option?: string) => {
    setProductVariation((oldVariation) => {
      if (oldVariation[key].length > 1) {
        const copyOfOldVariation = { ...oldVariation };
        const optionCopy = [...copyOfOldVariation[key]];
        optionCopy.splice(index, 1);
        copyOfOldVariation[key] = optionCopy;
        return copyOfOldVariation;
      } else {
        return oldVariation;
      }
    });

    setVariationList((oldVarList) => {
      const copyOfOld: IVariationList = JSON.parse(JSON.stringify(oldVarList));
      delete copyOfOld[`${key}-${option}`];
      return copyOfOld;
    });
  };

  const editVariation = (key: string) => {
    setNewVariationName(key);
    setNewVariationOption(productVariation[key]);
  };

  const generateVariation = () => {
    const variationsTypeAndOptionsInput: any = [];
    Object.keys(productVariation).forEach((val) => {
      variationsTypeAndOptionsInput.push({
        type: val,
        options: productVariation[val],
      });
    });
    return variationsTypeAndOptionsInput;
  };

  const generateVariationList = () => {
    const variationsListGenerated: any = [];
    Object.keys(variationList).forEach((val) => {
      variationsListGenerated.push({
        variationName: val,
        price: Number(variationList[val].price),
        cost: Number(variationList[val].cost),
        variationQuantity: Number(variationList[val].quantity),
        quantity: Number(variationList[val].quantity),
        variationId: variationList[val].variationId as string,
      });
    });
    return variationsListGenerated;
  };

  generateVariationList();

  useEffect(() => {
    if (data) {
      const dataCategoryOpt: string[] = [];
      data.getAllShopInventoryCategory.forEach((val) => {
        dataCategoryOpt.push(val?.inventorycategoryName!);
      });
      setCategoryOption(dataCategoryOpt);
      setCategories(data.getAllShopInventoryCategory);
    }
  }, [data]);

  const handleSetErrorMessage = (
    field: "nameError" | "priceError" | "variationError",
    message: string
  ) => {
    setErrorMessage((prev) => {
      const copyOfPrev = JSON.parse(JSON.stringify(prev));
      copyOfPrev[field] = message;
      return copyOfPrev;
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage({
        nameError: "",
        priceError: "",
      });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const sessions = useAppSelector(getSessions);
  const token = sessions.session.token;

  const handleInventoryCreation = (update: boolean) => {
    dispatch(isLoading(true));

    if (!update) {
      createInventory({
        variables: {
          inventoryName: productName,
          shopId: currentShop?.shopId,
          quantityInPacks: Number(quantityInPacks),
          quantityInPieces: Number(quantityInPieces),
          isVariation: !!Object.keys(productVariation).length,
          trackable: trackQuantity,
          piecesCostPrice: Number(piecesCostPrice),
          packCostPrice: Number(packCostPrice),
          fixedUnitPrice: Number(fixedUnitPrice),
          fixedPackPrice: Number(fixedPackPrice),
          perPack: Number(perPack),
          discountEnabled: maxDiscount,
          isPack: sellType === 2 ? true : sellType === 1,
          isPieces: sellType === 2 ? true : sellType === 0,
          inventoryCategoryId: categories[selectedCategory]?.inventoryCategoryId,
          inventoryId: currentInventory?.inventoryId,
          inventoryDescription: description,
          isPublished: publish,
          costPrice: Number(costPrice),
          sellingPrice: Number(sellingPrice),
          fixedSellingPrice: fixedSellingPrice,
          variationTypesAndOptions: generateVariation(),
          variationsList: generateVariationList(),
          lowAlertQuantity: Number(lowAlertQuantity),
          isLowProductAlertEnabled: lowAlert,
          batchNo: null,
          barcode,
          brand,
          returnPolicy,
          measurementUnitPack:
            sellTypeOption[sellType] === "Sell in Pack" ? measurementUnit?.value : "",
          measurementUnitPieces:
            sellTypeOption[sellType] === "Sell Single" ? measurementUnit?.value : "",
        },
      })
        .then(async (res) => {
          if (res.data) {
            if (images && images.length > 0) {
              const imgData = {
                key: "inventoryId",
                id: res?.data?.createInventory?.inventoryId,
                shopId: currentShop?.shopId,
              };
              const uploadedImages = await upload({
                files: images,
                key: imgData?.key,
                id: imgData?.id as string,
                shopId: imgData?.shopId || "",
                token,
              });

              if (!uploadedImages.success) {
                console.log("Unable to upload inventory image(s)");
              }
            }
            dispatch(
              increaseSyncCount([
                "Sales",
                "Inventory",
                "TrackableItems",
                "NonTrackableItems",
                "Supplies",
                "InventoryQuantity",
              ])
            );
            refetchFeatureCount();
            dispatch(isLoading(false));
            navigate("/dashboard/product");
            dispatch(toggleSnackbarOpen("Successfully Added"));
          }
        })
        .catch((error) => {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        });
    } else {
      updateInventory({
        variables: {
          inventoryName: type === "service" ? serviceName : productName,
          shopId: currentShop?.shopId,
          quantityInPacks: Number(quantityInPacks),
          quantityInPieces: Number(quantityInPieces),
          trackable: trackQuantity,
          piecesCostPrice: Number(piecesCostPrice),
          packCostPrice: Number(packCostPrice),
          fixedUnitPrice: Number(fixedUnitPrice),
          fixedPackPrice: Number(fixedPackPrice),
          perPack: Number(perPack),
          discountEnabled: maxDiscount,
          isPack: sellType === 1,
          isPieces: sellType === 0,
          inventoryCategoryId: categories[selectedCategory]?.inventoryCategoryId,
          inventoryId: currentInventory?.inventoryId,
          inventoryDescription: description,
          isPublished: type === "service" ? spublish : publish,
          costPrice: Number(costPrice),
          sellingPrice: Number(type === "service" ? serviceCharge : sellingPrice),
          fixedSellingPrice: fixedSellingPrice,
          isVariation: currentInventory.isVariation,
          lowAlertQuantity: Number(lowAlertQuantity),
          variationsList: generateVariationList(),
          isLowProductAlertEnabled: lowAlert,
          barcode,
          batchNo,
          brand,
          returnPolicy,
          measurementUnitPack:
            sellTypeOption[sellType] === "Sell in Pack" ? measurementUnit?.value : "",
          measurementUnitPieces:
            sellTypeOption[sellType] === "Sell Single" ? measurementUnit?.value : "",
        },
      })
        .then(async (res) => {
          if (res.data) {
            if (images && images.length > 0) {
              const imgData = {
                key: "inventoryId",
                id: res?.data?.updateInventory?.inventoryId,
                shopId: currentShop?.shopId,
              };
              const uploadedImages = await upload({
                files: images,
                key: imgData?.key,
                id: imgData?.id as string,
                shopId: imgData?.shopId || "",
                token,
              });

              if (!uploadedImages.success) {
                console.log("Unable to upload inventory image(s)");
              }
            }
            refetchFeatureCount();
            dispatch(isLoading(false));
            dispatch(toggleSnackbarOpen("Successfully Updated"));
            navigate("/dashboard/product");
            refetch();
          }
        })
        .catch((error) => {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        });
    }
  };
  const [toggleConfirmAction, setToggleConfirmAction] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, update: boolean = false) => {
    e.preventDefault();

    setErrorMessage({
      nameError: "",
      priceError: "",
    });

    if (productName === "") {
      handleSetErrorMessage("nameError", "Enter product name");
      return;
    }
    if (Number(costPrice) > Number(sellingPrice)) {
      setToggleConfirmAction(true);
      dispatch(toggleSnackbarOpen("Please ensure cost price and selling price are correct"));
      return;
    }
    if (sellType === 0) {
      if (!fixedUnitPrice) {
        handleSetErrorMessage("priceError", "Enter product price");
        return;
      }
      if (Number(piecesCostPrice) > Number(fixedUnitPrice)) {
        setToggleConfirmAction(true);
        return;
      }
      const validated = validateMeasurementUnit(quantityInPieces, measurementUnit?.value as string);
      if (!validated) {
        dispatch(
          toggleSnackbarOpen({
            message:
              "The selected measurement unit does not accept decimal or fractional quantities, you can select either grams, Kilograms, yard, centimetre and litre",
            color: "INFO",
          })
        );
        return;
      }
    }
    if (sellType === 1) {
      if (!perPack || !fixedPackPrice || !packCostPrice) {
        handleSetErrorMessage("priceError", "Enter product price");
      }
      if (Number(packCostPrice) > Number(fixedPackPrice)) {
        setToggleConfirmAction(true);
        return;
      }
      const validated = validateMeasurementUnit(quantityInPacks, measurementUnit?.value as string);
      if (!validated) {
        dispatch(
          toggleSnackbarOpen({
            message:
              "The selected measurement unit does not accept decimal or fractional quantities, you can select either grams, Kilograms, yard, centimetre and litre",
            color: "INFO",
          })
        );
        return;
      }
    }

    if (errorMessage.priceError || errorMessage.nameError) {
      dispatch(toggleSnackbarOpen("please fill the required fields"));
      return;
    } else if (sellType === 1) {
      if (!quantityInPacks || !perPack) {
        dispatch(toggleSnackbarOpen("please fill the required fields"));
        return;
      }
    }

    if (sellType === 2) {
      if (Number(piecesCostPrice) > Number(fixedUnitPrice)) {
        setToggleConfirmAction(true);
        return;
      }
      if (Number(packCostPrice) > Number(fixedPackPrice)) {
        setToggleConfirmAction(true);
        return;
      }
    }

    if (sellTypeOption[sellType] === "Sell in Variation") {
      if (newVariationName && variationTypeList.length <= 0) {
        handleSetErrorMessage(
          "variationError",
          "Variation name is required for variation products"
        );
        dispatch(
          toggleSnackbarOpen(
            "Variation name and Variation type list is required for variation products"
          )
        );
        return;
      } else if (variationTypeList.length < 1) {
        handleSetErrorMessage("priceError", "Please fill all required fields");
        dispatch(toggleSnackbarOpen("Please fill all required fields"));
        return;
      } else if (variationTypeList.length > 0) {
        let isError = false;
        variationTypeList?.forEach((val) => {
          if (Number(variationList[val]?.cost) > Number(variationList[val]?.price)) {
            setToggleConfirmAction(true);
            isError = true;
          } else if (Number(variationList[val]?.quantity) <= 0) {
            handleSetErrorMessage("priceError", "Variant quantity cannot be less than 0");
            dispatch(toggleSnackbarOpen("Variant quantity cannot be less than 0"));
            isError = true;
          } else if (!Number(variationList[val]?.price)) {
            handleSetErrorMessage("priceError", "Please fill all required fields");
            dispatch(toggleSnackbarOpen("Please fill all required fields"));
            isError = true;
          }
        });
        if (isError) {
          return;
        }
      }
    }

    handleInventoryCreation(update);
  };

  const validateInputNum = (
    setNumVal: React.Dispatch<React.SetStateAction<string>>,
    val: string
  ) => {
    const newVal = val.replace(/[^0-9]/g, "");

    if (newVal === "") {
      setNumVal("");
      return;
    }
    if (!isNaN(parseInt(newVal))) {
      setNumVal(newVal);
    }
  };

  const changeVariationPrice = (variationName: string, price: string) => {
    setVariationList((oldVarList: IVariationList) => {
      const copyOfOld: IVariationList = JSON.parse(JSON.stringify(oldVarList));
      if (copyOfOld[variationName]) {
        if (price === "") {
          copyOfOld[variationName].price = "";
        }
        if (Number(price)) {
          copyOfOld[variationName].price = price;
        }
      } else {
        copyOfOld[variationName] = {
          price: "",
          quantity: "",
          cost: "",
        };
        if (price === "") {
          copyOfOld[variationName].price = "";
        }
        if (Number(price)) {
          copyOfOld[variationName].price = price;
        }
      }
      return copyOfOld;
    });
  };

  const changeVariationQuantity = (variationName: string, quantity: string) => {
    setVariationList((oldVarList: IVariationList) => {
      const copyOfOld: IVariationList = JSON.parse(JSON.stringify(oldVarList));
      if (copyOfOld[variationName]) {
        if (quantity === "") {
          copyOfOld[variationName].quantity = "";
        }
        if (Number(quantity) || quantity === "0") {
          copyOfOld[variationName].quantity = quantity;
        }
      } else {
        copyOfOld[variationName] = {
          price: "",
          quantity: "",
          cost: "",
        };
        if (quantity === "") {
          copyOfOld[variationName].quantity = "";
        }
        if (Number(quantity) || quantity === "0") {
          copyOfOld[variationName].quantity = quantity;
        }
      }
      return copyOfOld;
    });
  };

  const changeVariationCost = (variationName: string, cost: string) => {
    setVariationList((oldVarList: IVariationList) => {
      const copyOfOld: IVariationList = JSON.parse(JSON.stringify(oldVarList));
      if (copyOfOld[variationName]) {
        if (cost === "") {
          copyOfOld[variationName].cost = "";
        }
        if (Number(cost)) {
          copyOfOld[variationName].cost = cost;
        }
      } else {
        copyOfOld[variationName] = {
          price: "",
          quantity: "",
          cost: "",
        };
        if (cost === "") {
          copyOfOld[variationName].cost = "";
        }
        if (Number(cost)) {
          copyOfOld[variationName].cost = cost;
        }
      }
      return copyOfOld;
    });
  };

  const handleImageUpload = (file: File | undefined) => {
    if (images.length === 4) return;
    setImages((oldImageList) => {
      const copyOldImageList = [...oldImageList];
      if (file) {
        copyOldImageList.push(file);
      }
      return copyOldImageList;
    });
  };

  const handleServiceImageUpload = (file: File | undefined) => {
    if (images.length === 4) return;
    setServiceImages((oldImageList) => {
      const copyOldImageList = [...oldImageList];
      if (file) {
        copyOldImageList.push(file);
      }
      return copyOldImageList;
    });
  };

  const getImageUrl = (index: number) => {
    if (!images[index]) return "";
    if (images[index] instanceof File) {
      return URL.createObjectURL(images[index] as File);
    } else {
      return getLocalImgUrl(images[index] as IInventoryImage);
    }
  };

  const getServiceImageUrl = (index: number) => {
    if (!serviceImages[index]) return "";
    return URL.createObjectURL(serviceImages[index]);
  };

  const handleCreateService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!serviceName && !serviceCharge) return;
    dispatch(isLoading(true));
    createInventory({
      variables: {
        inventoryName: serviceName,
        shopId: currentShop?.shopId,
        trackable: false,
        isPublished: spublish,
        // fixedSellingPrice: fixedServiceCharge,
        costPrice: 0,
        isPack: false,
        sellingPrice: Number(serviceCharge),
      },
    })
      .then((res) => {
        if (res.data) {
          dispatch(isLoading(false));
          navigate("/dashboard/product");
          dispatch(toggleSnackbarOpen("Successful"));
        }
      })
      .catch((error) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  useEffect(() => {
    const list: any = [];
    let parsedList: any = [];
    if (Object.keys(productVariation).length > 0) {
      Object.keys(productVariation).forEach((val) => {
        list.push(productVariation[val]);
      });
      if (list.length === 1) {
        parsedList = list[0];
        setVariationTypeList(parsedList);
      } else if (list.length > 1) {
        const position: { [key: number]: number } = {};
        for (let i = 0; i < list.length; i++) {
          position[i] = 0;
        }
        const touchedAllElement = () => {
          let allTouched = true;
          if (position[0] === list[0].length) {
            allTouched = false;
          }
          return allTouched;
        };
        while (touchedAllElement()) {
          const currentPosition = JSON.parse(JSON.stringify(position));
          let parsedName = "";
          for (let i = 0; i < list.length; i++) {
            if (parsedName === "") {
              if (currentPosition[i] === list[i].length) {
                parsedName += list[i][currentPosition[i] - 1];
              } else {
                parsedName += list[i][currentPosition[i]];
              }
            } else {
              if (currentPosition[i] === list[i].length) {
                parsedName += `/${list[i][currentPosition[i] - 1]}`;
              } else {
                parsedName += `/${list[i][currentPosition[i]]}`;
              }
            }
            if (i < list.length - 1) {
              if (position[i] === list[i].length && i > 0) {
                if ((!!position[i + 1] && position[i + 1] === 0) || !position[i + 1]) {
                  position[i - 1] += 1;
                  position[i] = 0;
                }
              }
            } else {
              if (position[i] === list[i].length && i > 0) {
                position[i - 1] += 1;
                position[i] = 0;
              } else {
                position[i] += 1;
              }
            }
          }
          if (!parsedList.includes(parsedName)) {
            parsedList.push(parsedName);
          }
        }

        setVariationTypeList(parsedList);
      }
    } else {
      setVariationTypeList([]);
    }
  }, [productVariation]);

  useEffect(() => {
    const options: any[] = [];
    shops.forEach((val: any) => {
      options.push(val.shopName);
    });
    setStoreOptions(options);
    if (currentShop) {
      const currentShopIndex = shops.findIndex((val) => val.shopId === currentShop.shopId);
      setSelectedStore(currentShopIndex === -1 ? 0 : currentShopIndex);
    }
  }, [shops, currentShop]);

  const resetInputs = () => {
    setSelectedCategory(-1);
    setPublish(false);
    setLowAlert(false);
    setShowProductVariation(false);
    setNewVariationName("");
    setProductName("");
    setDescription("");
    setCostPrice("");
    setSellingPrice("");
    setQuantityInPacks("");
    setQuantityInPieces("");
    setFixedUnitPrice("");
    setFixedPackPrice("");
    setPiecesCostPrice("");
    setPackCostPrice("");
    setPerPack("");
    setServiceCharge("");
    setServiceName("");
    setCategories([]);
    setCategoryOption([]);
    setVariationList({});
    setVariationTypeList([]);
    setType("product");
    setImages([]);
    setServiceImages([]);
    setFixedServiceCharge(false);
    setSpublish(false);
    setLowAlertQuantity("");
    setNewVariationName("");
    setNewVariationOption([""]);
    setBarcode("");
    setBrand("");
    setBatchNo("");
  };

  const [removeImage] = useLazyQuery(REMOVE_IMAGE);

  function handleImageDelete(productType: string, index: number) {
    if (productType === "product") {
      const image = images.find((img, idx) => idx === index);
      console.log(image);
      if (images[index] instanceof File) {
        console.log("deleteing Image State");
      } else {
        removeImage({
          variables: {
            imageId: (image as IInventoryImage).imageId as string,
          },
        });
      }
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages.splice(index, 1);
        return newImages;
      });
    } else {
      const image = serviceImages.find((img, idx) => idx === index);
      if (images[index] instanceof File) {
        console.log("deleteing Image State");
      } else {
        removeImage({
          variables: {
            imageId: (image as IInventoryImage).imageId as string,
          },
        });
      }
      setServiceImages((prevServiceImages) => {
        const newServiceImages = [...prevServiceImages];
        newServiceImages.splice(index, 1);
        return newServiceImages;
      });
    }

    const productFileInput = document.getElementById("add-i-1") as HTMLInputElement;
    const serviceFileInput = document.getElementById("add-i-2") as HTMLInputElement;
    if (productFileInput) {
      productFileInput.value = "";
    }
    if (serviceFileInput) {
      serviceFileInput.value = "";
    }
  }

  function handleOnlinePresence() {
    if (currentShop.isPublished) {
      type === "product" ? setPublish(!publish) : setSpublish(!spublish);
    } else {
      dispatch(
        toggleSnackbarOpen(
          "You can't do this for now, First click on 'Settings', then 'Business Settings', and activate 'Online Presence'"
        )
      );
    }
  }

  useEffect(() => {
    if (sellType !== 2) {
      setSellInPP(false);
    }
    if (sellType === 2) {
      setSellInPP(true);
    }
    if (sellType === 3) {
      setSellInPP(false);
    }
  }, [sellType]);

  const updateBarcode = (keys: string) => {
    setBarcode(keys);
  };

  useEffect(() => {
    const barcodeListener = getBarcode(updateBarcode);
    document.body.addEventListener("keydown", barcodeListener, true);

    return () => document.body.removeEventListener("keydown", barcodeListener, true);
  }, []);

  const removeVariationOption = (i: number) => {
    if (newVariationOption.length === 1) return;

    const newOptions = newVariationOption.filter((_, index) => {
      return index !== i;
    });
    setNewVariationOption(newOptions);
  };

  return (
    <div>
      <TopNav
        header="Back to Products"
        setNavBarHeight={setNavBarHeight}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSellType={setSellType}
        type={type}
      />

      {showCreateCategory && (
        <ModalContainer>
          <NewCategory setShowModal={setShowCreateCategory} refetch={refetch} />
        </ModalContainer>
      )}
      <Container navBarHeight={navBarHeight}>
        <Flex width="100%" alignItems="center" justifyContent="space-between">
          <Flex width="66%" height="3.125rem">
            {headerContent(activeTab, type)}
          </Flex>
          <Flex
            width="33%"
            alignItems="center"
            justifyContent="space-between"
            gap="1rem"
            alignSelf="end"
          >
            <Button
              label="Clear Inputs"
              type="button"
              height="2.5rem"
              width="100%"
              backgroundColor={primaryColor}
              size="lg"
              color={white}
              border={true}
              borderColor={primaryColor}
              borderRadius="0.75rem"
              borderSize="2px"
              fontSize="0.875rem"
              onClick={resetInputs}
            />
            <Button
              label={isEdit ? "Update Product" : "Save Product"}
              type="submit"
              height="2.5rem"
              width="100%"
              backgroundColor={darkGreen}
              size="lg"
              color={white}
              borderColor={darkGreen}
              borderRadius="0.75rem"
              borderSize="1px"
              fontSize="0.875rem"
              onClick={(e: React.FormEvent<HTMLFormElement>) =>
                type === "service" && !isEdit ? handleCreateService(e) : handleSubmit(e, isEdit)
              }
            />
          </Flex>
        </Flex>
        <Flex className="body" width="100%" height="100%">
          <Column navBarHeight={navBarHeight}>
            <Span className="title">{type === "product" ? "Product" : "Service"} Information</Span>
            <Flex direction="column" width="100%" className="column-body">
              <ProductInformation
                {...{
                  type,
                  errorMessage,
                  productName,
                  setProductName,
                  selectedCategory,
                  setSelectedCategory,
                  categoryOption,
                  setShowCreateCategory,
                  serviceName,
                  setServiceName,
                  serviceCharge,
                  setServiceCharge,
                  validateInputNum,
                  barcode,
                  batchNo,
                  brand,
                  setBatchNo,
                  setBrand,
                  setBarcode,
                  description,
                  setDescription,
                }}
              />
            </Flex>
          </Column>
          <Column navBarHeight={navBarHeight}>
            <Flex alignItems="center" justifyContent="flex-start" gap="2rem">
              <Span>
                <ToggleButton
                  height="auto"
                  style={{ opacity: isEdit ? "0.3" : 1 }}
                  disabled={isEdit}
                  onClick={() => {
                    if (type === "product") {
                      setType("service");
                    } else {
                      setType("product");
                    }
                  }}
                >
                  <img src={type === "product" ? toggleOn : toggleOff} alt="" />
                </ToggleButton>
              </Span>
              <span className="title">Add product with quantity</span>
            </Flex>
            <Flex direction="column" width="100%" className="column-body">
              <Quantities
                {...{
                  type,
                  trackQuantity,
                  sellType,
                  setSellType,
                  sellTypeOption,
                  newVariationName,
                  setNewVariationName,
                  newVariationOption,
                  updateVariationOption,
                  addNewOptionField,
                  productVariation,
                  saveNewVariation,
                  variationList,
                  variationTypeList,
                  deleteVariationOption,
                  deleteVariation,
                  editVariation,
                  setPiecesCostPrice,
                  piecesCostPrice,
                  sellInPP,
                  errorMessage,
                  showProductVariation,
                  changeVariationQuantity,
                  changeVariationPrice,
                  changeVariationCost,
                  perPack,
                  setPerPack,
                  setFixedPackPrice,
                  fixedPackPrice,
                  setPackCostPrice,
                  packCostPrice,
                  setQuantityInPieces,
                  quantityInPieces,
                  setFixedUnitPrice,
                  validateInputNum,
                  fixedUnitPrice,
                  fixedSellingPrice,
                  setFixedSellingPrice,
                  setSellingPrice,
                  sellingPrice,
                  setCostPrice,
                  costPrice,
                  setQuantityInPacks,
                  quantityInPacks,
                  handleAddBulkPrice,
                  handleBulkOptionDelete,
                  updateBulkOption,
                  bulkOptions,
                  bulkSales,
                  removeVariationOption,
                  setMeasurementUnit,
                  measurementUnit,
                }}
              />
              <ImageUpload
                {...{
                  type,
                  handleImageUpload,
                  images,
                  handleImageDelete,
                  getImageUrl,
                  getServiceImageUrl,
                  serviceImages,
                  handleServiceImageUpload,
                  // productImageSearchData,
                  productName,
                }}
              />
            </Flex>
          </Column>
          <Column navBarHeight={navBarHeight}>
            <Span className="title">Additional Options</Span>
            <Flex direction="column" width="100%" className="column-body">
              <AdditionalOptions
                {...{
                  sellTypeOption,
                  sellType,
                  type,
                  publish,
                  handleOnlinePresence,
                  lowAlertQuantity,
                  errorMessage,
                  setLowAlert,
                  lowAlert,
                  setIsFocused,
                  setDescription,
                  description,
                  isFocused,
                  setWeightType,
                  weightType,
                  spublish,
                  fixedServiceCharge,
                  setFixedServiceCharge,
                  setLowAlertQuantity,
                  setProductDiscount,
                  productDiscount,
                  setReturnPolicy,
                  returnPolicy,
                }}
              />
            </Flex>
          </Column>
        </Flex>
      </Container>
      {toggleConfirmAction && (
        <ConfirmAction
          action="Continue"
          actionText="Purchase price should not be greater than selling price. Going forward, this would affect the computation of profit."
          doAction={handleInventoryCreation}
          setConfirmSignout={setToggleConfirmAction}
        />
      )}
    </div>
  );
};

export default AddInventory;
