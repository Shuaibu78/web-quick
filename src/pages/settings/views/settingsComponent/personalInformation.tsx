/* eslint-disable indent */
import { Flex, Span } from "../../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../../GlobalStyles/theme";
import { SalesCard } from "../../../home/style";
import { BoxHeading, ButtonPlusIcon, ShopTitleCont } from "../../settingsComps.style";
import DefaultSettingsImg from "../../../../assets/ProfileAlteColor.svg";
import EditFigorr from "../../../../assets/EditPryFigorr.svg";
import Edit from "../../../../assets/EditPry.svg";
import Cancel from "../../../../assets/cancel.svg";
import DeleteShopIcon from "../../../../assets/LeaveShopIconRed.svg";
import { useAppSelector } from "../../../../app/hooks";
import { getCurrentUser, setUserInfo } from "../../../../app/slices/userInfo";
import { getUserPermissions, setRole } from "../../../../app/slices/roles";
import {
  DefualtManagerRoles,
  defaultSalesRoles,
  defaultCashierRoles,
} from "../../../../utils/defaultRoles.utils";
import { useEffect, useState } from "react";
import _ from "lodash";
import { rpcClient } from "../../../../helper/rpcClient";
import {
  CAN_USER_SET_PIN,
  DELETE_USER,
  GETUSER,
  GET_USERS_WITH_PIN,
  UPDATE_USER,
} from "../../../../schema/auth.schema";
import { useDispatch } from "react-redux";
import { showLockModal } from "../../../../app/slices/accountLock";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { setCurrentShop, setShops } from "../../../../app/slices/shops";
import { useNavigate } from "react-router-dom";
import ConfirmAction from "../../../../components/modal/confirmAction";
import { throwIfNoInternetConnection } from "../../../../utils/checkInternet.utils";
import { setSession } from "../../../../app/slices/session";
import { isFigorr } from "../../../../utils/constants";
import { ModalBox, ModalContainer } from "../../style";
import { CancelButton } from "../../../sales/style";
import { InputField } from "../../../../components/input-field/input";
import { Button } from "../../../../components/button/Button";
import { isLoading } from "../../../../app/slices/status";
import { IUpdateUser } from "../../../../interfaces/user.interface";

interface IInput {
  name: string;
  surname: string;
}

