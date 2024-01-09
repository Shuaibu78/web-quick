import { setSubscriptionModal } from "../../../app/slices/subscriptionslice";
import { PackageData, IAdditionalFeatures } from "../../../interfaces/subscription.interface";

export const checkPackageLimits = (
  packageNumber: number,
  packages: PackageData[],
  values: IAdditionalFeatures["featureCount"],
  dispatch: any,
  check: IAdditionalFeatures["check"]
): boolean => {
  const allowedFeatures = packages.find(
    (packageData: PackageData) => packageData.packageNumber === packageNumber
  );

  if (!allowedFeatures) {
    return false;
  }

  console.log(allowedFeatures);

  const nonAdditionalFeatures = ["inventory", "debt"];

  if (
    check === "inventory" &&
    allowedFeatures.inventoryCount !== -1 &&
    values.inventoriesCount >= allowedFeatures.inventoryCount
  ) {
    dispatch(setSubscriptionModal({ status: true, msg: "Exceeded inventory count limit" }));
    return false;
  } else if (
    check === "debt" &&
    allowedFeatures.debtorCount !== -1 &&
    values.debtCount >= allowedFeatures.debtorCount
  ) {
    dispatch(setSubscriptionModal({ status: true, msg: "Exceeded customer count limit" }));
    return false;
  } else if (
    !nonAdditionalFeatures.includes(check) &&
    !allowedFeatures.additionalFeatures.includes(check)
  ) {
    dispatch(setSubscriptionModal({ status: true, msg: "Exceeded Feature limit" }));
    return false;
  }

  return true;
};
