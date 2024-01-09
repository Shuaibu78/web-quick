import React from "react";
import { Flex } from "../../../components/receipt/style";
import { SubCardSelector } from "../subscriptions.style";
import { formatAmount } from "../../../helper/format";
import { PackageData } from "../../../interfaces/subscription.interface";

const PaymentPlanCard = ({
  setSubDurationTab,
  subDurationTab,
  cardDetail,
}: {
  setSubDurationTab: React.Dispatch<React.SetStateAction<"monthly" | "annually">>;
  subDurationTab: "monthly" | "annually";
  cardDetail: PackageData;
}) => {
  return (
    <div style={{ textAlign: "center", marginBottom: ".5rem" }}>
      <h2 style={{ fontSize: "22px" }}>Choose Pricing</h2>
      <div
        style={{
          height: "fit-content",
          display: "flex",
          marginInline: "auto",
          width: "90%",
          justifyContent: "space-between",
        }}
      >
        <SubCardSelector
          checkedBg="#DBF9E8"
          height="70px"
          width="45%"
          checked={subDurationTab === "monthly"}
          onClick={() => setSubDurationTab("monthly")}
        >
          <Flex justifyContent="space-around" alignItems="center">
            <div
              style={{
                width: "18px",
                height: "18px",
                border: subDurationTab === "monthly" ? "1px solid #219653" : "1px solid #9EA8B7",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: subDurationTab === "monthly" ? "#219653" : "transparent",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
            <div>
              <Flex alignItems="flex-end">
                <h1
                  style={{
                    fontSize: "18px",
                    color: subDurationTab === "monthly" ? "#219653" : "#9EA8B7",
                  }}
                >
                  {formatAmount(cardDetail.pricePerMonth)}
                </h1>
                <p
                  style={{
                    fontSize: "14px",
                    color: subDurationTab === "monthly" ? "#219653" : "#9EA8B7",
                  }}
                >
                  /Month
                </p>
              </Flex>
            </div>
          </Flex>
        </SubCardSelector>
        <SubCardSelector
          checkedBg="#DBF9E8"
          height="70px"
          width="50%"
          checked={subDurationTab === "annually"}
          onClick={() => setSubDurationTab("annually")}
        >
          <Flex
            justifyContent="flex-start"
            alignItems="cennter"
            flexDirection="column"
            gap="2px 0px"
          >
            <Flex justifyContent="space-around" alignItems="center">
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  border: subDurationTab === "annually" ? "1px solid #219653" : "1px solid #9EA8B7",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: subDurationTab === "annually" ? "#219653" : "transparent",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
              <div>
                <Flex alignItems="flex-end" justifyContent="flex-start">
                  <h1
                    style={{
                      fontSize: "18px",
                      color: subDurationTab === "annually" ? "#219653" : "#9EA8B7",
                    }}
                  >
                    {formatAmount(cardDetail.pricePerYear)}
                  </h1>
                  <p
                    style={{
                      fontSize: "14px",
                      color: subDurationTab === "annually" ? "#219653" : "#9EA8B7",
                    }}
                  >
                    /Year
                  </p>
                </Flex>
              </div>
            </Flex>
            <p style={{ fontSize: "12px", color: "#FFBE62" }}>
              Get {cardDetail.percentageOff}% off
            </p>
          </Flex>
        </SubCardSelector>
      </div>
    </div>
  );
};

export default PaymentPlanCard;
