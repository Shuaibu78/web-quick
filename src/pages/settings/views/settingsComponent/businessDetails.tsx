import { Flex } from "../../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../../GlobalStyles/theme";
import { SalesCard } from "../../../home/style";
import { BoxHeading, ButtonPlusIcon, ShopTitleCont } from "../../settingsComps.style";
import DefaultSettingsImg from "../../../../assets/Image.svg";
import DeleteShopIcon from "../../../../assets/DeleteShopIcon.svg";
import SalesCardSpiralBg from "../../../../assets/SalesCardSpiralBg.svg";
import Edit from "../../../../assets/Edit.svg";
import Close from "../../../../assets/cancel.svg";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import {
  getCurrentShop,
  increaseSyncCount,
  setCurrentShop,
  setShops,
} from "../../../../app/slices/shops";
import CustomRadioInputWrapper from "../../../../components/customRadioInput/radioInputWrapper";
import { GET_ALL_SHOPS, GET_SHOP, GET_SHOP_CATEGORIES, UPDATE_SHOP } from "../../../../schema/shops.schema";
import { IShop } from "../../../../interfaces/shop.interface";
import { CountryAttr } from "../../sub-page/business";
import { useMutation, useQuery, gql, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { isLoading } from "../../../../app/slices/status";
import { ModalBox, ModalContainer } from "../../style";
import { InputField } from "../../../../components/input-field/input";
import PopupCard from "../../../../components/popUp/PopupCard";
import DeleteModal from "../../../../components/modal/deleteShopModal";
import { getUserPermissions } from "../../../../app/slices/roles";
import { getCurrentUser } from "../../../../app/slices/userInfo";
import { setShowSelectShop } from "../../../../app/slices/accountLock";
import { useNavigate } from "react-router-dom";
import ConfirmAction from "../../../../components/modal/confirmAction";
import {
  GET_SHOP_OFFLINE_ORDER_STATUS,
  UPDATE_SHOP_OFFLINE_ORDER_STATUS,
} from "../../../../schema/orders.schema";
import CustomConfirm from "../../../../components/confirmComponent/cofirmComponent";
import { syncTotalTableCount } from "../../../../helper/comparisons";
import EditBizDetails from "../../modal/editBusinessDetails";
import { currencyList } from "../../../../utils/helper.utils";
import { upload, getImageUrl as getLocalImageUrl } from "../../../../helper/image.helper";
import { getSessions, setSession } from "../../../../app/slices/session";
import { toggleMustMakeSaleWithCashier } from "../../../../app/slices/shopPreferences";
import { isFigorr } from "../../../../utils/constants";
import { IAdditionalFeatures } from "../../../../interfaces/subscription.interface";
import { checkPackageLimits } from "../../../subscriptions/util/packageUtil";
import SelectShop from "../../../login/selectShop";

interface IForm {
  discount: number;
  shopCategoryName: string;
}

interface IUpdateForm {
  businessName: string;
  category: string;
  phoneNo: string;
  currency: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

const DELETE_SHOP = gql`
  mutation DeleteShop($shopId: ID!) {
    deleteShop(shopId: $shopId)
  }
`;

const BusinessDetails = () => {
  const currentShop = useAppSelector(getCurrentShop);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showLeaveShopModal, setLeaveShopModal] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getShop] = useLazyQuery<{
    getShop: {
      countries: CountryAttr[];
      result: IShop;
    };
  }>(GET_SHOP, {
    variables: {
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "network-only",
    onCompleted(shopData) {
      dispatch(setCurrentShop(shopData?.getShop?.result));
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    getShop();
  }, []);

  const { user: userInfo } = useAppSelector((state) => state);
  const isMerchant = userInfo?.userId === currentShop?.userId;
  const accountLock = useAppSelector((state) => state.accountLock);
  const currentUser = useAppSelector(getCurrentUser);
  const [expiryVal, setExpiryVal] = useState<boolean>(false);
  const [onlinePresence, setOnlinePresence] = useState<boolean>(false);
  const [enableDiscount, setEnableDiscount] = useState<boolean>(false);
  const [enableSurplus, setEnableSurplus] = useState<boolean>(false);
  const [enableDiscountModal, setEnableDiscountModal] = useState<boolean>(false);
  const [isActive, setIsActive] = useState(false);
  const [image, setImage] = useState<File>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [update, setUpdate] = useState<string>("Business Information");
  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(0);
  const [shopCategoriesName, setShopCategoriesName] = useState<string[]>([]);
  const [shopCategoriesId, setShopCategoriesId] = useState<string[]>([]);
  const [selectedShopCategory, setSelectedShopCategory] = useState(-1);
  const [updateFormInput, setUpdateFormInput] = useState<IUpdateForm>({
    businessName: "",
    category: "",
    phoneNo: "",
    currency: "",
    city: "",
    state: "",
    country: "",
    address: "",
  });
  const { shouldMakeSalesWithoutCashier } = useAppSelector((state) => state.shopPreference);
  const userRole = useAppSelector(getUserPermissions);
  const { subscriptions } = useAppSelector((state) => state);
  const userSubscriptions = subscriptions?.subscriptions[0] || [];
  const subscriptionPackages = subscriptions?.subscriptionPackages || [];
  const featureCount = subscriptions?.featureCount || {};

  const checkPackageLimit = (check: IAdditionalFeatures["check"]) =>
    checkPackageLimits(
      userSubscriptions.packageNumber,
      subscriptionPackages,
      featureCount,
      dispatch,
      check
    );

  useEffect(() => {
    if (currentShop?.shopCategoryId) {
      const index = shopCategoriesId.indexOf(currentShop?.shopCategoryId);

      setSelectedShopCategory(index);
    }
  }, [currentShop, shopCategoriesId]);

  const handleUpdateFormInput = (
    key: "businessName" | "category" | "phoneNo" | "currency",
    value: string
  ) => {
    setUpdateFormInput((prevInput) => {
      const inputCopy: IUpdateForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  const updateOnSync = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["Shops"])
  );

  const [formInput, setFormInput] = useState<IForm>({
    discount: 0,
    shopCategoryName: "",
  });

  const handleInput = (key: "discount" | "shopCategoryName", value: string | number) => {
    setFormInput((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  useEffect(() => {
    setExpiryVal(currentShop?.isExpiryDateEnabled as boolean);
    setOnlinePresence(currentShop?.isPublished as boolean);
    setEnableDiscount(currentShop?.discountEnabled as boolean);
    setEnableSurplus(currentShop?.isSurplusEnabled as boolean);
    handleInput("discount", currentShop?.maximumDiscount as number);
    dispatch(toggleMustMakeSaleWithCashier(currentShop?.shouldMakeSalesWithoutCashier as boolean));
  }, [currentShop]);

  const [updateShop] = useMutation<{ updateShop: boolean }>(UPDATE_SHOP, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const keyword = isActive ? "Disable" : "Enable";
  const shopImages = currentShop?.Images as IShop["Images"];

  const sessions = useAppSelector(getSessions);
  const token = sessions.session.token;

  const handleUpdateShop = async (
    currentUpdate: string,
    updatedExpiryVal?: boolean,
    updatedDiscountVal?: boolean,
    updatedOnlinePresence?: boolean
  ) => {
    type UpdateShopVariable = {
      shopId: string;
      shopName?: string;
      shopPhone?: string;
      shopAddress?: string;
      isPublished?: boolean;
      city?: string;
      state?: string;
      country?: string;
      shopCategoryId?: string;
      shopCategoryName?: string;
      checkoutMethod?: string;
      maximumDiscount?: number;
      discountEnabled?: boolean;
      currencyCode?: string;
      isExpiryDateEnabled?: boolean;
      isSurplusEnabled?: boolean;
      shouldMakeSalesWithoutCashier?: boolean;
    };

    const isToggle: boolean =
      currentUpdate === "onlinePresence" ||
      currentUpdate === "onlinePresence" ||
      currentUpdate === "expiryUpdate" ||
      currentUpdate === "surplusUpdate" ||
      currentUpdate === "discountUpdate";

    if (!updateFormInput.businessName && !isToggle) {
      dispatch(toggleSnackbarOpen({ message: "Business Name cannot be empty", color: "DANGER" }));
      return;
    }
    try {
      dispatch(isLoading(true));

      const variables: UpdateShopVariable = { shopId: currentShop?.shopId! };

      if (currentUpdate === "Information") {
        variables.shopName = updateFormInput.businessName;
        variables.shopPhone = updateFormInput.phoneNo;
        variables.currencyCode = updateFormInput.currency;
        variables.shopCategoryId = shopCategoriesId[selectedShopCategory];
        variables.shopCategoryName = shopCategoriesName[selectedShopCategory];
      } else if (currentUpdate === "Location") {
        variables.shopAddress = updateFormInput.address;
        variables.city = updateFormInput.city;
        variables.state = updateFormInput.state;
        variables.country = updateFormInput.country;
      } else if (currentUpdate === "imageUpdate") {
        variables.shopId = currentShop?.shopId as string;
        if (image) {
          const imgData = {
            key: "shopId",
            id: currentShop?.shopId,
            shopId: currentShop?.shopId,
          };
          const uploadedImages = await upload({
            files: [image],
            key: "",
            id: imgData?.id as string,
            shopId: imgData?.shopId || "",
            token,
          });
          if (!uploadedImages.success) {
            toggleSnackbarOpen({
              message: "Unable to upload shop image",
              color: "DANGER",
            });
          }
        }
      } else if (currentUpdate === "discountUpdate") {
        variables.maximumDiscount = Number(formInput.discount);
        variables.discountEnabled = updatedDiscountVal;
      } else if (currentUpdate === "surplusUpdate") {
        variables.isSurplusEnabled = updatedDiscountVal;
      } else if (currentUpdate === "expiryUpdate") {
        variables.isExpiryDateEnabled = updatedExpiryVal as boolean;
      } else if (currentUpdate === "onlinePresence") {
        variables.isPublished = updatedOnlinePresence as boolean;
      } else if (currentUpdate === "cashier") {
        variables.shouldMakeSalesWithoutCashier = !shouldMakeSalesWithoutCashier as boolean;
      }

      await updateShop({ variables });
      dispatch(isLoading(false));
      setTimeout(() => {
        setImage(undefined);
      }, 2500);
      dispatch(increaseSyncCount(["Shops"]));
      getShop();
      setShowEditModal(false);
      dispatch(toggleSnackbarOpen({ message: "Updated Successfully", color: "SUCCESS" }));
    } catch (err: any) {
      dispatch(isLoading(false));
      dispatch(
        toggleSnackbarOpen({
          message: err?.message || err?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    }
  };

  const handleExpriyDateChange = () => {
    const isProgress = checkPackageLimit("ExpiryDateNotification");
    if (!isProgress) return;
    const updatedExpiryVal = !expiryVal;
    setExpiryVal(updatedExpiryVal);
    handleUpdateShop("expiryUpdate", updatedExpiryVal);
  };

  const handleDiscountChange = () => {
    if (!isMerchant) return;

    if (!enableDiscount) {
      setEnableDiscountModal(true);
    } else {
      const updatedDiscountVal = !enableDiscount;
      handleUpdateShop("discountUpdate", undefined, updatedDiscountVal, undefined);
    }
    setEnableDiscount(!enableDiscount);
  };

  const handleSurplusChange = () => {
    if (!isMerchant) return;
    let updatedSurplusVal;

    if (!enableSurplus) {
      updatedSurplusVal = !enableSurplus;
      handleUpdateShop("surplusUpdate", undefined, updatedSurplusVal, undefined);
    } else {
      updatedSurplusVal = enableSurplus;
      handleUpdateShop("surplusUpdate", undefined, updatedSurplusVal, undefined);
    }
    setEnableSurplus(!enableSurplus);
  };

  const [getUserShop] = useLazyQuery<{ getUsersShops: [IShop] }>(GET_ALL_SHOPS, {
    variables: {
      userId: currentUser?.userId
    },
    fetchPolicy: "network-only",
    onCompleted(data) {
      dispatch(setShops(data?.getUsersShops));
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [DeleteShop] = useMutation(DELETE_SHOP, {
    async onCompleted() {
      try {
        const shopsList = await getUserShop();
        if (shopsList?.data?.getUsersShops?.length as number >= 1) {
          dispatch(setShowSelectShop());
        } else {
          navigate("/create-business");
        }
      } catch (error) {
        console.error("Error fetching user shops:", error);
        dispatch(toggleSnackbarOpen("Error fetching user shops."));
      }
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const handleDeleteShop = (shopId: string) => {
    if (userRole.isShopOwner) {
      DeleteShop({ variables: { shopId: shopId } });
    } else {
      dispatch(
        toggleSnackbarOpen({
          message: "You do not have permission to delete this shop",
          color: "INFO",
        })
      );
    }
  };

  const handleOnlinePresenceChange = () => {
    const updatedOnlinePresence = !onlinePresence;
    setOnlinePresence(updatedOnlinePresence);
    handleUpdateShop("onlinePresence", undefined, undefined, updatedOnlinePresence);
  };

  const getImageUrl = () => {
    if (!image) return "";
    return URL.createObjectURL(image);
  };

  const { refetch: offlineStatusRefetch } = useQuery<{
    getShopOfflineOrderStatus: boolean;
  }>(GET_SHOP_OFFLINE_ORDER_STATUS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onCompleted(result) {
      setIsActive(result?.getShopOfflineOrderStatus);
    },
    onError(err: any) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  const [updateStatus] = useMutation(UPDATE_SHOP_OFFLINE_ORDER_STATUS, {
    variables: {
      shopId: currentShop?.shopId,
      status: !isActive,
    },
    onCompleted() {
      dispatch(toggleSnackbarOpen(`Offline order ${keyword} for (${currentShop?.shopName})`));
      offlineStatusRefetch({
        variables: {
          shopId: currentShop?.shopId,
        },
      });
    },
  });

  useEffect(() => {
    offlineStatusRefetch({
      variables: {
        shopId: currentShop?.shopId,
      },
    });
  }, [currentShop, updateOnSync]);

  const handleActiveOfflineOrder = async () => {
    const isProgress = checkPackageLimit("KitchenOrder");
    if (!isProgress) return;
    await CustomConfirm(
      `Are you sure you want to ${keyword} offline order for (${currentShop?.shopName})`
    );

    updateStatus();
  };

  const { data: categoryData } = useQuery<{
    getShopCategories: [
      {
        shopCategoryId: string;
        shopCategoryName: string;
      }
    ];
  }>(GET_SHOP_CATEGORIES, {
    onError(err) {
      dispatch(
        toggleSnackbarOpen({
          message: err?.message || err?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  useEffect(() => {
    const currencyName: string[] = [];
    const currencyId: string[] = [];
    currencyList.forEach((val) => {
      currencyName.push(val.Country);
      currencyId.push(val.Code);
    });
    setCurrencyNames(currencyName);

    if (categoryData) {
      const categoryName: string[] = [];
      const categoryId: string[] = [];
      categoryData.getShopCategories.forEach((val) => {
        categoryName.push(val.shopCategoryName);
        categoryId.push(val.shopCategoryId);
      });
      setShopCategoriesName(categoryName);
      setShopCategoriesId(categoryId);
    }
  }, [categoryData]);

  return (
    <>
      <BoxHeading>
        Business Details
        <p>Please enter your current passowrd to update business details</p>
      </BoxHeading>

      <div style={{ marginTop: "1.5rem" }}></div>
      <SalesCard
        backgroundImage={SalesCardSpiralBg}
        backgroundPosition="right"
        backgroundSize="9.375rem"
        height="6.25rem"
        background="#F0F3F8"
        width="100%"
      >
        <Flex justifyContent="space-between" width="100%" alignItems="center">
          <Flex>
            {image ? (
              <Flex height="4.4rem" width="4.4rem" borderRadius="0.5rem">
                <img
                  src={image && getImageUrl()}
                  height="100%"
                  width="100%"
                  style={{ borderRadius: "inherit" }}
                  alt=""
                />
              </Flex>
            ) : (
              <>
                {shopImages ? (
                  <Flex height="4.4rem" width="4.4rem" borderRadius="0.5rem">
                    <img
                      src={getLocalImageUrl(shopImages[0])}
                      height="100%"
                      width="100%"
                      style={{ borderRadius: "inherit" }}
                      alt=""
                    />
                  </Flex>
                ) : (
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    bg="#130F26"
                    height="4.4rem"
                    width="4.4rem"
                    borderRadius="0.5rem"
                  >
                    <img src={DefaultSettingsImg} height="50%" width="50%" alt="" />
                  </Flex>
                )}
              </>
            )}
            <ShopTitleCont>
              {currentShop?.shopName}
              <p>{currentShop?.shopCategoryName}</p>
              {image ? (
                <p className="button" onClick={() => handleUpdateShop("imageUpdate")}>
                  Upload photo
                </p>
              ) : (
                <label className="button" htmlFor="addPhotoInput">
                  Add Photo
                </label>
              )}
              <input
                type="file"
                id="addPhotoInput"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target?.files?.[0])}
              />
            </ShopTitleCont>
          </Flex>
          <Flex style={{ columnGap: ".9rem" }}>
            <ButtonPlusIcon onClick={() => setShowDeleteModal(true)} color={Colors.red}>
              <img src={DeleteShopIcon} alt="" />
              Delete Shop
            </ButtonPlusIcon>
            {/* <ButtonPlusIcon onClick={() => setLeaveShopModal(true)} color={Colors.blackLight}>
              <img src={LeaveShopIcon} alt="" />
              Leave Shop
            </ButtonPlusIcon> */}
          </Flex>
        </Flex>
      </SalesCard>

      <Flex
        border={`1px solid ${Colors.borderGreyColor}`}
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="100%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        <Flex
          width="100%"
          margin="0px 0 0.625rem 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <ShopTitleCont fontWeight="500" color={Colors.blackishBlue}>
            Bussiness Information
          </ShopTitleCont>
          <ButtonPlusIcon
            style={{ fontSize: "0.75rem", cursor: "pointer" }}
            color={Colors.primaryColor}
            onClick={() => {
              setShowEditModal(true);
              setUpdate("Business Information");
            }}
          >
            Edit
            <img height="0.875rem" src={Edit} alt="" />
          </ButtonPlusIcon>
        </Flex>

        <Flex margin="0 0 0.3125rem 0" alignItems="center" justifyContent="spac">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "55%",
              rowGap: "1.5rem",
            }}
          >
            <ShopTitleCont color={Colors.blackLight}>
              <p>Business Name</p>
              {currentShop?.shopName}
            </ShopTitleCont>
            <ShopTitleCont color={Colors.blackLight}>
              <p>Business Phone</p>
              {currentShop?.shopPhone}
            </ShopTitleCont>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "1.5rem",
            }}
          >
            <ShopTitleCont color={Colors.blackLight}>
              <p>Business Catgory</p>
              {currentShop?.shopCategoryName ?? "OTHERS"}
            </ShopTitleCont>
            <ShopTitleCont color={Colors.blackLight}>
              <p>Currency</p>
              {currentShop?.currencyCode}
            </ShopTitleCont>
          </div>
        </Flex>
      </Flex>

      <Flex
        border={`1px solid ${Colors.borderGreyColor}`}
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="100%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        <Flex
          width="100%"
          margin="0px 0 0.625rem 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <ShopTitleCont fontWeight="500" color={Colors.blackishBlue}>
            Bussiness Location
          </ShopTitleCont>
          <ButtonPlusIcon
            style={{ fontSize: "0.75rem", cursor: "pointer" }}
            color={Colors.primaryColor}
            onClick={() => {
              setShowEditModal(true);
              setUpdate("Business Location");
            }}
          >
            Edit
            <img height="0.875rem" src={Edit} alt="" />
          </ButtonPlusIcon>
        </Flex>

        <Flex margin="0 0 0.3125rem 0" alignItems="center">
          <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem", width: "55%" }}>
            <ShopTitleCont color={Colors.blackLight}>
              <p>Country</p>
              Nigeria
            </ShopTitleCont>
            <ShopTitleCont color={Colors.blackLight}>
              <p>City</p>
              {currentShop?.city ?? "CITY"}
            </ShopTitleCont>
          </div>
          <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem" }}>
            <ShopTitleCont color={Colors.blackLight}>
              <p>State</p>
              {currentShop?.state ?? "STATE"}
            </ShopTitleCont>
            <ShopTitleCont color={Colors.blackLight}>
              <p>Business Address</p>
              {currentShop?.shopAddress}
            </ShopTitleCont>
          </div>
        </Flex>
      </Flex>

      <Flex
        border={`1px solid ${Colors.borderGreyColor}`}
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="100%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        <Flex
          width="100%"
          margin="0px 0 0.625rem 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <ShopTitleCont fontWeight="500" color={Colors.blackishBlue}>
            Additional Settings
          </ShopTitleCont>
        </Flex>

        <CustomRadioInputWrapper
          radioValue={expiryVal}
          handleChange={handleExpriyDateChange}
          radioText="Enable product expiry date"
          radioHelperText="Toggle on to enable product expiry date."
        />

        {!isFigorr && (
          <CustomRadioInputWrapper
            radioValue={onlinePresence}
            handleChange={handleOnlinePresenceChange}
            radioText="Toggle online presence"
            radioHelperText="Toggle on to enable online presence for your shop and products on Timart E-commerce."
          />
        )}

        <CustomRadioInputWrapper
          radioValue={enableDiscount}
          handleChange={handleDiscountChange}
          radioText="Enable discount"
          radioHelperText=" This will allow you sell products at a discount."
        />

        <CustomRadioInputWrapper
          radioValue={enableSurplus}
          handleChange={handleSurplusChange}
          radioText="Enable Surplus"
          radioHelperText=" This will allow you sell products with surplus."
        />

        {/* <CustomRadioInputWrapper
          radioValue={bargainVal}
          handleChange={() => setBargainVal(!bargainVal)}
          radioText="Enable bargain"
          radioHelperText="This will increase customers engagement on your online products."
        /> */}

        {!isFigorr && (
          <CustomRadioInputWrapper
            radioValue={isActive}
            handleChange={handleActiveOfflineOrder}
            radioText="Enable Offline Order"
            radioHelperText=" This will allow you sell products at offline Order."
          />
        )}

        {/* <CustomRadioInputWrapper
          radioValue={shouldMakeSalesWithoutCashier}
          handleChange={handleToggleSalesPreference}
          radioText="Enable Make Sales without cahier"
          radioHelperText="When this is activated, sales would no longer require a cashier to clear."
        /> */}
      </Flex>

      {enableDiscountModal && (
        <ModalContainer>
          <ModalBox width="26rem">
            <Flex height="fit-content" direction="column" justifyContent="center">
              <Flex alignItems="center" justifyContent="space-between">
                <h3>Maximum Discount (%)</h3>
                <div style={{ cursor: "pointer" }}>
                  <img
                    src={Close}
                    alt="close"
                    onClick={() => {
                      setEnableDiscountModal(false);
                      setEnableDiscount(!enableDiscount);
                    }}
                  />
                </div>
              </Flex>
              <InputField
                placeholder="0.05 => 5%"
                value={formInput.discount}
                type="text"
                backgroundColor="#F4F6F9"
                size="lg"
                color="#607087"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
                onChange={(e) => handleInput("discount", e.target.value)}
              />
            </Flex>
            <div
              onClick={() => {
                if (formInput.discount === 0) {
                  dispatch(toggleSnackbarOpen("You have to input a maximum discount..."));
                } else {
                  setEnableDiscountModal(false);
                  handleUpdateShop("discountUpdate", undefined, enableDiscount, undefined);
                }
              }}
              style={{
                cursor: "pointer",
                width: "100%",
                height: "2.5rem",
                borderRadius: ".75rem",
                backgroundColor: Colors.primaryColor,
                display: "grid",
                placeItems: "center",
                color: Colors.white,
                margin: "1.25rem 0px 0px",
              }}
            >
              Submit
            </div>
          </ModalBox>
        </ModalContainer>
      )}

      {showDeleteModal ? (
        <PopupCard close={() => setShowDeleteModal(false)}>
          <DeleteModal
            action="Confirm Delete"
            shopName={currentShop?.shopName as string}
            actionhandler={() => handleDeleteShop(currentShop?.shopId as string)}
            closeModal={() => setShowDeleteModal(false)}
          />
        </PopupCard>
      ) : null}

      {showLeaveShopModal ? (
        <ConfirmAction
          setConfirmSignout={() => setLeaveShopModal(false)}
          doAction={() => {
            setLeaveShopModal(false);
          }}
          action="Leave Shop"
          actionText="Are you sure you want to Leave Shop?"
        />
      ) : null}
      {showEditModal && (
        <EditBizDetails
          formInput={updateFormInput}
          handleInput={handleUpdateFormInput}
          update={update}
          setUpdate={setUpdate}
          selectedCurrency={selectedCurrency}
          shopCategoriesName={shopCategoriesName}
          selectedShopCategory={selectedShopCategory}
          currencyNames={currencyNames}
          setSelectedCurrency={setSelectedCurrency}
          setSelectedShopCategory={setSelectedShopCategory}
          currentShop={currentShop as IShop}
          setShowEditModal={setShowEditModal}
          handleUpdateShop={handleUpdateShop}
          setFormInput={setUpdateFormInput}
        />
      )}

      {accountLock.showSelectShop && (
        <ModalContainer>
          <SelectShop />
        </ModalContainer>
      )}
    </>
  );
};

export default BusinessDetails;
