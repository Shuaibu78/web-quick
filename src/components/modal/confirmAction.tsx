import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../pages/settings/style";
import { Button } from "../button/Button";
import { CancelButton } from "../../pages/sales/style";
import Cancel from "../../assets/cancel.svg";

const ConfirmAction = ({
  setConfirmSignout,
  doAction,
  action,
  actionText,
}: {
  setConfirmSignout: Function;
  doAction: Function;
  action: string;
  actionText: string;
}) => {
  return (
    <>
      <ModalContainer>
        <ModalBox position width="26rem" textMargin="0 0">
          <Flex justifyContent="flex-end">
            <CancelButton
              style={{
                width: "1.875rem",
                height: "1.875rem",
                display: "grid",
                placeItems: "center",
              }}
              hover
              onClick={() => setConfirmSignout(false)}
            >
              <img src={Cancel} alt="" />
            </CancelButton>
          </Flex>
          <Flex
            height="fit-content"
            direction="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Span color={Colors.grey} textAlign="center">
              <h3>{action}</h3>
            </Span>
            <Span color={Colors.grey} textAlign="center" margin="0.625rem 0">
              {actionText}
            </Span>
          </Flex>
          <Flex gap="1em">
            <Button
              margin="0.9375rem 0"
              label="Cancel"
              width="100%"
              height="2.5rem"
              fontSize="1em"
              borderRadius="0.75rem"
              color={Colors.grey}
              backgroundColor={Colors.offWhite}
              onClick={() => setConfirmSignout(false)}
            />
            <Button
              margin="0.9375rem 0"
              label={action}
              width="100%"
              fontSize="1em"
              height="2.5rem"
              borderRadius="0.75rem"
              color={Colors.white}
              backgroundColor={Colors.red}
              onClick={() => {
                doAction();
                setConfirmSignout(false);
              }}
            />
          </Flex>
        </ModalBox>
      </ModalContainer>
    </>
  );
};

export default ConfirmAction;
