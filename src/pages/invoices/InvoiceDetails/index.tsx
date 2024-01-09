import { FunctionComponent, useState, useEffect, useRef } from "react";
import { Flex, Span, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { ModalBox } from "../../settings/style";
import cancelIcon from "../../../assets/cancel.svg";
import { getImageUrl } from "../../../helper/image.helper";
import { Button } from "../../../components/button/Button";
import InvoiceActions from "./InvoiceActions";
import MarkSettled from "./MarkSettled";
import { InputWrapper } from "../../login/style";
import { InputField } from "../../../components/input-field/input";
import { TextArea } from "../../sales/style";
import { ArrowDown, ArrowUp, GreenTick, WarningCircle, WhiteTick } from "../icons";
import HistoryDetails from "./HistoryDetails";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArrowBottom = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
      <path d="M4.36602 6C3.98112 6.66667 3.01887 6.66667 2.63397 6L0.468911 2.25C0.0840106 1.58333 0.565136 0.75 1.33494 0.75L5.66507 0.75C6.43487 0.75 6.91599 1.58333 6.53109 2.25L4.36602 6Z" fill="#9EA8B7"/>
    </svg>
  );
};

const InventoryItem = () => {
  return (
    <div style={{ margin: "0.75rem 0" }}>
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Flex gap="0.5rem">
          <Flex
            alignItems="center"
            justifyContent="center"
            width="40px"
            height="40px"
            borderRadius="0.5rem"
          >
            <img style={{ width: "100%", height: "100%" }} src={getImageUrl(undefined)} />
          </Flex>
          <Flex direction="column" gap="0.5rem">
            <Text color={Colors.primaryGrey}>Indomie 120g</Text>
            <Text color={Colors.grey}>₦ 1,000 (Pack) x3</Text>
          </Flex>
        </Flex>
        <Text color={Colors.blackishBlue} fontWeight="500">N 3,000</Text>
      </Flex>
      <Text color={Colors.blackLight} margin="0.75rem 0 0 0">
        This is  a replica of the iphone with two better changes.
      </Text>
    </div>
  );
};

type TPaymentType = "cash" | "pos" | "transfer";

