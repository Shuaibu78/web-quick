import { Flex, Span, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../settings/style";
import cancelIcon from "../../../assets/cancel.svg";
import { FunctionComponent } from "react";
import { TimerIcon } from "../icons";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const HistoryDetails: FunctionComponent<IProps> = ({ setShowModal }) => {
  return (
    <ModalContainer>
      <ModalBox width='35%'>
        <h3
          style={{
            marginBottom: "32px",
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
            color: Colors.primaryColor,
          }}
        >
          <span>History Details</span>
          <button
            onClick={() => setShowModal(false)}
            style={{ background: "transparent", border: "1px solid black" }}
          >
            <img src={cancelIcon} alt="" />
          </button>
        </h3>
        <Flex direction="column" gap="1rem">
          <div>
            <Flex margin="0.5rem 0" gap="0.5rem" alignItems="center">
              <TimerIcon />
              <Text color={Colors.secondaryColor}>1 Jun 2022  09:23am</Text>
            </Flex>
            <hr style={{ width: "100%", borderColor: Colors.lightBlue, height: "1px", opacity: "0.2" }} />
          </div>

          <Flex direction="column">
            <Text color={Colors.grey}>Payment Recorded</Text>
            <Text color={Colors.blackLight}><Span color={Colors.green}>₦5000</Span> Cash</Text>
          </Flex>

          <Flex direction="column">
            <Text color={Colors.grey}>Invoice Updated</Text>
            <Text color={Colors.blackLight}>Two (3) details updated</Text>
          </Flex>

          <Flex direction="column">
            <Text color={Colors.grey}>Staff</Text>
            <Text color={Colors.blackishBlue}>
              <i>Muhammad Kabir</i>
            </Text>
          </Flex>

          <Flex direction="column">
            <Text color={Colors.grey}>Comments</Text>
            <Text color={Colors.blackishBlue}>
              Lorem ipsum dolor sit amet consectetur.
              Nisi amet volutpat dolor quis ut.
              Tellus lorem habitasse vitae
            </Text>
          </Flex>
        </Flex>
      </ModalBox>
    </ModalContainer>
  );
};

export default HistoryDetails;
