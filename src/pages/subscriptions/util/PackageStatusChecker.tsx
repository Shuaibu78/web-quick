import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector, useCurrentShop } from "../../../app/hooks";
import { useMutation, useQuery } from "@apollo/client";

import {
  setCurrentSubscriptions,
  setFeatureCount,
  setSubscriptionModal,
} from "../../../app/slices/subscriptionslice";
import { ModalBox, ModalContainer } from "../../../pages/settings/style";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { Button } from "../../../components/button/Button";
import { CancelButton } from "../../../pages/sales/style";
import NoPermission from "../../../assets/SwitchingShops.svg";
import { ISubscriptionInitial } from "../../../interfaces/subscription.interface";
import { ACTIVATE_GRACE_PERIOD, GET_FEATURE_COUNT } from "../../../schema/subscription.schema";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { RestrictionContainer } from "../style";
import { useNavigate } from "react-router-dom";
import { socketClient } from "../../../helper/socket";
import { SYNC_START } from "../../../utils/constants";

const PackageStatusChecker = ({
  userPackage,
  children,
}: {
  userPackage: ISubscriptionInitial;
  children: React.ReactNode;
}) => {
  const [isTrialPeriod, setIsTrialPeriod] = useState(false);
  const [shouldUserUpgrade, setShouldUserUpgrade] = useState(false);
  const [activateTrial, setActivateTrial] = useState(false);
  const currentShop = useCurrentShop();
  const shopId = currentShop?.shopId;
  const { subscriptions } = useAppSelector((state) => state);
  const showModal = subscriptions?.subscriptionModal || { status: false, msg: "" };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { refetch } = useQuery<{
    getFeatureCount: { inventoriesCount: number; debtCount: number };
  }>(GET_FEATURE_COUNT, {
    variables: {
      shopId,
    },
    fetchPolicy: "cache-and-network",
    onCompleted(arrData) {
      dispatch(setFeatureCount(arrData?.getFeatureCount ?? {}));
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [activateFreeTrial] = useMutation<{ activateServerGracePeriod: ISubscriptionInitial[] }>(
    ACTIVATE_GRACE_PERIOD,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const handleActivateFreeTrial = () => {
    activateFreeTrial({
      variables: {
        shopId,
      },
    })
      .then((result) => {
        const data = result.data?.activateServerGracePeriod;
        if (data) {
          socketClient.emit(SYNC_START, { shopId });
          dispatch(setCurrentSubscriptions([data] ?? []));
          refetch();
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  useEffect(() => {
    const { packageNumber, expiryDate, gracePeriodExpiryDate } = userPackage;
    const isBasic = packageNumber === 0;
    const isTrial = gracePeriodExpiryDate !== null && packageNumber === 4;
    const isExpired =
      expiryDate !== null
        ? new Date(expiryDate) < new Date()
        : new Date(gracePeriodExpiryDate) < new Date();

    setIsTrialPeriod(isTrial);
    setShouldUserUpgrade(isExpired);
    setActivateTrial(isBasic);
  }, [userPackage]);

  const cancelBtn = () => {
    dispatch(setSubscriptionModal({ status: false, msg: "" }));
  };

  const handleNavigationForSubscription = () => {
    navigate("/dashboard/subscriptions");
  };

  return (
    <div>
      <RestrictionContainer>
        {activateTrial && showModal.status === true && (
          <ModalContainer>
            <ModalBox position width="26rem" textMargin="0 0">
              <Flex justifyContent="flex-end">
                <CancelButton hover onClick={cancelBtn}>
                  X
                </CancelButton>
              </Flex>
              <Flex height="fit-content" direction="column" justifyContent="center">
                <Flex height="15rem" justifyContent="center">
                  <img src={NoPermission} alt="" />
                </Flex>
                <Span color={Colors.grey} textAlign="center" margin="0.625rem 0">
                  <h3>
                    You can start your free trial now to enjoy unlimited access to all package
                    features. Upgrade today and experience the full potential of our services!
                  </h3>
                </Span>
              </Flex>
              <Button
                margin="0.9375rem 0"
                label="Start Free Trial"
                width="100%"
                height="2.5rem"
                borderRadius="0.75rem"
                color={Colors.white}
                backgroundColor={Colors.primaryColor}
                onClick={handleActivateFreeTrial}
              />
            </ModalBox>
          </ModalContainer>
        )}
        {!isTrialPeriod && !shouldUserUpgrade && showModal.status === true && (
          <ModalContainer>
            <ModalBox position width="26rem" textMargin="0 0">
              <Flex justifyContent="flex-end">
                <CancelButton hover onClick={() => dispatch(setSubscriptionModal(false))}>
                  X
                </CancelButton>
              </Flex>
              <Flex height="fit-content" direction="column" justifyContent="center">
                <Flex height="15rem" justifyContent="center">
                  <img src={NoPermission} alt="" />
                </Flex>
                <Span color={Colors.grey} textAlign="center" margin="0.625rem 0">
                  <h3>{showModal.msg}. Upgrade now for full access.</h3>
                </Span>
              </Flex>
              <Button
                margin="0.9375rem 0"
                label="Upgrade"
                width="100%"
                height="2.5rem"
                borderRadius="0.75rem"
                color={Colors.white}
                backgroundColor={Colors.primaryColor}
                onClick={handleNavigationForSubscription}
              />
            </ModalBox>
          </ModalContainer>
        )}
        {userPackage.packageNumber >= 1 && shouldUserUpgrade && showModal.status === true && (
          <ModalContainer>
            <ModalBox position width="26rem" textMargin="0 0">
              <Flex justifyContent="flex-end">
                <CancelButton hover onClick={() => dispatch(setSubscriptionModal(false))}>
                  X
                </CancelButton>
              </Flex>
              <Flex height="fit-content" direction="column" justifyContent="center">
                <Flex height="15rem" justifyContent="center">
                  <img src={NoPermission} alt="" />
                </Flex>
                <Span color={Colors.grey} textAlign="center" margin="0.625rem 0">
                  <h3>Your package has expired. Re-subscribe now for full access.</h3>
                </Span>
              </Flex>
              <Button
                margin="0.9375rem 0"
                label="Subscribe"
                width="100%"
                height="2.5rem"
                borderRadius="0.75rem"
                color={Colors.white}
                backgroundColor={Colors.primaryColor}
                onClick={handleNavigationForSubscription}
              />
            </ModalBox>
          </ModalContainer>
        )}
      </RestrictionContainer>
      {children}
    </div>
  );
};

export default PackageStatusChecker;
