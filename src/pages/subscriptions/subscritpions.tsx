import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { GET_SUBSCRIBTION_PACKAGES } from "../../schema/subscription.schema";
import { useQuery } from "@apollo/client";
import { PackageData } from "../../interfaces/subscription.interface";
import SubscriptionDetails from "./subDetails";

const Subscriptions: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [subscriptionPackages, setSubscriptionPackages] = useState<PackageData[]>([]);

  useQuery<{
    getSubscriptionPackages: PackageData[];
  }>(GET_SUBSCRIBTION_PACKAGES, {
    fetchPolicy: "cache-and-network",
    onCompleted(arrData) {
      setSubscriptionPackages(arrData?.getSubscriptionPackages ?? []);
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  return (
    <>
      <SubscriptionDetails />
    </>
  );
};

export default Subscriptions;
