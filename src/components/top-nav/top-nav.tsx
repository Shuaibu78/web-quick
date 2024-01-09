import { FunctionComponent, useEffect, useRef, useState } from "react";
import dropIcon2 from "../../assets/DropIcon3.svg";
import cancelIcon from "../../assets/cancel.svg";
import BackArrow from "../../assets/back-arrow.svg";
import menuIcon from "../../assets/nav-menu.svg";
import plusIcon from "../../assets/grayPlus.svg";
import editIcon from "../../assets/Edit.svg";
import Calendar from "../../assets/Calendar2.svg";
import SettingsIconWhite from "../../assets/SettingsIconWhite.svg";
import {
  Container,
  RightContainer,
  ButtonWithIcon,
  ToggleButton,
  ActionBox,
  DropIcon,
  ShopDropDown,
} from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggle } from "../../app/slices/sidebar";
import { getCurrentShop, getShops, setCurrentShop, setShops } from "../../app/slices/shops";
import { ControlContainer, TabButton, TabContainer } from "../../pages/staffs/style";
import { setItem } from "../../utils/localStorage.utils";
import { hasPermission, syncTotalTableCount } from "../../helper/comparisons";
import { setSingleInventory } from "../../app/slices/inventory";
import { clearTabs } from "../../app/slices/sales";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { Flex, Button } from "../../GlobalStyles/CustomizableGlobal.style";
import { getUserPermissions, setRole } from "../../app/slices/roles";
import { rpcClient } from "../../helper/rpcClient";
import { getCurrentUser, setUserInfo } from "../../app/slices/userInfo";
import SalesCards from "../../pages/sales/salesCards";
import {
  TabContainer as NewSalesTabContainer,
  Tab,
  AddTab,
  TabItem,
  TabButton as NewSalesTabButton,
} from "../../pages/sales/new-sales/styles";
import { setShowModal, setEditSupplier } from "../../app/slices/showSupplyModal";
import StoreListModal from "./storeListModal";
import SubscriptionCard from "../../pages/subscriptions/cards/subscriptionCards";
import { StyledNavLink } from "../../pages/settings/settingsComps.style";
import { ProductNavContent } from "../../pages/inventory/add/addUtils";
import { setTopNavProp } from "../../app/slices/settings";
import { Colors } from "../../GlobalStyles/theme";
import { setIsEdit } from "../../app/slices/isEdit";
import { setUserPreference } from "../../app/slices/userPreferences";
import { CustomDropDownIcon, ShopIcon } from "../../assets/CustomizableSvgIcons";
import { setBatchProduct } from "../../app/slices/batch";
import { isStaging } from "../../utils/constants";
import SettingsIcon from "../../assets/Setting.svg";
import { checkPackageLimits } from "../../pages/subscriptions/util/packageUtil";
import { IAdditionalFeatures } from "../../interfaces/subscription.interface";
import { TabStruct, TopNavProps } from "../../interfaces/topNav.interface";
import DateDropdown from "../dateDropdown/dateDropdown";
import { setNoPermissionModal } from "../../app/slices/accountLock";