const InvoiceDetails: FunctionComponent<IProps> = ({ setShowModal }) => {
  const [tab, setTab] = useState<"details" | "payment" | "history">("details");
  const [showShippingAddress, setShowShippingAddress] = useState<boolean>(false);
  const [showInvoiceActions, setShowInvoiceActions] = useState<boolean>(false);
  const [showHistoryDetails, setShowHistoryDetails] = useState<boolean>(false);
  const [showSettled, setShowSettled] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<TPaymentType>("cash");
  const [amount, setAmount] = useState<string>();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [buttonsHeight, setButtonsHeight] = useState(0);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (headerRef.current) {
      const divHeightInPixels = headerRef.current.offsetHeight;
      setHeaderHeight(divHeightInPixels);
    }
  }, [headerRef]);

  useEffect(() => {
    if (buttonsRef.current) {
      const divHeightInPixels = buttonsRef.current.offsetHeight;
      setButtonsHeight(divHeightInPixels);
    }
  }, [buttonsRef]);

  const paymentSelectedColor = (type: TPaymentType) => {
    if (type === paymentType) {
      return {
        color: Colors.green,
        bg: Colors.lightGreen,
        isSelected: true
      };
    }
    return {
      color: Colors.grey,
      bg: Colors.lightBg,
      isSelected: false
    };
  };

  const recordPayment = () => {};

  return (
    <ModalBox width="35%" minHeight="90vh" padding="0" style={{ background: "#F3F4FA" }}>
        <Flex direction="column" width="35%" ref={headerRef} borderRadius="1.25rem 1.2rem 0 0" padding="0 1.875rem" style={{ zIndex: "10", background: "#fff", top: "5vh", position: "fixed" }}>
          <h3
            style={{
              marginBottom: "32px",
              justifyContent: "space-between",
              alignItems: "center",
              display: "flex",
              color: Colors.primaryColor,
            }}
          >
            <span>INV_0132933</span>
            <button
              onClick={() => setShowModal(false)}
              style={{ background: "transparent", border: "1px solid black" }}
            >
              <img src={cancelIcon} alt="" />
            </button>
          </h3>
          <Flex gap="0.75rem">
            <Text
              onClick={() => setTab("details")}
              className={`details-tab ${tab === "details" ? "active-details-tab" : ""}`}
            >
              Details
            </Text>
            <Text
              onClick={() => setTab("payment")}
              className={`details-tab ${tab === "payment" ? "active-details-tab" : ""}`}
            >
              Payments & Status
            </Text>
            <Text
              onClick={() => setTab("history")}
              className={`details-tab ${tab === "history" ? "active-details-tab" : ""}`}
            >
              History
            </Text>
          </Flex>
        </Flex>
        <Flex gap="3em" direction="column" padding="1.25rem 1.875rem" bg="#fff" margin={`${headerHeight + 10}px 0 ${tab === "details" ? buttonsHeight : "0"}px 0`}>
          {tab === "details" &&
            <>
              <Flex margin="0.5rem 0" direction="column" gap="1rem">
                <Flex alignItems="center">
                  <Text color={Colors.grey} width="15ch">Invoice Date</Text>
                  <Text color={Colors.blackLight}>08 0ct 2023</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text color={Colors.grey} width="15ch">Terms</Text>
                  <Text color={Colors.blackLight}>Due on Receipt</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text color={Colors.grey} width="15ch">Due Date</Text>
                  <Text color={Colors.blackLight}>24 Oct 2023</Text>
                </Flex>
              </Flex>

              <hr style={{ width: "100%", borderColor: Colors.lightBlue, height: "1px", opacity: "0.2" }} />

              <Flex margin="0.5rem 0" direction="column" gap="1rem">
                <Flex alignItems="center">
                  <Text color={Colors.grey} width="15ch">Client</Text>
                  <Text color={Colors.blackLight}>Muhammad Kabir</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text color={Colors.grey} width="15ch">Mobile</Text>
                  <Text color={Colors.blackLight}>+234 803 675 9786</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text color={Colors.grey} width="15ch">Email</Text>
                  <Text color={Colors.blackLight}>example@gmail.com</Text>
                </Flex>
                {showShippingAddress &&
                  <>
                    <Flex alignItems="center">
                      <Text color={Colors.grey} width="15ch">Address</Text>
                      <Text color={Colors.blackLight}>Zone C 29 Farm Centre Tunga Minna</Text>
                    </Flex>
                    <Flex alignItems="center">
                      <Text color={Colors.grey} width="15ch">Country</Text>
                      <Text color={Colors.blackLight}>Nigeria</Text>
                    </Flex>
                    <Flex alignItems="center">
                      <Text color={Colors.grey} width="15ch">City</Text>
                      <Text color={Colors.blackLight}>Minna</Text>
                    </Flex>
                  </>
                }
                <Flex
                  margin="1rem 0"
                  cursor="pointer"
                  justifyContent="center"
                  alignItems="center"
                  gap="0.5rem"
                  onClick={() => setShowShippingAddress(!showShippingAddress)}
                >
                  <Text color={Colors.secondaryColor} fontWeight="500">See Shipping Details</Text>
                  {showShippingAddress ? <ArrowUp /> : <ArrowDown />}
                </Flex>

                <Text color={Colors.grey} fontSize="1rem">Products/Services</Text>
                <hr style={{ width: "100%", borderColor: Colors.lightBlue, height: "1px", opacity: "0.2" }} />

                <InventoryItem />
                <InventoryItem />
                <InventoryItem />

                <hr style={{ width: "100%", borderColor: Colors.lightBlue, height: "1px", opacity: "0.2" }} />

                <Flex direction="column" gap="1rem" alignItems="flex-end">
                  <Flex width="50%" justifyContent="space-between" alignItems="center">
                    <Text color={Colors.blackishBlue} fontWeight="500">Sub Total</Text>
                    <Text color={Colors.blackishBlue} fontWeight="500">N 3,000</Text>
                  </Flex>

                  <Flex width="50%" justifyContent="space-between" alignItems="center">
                    <Text color={Colors.blackishBlue} fontWeight="500">Shipping Fee</Text>
                    <Text color={Colors.blackishBlue} fontWeight="500">N 2,000</Text>
                  </Flex>

                  <Flex width="50%" justifyContent="space-between" alignItems="center">
                    <Text color={Colors.blackishBlue} fontWeight="500">Discount</Text>
                    <Text color={Colors.blackishBlue} fontWeight="500">N 2,000</Text>
                  </Flex>

                  <Flex width="50%" justifyContent="space-between" alignItems="center">
                    <Text color={Colors.blackishBlue} fontWeight="500">Tax (VAT Incl)</Text>
                    <Text color={Colors.blackishBlue} fontWeight="500">N 2,000</Text>
                  </Flex>

                  <Flex width="50%" justifyContent="space-between" alignItems="center">
                    <Text color={Colors.blackishBlue} fontWeight="500">Total</Text>
                    <Text color={Colors.blackishBlue} fontWeight="500">N 2,000</Text>
                  </Flex>

                  <Flex width="50%" justifyContent="space-between" alignItems="center">
                    <Text color={Colors.blackishBlue} fontWeight="500">Balance Due</Text>
                    <Text color={Colors.blackishBlue} fontWeight="500">N 2,000</Text>
                  </Flex>
                </Flex>

                <Text color={Colors.grey} fontSize="1rem">Notes</Text>
                <hr style={{ width: "100%", borderColor: Colors.lightBlue, height: "1px", opacity: "0.2" }} />
                <Text color={Colors.blackishBlue}>
                  Thank you for trusting in us. Do come again.
                </Text>

                <Text color={Colors.grey} fontSize="1rem">Terms & Conditions</Text>
                <hr style={{ width: "100%", borderColor: Colors.lightBlue, height: "1px", opacity: "0.2" }} />
                <Text color={Colors.blackishBlue}>
                  Lorem ipsum dolor sit amet consectetur. Morbi ultrices cras facilisis ut interdum.
                    Pharetra cursus morbi massa velit nibh. Aliquet sapien eget mauris suspendisse.
                </Text>

                <Flex gap="0.75rem" position="absolute" ref={buttonsRef} style={{ zIndex: "10", bottom: "7vh", width: "32%", backdropFilter: "blur(1px)" }}>
                  <Button
                    label={"Edit Invoice"}
                    onClick={() => console.log(true)}
                    backgroundColor={Colors.secondaryColor}
                    size="lg"
                    color="#fff"
                    borderColor="transparent"
                    borderRadius="0.75rem"
                    borderSize="0px"
                    fontSize="1rem"
                    width="50%"
                    margin="2rem 0 0 0 "
                  />
                  <Button
                      label={"Invoice Actions"}
                      onClick={() => setShowInvoiceActions(true)}
                      backgroundColor={Colors.primaryColor}
                      size="lg"
                      color="#fff"
                      borderColor="transparent"
                      borderRadius="0.75rem"
                      borderSize="0px"
                      fontSize="1rem"
                      width="50%"
                      margin="2rem 0 0 0 "
                    />
                </Flex>
              </Flex>
            </>
          }

          {tab === "payment" &&
            <>
              <Flex direction="column" gap="0.75rem">
                <Flex alignItems="center">
                  <Text color={Colors.blackLight} width="15ch">Client</Text>
                  <Text color={Colors.blackishBlue}>Muhammad Kabir</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text color={Colors.blackLight} width="15ch">Balance</Text>
                  <Text color={Colors.danger}>₦ 2,000</Text>
                </Flex>
                <Flex alignItems="center">
                  <Text color={Colors.blackLight} width="15ch">Due Date</Text>
                  <Text color={Colors.blackishBlue}>30 Sep 2023</Text>
                </Flex>
              </Flex>

              <Flex direction="column" gap="0.5rem">
                <div>
                  <Text color={Colors.grey} fontSize="1rem" margin="0 0 0.75rem 0">Enter Payment Information</Text>
                  <hr style={{ width: "100%", borderColor: Colors.lightBlue, height: "1px", opacity: "0.2" }} />
                </div>

                <InputWrapper margin="1rem 0">
                  <InputField
                    label=""
                    placeholder="Amount recieved"
                    type="text"
                    backgroundColor="#F4F6F9"
                    size="lg"
                    color="#607087"
                    borderColor="transparent"
                    borderRadius="0.75rem"
                    borderSize="0px"
                    fontSize="1rem"
                    width="100%"
                    value={amount || ""}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </InputWrapper>

                <Flex gap="1rem" alignItems="center" margin="0 0 1rem 0">
                  <Flex
                    onClick={() => setPaymentType("cash")}
                    bg={paymentSelectedColor("cash").bg}
                    color={paymentSelectedColor("cash").color}
                    gap="0.5rem"
                    padding="0.5rem"
                    borderRadius="5px"
                    border={`1px solid ${paymentSelectedColor("cash").color}`}
                    cursor="pointer"
                    alignItems="center"
                  >
                    {paymentSelectedColor("cash").isSelected ? <GreenTick /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1px solid ${Colors.grey}` }} />}
                    Cash
                  </Flex>
                  <Flex
                    onClick={() => setPaymentType("pos")}
                    bg={paymentSelectedColor("pos").bg}
                    color={paymentSelectedColor("pos").color}
                    gap="0.5rem"
                    padding="0.5rem"
                    borderRadius="5px"
                    border={`1px solid ${paymentSelectedColor("pos").color}`}
                    cursor="pointer"
                    alignItems="center"
                  >
                    {paymentSelectedColor("pos").isSelected ? <GreenTick /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1px solid ${Colors.grey}` }} />}
                    POS
                  </Flex>
                  <Flex
                    onClick={() => setPaymentType("transfer")}
                    bg={paymentSelectedColor("transfer").bg}
                    color={paymentSelectedColor("transfer").color}
                    gap="0.5rem"
                    padding="0.5rem"
                    borderRadius="5px"
                    border={`1px solid ${paymentSelectedColor("transfer").color}`}
                    cursor="pointer"
                    alignItems="center"
                  >
                    {paymentSelectedColor("transfer").isSelected ? <GreenTick /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1px solid ${Colors.grey}` }} />}
                    Transfer
                  </Flex>
                </Flex>

                <TextArea placeholder="comments" />

                <Button
                  label={"Record Payment"}
                  onClick={recordPayment}
                  backgroundColor={Colors.primaryColor}
                  size="lg"
                  color="#fff"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="0px"
                  fontSize="1rem"
                  width="100%"
                  margin="2rem 0 0 0 "
                />
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <div>
                  <Text color={Colors.grey}>Invoice Status</Text>
                  <Text color={Colors.danger}>
                    <i>Not Shipped/Settled</i>
                  </Text>
                </div>
                <Flex onClick={() => setShowSettled(true)} alignItems="center" padding="0.65rem" borderRadius="15px" bg={Colors.green} color="#fff" gap="0.5rem" cursor="pointer">
                  Mark as Settled
                  <WhiteTick />
                </Flex>
              </Flex>

              <Flex bg={Colors.lightBg} padding="0.75rem" alignItems="center" gap="0.75rem">
                <WarningCircle />
                <Text color={Colors.blackLight}>
                  <Span color={Colors.blackishBlue}>NOTE</Span>:
                  Use the <Span color={Colors.secondaryColor}>“Mark as Settled”</Span> button to
                  confirm the shipment of products or the
                  completion of rendered services..
                </Text>
              </Flex>
            </>
          }

          {tab === "history" &&
            <Flex gap="1rem" direction="column">
              <Flex position="relative" direction="column" border={`1px solid ${Colors.grey}`} borderRadius="10px" padding="1rem">
                <Flex onClick={() => setShowHistoryDetails(true)} alignItems="flex-start" justifyContent="space-between" cursor="pointer">
                  <div>
                    <Text color={Colors.blackishBlue}>Mark as settled</Text>
                    <Text color={Colors.secondaryColor}>1 Jun 2022  09:23am</Text>
                  </div>
                  <Text color={Colors.green}>Shipped/Settled</Text>
                </Flex>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: "3px", margin: "auto", width: "fit-content" }}><ArrowBottom /></div>
              </Flex>

              <Flex position="relative" direction="column" border={`1px solid ${Colors.grey}`} borderRadius="10px" padding="1rem">
                <Flex onClick={() => setShowHistoryDetails(true)} alignItems="flex-start" justifyContent="space-between" cursor="pointer">
                  <div>
                    <Text color={Colors.blackishBlue}>Mark as settled</Text>
                    <Text color={Colors.secondaryColor}>1 Jun 2022  09:23am</Text>
                  </div>
                  <Text color={Colors.blackishBlue}>₦ 500,000</Text>
                </Flex>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: "3px", margin: "auto", width: "fit-content" }}><ArrowBottom /></div>
              </Flex>
            </Flex>
          }
        </Flex>
        {showInvoiceActions && <InvoiceActions setShowModal={setShowInvoiceActions} />}
        {showSettled && <MarkSettled setShowModal={setShowSettled} />}
        {showHistoryDetails && <HistoryDetails setShowModal={setShowHistoryDetails} />}
    </ModalBox>
  );
};

export default InvoiceDetails;
