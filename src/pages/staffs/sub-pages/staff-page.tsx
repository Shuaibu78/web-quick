import React, { Fragment, useEffect, useState } from "react";
import { Button } from "../../../components/button/Button";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { InputField } from "../../../components/input-field/input";
import {
  DropdownTRow,
  TRow,
  FormContainer,
  NotFoundContainer,
  RowDropButton,
  StaffContainer,
  SubRow,
  TableContainer,
  ActionRow,
  CustomText,
  SubActionRow,
  Left,
  Right,
} from "../style";
import userCircleIcon from "../../../assets/userCircle.svg";
import arrowDown from "../../../assets/ArrowDown.svg";
import { UsersAttr } from "../../../interfaces/user.interface";
import dropIcon from "../../../assets/dropIcon2.svg";
import editIcon from "../../../assets/Edit.svg";
import deleteIcon from "../../../assets/Delete.svg";
import { Table, Td, THead, TBody, TControls } from "../../sales/style";
import { Flex } from "../../../components/receipt/style";
import { AddButton } from "../../inventory/add/style";
import orangePlus from "../../../assets/orangePlus.svg";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_USER_INVITE,
  GET_ALL_ROLES,
  GET_ALL_USERS,
  UPDATE_USER,
} from "../../../schema/staff.schema";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { IRole } from "../../../app/slices/roles";
import { isLoading } from "../../../app/slices/status";
import ConfirmAction from "../../../components/modal/confirmAction";
import { Colors } from "../../../GlobalStyles/theme";
import NoInternetComp from "../../inventory/productDetails/NoInternet";
import { DELETE_USER_FROM_SHOP } from "../../../schema/auth.schema";
import { socketClient } from "../../../helper/socket";
import { SYNC_START } from "../../../utils/constants";
import { IShop } from "../../../interfaces/shop.interface";

