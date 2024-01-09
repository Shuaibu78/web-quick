import { Flex } from "../../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../../GlobalStyles/theme";
import { SubCardSelector } from "../../../subscriptions/subscriptions.style";
import { BoxHeading } from "../../settingsComps.style";
import SingleCheckout from "../../../../assets/singlecheckout.svg";
import MultipleCheckout from "../../../../assets/multipleCheckout.svg";
import { useState } from "react";

const CheckoutOptions = () => {
  const [checkoutMethod, setCheckoutMethod] = useState<"Single" | "Multiple">("Single");

  return (
    <>
      <BoxHeading>
        Checkout Options
        <p>Please enter your current passowrd to update business details</p>
      </BoxHeading>

      <Flex margin="0.625rem 0" style={{ columnGap: "1rem" }}>
        <SubCardSelector
          checkedBg="#DBF9E8"
          height="25.625rem"
          width="380px"
          checked={checkoutMethod === "Single"}
          onClick={() => setCheckoutMethod("Single")}
        >
          <div style={{ width: "100%", margin: "0.625rem 1px" }}>
            <Flex justifyContent="flex-end" width="100%" style={{ columnGap: "1rem" }}>
              <div
                style={{
                  width: "1.125rem",
                  height: "1.125rem",
                  border: checkoutMethod === "Single" ? "unset" : "1px solid #9EA8B7",
                  borderRadius: "3px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    width: "1.125rem",
                    height: "1.125rem",
                    backgroundColor: checkoutMethod === "Single" ? Colors.green : "transparent",
                    borderRadius: "3px",
                    color: Colors.white,
                    fontSize: "0.75rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "500",
                  }}
                >
                  ✓
                </div>
              </div>
            </Flex>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={SingleCheckout} alt="" />
            </div>
            <BoxHeading>
              Single Checkout
              <p>Only logged in user is allowed to complete a checkout </p>
            </BoxHeading>
          </div>
        </SubCardSelector>
        <SubCardSelector
          checkedBg="#DBF9E8"
          height="25.625rem"
          width="380px"
          checked={checkoutMethod === "Multiple"}
          onClick={() => setCheckoutMethod("Multiple")}
        >
          <div style={{ width: "100%", margin: "0.625rem 1px" }}>
            <Flex justifyContent="flex-end" width="100%" style={{ columnGap: "1rem" }}>
              <div
                style={{
                  width: "1.125rem",
                  height: "1.125rem",
                  border: checkoutMethod === "Multiple" ? "unset" : "1px solid #9EA8B7",
                  borderRadius: "3px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    width: "1.125rem",
                    height: "1.125rem",
                    backgroundColor: checkoutMethod === "Multiple" ? Colors.green : "transparent",
                    borderRadius: "3px",
                    color: Colors.white,
                    fontSize: "0.75rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "500",
                  }}
                >
                  ✓
                </div>
              </div>
            </Flex>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={MultipleCheckout} alt="" />
            </div>
            <BoxHeading>
              Multiple Checkout
              <p>Not only logged in user can complete a checkout </p>
            </BoxHeading>
          </div>
        </SubCardSelector>
      </Flex>
    </>
  );
};

export default CheckoutOptions;