const PersonalInformation = () => {
  const userRole = useAppSelector(getUserPermissions);
  const currentUser = useAppSelector(getCurrentUser);
  const [currentUserRole, setCurrentUserRole] = useState<string>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmSignout, setConfirmSignout] = useState<boolean>();
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<boolean>();
  const [ableToSetPin, setAbleToSetPin] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [formInput, setFormInput] = useState<IInput>({
    name: "",
    surname: "",
  });

  useEffect(() => {
    const isManager = _.isEqual(userRole.permissions, DefualtManagerRoles.rolePermissions);
    const isCashier = _.isEqual(userRole.permissions, defaultCashierRoles.rolePermissions);
    const isSales = _.isEqual(userRole.permissions, defaultSalesRoles.rolePermissions);
    isManager
      ? setCurrentUserRole("Manager")
      : isSales
      ? setCurrentUserRole("Sales Person")
      : isCashier
      ? setCurrentUserRole("Cashier")
      : setCurrentUserRole("Custom Role");
  }, [userRole]);

  const { data: canSetUserPinData } = useQuery<{
    canSetUserPin: boolean;
  }>(CAN_USER_SET_PIN, {
    fetchPolicy: "cache-and-network",
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const { data: usersWithPin } = useQuery<{
    getAuthenticatedUsersWithPin: { userId: string; fullName: string }[];
  }>(GET_USERS_WITH_PIN, {
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const [getUserPinData] = useLazyQuery<{
    canSetUserPin: boolean;
  }>(CAN_USER_SET_PIN, {
    fetchPolicy: "cache-and-network",
    onCompleted(data) {
      setAbleToSetPin(data?.canSetUserPin);
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

  useEffect(() => {
    setFormInput({
      name: currentUser.firstName as string,
      surname: currentUser.lastName as string,
    });
  }, [showEditModal]);

  const handleLogout = async () => {
    try {
      try {
        await rpcClient.request("logoutUser", { userId: currentUser?.userId });
      } catch (error) {
        console.log(error);
      }

      if (
        ableToSetPin ||
        (usersWithPin && usersWithPin?.getAuthenticatedUsersWithPin?.length <= 1)
      ) {
        dispatch(setUserInfo({}));
        dispatch(setSession({}));
        navigate("/login");
        localStorage.clear();
      } else {
        dispatch(showLockModal());
        dispatch(setUserInfo({}));
      }

      dispatch(setShops([]));
      dispatch(setCurrentShop({}));
      dispatch(setRole({}));
    } catch (error) {
      console.error("Error logging out", error);
      localStorage.clear();
      navigate("/login");
    }
  };

  const [deleteUser] = useMutation(DELETE_USER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleDeleteUser = () => {
    (async () => {
      try {
        await throwIfNoInternetConnection();
        deleteUser({
          variables: {
            userId: currentUser.userId,
          },
        })
          .then(() => {
            dispatch(
              toggleSnackbarOpen({ message: "User deleted successfully", color: "SUCCESS" })
            );
          })
          .catch((err) => {
            dispatch(
              toggleSnackbarOpen({
                message: err?.message || err?.graphQLErrors[0]?.message,
                color: "DANGER",
              })
            );
          });
        handleLogout();
      } catch (error) {
        dispatch(
          toggleSnackbarOpen({
            message: "You are not connected to the internet",
            color: "DANGER",
          })
        );
      }
    })();
  };

  const [updateUser] = useMutation<IUpdateUser>(UPDATE_USER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleUpdateUser = async () => {
    try {
      dispatch(isLoading(true));
      const res = await updateUser({
        variables: {
          userId: currentUser.userId,
          firstName: formInput.name,
          lastName: formInput.surname,
        },
      });
      if (res.data?.updateUser) {
        dispatch(isLoading(false));
        setShowEditModal(false);

        rpcClient.request("getUserInfo", { userId: currentUser.userId }).then((userInfo) => {
          if (userInfo) dispatch(setUserInfo(userInfo));
        });

        dispatch(
          toggleSnackbarOpen({
            message: "Updated Successfully",
            color: "SUCCESS",
          })
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(isLoading(false));
      setShowEditModal(false);
      dispatch(
        toggleSnackbarOpen({
          message: error.message || error.graphqlErrors[0]?.message,
          color: "DANGER",
        })
      );
    }
  };

  const handleInput = (key: "name" | "surname", value: string) => {
    setFormInput((prevInput) => {
      const inputCopy: IInput = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  return (
    <>
      <BoxHeading>
        Personal Information
        <p>Please enter your current passowrd to update business details</p>
      </BoxHeading>

      <div style={{ marginTop: "1.5rem" }}></div>
      <SalesCard
        style={{ border: `2px solid ${Colors.borderGreyColor}` }}
        height="6.25rem"
        background="#fff"
        width="100%"
      >
        <Flex justifyContent="space-between" width="100%" alignItems="center">
          <Flex>
            <Flex
              alignItems="center"
              justifyContent="center"
              bg="#130F26"
              height="4.4rem"
              width="4.4rem"
              borderRadius="0.5rem"
            >
              <img src={DefaultSettingsImg} height="50%" width="50%" alt="" />
            </Flex>

            <ShopTitleCont color={Colors.blackishBlue}>
              {currentUser.fullName}
              <p>{currentUser.mobileNumber}</p>
              {/* <p className="button">Add Photo</p> */}
            </ShopTitleCont>
          </Flex>
          <Flex>
            <ButtonPlusIcon
              onClick={() => setConfirmSignout(true)}
              bgColor={Colors.lightRed}
              color={Colors.red}
            >
              <img src={DeleteShopIcon} alt="" />
              Logout
            </ButtonPlusIcon>
          </Flex>
        </Flex>
      </SalesCard>

      <Flex
        border={`1px solid ${Colors.borderGreyColor}`}
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="100%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        <Flex
          width="100%"
          margin="0px 0 0.625rem 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <ShopTitleCont fontWeight="500" color={Colors.blackishBlue}>
            My details
          </ShopTitleCont>
          <ButtonPlusIcon
            style={{ fontSize: "0.75rem", cursor: "pointer" }}
            color={Colors.primaryColor}
            onClick={() => setShowEditModal(!showEditModal)}
          >
            Edit
            <img height="0.875rem" src={isFigorr ? EditFigorr : Edit} alt="" />
          </ButtonPlusIcon>
        </Flex>

        <Flex
          width="70%"
          margin="0 0 0.3125rem 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem" }}>
            <ShopTitleCont color={Colors.blackLight}>
              <p>First Name</p>
              {currentUser.firstName}
            </ShopTitleCont>
            <ShopTitleCont color={Colors.blackLight}>
              <p>My Phone</p>
              {currentUser.mobileNumber}
            </ShopTitleCont>
          </div>
          <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem" }}>
            <ShopTitleCont color={Colors.blackLight}>
              <p>Last Name</p>
              {currentUser.lastName}
            </ShopTitleCont>
            <ShopTitleCont color={Colors.blackLight}>
              <p>Email</p>
              {currentUser.email}
            </ShopTitleCont>
          </div>
        </Flex>
      </Flex>

      <Flex
        border={`1px solid ${Colors.borderGreyColor}`}
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="100%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        <Flex
          width="100%"
          margin="0px 0 0.625rem 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <Span margin="0px 1.25rem" fontWeight="500" color={Colors.blackishBlue}>
            Bussiness Role{" "}
            <span style={{ color: Colors.grey, fontWeight: "400" }}>(On current shop)</span>
          </Span>
        </Flex>

        <Flex margin="0 0 0.3125rem 0.3125rem" alignItems="center" justifyContent="space-between">
          <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem" }}>
            <ShopTitleCont color={Colors.blackLight}>
              <p>Role</p>
              {userRole.isShopOwner ? "Shop Owner" : currentUserRole}
            </ShopTitleCont>
          </div>
        </Flex>
      </Flex>

      <Flex
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="100%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        {/* <Flex
          margin="0px 0px 1.875rem 0px"
          width="98%"
          alignItems="center"
          justifyContent="space-between"
        >
          <BoxHeading color={Colors.blackLight}>
            Deactivate my Account
            <p>
              This will shutdown your account. Your account will be reactive when you sign in again.
            </p>
          </BoxHeading>

          <Span style={{ cursor: "pointer" }} color={Colors.grey}>
            Deatcivate
          </Span>
        </Flex> */}

        <Flex width="98%" alignItems="center" justifyContent="space-between">
          <BoxHeading color={Colors.blackLight}>
            Delete Account
            <p>
              This will shutdown your account. Your account will be reactive when you sign in again.
            </p>
          </BoxHeading>

          <Span
            onClick={() => setConfirmDeleteUser(true)}
            style={{ cursor: "pointer" }}
            color={Colors.red}
          >
            Delete
          </Span>
        </Flex>
      </Flex>

      {confirmSignout && (
        <ConfirmAction
          action="Logout"
          actionText="Are you sure you want to logout?"
          setConfirmSignout={setConfirmSignout}
          doAction={handleLogout}
        />
      )}

      {confirmDeleteUser && (
        <ConfirmAction
          action="Delete User"
          actionText="Are you sure you want to delete this account?"
          setConfirmSignout={setConfirmDeleteUser}
          doAction={handleDeleteUser}
        />
      )}

      {showEditModal && (
        <>
          <ModalContainer>
            <ModalBox position width="26rem" textMargin="0 0">
              <Flex justifyContent="space-between">
                <div>
                  <h3>Update Personal Details</h3>
                  <Span color={Colors.grey}>Update and save new changes to your info.</Span>
                </div>
                <CancelButton
                  style={{
                    width: "1.875rem",
                    height: "1.875rem",
                    display: "grid",
                    placeItems: "center",
                  }}
                  hover
                  onClick={() => setShowEditModal(false)}
                >
                  <img src={Cancel} alt="" />
                </CancelButton>
              </Flex>
              <Flex height="fit-content" direction="column" justifyContent="center">
                <Flex direction="column">
                  <>
                    <Flex margin="0.625rem 0px" direction="column">
                      <p>First Name</p>
                      <InputField
                        type="text"
                        backgroundColor="#F4F6F9"
                        size="lg"
                        color="#607087"
                        borderColor="transparent"
                        borderRadius="0.75rem"
                        borderSize="0px"
                        fontSize="1rem"
                        width="100%"
                        value={formInput.name}
                        onChange={(e) => handleInput("name", e.target.value)}
                      />
                    </Flex>
                    <Flex margin="0.625rem 0px" direction="column">
                      <p>Last Name</p>
                      <InputField
                        type="text"
                        backgroundColor="#F4F6F9"
                        size="lg"
                        color="#607087"
                        borderColor="transparent"
                        borderRadius="0.75rem"
                        borderSize="0px"
                        fontSize="1rem"
                        width="100%"
                        noFormat={true}
                        value={formInput.surname}
                        onChange={(e) => handleInput("surname", e.target.value)}
                      />
                    </Flex>
                  </>

                  <Flex margin="1.25rem 0px">
                    <Button
                      label="Update Profile"
                      color={Colors.white}
                      borderRadius="0.75rem"
                      onClick={handleUpdateUser}
                      backgroundColor={Colors.primaryColor}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </ModalBox>
          </ModalContainer>
        </>
      )}
    </>
  );
};

export default PersonalInformation;
