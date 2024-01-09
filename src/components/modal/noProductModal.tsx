import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../pages/settings/style";
import { Button } from "../button/Button";
import NoPermission from "../../assets/NoProductModal.svg";
import { useAppSelector } from "../../app/hooks";
import { setIsNoProductModal } from "../../app/slices/accountLock";
import { useDispatch } from "react-redux";
import { CancelButton } from "../../pages/sales/style";
import { useNavigate } from "react-router-dom";

const NoProductModal = () => {
  const { isNoProductModalActive } = useAppSelector((state) => state.accountLock);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      {isNoProductModalActive ? (
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
                <h3>You don’t have any product to sell</h3>
                To make sales on your shop, you need to add your products or services you offer
                first!
              </Span>
            </Flex>
            <Button
              margin="0.9375rem 0"
              label="Start Adding Products"
              width="100%"
              height="2.5rem"
              borderRadius="0.75rem"
              color={Colors.white}
              backgroundColor={Colors.primaryColor}
              onClick={() => {
                navigate("/dashboard/product/add");
                dispatch(setIsNoProductModal(false));
              }}
            />
          </ModalBox>
        </ModalContainer>
      ) : null}
    </>
  );
};

export default NoProductModal;
