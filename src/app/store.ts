import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import sidebarReducer from "./slices/sidebar";
import statusReducer from "./slices/status";
import shopReducer from "./slices/shops";
import salesReducer from "./slices/sales";
import userInfo from "./slices/userInfo";
import singleInventorySlice from "./slices/inventory";
import syncStatusSlice from "./slices/syncStatus";
import snackbarStatus from "./slices/snacbar";
import roleSlice from "./slices/roles";
import isEdit from "./slices/isEdit";
import accountLockReducer from "./slices/accountLock";
import salesFilterSlice from "./slices/salesFilter";
import supplyModalSlice from "./slices/showSupplyModal";
import settingsPagePropsReducer from "./slices/settings";
import userPreferencesReducer from "./slices/userPreferences";
import SessionsliceReducer from "./slices/session";
import shopPreferencesReducer from "./slices/shopPreferences";
import SubscriptionSlice from "./slices/subscriptionslice";
import batchReducer from "./slices/batch";

const persistConfig = {
  key: "currentshop",
  version: 1,
  storage,
  blacklist: ["list", "increaseSyncCount"],
};

const persistRoleConfig = {
  key: "currentRole",
  version: 1,
  storage,
};

const persistUserConfig = {
  key: "currentUser",
  version: 1,
  storage,
};
const persistEditModeConfig = {
  key: "isEdit",
  version: 1,
  storage,
};

const persistAccountLockConfig = {
  key: "accountLockReducer",
  version: 1,
  storage,
};

const persistSettingsPageProp = {
  key: "settingsPagePropsReducer",
  version: 1,
  storage,
};

const persistUserPreferences = {
  key: "userPreferencesReducer",
  version: 1,
  storage,
};

const persistSession = {
  key: "SessionsliceReducer",
  version: 1,
  storage,
};

const persistShopPreferences = {
  key: "shopPreferences",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, shopReducer);
const persistedSales = persistReducer(persistConfig, salesReducer);
const persistedRoles = persistReducer(persistRoleConfig, roleSlice);
const persistedUser = persistReducer(persistUserConfig, userInfo);
const persistedIsEdit = persistReducer(persistEditModeConfig, isEdit);
const persistedAccountLock = persistReducer(persistAccountLockConfig, accountLockReducer);
const persistedSettingsPageProp = persistReducer(persistSettingsPageProp, settingsPagePropsReducer);
const persistedUserPreferences = persistReducer(persistUserPreferences, userPreferencesReducer);
const persistedSession = persistReducer(persistSession, SessionsliceReducer);
const persistedShopPreferences = persistReducer(persistShopPreferences, shopPreferencesReducer);

export const store = configureStore({
  reducer: {
    shops: persistedReducer,
    batch: batchReducer,
    sidebar: sidebarReducer,
    status: statusReducer,
    user: persistedUser,
    singleInventory: singleInventorySlice,
    syncStatus: syncStatusSlice,
    snackbar: snackbarStatus,
    sales: persistedSales,
    roles: persistedRoles,
    isEdit: persistedIsEdit,
    accountLock: persistedAccountLock,
    salesFilter: salesFilterSlice,
    modal: supplyModalSlice,
    settings: persistedSettingsPageProp,
    userPreferences: persistedUserPreferences,
    session: persistedSession,
    shopPreference: persistedShopPreferences,
    subscriptions: SubscriptionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