const TopNav: FunctionComponent<TopNavProps> = ({ ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const shops = useAppSelector(getShops);
  const currentShop = useAppSelector(getCurrentShop);
  const currentUser = useAppSelector(getCurrentUser);

  const [storeOptions, setStoreOptions] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<number>();
  const [showActionBox, setShowActionBox] = useState(false);
  const { sidebar, session, subscriptions } = useAppSelector((state) => state);

  const userSubscriptions = subscriptions?.subscriptions[0] || [];
  const subscriptionPackages = subscriptions?.subscriptionPackages || [];
  const featureCount = subscriptions?.featureCount || {};

  const user: any = session.session;
  const navRef = useRef<HTMLDivElement | null>(null);
  const { primaryColor } = Colors;
  const {
    activeTab,
    setActiveTab,
    setSellType,
    refetch,
    setCurrentTab,
    setTNewTab,
    currentTab,
    tNewTab,
    setCurrentEdit,
    setShowEditTab,
    reduxTabs,
    topNavList,
  } = props;

  const checkPackageLimit = (check: IAdditionalFeatures["check"]) =>
    checkPackageLimits(
      userSubscriptions.packageNumber,
      subscriptionPackages,
      featureCount,
      dispatch,
      check
    );

  useEffect(() => {
    const handleResize = () => {
      if (navRef.current && navRef.current.offsetHeight) {
        props.setNavBarHeight && props.setNavBarHeight(navRef.current.offsetHeight);
      }
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!currentShop?.shopId) {
      dispatch(setShops([]));
      dispatch(setRole({}));
      dispatch(setUserInfo(null));
      return;
    }

    dispatch(
      setUserPreference({
        userId: user.userId!,
        hideProductsNav: true,
        hideSalesNav: true,
        appSize: "14px",
      })
    );

    if (user.userId) {
      rpcClient
        .request("fetchUserPermissions", { userId: user.userId, shopId: currentShop?.shopId })
        .then((userRole) => {
          console.log("userRole", userRole);
          if (userRole) dispatch(setRole(userRole));
        });
    }

    if (user.userId) {
      rpcClient.request("getUserInfo", { userId: user.userId }).then((userInfo) => {
        if (userInfo) dispatch(setUserInfo(userInfo));
      });
    }
  }, [currentShop?.shopId, user.userId]);

  const handleToggle = () => {
    dispatch(toggle());
  };

  const handleShowActionBox = () => {
    setShowActionBox((prev) => {
      return !prev;
    });
  };

  const handleStoreSelect = async (index: any) => {
    const shop = shops[index];

    if (!shop) return;

    setSelectedStore(index);
    dispatch(setCurrentShop(shop));
    setItem("currentShop", shop);

    dispatch(clearTabs());

    localStorage.setItem("currencyCode", shop?.currencyCode as string);
  };

  const { user: userInfo } = useAppSelector((state) => state);
  const reduxSelector = useAppSelector((state) => state);
  const userPermissions = useAppSelector(getUserPermissions);
  const isMerchant = userInfo?.userId === reduxSelector?.shops?.currentShop?.userId;
  const shouldManageSales = hasPermission("MANAGE_SALE", userPermissions);
  const shouldManageInventory = hasPermission("MANAGE_INVENTORY", userPermissions);
  const [showStoreListModal, setShowStoreListModal] = useState<boolean>(false);

  useEffect(() => {
    const options: any[] = [];

    shops.forEach((val: any) => {
      options.push({
        shopName: val.shopName,
        shopsCategory: val.shopsCategory,
        images: val.Images,
      });
    });
    setStoreOptions(options);
    if (currentShop) {
      const currentShopIndex = shops.findIndex((val) => val.shopId === currentShop.shopId);
      setSelectedStore(currentShopIndex === -1 ? 0 : currentShopIndex);
    }
  }, [shops, currentShop, user.userId]);

  const isStaffPage = location.pathname === "/dashboard/staffs";
  const isSupplyPage = location.pathname === "/dashboard/suppliers";
  const isProductPage = location.pathname === "/dashboard/product";
  const isProductSubPage = location.pathname.includes("/dashboard/product");
  const isExpensesPage = location.pathname.includes("/dashboard/expenses");
  const isSalesPage = location.pathname === "/dashboard/sales";
  const isNewSalesPage = location.pathname === "/dashboard/sales/new";
  const isOrdersPage = location.pathname === "/dashboard/online-presence";
  const isNewProductPage = location.pathname === "/dashboard/product/add";
  const isStockAdjustmentPage = location.pathname.includes("/dashboard/stock-adjustment");
  const isStockAdjustmentHistoryPage = location.pathname.includes(
    "/dashboard/stock-adjustment/history"
  );
  const isNewSingleCustomerPage = location.pathname.includes(
    "/dashboard/customers/single-customer"
  );
  const isNewSingleSupplierPage = location.pathname.includes(
    "/dashboard/suppliers/single-supplier/"
  );
  const isHome = location.pathname === "/dashboard";
  const isInvoices = location.pathname === "/dashboard/invoices";

  const isShowBackButton = () => {
    if (isNewSalesPage || isNewProductPage || isNewSingleCustomerPage || isNewSingleSupplierPage) {
      return true;
    }
  };

  const shouldEditSupplier = (editSupplier: boolean) => {
    dispatch(setEditSupplier(editSupplier));
  };

  const changeShowModal = (showModal: boolean) => {
    dispatch(setShowModal(showModal));
  };

  const handleAddNewProduct = () => {
    const isProgress = checkPackageLimit("inventory");
    if (!isProgress) return;
    dispatch(
      setBatchProduct({
        isBatchProduct: false,
        batchId: "",
        batchNumber: "",
      })
    );

    navigate("/dashboard/product/add");
    dispatch(setIsEdit(false));
    dispatch(setSingleInventory({}));
  };

  return (
    <Container direction="column" ref={navRef}>
      <Flex width="100%" height="auto" justifyContent="space-between">
        <div style={{ display: "flex", columnGap: "5rem" }}>
          <ToggleButton onClick={handleToggle}>
            {sidebar ? <img src={cancelIcon} alt="" /> : <img src={menuIcon} alt="" />}
          </ToggleButton>
          <Flex alignItems="center" gap="1rem" width="fit-content">
            <>
              {isShowBackButton() && (
                <Button
                  borderRadius="0.5rem"
                  padding=".3125rem .625rem"
                  backgroundColor="#60708726"
                  type="button"
                  color="#607087"
                  height="2.1876rem"
                  width="fit-content"
                  onClick={() => navigate(-1)}
                >
                  <img src={BackArrow} alt="back" />
                </Button>
              )}
              <h2>{props.header}</h2>
            </>
            {isStaging && (
              <Flex color={Colors.red} style={{ fontWeight: "600" }}>
                Staging
              </Flex>
            )}
          </Flex>
          {isStockAdjustmentPage && (
            <ControlContainer margin="0px 0px" width="fit-content">
              <TabContainer>
                <TabButton
                  isActive={location.pathname === "/dashboard/stock-adjustment"}
                  onClick={() => {
                    navigate("/dashboard/stock-adjustment");
                  }}
                >
                  Products Adjustment
                </TabButton>
                <TabButton
                  isActive={location.pathname === "/dashboard/stock-adjustment/history"}
                  onClick={() => {
                    navigate("/dashboard/stock-adjustment/history");
                  }}
                >
                  Adjustment History
                </TabButton>
              </TabContainer>
            </ControlContainer>
          )}
        </div>
        {(isProductPage || (isProductSubPage && !isNewProductPage)) && (
          <ControlContainer margin="2px 0px" width="fit-content">
            <TabContainer>
              <TabButton
                isActive={location.pathname === "/dashboard/product"}
                onClick={() => {
                  navigate("/dashboard/product");
                  props.setShowBatch?.(false);
                  props.setSelectedBatchId?.("");
                }}
              >
                Products List
              </TabButton>
              <TabButton
                isActive={location.pathname.includes("batch")}
                onClick={() => {
                  const canView = hasPermission("VIEW_INVENTORY", userPermissions);
                  if (canView) {
                    navigate("batches");
                  } else {
                    dispatch(
                      toggleSnackbarOpen({
                        message: "Access denied, Contact your manager",
                        color: "INFO",
                      })
                    );
                    dispatch(setNoPermissionModal(true));
                  }
                }}
              >
                Products Batches
              </TabButton>
              <TabButton
                isActive={props.view === "transfer"}
                onClick={() => {
                  props.setShowBatch?.(false);
                  navigate("transfer");
                  props.setSelectedBatchId?.("");
                }}
              >
                Products Transfer
              </TabButton>
            </TabContainer>
          </ControlContainer>
        )}
        {isSalesPage ? (
          <ControlContainer margin="0px 0px" width="fit-content">
            <TabContainer>
              <TabButton
                isActive={props.receiptButtonState}
                onClick={() => {
                  props.setReceiptButtonState!(true);
                  props.setListButtonState!(false);
                }}
              >
                Receipt List
              </TabButton>
              <TabButton
                isActive={props.listButtonState}
                onClick={() => {
                  props.setReceiptButtonState!(false);
                  props.setListButtonState!(true);
                }}
              >
                Sales Items List
              </TabButton>
            </TabContainer>
          </ControlContainer>
        ) : null}
        <RightContainer>
          <ActionBox show={showActionBox}>
            {isProductPage ? (
              isMerchant || shouldManageInventory ? (
                <ButtonWithIcon id="add-button" onClick={handleAddNewProduct}>
                  <div
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      borderRadius: "50%",
                      backgroundColor: Colors.white,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ fontSize: "1.25rem", color: primaryColor }}>+</p>
                  </div>
                  <span>Add a New Product</span>
                </ButtonWithIcon>
              ) : (
                ""
              )
            ) : isSalesPage || isOrdersPage || isHome ? (
              isMerchant || shouldManageSales ? (
                <ButtonWithIcon id="add-button" onClick={() => navigate("/dashboard/sales/new")}>
                  <div
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      borderRadius: "50%",
                      backgroundColor: Colors.white,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ fontSize: "1.25rem", color: primaryColor }}>+</p>
                  </div>
                  <span>Record New Sales</span>
                </ButtonWithIcon>
              ) : (
                ""
              )
            ) : location.pathname.includes("shops") || location.pathname.includes("settings") ? (
              <ButtonWithIcon onClick={() => navigate("/dashboard/shops/new")}>
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    backgroundColor: Colors.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "1.25rem", color: primaryColor }}>+</p>
                </div>
                <span>Create New Shop</span>
              </ButtonWithIcon>
            ) : (
              ""
            )}

            {location.pathname === "/dashboard/suppliers" ? (
              <ButtonWithIcon
                onClick={() => {
                  const isProgress = checkPackageLimit("Supplies");
                  if (!isProgress) return;
                  changeShowModal(true);
                  shouldEditSupplier(false);
                }}
              >
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    backgroundColor: Colors.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "1.25rem", color: primaryColor }}>+</p>
                </div>
                <span>Add New Supplier</span>
              </ButtonWithIcon>
            ) : null}
            {/* {location.pathname === "/dashboard/customers" ? (
              <ButtonWithIcon
                onClick={() => {
                  const isProgress = checkPackageLimit("debt");
                  if (!isProgress) return;
                  props.setShowAddCustomer && props.setShowAddCustomer(true);
                  props.setIsEditCustomer && props.setIsEditCustomer(false);
                  props.setCustomer && props.setCustomer(undefined);
                }}
                bgColor={Colors.secondaryColor}
              >
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    backgroundColor: Colors.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "1.25rem", color: Colors.secondaryColor }}>+</p>
                </div>
                <span>Add New Customer</span>
              </ButtonWithIcon>
            ) : null} */}
            {location.pathname === "/dashboard/customers" ? (
              <Flex cursor="pointer" onClick={() => props.setShowBankDetails!(true)}>
                <img src={SettingsIcon} alt="settings icon" />
              </Flex>
            ) : null}
            <div
              style={{
                marginInlineStart: "3.5rem",
                marginInlineEnd: "1rem",
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {props.shouldManageExpense && (
                <Button
                  type="button"
                  backgroundColor={primaryColor}
                  color="#fff"
                  borderColor={primaryColor}
                  borderRadius="0.75rem"
                  borderSize="1px"
                  fontSize="1rem"
                  width="auto"
                  height="2.5rem"
                  margin="0 2rem 0 0"
                  onClick={() => {
                    props.setShowCatModal && props.setShowCatModal(true);
                  }}
                >
                  <img
                    src={SettingsIconWhite}
                    alt=""
                    style={{ marginRight: "1rem", width: "1.2rem" }}
                  />
                  Category Settings
                </Button>
              )}
              {/* TODO: Add logic to only display this blob when notifications are available
              <div
                style={{
                  borderRadius: "50%",
                  background: "red",
                  padding: "1px 3px",
                  fontSize: "0.625rem",
                  position: "absolute",
                  top: "0.3125rem",
                  right: "-1px",
                  width: "0.5rem",
                  height: "0.5rem",
                }}
              ></div>
              <img src={NotificationBell} alt="Notification Bell" /> */}
            </div>

            {isStockAdjustmentHistoryPage && (
              <Flex alignItems="center" margin="0 0.5rem">
                <DateDropdown
                  width="7.5rem"
                  height="1.875rem"
                  padding="0.625rem 0"
                  borderRadius=".5rem"
                  icon={Calendar}
                  dateOptions={props.dateOptions as string[]}
                  selectedDate={props.selectedDate}
                  setSelectedDate={(val: number) => props.handleDropDown(val)}
                  handleApply={() => props.handleFilterByDate(8)}
                  dateRange={props.dateRange}
                  getStartDate={props.getStartDate}
                  getEndDate={props.getEndDate}
                />
              </Flex>
            )}
            <ShopDropDown onClick={() => setShowStoreListModal(!showStoreListModal)}>
              <ShopIcon color="#607087" />
              <p>{storeOptions[selectedStore as number]?.shopName}</p>
              <CustomDropDownIcon color="#607087" />
            </ShopDropDown>
            {showStoreListModal ? (
              <StoreListModal
                selectedStore={selectedStore as number}
                setShowStoreListModal={setShowStoreListModal}
                options={storeOptions}
                setValue={handleStoreSelect}
              ></StoreListModal>
            ) : null}
          </ActionBox>
          <DropIcon onClick={handleShowActionBox}>
            <img src={dropIcon2} alt="" />
          </DropIcon>
        </RightContainer>
      </Flex>

      <div style={{ paddingTop: "rem", width: "100%" }}>
        {isProductPage && props.inventoryCards!()}
        {isExpensesPage && props.navContent!()}
        {isInvoices && props.navContent!()}
        {isHome && props.overViewNavContent!()}
        {isStaffPage && props.staffNavContent!()}
        {isSupplyPage && props.supplyNavContent!()}
        {isStockAdjustmentPage && props.adjustCards}
        {isNewProductPage && props.type === "product" && (
          <ProductNavContent
            {...{
              activeTab,
              setActiveTab,
              setSellType,
            }}
          />
        )}
        <div style={{ width: "100%" }}>
          {location.pathname === "/dashboard/customers" &&
            props.customerNavContent &&
            props.customerNavContent()}
          {isNewSalesPage && (
            <NewSalesTabContainer>
              <Tab>
                {Object.entries(reduxTabs as TabStruct).map(([key, value]) => {
                  return (
                    <TabItem
                      key={key}
                      onClick={() => {
                        refetch();
                        setCurrentTab(key);
                        setTNewTab(!tNewTab);
                      }}
                      isActive={currentTab === key}
                    >
                      <span style={{ width: "90%" }}>
                        ({value.id}){" "}
                        {value.name.length > 14 ? value.name.substring(0, 12) + "..." : value.name}
                      </span>
                      {currentTab === key ? (
                        <NewSalesTabButton>
                          <button
                            onClick={() => {
                              setCurrentEdit(key);
                              setShowEditTab(true);
                            }}
                          >
                            <img src={editIcon} alt="" />
                          </button>
                          <button>
                            <img
                              src={cancelIcon}
                              alt=""
                              onClick={() => props.handleRemoveTab(key, reduxTabs)}
                            />
                          </button>
                        </NewSalesTabButton>
                      ) : null}
                    </TabItem>
                  );
                })}
                <AddTab onClick={() => props.handleAddTab(reduxTabs)}>
                  <img src={plusIcon} alt="" />
                </AddTab>
              </Tab>
            </NewSalesTabContainer>
          )}
        </div>
        {isSalesPage ? (
          <SalesCards
            handleDropDown={props.handleDropDown}
            handleFilterByDate={props.handleFilterByDate}
            setShowFilterModal={props.setShowFilterModal}
            selectedDate={props.selectedDate}
            dateOptions={props.dateOptions}
            dateRange={props.dateRange}
            getStartDate={props.getStartDate}
            getEndDate={props.getEndDate}
            shouldViewSales={props.shouldViewSales}
            totalAmounts={props.totalAmounts}
          />
        ) : null}
        {location.pathname === "/dashboard/subscriptions" ? <SubscriptionCard /> : null}
        {location.pathname === "/dashboard/settings" && (
          <div style={{ display: "flex", columnGap: "1rem", marginLeft: ".3rem" }}>
            {topNavList &&
              topNavList.map((list, i) => (
                <StyledNavLink
                  key={i}
                  active={list === props.navList}
                  onClick={() => dispatch(setTopNavProp(list))}
                >
                  {list}
                </StyledNavLink>
              ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default TopNav;
