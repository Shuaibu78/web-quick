import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  PackageData,
  ISubscriptionInitial,
  IAdditionalFeatures,
} from "../../interfaces/subscription.interface";

type SubscriptionSliceType = {
  subscriptions: ISubscriptionInitial[];
  subscriptionModal: {
    status: boolean;
    msg: string;
  };
  subscriptionPackages: PackageData[];
  featureCount: IAdditionalFeatures["featureCount"];
};

// Initial state
const initialState: SubscriptionSliceType = {
  subscriptions: [],
  subscriptionModal: {
    status: false,
    msg: "",
  },
  subscriptionPackages: [],
  featureCount: {
    inventoriesCount: 0,
    debtCount: 0,
  },
};

const SubscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setCurrentSubscriptions(state, { payload }) {
      state.subscriptions = payload;
    },
    setSubscriptionModal(state, { payload }) {
      state.subscriptionModal = payload;
    },
    setSubscriptionPackages(state, { payload }) {
      state.subscriptionPackages = payload;
    },
    setFeatureCount(state, { payload }) {
      state.featureCount = payload;
    },
  },
});

export default SubscriptionSlice.reducer;
export const { setCurrentSubscriptions, setSubscriptionModal, setSubscriptionPackages, setFeatureCount } =
  SubscriptionSlice.actions;

// Selector to access subscriptions from the store
export const getSubscriptions = (state: RootState) => state.subscriptions;
