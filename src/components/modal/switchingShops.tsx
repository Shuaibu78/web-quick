import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../pages/settings/style";
import { Button } from "../button/Button";
import NoPermission from "../../assets/SwitchingShops.svg";
import { useAppSelector } from "../../app/hooks";
import { setIsNoProductModal } from "../../app/slices/accountLock";
import { useDispatch } from "react-redux";
import { CancelButton } from "../../pages/sales/style";

const SwitchingShops = () => {
  const { isSwitchigShops } = useAppSelector((state) => state.accountLock);
  const dispatch = useDispatch();
  return (
    <>
      {isSwitchigShops ? (
        <ModalContainer>
          <ModalBox position width="26rem" textMargin="0 0">
            <Flex justifyContent="flex-end">
              <CancelButton hover onClick={() => dispatch(setIsNoProductModal(false))}>
                X
              </CancelButton>
            </Flex>
            <Flex height="fit-content" direction="column" justifyContent="center">
              <Flex height="15rem" justifyContent="center">
                <img src={NoPermission} alt="" />
              </Flex>
              <Span color={Colors.grey} textAlign="center" margin="0.625rem 0">
                <h3>You’re currently switching shops</h3>
                Please wait while we sync data of the shop
              </Span>
            </Flex>
            <Button
              margin="0.9375rem 0"
              label="Loading..."
              width="100%"
              height="2.5rem"
              borderRadius="0.75rem"
              color={Colors.white}
              backgroundColor={Colors.primaryColor}
            />
          </ModalBox>
        </ModalContainer>
      ) : null}
    </>
  );
};

export default SwitchingShops;
