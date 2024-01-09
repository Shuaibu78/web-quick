import React, { FunctionComponent, useEffect, useState } from "react";
import { Flex } from "../../../components/receipt/style";
import TopNav from "../../../components/top-nav/top-nav";
import { Colors } from "../../../GlobalStyles/theme";
import { formatAmount } from "../../../helper/format";
import { Body } from "../../expenses/style";
import { Left, Right } from "../../sales/style";
import { TabButton, TabContainer } from "../../staffs/style";
import { SubCardSelector } from "../subscriptions.style";
import TimartPaymentCard, { AuthorizationInfo } from "./advancedCard";
import {
  INITIALIZE_SUBSCRIPTION,
  ACTIVATE_SUBSCRIBTION,
  GET_ALL_USER_SUBSCRIPTIONS,
} from "../../../schema/subscription.schema";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector, useCurrentShop } from "../../../app/hooks";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { socketClient } from "../../../helper/socket";
import { SYNC_START } from "../../../utils/constants";
import { setCurrentSubscriptions } from "../../../app/slices/subscriptionslice";
import { ISubscriptionInitial } from "../../../interfaces/subscription.interface";

type CardsType = "Advanced" | "Ultimate" | "Unlimited";

const SubscriptionDetails: FunctionComponent = () => {
  const [subIndex, setSubIndex] = useState<number>(0);
  const [subDurationTab, setSubDurationTab] = useState<"monthly" | "annually">("annually");
  const [navbarHeaight, setNavBarHeight] = useState<number>();
  const [referenceId, setReferenceId] = useState<string>("");
  const dispatch = useAppDispatch();
  const { subscriptions } = useAppSelector((state) => state);
  const subscriptionPackages = subscriptions?.subscriptionPackages || [];
  const cardDetail =
    subscriptionPackages?.filter((subPackage) => subPackage.packageNumber !== 0) || [];

  const currentShop = useCurrentShop();

  const [refetch] = useLazyQuery(INITIALIZE_SUBSCRIPTION);

  const [activateSub] = useMutation<{ verifyAndActivateSubscription: any }>(ACTIVATE_SUBSCRIBTION, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
    onCompleted: ({ verifyAndActivateSubscription }) => {
      if (verifyAndActivateSubscription) {
        dispatch(
          toggleSnackbarOpen({
            color: "SUCCESS",
            message: "subscription successfully updated",
          })
        );
      }
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error.message));
    },
  });

  const { refetch: refetchSubscriptions } = useQuery<{
    getAllUserSubscriptions: [ISubscriptionInitial];
  }>(GET_ALL_USER_SUBSCRIPTIONS, {
    variables: {
      userId: currentShop.userId,
    },
    fetchPolicy: "network-only",
    onCompleted(result) {
      dispatch(setCurrentSubscriptions(result?.getAllUserSubscriptions));
    },
    onError: (error) => {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const handleOpenPaymentUrl = (paymentUrl: string) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).manager?.send("paystack-payment", { url: paymentUrl });
  };

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).manager?.receive("payment-successful", (_event, value) => {
      if (value.status === "Successful" && referenceId) {
        activateSub({
          variables: {
            referenceId,
            shopId: currentShop?.shopId,
          },
        }).then((res) => {
          const result = res.data?.verifyAndActivateSubscription;
          if (result) {
            socketClient.emit(SYNC_START, { shopId: currentShop?.shopId });
            refetchSubscriptions();
          }
        });
      }
    });
  }, [referenceId]);

  const handleInitiateSub = (packageNumber: number, recurrence: "MONTHLY" | "YEARLY") => {
    refetch({
      variables: {
        shopId: currentShop?.shopId,
        packageNumber,
        recurrence,
      },
    })
      .then((data: any) => {
        const { intializeSubscription } = data?.data;
        const result = intializeSubscription as AuthorizationInfo;
        setReferenceId(result?.reference);
        handleOpenPaymentUrl(result?.authorization_url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <TopNav header="Subscription" setNavBarHeight={setNavBarHeight} />
      </div>

      <Body navBarHeight={navbarHeaight as number} bgColor="transparent">
        <Flex height="100%" justifyContent="flex-start" style={{ columnGap: ".5rem" }}>
          <Left
            style={{
              backgroundColor: "white",
              borderRadius: "1.25rem",
              padding: "1.25rem 1.25rem",
              marginInline: ".5rem",
              height: "fit-content",
              width: "45%",
            }}
          >
            <Flex justifyContent="space-between">
              <div
                style={{
                  display: "flex",
                  height: "2.1875rem",
                  width: "20%",
                  alignItems: "center",
                  color: "#607087",
                  marginBottom: "2rem",
                }}
              >
                <h3>Select Plan</h3>
              </div>
              <div style={{ width: "12.5rem" }}>
                <TabContainer>
                  <TabButton
                    height="2.5rem"
                    onClick={() => setSubDurationTab("monthly")}
                    isActive={subDurationTab === "monthly"}
                  >
                    Monthly
                  </TabButton>
                  <TabButton
                    height="2.5rem"
                    onClick={() => setSubDurationTab("annually")}
                    isActive={subDurationTab === "annually"}
                  >
                    Annually
                  </TabButton>
                </TabContainer>
              </div>
            </Flex>

            <div>
              {cardDetail.map((card, i) => (
                <SubCardSelector
                  checked={subIndex + 1 === card.packageNumber}
                  onClick={() => setSubIndex(card.packageNumber - 1)}
                  style={{ marginBlock: "50px" }}
                  key={i}
                >
                  <div>
                    <h3 style={{ fontSize: "16px", paddingLeft: "1.8rem" }}>
                      Timart {card.packageName}
                    </h3>
                    <Flex
                      alignItems="center"
                      style={{ columnGap: "1rem", justifyContent: "space-between" }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border:
                            subIndex + 1 === card.packageNumber
                              ? "1px solid black"
                              : "1px solid #9EA8B7",
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor:
                              subIndex + 1 === card.packageNumber ? "black" : "transparent",
                            borderRadius: "50%",
                          }}
                        ></div>
                      </div>
                      <div style={{ width: "100%" }}>
                        {subDurationTab === "annually" ? (
                          <Flex alignItems="flex-end">
                            <h1>{formatAmount(card.pricePerYear as number)}</h1>
                            <p style={{ fontSize: "16px", color: "#9EA8B7" }}>/Year</p>
                          </Flex>
                        ) : (
                          <Flex alignItems="flex-end">
                            <h1>{formatAmount(card.pricePerMonth as number)}</h1>
                            <p style={{ fontSize: "16px", color: "#9EA8B7" }}>/Month</p>
                          </Flex>
                        )}
                      </div>
                      {subDurationTab === "annually" && (
                        <div>
                          <p
                            style={{
                              fontSize: "12px",
                              color: Colors.primaryColor,
                            }}
                          >
                            {`${card.percentageOff}%`}
                          </p>
                        </div>
                      )}
                    </Flex>
                  </div>
                </SubCardSelector>
              ))}
            </div>
          </Left>
          <Right
            style={{
              backgroundColor: "white",
              borderRadius: "1.25rem",
              marginInline: ".5rem",
              padding: "0 0",
              border: "1px solid #607087",
              boxShadow: "0px 4px 30px rgba(96, 112, 135, 0.2)",
              height: "fit-content",
              width: "45%",
            }}
          >
            {
              <TimartPaymentCard
                setSubDurationTab={setSubDurationTab}
                subDurationTab={subDurationTab}
                handleInitiateSub={handleInitiateSub}
                cardDetail={cardDetail[subIndex]}
              />
            }
          </Right>
        </Flex>
      </Body>
    </>
  );
};

export default SubscriptionDetails;
