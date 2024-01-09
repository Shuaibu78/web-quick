import DiamondBgImg from "../../../assets/DiamondBgImg.svg";
import SalesCardSpiralBg from "../../../assets/SalesCardSpiralBg.svg";
import { useAppSelector } from "../../../app/hooks";
import { SalesCard } from "../../home/style";
import { Flex } from "../../../components/receipt/style";
import { Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { differenceInDays } from "date-fns";

const SubscriptionCard = () => {
  const { subscriptions } = useAppSelector((state) => state);
  const currentUserSubscriptions = subscriptions.subscriptions || [];
  const expiryDate =
    currentUserSubscriptions[0]?.expiryDate !== null
      ? currentUserSubscriptions[0]?.expiryDate
      : currentUserSubscriptions[0]?.gracePeriodExpiryDate;
  const daysLeft = Math.ceil(differenceInDays(new Date(expiryDate), new Date())) - 1;
  const formattedDaysLeft =
    currentUserSubscriptions[0]?.packageNumber === 0 ? "no expiry date" : `${daysLeft} day(s) left`;

  return (
    <div>
      <div style={{ display: "flex", marginTop: "1rem", columnGap: "2rem" }}>
        <SalesCard backgroundImage={DiamondBgImg} height="80px" width="35%">
          <Flex width="" justifyContent="start">
            <Flex width="" justifyContent="space-between" flexDirection="column">
              <div>
                <Span margin="0 0" fontSize="13px">
                  Plan Status
                </Span>
                <p style={{ fontSize: "16px", fontWeight: "500" }}>
                  {currentUserSubscriptions[0]?.packageName} Plan
                </p>
                <p style={{ fontSize: "16px", fontWeight: "500" }}>
                  Expiry Date: {formattedDaysLeft}{" "}
                </p>
              </div>
            </Flex>
          </Flex>
        </SalesCard>

        <SalesCard
          backgroundImage={SalesCardSpiralBg}
          backgroundPosition="right"
          backgroundSize="9.375rem"
          background="#ECEFF4"
          height="5rem"
          width="30.625rem"
        >
          <Flex width="" justifyContent="start">
            <Flex width="" justifyContent="space-between" flexDirection="column">
              <div>
                <Span margin="0 0" fontSize="13px" color="#607087">
                  You’re currently on a{" "}
                  {currentUserSubscriptions[0]?.packageName.toLocaleLowerCase()} plan. Subscribe to
                  access premium features that helps you efficiently manage your business and it’s
                  activities
                </Span>
              </div>
            </Flex>
          </Flex>
        </SalesCard>
      </div>
    </div>
  );
};

export default SubscriptionCard;
