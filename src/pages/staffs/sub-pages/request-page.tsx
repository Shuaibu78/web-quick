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
  Label,
} from "../style";
import userCircleIcon from "../../../assets/userCircle.svg";
import arrowDown from "../../../assets/ArrowDown.svg";
import { IUserInvite, UsersAttr } from "../../../interfaces/user.interface";
import dropIcon from "../../../assets/dropIcon2.svg";
import cancelIcon from "../../../assets/cancel-red.svg";
import { CustomCont, Table, Td, THead, TBody, TControls, StaffTHead } from "../../sales/style";
import Checkbox from "../../../components/checkbox/checkbox";
import { Flex } from "../../../components/receipt/style";
import { AddButton } from "../../inventory/add/style";
import orangePlus from "../../../assets/orangePlus.svg";
import { useMutation, useQuery } from "@apollo/client";
import {
  CANCEL_INVITE_REQUEST,
  CREATE_USER_INVITE,
  GET_ALL_ROLES,
  GET_USER_INVITES,
  UPDATE_USER,
} from "../../../schema/staff.schema";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { IRole } from "../../../app/slices/roles";
import { Colors } from "../../../GlobalStyles/theme";
import NoInternetComp from "../../inventory/productDetails/NoInternet";
import { isLoading } from "../../../app/slices/status";
import { socketClient } from "../../../helper/socket";
import { SYNC_START } from "../../../utils/constants";
type DynamicObject = {
  [key: string]: boolean;
};
type IForm = {
  firstname: string;
  lastname: string;
  email: string;
  phoneno: string;
  address: string;
  password: string;
};
type IForm2 = IForm & {
  confirmPassword: string;
};
const RequestPage = () => {
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [showTable, setShowTable] = useState(true);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DynamicObject>({});
  const [showDropdown, setShowDropdown] = useState<DynamicObject>({});
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const dispatch = useAppDispatch();
  const {
    shops: { currentShop },
  } = useAppSelector((state) => state);

  const { data: inviteData, refetch: refetchUserInvites } = useQuery<{
    getPendingInvites: [IUserInvite];
  }>(GET_USER_INVITES, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    socketClient.emit(SYNC_START, { shopId: currentShop?.shopId });
  }, [inviteData?.getPendingInvites.length]);

  useEffect(() => {
    refetchUserInvites();
  }, []);

  const { data: rolesData } = useQuery<{ getAllRoles: [IRole] }>(GET_ALL_ROLES, {
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
    variables: {
      shopId: currentShop?.shopId,
    },
    onCompleted(data) {
      const options: string[] = [];
      data.getAllRoles.forEach((val) => {
        options.push(val.roleName ?? "");
      });
      setRoleOptions(options);
    },
  });

  const [formInputEdit, setFormInputEdit] = useState<IForm2>({
    firstname: "",
    lastname: "",
    email: "",
    phoneno: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [formInputAdd, setFormInputAdd] = useState<IForm>({
    firstname: "",
    lastname: "",
    email: "",
    phoneno: "",
    address: "",
    password: "",
  });

  const handleInputEdit = (
    key:
      | "firstname"
      | "lastname"
      | "email"
      | "password"
      | "confirmPassword"
      | "phoneno"
      | "address",
    value: string
  ) => {
    setFormInputEdit((prevInput) => {
      const inputCopy: IForm2 = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  const handleInputAdd = (
    key: "firstname" | "lastname" | "email" | "password" | "phoneno" | "address",
    value: string
  ) => {
    setFormInputAdd((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  const [createStaff] = useMutation<{ createUser: UsersAttr }>(CREATE_USER_INVITE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const [cancelInvite] = useMutation<{ changeUserInviteStatus: boolean }>(CANCEL_INVITE_REQUEST, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createStaff({
      variables: {
        shopId: currentShop?.shopId,
        mobileOrEmail: formInputAdd.email,
        roleId: rolesData?.getAllRoles[selectedRole].roleId,
      },
    })
      .then((res) => {
        if (res.data?.createUser) {
          socketClient.emit(SYNC_START, { shopId: currentShop?.shopId });
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(toggleSnackbarOpen(err?.graphQLErrors[0]?.message));
      });
  };

  const handleCancelInvite = (inviteId: string) => {
    dispatch(isLoading(true));
    cancelInvite({
      variables: {
        inviteId: inviteId,
        status: "CANCELLED",
      },
    })
      .then((res) => {
        console.log(res);
        if (res) {
          refetchUserInvites();
          dispatch(isLoading(false));
        }
      })
      .catch((err) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(err?.graphQLErrors[0]?.message));
      });
  };

  const [updateStaff] = useMutation<{ updateUser: UsersAttr }>(UPDATE_USER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateStaff({
      variables: {
        userId: currentUserId,
        firstName: formInputEdit.firstname,
        lastName: formInputEdit.lastname,
        email: formInputEdit.email,
        mobileNumber: formInputEdit.phoneno,
      },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        dispatch(toggleSnackbarOpen(err?.graphQLErrors[0]?.message));
      });
  };

  useEffect(() => {
    let initialSelectedState: { [key: string]: boolean } = {};
    inviteData?.getPendingInvites?.forEach((val) => {
      initialSelectedState = { ...initialSelectedState, [val?.userId!]: false };
    });
    setSelectedRow(initialSelectedState);
    setShowDropdown(initialSelectedState);
  }, []);

  const handleSelect = () => {
    if (!inviteData?.getPendingInvites?.length) {
      return false;
    }
    for (let i: number = 0; i < inviteData?.getPendingInvites?.length; i++) {
      if (!selectedRow[inviteData?.getPendingInvites[i]?.userId!]) {
        let initialSelectedState: { [key: string]: boolean } = {};
        inviteData?.getPendingInvites?.forEach((val) => {
          initialSelectedState = { ...initialSelectedState, [val?.userId!]: true };
        });
        setSelectedRow(initialSelectedState);
        return true;
      }
    }
    let initialSelectedState: { [key: string]: boolean } = {};
    inviteData?.getPendingInvites?.forEach((val) => {
      initialSelectedState = { ...initialSelectedState, [val?.userId!]: false };
    });
    setSelectedRow(initialSelectedState);
    return false;
  };

  const handleRowSelect = (id: number | string, isChecked: boolean) => {
    if (!inviteData?.getPendingInvites?.length) {
      return { ...selectedRow, [id]: false };
    }
    if (!isChecked) {
      setAllSelected(false);
    } else {
      let isAllSelected = true;
      for (let i: number = 0; i < inviteData?.getPendingInvites?.length; i++) {
        if (
          !selectedRow[inviteData?.getPendingInvites[i]?.userId!] &&
          inviteData?.getPendingInvites[i]?.userId !== id
        ) {
          isAllSelected = false;
        }
      }
      if (isAllSelected) {
        setAllSelected(true);
      }
    }
    return { ...selectedRow, [id]: isChecked };
  };

  const handleDropdownToggle = (key: number) => {
    setShowDropdown((oldList) => {
      const newList = { ...oldList };
      newList[key] = !newList[key];
      return newList;
    });
  };

  return (
    <Flex
      backgroundColor="white"
      borderRadius="1rem"
      flexDirection="column"
      width="100%"
      padding="1.5rem"
    >
      {window.navigator.onLine ? (
        <Flex width="100%" flexDirection="column">
          <TControls>
            <h3>
              Staff{" "}
              <span style={{ opacity: "0.4", paddingLeft: "0.625rem" }}>
                {inviteData?.getPendingInvites?.length || 0}
              </span>
            </h3>
          </TControls>
          {showTable && inviteData?.getPendingInvites?.length! > 0 ? (
            <Table maxWidth="100%" width="900px" margin="0 10rem">
              <StaffTHead fontSize="0.875rem" minWidth="100%" justifyContent="flex-start">
                <Td width="3rem">
                  <CustomCont imgHeight="100%" height="1.25rem">
                    <Checkbox
                      isChecked={allSelected}
                      onChange={(e) => setAllSelected(handleSelect())}
                      color="#130F26"
                      size="1.125rem"
                    />
                  </CustomCont>
                </Td>
                <Td width="15rem">Staff Email</Td>
                <Td width="5rem">Role</Td>
                <Td width="3rem"></Td>
              </StaffTHead>
              <TBody width="100%" style={{ padding: "0" }}>
                {inviteData?.getPendingInvites?.map((val, i) => {
                  return (
                    <DropdownTRow
                      style={{ padding: "0" }}
                      minWidth="100%"
                      background={"#F6F8FB"}
                      key={i}
                    >
                      <SubRow style={{ width: "100%" }}>
                        <TRow style={{ width: "100%" }}>
                          <Td width="3rem"></Td>
                          <Td width="15rem">
                            <span>{val.email?.toLowerCase()}</span>
                          </Td>
                          <Td width="5rem">
                            <span>{val.Role.roleName}</span>
                          </Td>
                        </TRow>
                        {showDropdown[i] && (
                          <ActionRow isOpen={showDropdown[i]}>
                            <SubActionRow>
                              <Left>
                                <Flex justifyContent="space-between" margin="0.9375rem 0">
                                  <CustomText>
                                    <span>Phone:</span> {val.mobileNumber}
                                  </CustomText>
                                </Flex>
                                <Flex margin="0.9375rem 0" justifyContent="space-between">
                                  <button
                                    style={{
                                      color: "red",
                                      outline: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      background: "transparent",
                                    }}
                                    onClick={() => handleCancelInvite(val.inviteId ?? "")}
                                  >
                                    <span>Cancel Request</span>
                                  </button>
                                </Flex>
                              </Left>
                              <Right></Right>
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
                <h3>No Request to Show Yet</h3>
                <p>Start sending request to view and manage them here</p>
              </NotFoundContainer>
            </Fragment>
          )}
        </Flex>
      ) : (
        <>
          <NoInternetComp />
        </>
      )}
    </Flex>
  );
};

export default RequestPage;
