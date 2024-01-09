import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../pages/settings/style";
import { Button } from "../button/Button";
import NoPermission from "../../assets/NoPermission.svg";
import { useAppSelector } from "../../app/hooks";
import { setNoPermissionModal } from "../../app/slices/accountLock";
import { useDispatch } from "react-redux";
import { CancelButton } from "../../pages/sales/style";
import Cancel from "../../assets/cancel.svg";

const NoPermissionModal = () => {
  const { noPermisssionModalActive } = useAppSelector((state) => state.accountLock);
  const dispatch = useDispatch();
  return (
    <>
      {noPermisssionModalActive ? (
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
                onClick={() => dispatch(setNoPermissionModal(false))}
              >
                <img src={Cancel} alt="" />
              </CancelButton>
            </Flex>
            <Flex height="fit-content" direction="column" justifyContent="center">
              <Flex height="15rem" justifyContent="center">
                <img src={NoPermission} alt="" />
              </Flex>
              <Span color={Colors.grey} textAlign="center" margin="0.625rem 0">
                <h3>You don’t have permission here!</h3>
                You do not have permission to access this feature. kindly contact shop owner to
                request access to continue.
              </Span>
            </Flex>
            <Button
              margin="0.9375rem 0"
              label="I Understand"
              width="100%"
              height="2.5rem"
              borderRadius="0.75rem"
              color={Colors.white}
              backgroundColor={Colors.primaryColor}
              onClick={() => dispatch(setNoPermissionModal(false))}
            />
          </ModalBox>
        </ModalContainer>
      ) : null}
    </>
  );
};

export default NoPermissionModal;
