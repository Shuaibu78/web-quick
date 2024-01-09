/* eslint-disable no-debugger */
import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardWrapper from "./components/dashboard-wrapper/dashboard-wrapper";
import Customers from "./pages/customers/customers";
import Expenses from "./pages/expenses/expenses";
import Home from "./pages/home/home";
import Inventory from "./pages/inventory/inventory";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import RecoverPassword from "./pages/recover-password/recover-password";
import PageReport from "./pages/report/report";
import Sales from "./pages/sales/sales";
import Settings from "./pages/settings/settings";
import Staffs from "./pages/staffs/staffs";
import AddInventory from "./pages/inventory/add/add";
import NewSales from "./pages/sales/new-sales/new-sales";
import Loader from "./components/loader";
import { useAppSelector } from "./app/hooks";
import { getLoading } from "./app/slices/status";
import ShopPage from "./pages/shops";
import CreateBusiness from "./pages/register/create-business";
import CreateShop from "./pages/shops/new/create-business";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Snackbar from "./components/snackbar/snackbar";
import OnlinePresence from "./pages/onlinePresence/onlinepresence";
import OrdersPage from "./pages/onlinePresence/orders/orders";
import Products from "./pages/onlinePresence/orders/availableProducts/products";
import Suppliers from "./pages/supply/supply";
import SingleSupplierView from "./pages/supply/singleSupplierView";
import SingleCustomerView from "./pages/customers/view-customer/singleCustomerView";
import ManageBusiness from "./pages/manageBusinesses/index";
import Subscriptions from "./pages/subscriptions/subscritpions";
import SubscriptionDetails from "./pages/subscriptions/subDetails";
import NoPermissionModal from "./components/modal/noPermissionModal";
import NoProductModal from "./components/modal/noProductModal";
import SwitchingShops from "./components/modal/switchingShops";
import { getSessions } from "./app/slices/session";
import PasswordChange from "./pages/recover-password/passwordChange";
import { useDispatch } from "react-redux";
import { getShops } from "./app/slices/shops";
import { setShowSelectShop } from "./app/slices/accountLock";
import Invoices from "./pages/invoices/invoices";
import StockAdjustment from "./pages/stockAdjustment/stockAdjustment";
import AdjustStock from "./pages/stockAdjustment/view/adjustStock";
import AdjustmentHistory from "./pages/stockAdjustment/view/adjustmentHistory";
import PackageStatusChecker from "./pages/subscriptions/util/PackageStatusChecker";
import ProductList from "./pages/inventory/product-list/product_list";
import Batches from "./pages/inventory/product-batches/batches";
import Transfer from "./pages/inventory/transfer/prodTransfer";
import AddNewInvoice from "./pages/invoices/addNewInvoice";

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectPath?: string;
  children: React.ReactNode;
  path?: string;
}

const publicRoutes = ["/login", "/register", "/recover-password", "/"];

export const ProtectedRoute = ({
  isAllowed,
  redirectPath = "/login",
  children,
  path = "/dashboard",
}: ProtectedRouteProps) => {
  const { subscriptions } = useAppSelector((state) => state);
  const userSubscriptions = subscriptions?.subscriptions || [];

  if (!publicRoutes.includes(path)) {
    if (!isAllowed) {
      return <Navigate to={redirectPath} replace />;
    }
  } else if (isAllowed && path === "/register") {
    return <Navigate to="/create-business" replace />;
  } else if (isAllowed && publicRoutes.includes(path)) {
    return <Navigate to="/dashboard" replace />;
  }

  return userSubscriptions.length < 1 || publicRoutes.includes(path)
    ? <>{children}</> || <Outlet />
    : (
        <PackageStatusChecker userPackage={userSubscriptions[0]}>{children}</PackageStatusChecker>
      ) || <Outlet />;
};

function App() {
  const loading = useAppSelector(getLoading);
  const sessions = useAppSelector(getSessions);
  const dispatch = useDispatch();
  const shops = useAppSelector(getShops);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const preferences = useAppSelector((state) => state.userPreferences.preferences);
  const currentUserId = useAppSelector((state) => state.user.userId);
  const userPreference = preferences.find((user) => user.userId === currentUserId);

  useEffect(() => {
    document.documentElement.style.setProperty("font-size", userPreference?.appSize as string);
  }, [userPreference?.appSize]);

  useEffect(() => {
    const isAllowd = sessions ? sessions.session.token?.length > 0 : false;
    if (shops.length > 1) {
      dispatch(setShowSelectShop());
    }
    setIsLoggedIn(isAllowd);
  }, [sessions]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAllowed={!!isLoggedIn} path="/register">
              <Register />
            </ProtectedRoute>
          }
        />
        <Route path="/password-change" element={<PasswordChange />} />
        <Route
          path="/recover-password"
          element={
            <ProtectedRoute isAllowed={!!isLoggedIn} redirectPath="/login" path="/recover-password">
              <RecoverPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute isAllowed={!!isLoggedIn} redirectPath="/login" path="/login">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route path="/create-business" element={<CreateBusiness />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAllowed={!!isLoggedIn} redirectPath="/login">
              <DashboardWrapper />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Home />} />
          <Route path="sales" element={<Sales />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="subscriptions/details" element={<SubscriptionDetails />} />
          <Route path="manage-businesses" element={<ManageBusiness />} />
          <Route path="sales/new" element={<NewSales />} />
          <Route path="product" element={<Inventory />}>
            <Route index element={<ProductList />} />
            <Route path="batches" element={<Batches />} />
            <Route path="transfer" element={<Transfer />} />
          </Route>
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/single-supplier/:id" element={<SingleSupplierView />} />
          <Route path="product/add" element={<AddInventory />} />
          <Route path="shops/new" element={<CreateShop />} />
          <Route path="shops" element={<ShopPage />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="stock-adjustment" element={<StockAdjustment />}>
            <Route index element={<AdjustStock />} />
            <Route path="history" element={<AdjustmentHistory />} />
          </Route>
          <Route path="online-presence" element={<OnlinePresence />}>
            <Route index element={<OrdersPage />} />
            <Route path="available-products" element={<Products />} />
            {/* <Route path="wallet" element={<WalletPage />} />
          <Route path="business-settings" element={<BusinessSettingsPage />} /> */}
          </Route>
          <Route path="staffs" element={<Staffs />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/new" element={<AddNewInvoice />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/single-customer/:id" element={<SingleCustomerView />} />
          <Route path="report" element={<PageReport />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      {loading && <Loader />}
      {/* {success && <Success />}
      {error && <ErrorModal />} */}
      <ToastContainer />
      <Snackbar timeout={4000} />
      <NoPermissionModal />
      <SwitchingShops />
      <NoProductModal />
    </div>
  );
}

export default App;
