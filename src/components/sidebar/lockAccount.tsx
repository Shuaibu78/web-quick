/* eslint-disable indent */
import React, { FunctionComponent, useEffect, useState } from "react";
import { Button } from "../button/Button";
import { InputField } from "../input-field/input";
import cancelIcon from "../../assets/cancel.svg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getCurrentUser } from "../../app/slices/userInfo";
import {
  defaultCashierRoles,
  defaultSalesRoles,
  DefualtManagerRoles,
} from "../../utils/defaultRoles.utils";
import { getUserPermissions } from "../../app/slices/roles";
import _ from "lodash";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import FallBackImage from "../../assets/Image.svg";
import { lock, showLockModal } from "../../app/slices/accountLock";
import { Colors } from "../../GlobalStyles/theme";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CAN_USER_SET_PIN, CREATE_USER_PIN } from "../../schema/auth.schema";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { ModalBox, ModalContainer } from "../expenseModal/style";
import { UserCredentialsAttr } from "../../interfaces/user.interface";
import { isLoading } from "../../app/slices/status";

interface LockAccountProps {
  closePreLockModal: Function;
  setShowWarn: Function;
}
const LockAccount: FunctionComponent<LockAccountProps> = ({ closePreLockModal, setShowWarn }) => {
  const [pin, setPin] = useState("");
  const [canChangePin, setCanChangePin] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getCurrentUser);
  const userRole = useAppSelector(getUserPermissions);
  const { blackishBlue, blackLight, primaryColor } = Colors;

  useEffect(() => {
    const isManager = _.isEqual(userRole.permissions, DefualtManagerRoles.rolePermissions);
    const isCashier = _.isEqual(userRole.permissions, defaultCashierRoles.rolePermissions);
    const isSales = _.isEqual(userRole.permissions, defaultSalesRoles.rolePermissions);
    isManager
      ? setCurrentUserRole("Manager")
      : isSales
      ? setCurrentUserRole("Sales Person")
      : isCashier && setCurrentUserRole("Cashier");
  }, [userRole]);

  const handleCloseModal = () => {
    dispatch(closePreLockModal());
    setShowWarn(false);
  };

  const [getUserPinData] = useLazyQuery<{
    canSetUserPin: boolean;
  }>(CAN_USER_SET_PIN, {
    fetchPolicy: "cache-and-network",
    onCompleted(data) {
      setCanChangePin(data?.canSetUserPin);
    },
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  useEffect(() => {
    getUserPinData();
  }, []);

  const [createUserPin] = useMutation<{ createUserPin: UserCredentialsAttr }>(CREATE_USER_PIN, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleLock = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!pin) {
      dispatch(toggleSnackbarOpen({ message: "Set your pin first!", color: "INFO" }));
      return;
    }

    createUserPin({
      variables: {
        pin,
      },
    })
      .then(async (res) => {
        if (res.data) {
          dispatch(isLoading(false));
          dispatch(showLockModal());
          dispatch(lock({ lock: true }));
          setShowWarn(false);
        }
      })
      .catch((error) => {
        dispatch(isLoading(false));
        dispatch(
          toggleSnackbarOpen({
            message: error?.message || error?.graphQLErrors[0]?.message,
            color: "SUCCESS",
          })
        );
      });
  };

  return (
    <ModalContainer>
      <ModalBox>
        <h3 style={{ margin: "0px", marginBottom: "1em" }}>
          <button onClick={handleCloseModal}>
            <img src={cancelIcon} alt="" />
          </button>
          <span style={{ fontSize: "0.85em" }}>Are you sure you want to end your shift?</span>
        </h3>

        <Flex direction="column" alignItems="center" gap="0.5em" margin="0 0 4em 0">
          <img
            src={
              // (image && URL.createObjectURL(image)) ||
              FallBackImage
            }
            alt=""
            id="user image"
            width="4.375rem"
          />
          <Span fontSize="1.2em" color={blackishBlue}>
            {currentUser.firstName}
          </Span>
          <Span fontSize="0.75rem" color={blackLight}>
            {userRole.isShopOwner ? "Shop Owner" : currentUserRole}
          </Span>
        </Flex>
        <InputField
          label="Enter pin to continue"
          placeholder="Enter pin to continue"
          type="password"
          noFormat={true}
          backgroundColor="#F4F6F9"
          size="lg"
          color={blackLight}
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          value={pin}
          labelMargin="0 0 1em 0!important"
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLock(e);
            }
          }}
        />
        <Button
          label="Continue"
          onClick={handleLock}
          backgroundColor={primaryColor}
          size="lg"
          color="#fff"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          margin="1em 0 1em 0"
        />
      </ModalBox>
    </ModalContainer>
  );
};

export default LockAccount;
