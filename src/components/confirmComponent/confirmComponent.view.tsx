import { confirmable } from "react-confirm";
import { DarkText, Flex } from "../../pages/onlinePresence/style.onlinePresence";
import { Button } from "../button/Button";
import { Colors } from "../../GlobalStyles/theme";
import Cancel from "./../../assets/cancel.svg";
import { ModalContainer } from "../expenseModal/style";
import { ICustomConfirmOptions } from "./cofirmComponent";

interface IConfirmComponent {
  show: boolean;
  proceed: (value: boolean) => void;
  confirmation: string;
  options: ICustomConfirmOptions;
}

const ConfirmComponent = ({ show, proceed, confirmation, options = {} }: IConfirmComponent) => {
  return show ? (
    <ModalContainer style={{ zIndex: "99999" }}>
      <Flex bgColor="#fff" borderRadius="0.75rem" p="2rem" pb="1rem" direction="column">
        <DarkText>{confirmation}</DarkText>
        <Flex mt="1rem" gap="1rem" justifyContent="right">
          <Button
            label={options.decline ?? "Cancel"}
            onClick={() => proceed(false)}
            backgroundColor="transparent"
            size="sm"
            fontSize="0.875rem"
            borderRadius="0.5rem"
            borderColor="#FFA412"
            color="#FFA412"
            borderSize="2px"
            height="2rem"
            type="button"
            border
          />
          <Button
            label={options.accept ?? "Okay"}
            onClick={() => proceed(true)}
            backgroundColor={Colors.primaryColor}
            size="sm"
            fontSize="0.875rem"
            borderRadius="0.5rem"
            borderColor="transparent"
            color="#fff"
            height="2rem"
            borderSize="0px"
          />
        </Flex>
      </Flex>
    </ModalContainer>
  ) : null;
};

export default confirmable(ConfirmComponent);
