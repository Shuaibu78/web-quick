import { FunctionComponent } from "react";
import { ModalBox } from "../../settings/style";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import cancelIcon from "../../../assets/cancel.svg";
import { ICustomer } from "../../../interfaces/inventory.interface";
import ProfileIcon from "../../../assets/profile-icon-invoice.svg";

interface IProps {
  setShowCustomerList: Function;
  customerList: ICustomer[];
  setCustomer: Function;
};

const Customerlist: FunctionComponent<IProps> = ({
  setShowCustomerList,
  customerList,
  setCustomer
}) => {
  const handleSelectCustomer = (customer: ICustomer) => {
    setCustomer(customer);
    setShowCustomerList(false);
  };

  return (
    <ModalBox width="35%">
      <h3
        style={{
          marginBottom: "32px",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          color: Colors.primaryColor,
        }}
      >
        <span>My Customers</span>
        <button
          onClick={() => setShowCustomerList(false)}
          style={{ background: "transparent", border: "1px solid black" }}
        >
          <img src={cancelIcon} alt="" />
        </button>
      </h3>
      <Flex gap="3em" direction="column">
        {customerList.map((customer) => {
          const { customerId, customerName, phoneNumber } = customer;
          return (
            <Flex key={customerId} cursor="pointer" gap="0.5rem" alignItems="center" onClick={() => handleSelectCustomer(customer)}>
              <img src={ProfileIcon} />
              <div>
                <Text color={Colors.blackishBlue} fontSize="1rem">{customerName}</Text>
                <Text color={Colors.blackLight} fontSize="0.75rem">{phoneNumber || "N/A"}</Text>
              </div>
            </Flex>
          );
        })}
      </Flex>
    </ModalBox>
  );
};

export default Customerlist;
