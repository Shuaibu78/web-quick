import { Flex } from "../../../components/receipt/style";
import BasicStar from "../../../assets/AdvancedDiamond.svg";
import SpecialListItem from "./specialListItem";
import { Colors } from "../../../GlobalStyles/theme";
import PaymentPlanCard from "./PaymentPlanCard";
import { PackageData } from "../../../interfaces/subscription.interface";

export interface AuthorizationInfo {
  authorization_url: string;
  access_code: string;
  reference: string;
}

const TimartPaymentCard = ({
  setSubDurationTab,
  subDurationTab,
  handleInitiateSub,
  cardDetail,
}: {
  setSubDurationTab: React.Dispatch<React.SetStateAction<"monthly" | "annually">>;
  subDurationTab: "monthly" | "annually";
  handleInitiateSub: (packageNumber: number, recurrence: "MONTHLY" | "YEARLY") => void;
  cardDetail: PackageData;
}) => {
  const handlePayment = () => {
    const isMonthly = subDurationTab !== "annually" ? "MONTHLY" : "YEARLY";
    handleInitiateSub(cardDetail.packageNumber, isMonthly);
  };

  return (
    <div
      style={{
        backgroundColor: "inherit",
        borderRadius: "inherit",
        height: "inherit",
        width: "100%",
      }}
    >
      <Flex
        style={{
          borderTopLeftRadius: "1.25rem",
          padding: "0.625rem 1.25rem",
          borderTopRightRadius: "1.25rem",
        }}
        backgroundColor="#DBF9E8"
        height="51px"
        justifyContent="space-between"
      >
        <h1 style={{ fontSize: "1.375rem", color: "black", fontWeight: "600" }}>
          TIMART {cardDetail.packageName}
        </h1>
        <img src={BasicStar} alt="" />
      </Flex>

      <div style={{ marginLeft: "2rem", marginBottom: "1rem", marginTop: "1rem" }}>
        <p style={{ color: "#7D8998" }}>
          Get unlimited access for a {`${subDurationTab !== "annually" ? "month" : "year"}`} on:
        </p>
        {cardDetail.featuresToDisplay?.map((res) => (
          <SpecialListItem listItem={res} key={res} />
        ))}
      </div>

      <PaymentPlanCard
        cardDetail={cardDetail}
        setSubDurationTab={setSubDurationTab}
        subDurationTab={subDurationTab}
      />

      <div>
        <div
          style={{
            backgroundColor: Colors.primaryColor,
            width: "90%",
            height: "2.5rem",
            borderRadius: "0.75rem",
            color: "white",
            marginInline: "auto",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            cursor: "pointer",
          }}
          onClick={handlePayment}
        >
          Proceed to Payment
        </div>
        <div
          style={{
            fontSize: "13px",
            width: "60%",
            textAlign: "center",
            marginInline: "auto",
            marginBlock: "1rem",
            color: "#9EA8B7",
          }}
        >
          By choosing this option, you agree to our payments{" "}
          <b style={{ color: Colors.primaryColor }}>Terms of service</b> and{" "}
          <b style={{ color: Colors.primaryColor }}>Privacy policy</b>
        </div>
      </div>
    </div>
  );
};

export default TimartPaymentCard;