type DynamicObject = {
  [key: string]: boolean;
};
type IForm = {
  firstname: string;
  lastname: string;
  email: string;
  phoneno: string;
  address: string;
  password?: string;
};
type IForm2 = IForm;
const StaffPage = () => {
  const [selectedRole, setSelectedRole] = useState<number>(-1);
  const [showTable, setShowTable] = useState(true);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DynamicObject>({});
  const [allRoles, setAllRoles] = useState<IRole[]>([]);
  const [showDropdown, setShowDropdown] = useState<DynamicObject>({});
  const [currentUserId, setCurrentUserId] = useState("");
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();
  const [confirmDeletStaff, setConfirmDeleteStaff] = useState<boolean>(false);
  const [currentStaff, setCurrentStaff] = useState<UsersAttr>();

  const { data: staffsData, refetch: refetchStaffs } = useQuery<{ getAllUsers: [UsersAttr] }>(
    GET_ALL_USERS,
    {
      variables: {
        shopId: currentShop?.shopId,
        isStaff: true,
      },
      fetchPolicy: "no-cache",
      onError(error) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      },
    }
  );

  useEffect(() => {
    refetchStaffs();
  }, []);

  const { data: rolesData } = useQuery<{ getAllRoles: [IRole] }>(GET_ALL_ROLES, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
    onCompleted(data) {
      const options: string[] = [];
      data.getAllRoles.forEach((val) => {
        options.push(val.roleName ?? "");
      });
      setAllRoles(data.getAllRoles);
      setRoleOptions(options);
    },
  });

  const [removeUserFromShop] = useMutation<{ removeUserFromShop: boolean }>(DELETE_USER_FROM_SHOP, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleDeleteUser = (userId: string) => {
    dispatch(isLoading(true));
    removeUserFromShop({
      variables: {
        userId: userId,
        shopId: currentShop.shopId,
      },
    })
      .then((res) => {
        if (res.data?.removeUserFromShop) {
          refetchStaffs();
          dispatch(isLoading(false));
        }
      })
      .catch((err) => {
        dispatch(isLoading(false));
        dispatch(
          toggleSnackbarOpen({
            message: err.message || err?.graphQLErrors[0]?.message,
            color: "DANGER",
          })
        );
      });
  };

  const getUserRole = () => {
    const roleId = currentStaff?.UserShops.find(
      (shop: IShop) => shop.shopId === currentShop.shopId
    )?.roleId;

    const roleIndex = rolesData?.getAllRoles.findIndex((role) => role.roleId === roleId);

    roleIndex && setSelectedRole(roleIndex);
  };

  useEffect(() => {
    getUserRole();
  }, [currentStaff]);

  const [formInputEdit, setFormInputEdit] = useState<IForm2>({
    firstname: "",
    lastname: "",
    email: "",
    phoneno: "",
    address: "",
  });

  const [formInputAdd, setFormInputAdd] = useState<IForm>({
    firstname: "",
    lastname: "",
    email: "",
    phoneno: "",
    address: "",
    password: "",
  });

  const handleInputAdd = (
    key: "firstname" | "lastname" | "email" | "password" | "phoneno" | "address",
    value: string
  ) => {
    setFormInputAdd((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  const handleEditStaff = (
    key: "firstname" | "lastname" | "email" | "password" | "phoneno" | "address",
    value: string
  ) => {
    setFormInputEdit((prevInput) => {
      const inputCopy: IForm2 = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  const [createStaff] = useMutation<{ createUserInvite: boolean }>(CREATE_USER_INVITE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(isLoading(true));

    createStaff({
      variables: {
        shopId: currentShop?.shopId,
        mobileOrEmail: formInputAdd.email,
        roleId: rolesData?.getAllRoles[selectedRole]?.roleId,
      },
    })
      .then((res) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen({ message: "Successfully sent.", color: "SUCCESS" }));
        if (res.data?.createUserInvite) {
          socketClient.emit(SYNC_START, { shopId: currentShop?.shopId });
          refetchStaffs();
        }
      })
      .catch((err) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen({ message: err?.graphQLErrors[0]?.message, color: "DANGER" }));
      });
  };

  const [updateStaff] = useMutation<{ updateUser: UsersAttr }>(UPDATE_USER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(isLoading(true));
    updateStaff({
      variables: {
        userId: currentUserId,
        firstName: formInputEdit.firstname,
        lastName: formInputEdit.lastname,
        email: formInputEdit.email,
        mobileNumber: formInputEdit.phoneno,
        roleId: allRoles[selectedRole].roleId,
      },
    })
      .then((res) => {
        dispatch(isLoading(false));
        refetchStaffs();
        dispatch(toggleSnackbarOpen({ message: "Successful", color: "SUCCESS" }));
      })
      .catch((err) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen({ message: err?.graphQLErrors[0]?.message, color: "DANGER" }));
      });
  };

  useEffect(() => {
    let initialSelectedState: { [key: string]: boolean } = {};
    staffsData?.getAllUsers.forEach((val) => {
      initialSelectedState = { ...initialSelectedState, [val?.userId!]: false };
    });
    setSelectedRow(initialSelectedState);
    setShowDropdown(initialSelectedState);
  }, []);

  const handleEditClick = (val: UsersAttr) => {
    setShowEditUser(true);
    setCurrentUserId(val.userId ?? "");
    setFormInputEdit({
      firstname: val.firstName ?? "",
      lastname: val.lastName ?? "",
      email: val.email ?? "",
      phoneno: val.mobileNumber ?? "",
      address: "",
    });
  };

  const handleDropdownToggle = (key: number) => {
    setShowDropdown((oldList) => {
      const newList = { ...oldList };
      newList[key] = !newList[key];
      return newList;
    });
  };

  return (
    <>
      <StaffContainer>
        <TableContainer>
          {window.navigator.onLine ? (
            <div style={{ width: "100%" }}>
              <TControls style={{ marginBottom: "2rem" }}>
                <h3>
                  Staff List{" "}
                  <span style={{ opacity: "0.4", paddingLeft: "0.625rem" }}>
                    {staffsData?.getAllUsers.length as number}
                  </span>
                </h3>
              </TControls>
              {showTable && staffsData?.getAllUsers?.length! > 0 ? (
                <Table width="100%" margin="0px 2rem" maxHeight="calc(100% - 45px)">
                  <THead justifyContent="flex-start" fontSize="0.875rem">
                    <Td width="5%" style={{ paddingLeft: "0.3125rem" }}>
                      S/N
                    </Td>
                    <Td width="50%">
                      <span>Staff Name</span>
                    </Td>
                    <Td width="15%">
                      <span></span>
                    </Td>

                    <Td width="10%"></Td>
                  </THead>
                  <TBody width="100%">
                    {staffsData?.getAllUsers.map((val, i) => {
                      const userShop = val?.UserShops[0] as any;
                      return (
                        <DropdownTRow background={"#F6F8FB"} key={i} style={{ width: "100%" }}>
                          <SubRow
                            onClick={() => {
                              handleDropdownToggle(i);
                              setCurrentStaff(val);
                            }}
                            style={{ width: "100%" }}
                          >
                            <TRow style={{ width: "100%" }}>
                              <Td width="8%" style={{ paddingLeft: "0.3125rem" }}>
                                {i + 1}
                              </Td>
                              <Td width="60%">
                                <span>{val.fullName}</span>
                              </Td>
                              <Td>
                                <span>{(userShop?.Role.roleName as any) || ""}</span>
                              </Td>
                              {/* <Td width="240px">
                          <span></span>
                        </Td> */}
                            </TRow>
                            {showDropdown[i] && (
                              <ActionRow isOpen={showDropdown[i]}>
                                <SubActionRow>
                                  <Left>
                                    <Flex
                                      flexDirection="column"
                                      justifyContent="space-between"
                                      margin="0.9375rem 0"
                                    >
                                      <CustomText>
                                        <span>Email:</span> {val.email}
                                      </CustomText>
                                      <CustomText>
                                        <span>Phone:</span> {val.mobileNumber}
                                      </CustomText>
                                    </Flex>
                                  </Left>
                                  <Right>
                                    <button onClick={() => handleEditClick(val)}>
                                      <img src={editIcon} alt="" />
                                    </button>
                                    <button onClick={() => setConfirmDeleteStaff(true)}>
                                      <img src={deleteIcon} alt="" />
                                    </button>
                                  </Right>
                                </SubActionRow>
                              </ActionRow>
                            )}
                          </SubRow>
                          <RowDropButton
                            height={`${showDropdown[i] ? "130px" : "3.125rem"}`}
                            onClick={() => handleDropdownToggle(i)}
                          >
                            <img
                              src={arrowDown}
                              alt=""
                              style={{
                                transform: `${showDropdown[i] ? "rotate(180deg)" : "rotate(0deg)"}`,
                                transition: ".3s linear",
                              }}
                            />
                          </RowDropButton>
                        </DropdownTRow>
                      );
                    })}
                  </TBody>
                </Table>
              ) : (
                <Fragment>
                  <NotFoundContainer>
                    <img src={userCircleIcon} alt="" style={{ margin: "0.875rem 0" }} />
                    <h3>No Users to Show Yet</h3>
                    <p>Start adding Staff to view and manage them here</p>
                  </NotFoundContainer>
                </Fragment>
              )}
            </div>
          ) : (
            <>
              <NoInternetComp />
            </>
          )}
        </TableContainer>
        {showEditUser ? (
          <FormContainer>
            <Flex justifyContent="space-between">
              <h3 style={{ fontSize: "1rem" }}>Edit Staff</h3>
              <AddButton onClick={() => setShowEditUser(false)}>
                <img src={orangePlus} alt="" />
                <span style={{ fontSize: "1rem" }}>Add a new Staff</span>
              </AddButton>
            </Flex>
            <form onSubmit={(e) => e.preventDefault()}>
              <InputField
                type="text"
                placeholder="Firstname"
                backgroundColor="#F4F6F9"
                borderRadius="0.75rem"
                size="lg"
                noFormat
                fontSize="1rem"
                color="#8196B3"
                marginBottom="0.9375rem"
                width="100%"
                value={formInputEdit.firstname}
                // onChange={(e) => handleEditStaff("firstname", e.target.value)}
              />
              <InputField
                type="text"
                placeholder="Lastname"
                backgroundColor="#F4F6F9"
                borderRadius="0.75rem"
                size="lg"
                fontSize="1rem"
                color="#8196B3"
                width="100%"
                noFormat
                marginBottom="0.9375rem"
                value={formInputEdit.lastname}
                // onChange={(e) => handleEditStaff("lastname", e.target.value)}
              />
              <CustomDropdown
                width="100%"
                color="#8196B3"
                containerColor="#F4F6F9"
                borderRadius="0.75rem"
                height="45px"
                dropdownIcon={dropIcon}
                options={roleOptions}
                setValue={setSelectedRole}
                fontSize="1rem"
                selected={selectedRole}
                margin="0 0 0.875rem 0"
                padding="0 24px"
              />
              <InputField
                type="email"
                placeholder="Email"
                backgroundColor="#F4F6F9"
                borderRadius="0.75rem"
                marginBottom="0.9375rem"
                noFormat
                size="lg"
                fontSize="1rem"
                color="#8196B3"
                width="100%"
                value={formInputEdit.email}
                // onChange={(e) => handleEditStaff("email", e.target.value)}
              />
              <InputField
                type="tel"
                placeholder="Phone Number"
                backgroundColor="#F4F6F9"
                borderRadius="0.75rem"
                marginBottom="0.9375rem"
                size="lg"
                noFormat
                fontSize="1rem"
                color="#8196B3"
                width="100%"
                value={formInputEdit.phoneno}
                // onChange={(e) => handleEditStaff("phoneno", e.target.value)}
              />
              {/* <InputField
              type="text"
              placeholder="Address"
              backgroundColor="#F4F6F9"
              borderRadius="0.75rem"
              marginBottom="0.9375rem"
              size="lg"
              fontSize="1rem"
              color="#8196B3"
              width="95%"
              value={formInputEdit.address}
              onChange={(e) => handleInputEdit("address", e.target.value)}
            /> */}
              {/* <InputField
              type="password"
              placeholder="New Password"
              backgroundColor="#F4F6F9"
              borderRadius="0.75rem"
              size="lg"
              fontSize="1rem"
              color="#8196B3"
              width="95%"
              value={formInputEdit.password}
              onChange={(e) => handleInputEdit("password", e.target.value)}
            />
            <InputField
              type="password"
              placeholder="Confirm Password"
              backgroundColor="#F4F6F9"
              borderRadius="0.75rem"
              size="lg"
              fontSize="1rem"
              color="#8196B3"
              width="95%"
              value={formInputEdit.confirmPassword}
              onChange={(e) => handleInputEdit("confirmPassword", e.target.value)}
            /> */}
              <Button
                label="Update"
                onClick={handleUpdate}
                backgroundColor={Colors.primaryColor}
                size="lg"
                fontSize="1rem"
                borderRadius="0.75rem"
                width="100%"
                color="#fff"
                borderColor="transparent"
                borderSize="0px"
              />
            </form>
          </FormContainer>
        ) : (
          <FormContainer>
            <h3 style={{ fontSize: "1rem" }}>Add new staff</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <InputField
                type="email"
                placeholder="Staff email"
                backgroundColor="#F4F6F9"
                borderRadius="0.75rem"
                size="lg"
                noFormat
                fontSize="1rem"
                color="#8196B3"
                marginBottom="0.9375rem"
                width="100%"
                value={formInputAdd.email}
                onChange={(e) => handleInputAdd("email", e.target.value)}
              />
              <CustomDropdown
                placeholder="Staff Role"
                width="100%"
                color="#8196B3"
                containerColor="#F4F6F9"
                borderRadius="0.75rem"
                height="45px"
                dropdownIcon={dropIcon}
                options={roleOptions}
                setValue={setSelectedRole}
                fontSize="1rem"
                selected={selectedRole}
                margin="0 0 0.875rem 0"
                padding="0 24px"
              />
              <Button
                label="Send"
                onClick={handleCreate}
                backgroundColor={Colors.primaryColor}
                size="lg"
                fontSize="1rem"
                borderRadius="0.75rem"
                width="100%"
                color="#fff"
                borderColor="transparent"
                borderSize="0px"
              />
            </form>
          </FormContainer>
        )}
      </StaffContainer>
      {confirmDeletStaff && (
        <ConfirmAction
          action="Delete Staff"
          actionText={`Are you sure you want to remove ${currentStaff?.fullName} from this shop?`}
          setConfirmSignout={setConfirmDeleteStaff}
          doAction={() => handleDeleteUser(currentStaff?.userId as string)}
        />
      )}
    </>
  );
};

export default StaffPage;
