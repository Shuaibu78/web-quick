import { FunctionComponent } from "react";
import { Colors } from "../../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../settings/style";
import cancelIcon from "../../../assets/cancel.svg";
import { Flex, Span, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { TextArea } from "../../sales/style";
import { Button } from "../../../components/button/Button";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MarkSettled: FunctionComponent<IProps> = ({ setShowModal }) => {
  const confirm = () => {};

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
          <span>Mark as Settled</span>
          <button
            onClick={() => setShowModal(false)}
            style={{ background: "transparent", border: "1px solid black" }}
          >
            <img src={cancelIcon} alt="" />
          </button>
        </h3>
        <Flex direction="column" gap="1rem">
          <Text color={Colors.blackishBlue}>
            Are you sure you want to mark invoice <Span fontWeight="600">INV_0132933</Span> as shipped/settled?
          </Text>
          <Flex></Flex>
          <TextArea placeholder="comments" />
          <Button
            label={"Confirm"}
            onClick={confirm}
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
      </ModalBox>
    </ModalContainer>
  );
};

export default MarkSettled;
