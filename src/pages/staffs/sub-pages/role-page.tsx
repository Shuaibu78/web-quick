import React, { useState, Fragment, useEffect } from "react";
import userCircleIcon from "../../../assets/userCircle.svg";
import toggleOff from "../../../assets/toggleOff.svg";
import toggleOn from "../../../assets/toggleOn.svg";
import {
  DropdownTRow,
  TRow,
  RoleList,
  RoleNav,
  ToggleButton,
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
  RoleHeader,
  RoleRow,
  Roles,
} from "../style";
import { Table, Td, THead, TBody, TControls } from "../../sales/style";
import { InputField } from "../../../components/input-field/input";
import { Button } from "../../../components/button/Button";
import { Flex } from "../../../components/receipt/style";
import arrowDown from "../../../assets/ArrowDown.svg";
import editIcon from "../../../assets/Edit.svg";
import deleteIcon from "../../../assets/Delete.svg";
import {
  CREATE_ROLE,
  DELETE_ROLE,
  GET_ALL_PERMISSIONS,
  GET_ALL_ROLES,
  UPDATE_ROLE,
} from "../../../schema/staff.schema";
import { IRole } from "../../../app/slices/roles";
import { useMutation, useQuery } from "@apollo/client";
import { IPermissions } from "../../../interfaces/staff.interface";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { isLoading } from "../../../app/slices/status";
import { getCurrentShop } from "../../../app/slices/shops";
import { formatDate, formatPermissionList } from "../../../helper/format";
import ConfirmAction from "../../../components/modal/confirmAction";
import { Colors } from "../../../GlobalStyles/theme";

type DynamicObject = {
  [key: string]: boolean;
};
interface IPermissionStatus {
  name?: string;
  view?: boolean;
  manage?: boolean;
}

const RolePage = ({ navBarHeight }: { navBarHeight: number }) => {
  const [allPermissionSelected, setAllPermissionSelected] = useState(false);
  const [showTable] = useState(true);
  // const [selectedRow, setSelectedRow] = useState<DynamicObject>({});
  const [showDropdown, setShowDropdown] = useState<DynamicObject>({});
  // const [allSelected, setAllSelected] = useState<boolean>(false);
  const [comfirmDeleteRole, setConfirmDeleteRole] = useState<boolean>(false);
  const [editRole, setEditRole] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<IRole>();
  const [permissionStatus, setPermissionStatus] = useState<IPermissionStatus[]>([]);
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();
  const [editPermissions, setEditPermissions] = useState<IPermissionStatus[]>();

  const { data: permissionsData } = useQuery<{ getAllPermissions: [IPermissions] }>(
    GET_ALL_PERMISSIONS,
    {
      onError(error) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      },
    }
  );

  const [updateRole] = useMutation<{ createRole: IRole }>(UPDATE_ROLE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });
  const [createRole] = useMutation<{ createRole: IRole }>(CREATE_ROLE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const { data: rolesData, refetch: refetchRoles } = useQuery<{ getAllRoles: [IRole] }>(
    GET_ALL_ROLES,
    {
      variables: {
        shopId: currentShop?.shopId,
      },
      onError(error) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      },
    }
  );
  const [deleteRole] = useMutation<{ deleteRole: boolean }>(DELETE_ROLE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });
  const handleDeleteRole = (roleId: string) => {
    deleteRole({
      variables: {
        roleId,
      },
    })
      .then((res) => {
        if (res.data?.deleteRole) {
          refetchRoles();
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(toggleSnackbarOpen(err?.graphQLErrors[0]?.message));
      });
  };
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    let initialSelectedState: { [key: string]: boolean } = {};
    rolesData?.getAllRoles.forEach((val) => {
      initialSelectedState = { ...initialSelectedState, [val?.roleId!]: false };
    });
    // setSelectedRow(initialSelectedState);
    setShowDropdown(initialSelectedState);
  }, []);

  const handleDropdownToggle = (key: string) => {
    setShowDropdown((oldList) => {
      const newList = { ...oldList };
      newList[key] = !newList[key];
      return newList;
    });
  };

  const toggleEditPermission = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
    type: "view" | "manage"
  ) => {
    setEditPermissions((prev) => {
      const copyOfPrev: IPermissionStatus[] = JSON.parse(JSON.stringify(prev));
      copyOfPrev[index][type] = !copyOfPrev[index][type];
      return copyOfPrev;
    });
  };

  const togglePermission = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
    type: "view" | "manage"
  ) => {
    setPermissionStatus((prev) => {
      const copyOfPrev: IPermissionStatus[] = JSON.parse(JSON.stringify(prev));
      copyOfPrev[index][type] = !copyOfPrev[index][type];
      let isAllSelected = true;
      copyOfPrev.forEach((val) => {
        if (!val.manage || !val.view) {
          isAllSelected = false;
        }
      });
      setAllPermissionSelected(isAllSelected);
      return copyOfPrev;
    });
  };
  const toggleAllPermission = () => {
    if (permissionsData) {
      const newPermissionStatus: IPermissionStatus[] = [];
      permissionsData.getAllPermissions.forEach((val) => {
        newPermissionStatus.push({
          name: val.name,
          manage: !allPermissionSelected,
          view: !allPermissionSelected,
        });
      });
      setAllPermissionSelected(!allPermissionSelected);
      setPermissionStatus(newPermissionStatus);
    }
  };
  const generatePermission = () => {
    const permissionList: string[] = [];
    permissionStatus.forEach((val, i) => {
      if (val.manage) {
        permissionList.push(permissionsData?.getAllPermissions[i].manage ?? "");
      }
      if (val.view) {
        permissionList.push(permissionsData?.getAllPermissions[i].view ?? "");
      }
    });
    return permissionList.join(",");
  };
  const generateEditPermission = () => {
    const permissionList: string[] = [];
    editPermissions?.forEach((val, i) => {
      if (val.manage) {
        permissionList.push(permissionsData?.getAllPermissions[i].manage ?? "");
      }
      if (val.view) {
        permissionList.push(permissionsData?.getAllPermissions[i].view ?? "");
      }
    });
    return permissionList.join(",");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roleName) {
      dispatch(isLoading(true));
      createRole({
        variables: {
          roleName,
          rolePermissions: generatePermission(),
          shopId: currentShop?.shopId,
        },
      })
        .then((res) => {
          dispatch(isLoading(false));
          refetchRoles();
          setRoleName("");
        })
        .catch((err) => {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen(err?.graphQLErrors[0]?.message));
        });
    }
  };
  const handleAllPermissionSelected = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    toggleAllPermission();
  };
  useEffect(() => {
    if (permissionsData) {
      const initialPermissionStatus: IPermissionStatus[] = [];
      permissionsData.getAllPermissions.forEach((val) => {
        initialPermissionStatus.push({
          name: val.name,
          manage: false,
          view: false,
        });
      });
      setPermissionStatus(initialPermissionStatus);
    }
  }, [permissionsData]);

  const editShop = (val: IRole) => {
    setCurrentRole(val);
    setRoleName(val?.roleName as string);
    setEditRole(true);
    const userPermissionsArray = val.rolePermissions?.split(",");
    const updatedPermissions = permissionsData?.getAllPermissions?.map(
      (permission: IPermissions) => {
        const hasViewPermission = userPermissionsArray?.includes(permission.view.trim());
        const hasManagePermission = userPermissionsArray?.includes(permission.manage.trim());

        return {
          ...permission,
          view: hasViewPermission,
          manage: hasManagePermission,
        };
      }
    );
    setEditPermissions(updatedPermissions);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(isLoading(true));
    updateRole({
      variables: {
        roleName,
        rolePermissions: generateEditPermission(),
        shopId: currentShop?.shopId,
        roleId: currentRole?.roleId,
      },
    })
      .then(() => {
        dispatch(isLoading(false));
        refetchRoles();
        setRoleName("");
      })
      .catch((err) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(err?.graphQLErrors[0]?.message));
      });
  };

  return (
    <>
      <StaffContainer>
        <TableContainer>
          <TControls>
            <h3>
              Roles{" "}
              <span style={{ opacity: "0.4", paddingLeft: "0.625rem" }}>
                {rolesData?.getAllRoles.length}
              </span>
            </h3>
          </TControls>
          {showTable ? (
            <Table maxWidth="740px" margin="2rem 2rem" maxHeight="calc(100% - 45px)">
              <THead fontSize="0.875rem">
                <Td style={{ padding: "0.3125rem" }} width="3.75rem">
                  S/N
                </Td>
                <Td width="140px">
                  <span>Role Name</span>
                </Td>
                {/* <Td width="6.25rem">
                  <span>Staffs</span>
                </Td> */}
                <Td width="40.625rem">
                  <span>Date Added</span>
                </Td>
                <Td width="3.125rem"></Td>
              </THead>
              <TBody>
                {rolesData?.getAllRoles.map((val, i) => {
                  return (
                    <DropdownTRow background={"#F6F8FB"} key={val.roleId}>
                      <SubRow
                        onClick={() => {
                          handleDropdownToggle(val.roleId!);
                          setCurrentRole(val);
                        }}
                      >
                        <TRow>
                          <Td style={{ padding: "0.3125rem" }} width="3.75rem">
                            {i + 1}
                          </Td>
                          <Td width="140px">
                            <span>{val.roleName}</span>
                          </Td>
                          {/* <Td width="6.25rem">
                            <span>4</span>
                          </Td> */}
                          {/* <Td width="35.625rem"> */}
                          <Td width="40.625rem">
                            <span>{formatDate(val.createdAt!)}</span>
                          </Td>
                        </TRow>
                        {showDropdown[val.roleId!] && (
                          <ActionRow isOpen={showDropdown[val.roleId!]}>
                            <SubActionRow>
                              <Left>
                                <Flex justifyContent="space-between" margin="0.9375rem 0">
                                  <CustomText>
                                    <span>Permissions:</span>{" "}
                                    {formatPermissionList(val.rolePermissions ?? "")}
                                  </CustomText>
                                </Flex>
                              </Left>
                              <Right>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editShop(val);
                                  }}
                                >
                                  <img src={editIcon} alt="" />
                                </button>
                                <button onClick={() => setConfirmDeleteRole(true)}>
                                  <img src={deleteIcon} alt="" />
                                </button>
                              </Right>
                            </SubActionRow>
                          </ActionRow>
                        )}
                      </SubRow>
                      <RowDropButton
                        height={`${showDropdown[val.roleId!] ? "180px" : "3.125rem"}`}
                        onClick={() => handleDropdownToggle(val.roleId!)}
                      >
                        <img
                          src={arrowDown}
                          alt=""
                          style={{
                            transform: `${
                              showDropdown[val.roleId!] ? "rotate(180deg)" : "rotate(0deg)"
                            }`,
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
              <h3>All Roles</h3>
              <NotFoundContainer>
                <img src={userCircleIcon} alt="" />
                <h3>No Roles to Show Yet</h3>
                <p>Start adding Customers to view and manage them here</p>
              </NotFoundContainer>
            </Fragment>
          )}
        </TableContainer>
        <FormContainer>
          <h3 style={{ fontSize: "1rem" }}>Add Role</h3>
          <form>
            <InputField
              type="text"
              placeholder="Role Name"
              backgroundColor="#F4F6F9"
              borderRadius="0.75rem"
              size="lg"
              fontSize="1rem"
              color="#8196B3"
              width="100%"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />

            <div>
              {!editRole && (
                <RoleNav>
                  <ToggleButton onClick={(e) => handleAllPermissionSelected(e)}>
                    <img src={allPermissionSelected ? toggleOn : toggleOff} alt="" />
                    <span>Full Permission</span>
                  </ToggleButton>
                </RoleNav>
              )}
              <RoleList>
                <RoleHeader>
                  <span>Permissions</span>
                  <span>View</span>
                  <span>Manage</span>
                </RoleHeader>
                {editRole ? (
                  <>
                    <Roles navBarHeight={navBarHeight}>
                      {editPermissions?.map((val, i) => (
                        <RoleRow key={i}>
                          <span>{val.name}</span>

                          <div>
                            <ToggleButton
                              onClick={(e) => {
                                e.preventDefault();
                                toggleEditPermission(e, i, "view");
                              }}
                              style={{ height: "auto" }}
                            >
                              <img src={editPermissions[i].view ? toggleOn : toggleOff} alt="" />
                            </ToggleButton>
                          </div>
                          <div>
                            <ToggleButton
                              onClick={(e) => {
                                e.preventDefault();
                                toggleEditPermission(e, i, "manage");
                              }}
                              style={{ height: "auto" }}
                            >
                              <img src={editPermissions[i].manage ? toggleOn : toggleOff} alt="" />
                            </ToggleButton>
                          </div>
                        </RoleRow>
                      ))}
                    </Roles>
                  </>
                ) : (
                  <Roles navBarHeight={navBarHeight}>
                    {permissionStatus.map((val, i) => (
                      <RoleRow key={i}>
                        <div>
                          <span>{val.name}</span>
                        </div>
                        <div>
                          <ToggleButton
                            onClick={(e) => {
                              e.preventDefault();
                              togglePermission(e, i, "view");
                            }}
                            style={{ height: "auto" }}
                          >
                            <img src={permissionStatus[i].view ? toggleOn : toggleOff} alt="" />
                          </ToggleButton>
                        </div>
                        <div>
                          <ToggleButton
                            onClick={(e) => {
                              e.preventDefault();
                              togglePermission(e, i, "manage");
                            }}
                            style={{ height: "auto" }}
                          >
                            <img src={permissionStatus[i].manage ? toggleOn : toggleOff} alt="" />
                          </ToggleButton>
                        </div>
                      </RoleRow>
                    ))}
                  </Roles>
                )}
              </RoleList>
            </div>
            <Button
              label={editRole ? "Update" : "Save"}
              onClick={editRole ? handleUpdate : handleSubmit}
              backgroundColor={Colors.primaryColor}
              size="lg"
              fontSize="1rem"
              borderRadius="0.75rem"
              width="95%"
              color="#fff"
              borderColor="transparent"
              borderSize="0px"
            />
          </form>
        </FormContainer>
      </StaffContainer>
      {comfirmDeleteRole && (
        <ConfirmAction
          action="Delete Role"
          actionText={`Are you sure you want to Delete (${currentRole?.roleName}) role?`}
          setConfirmSignout={setConfirmDeleteRole}
          doAction={() => handleDeleteRole(currentRole?.roleId as string)}
        />
      )}
    </>
  );
};

export default RolePage;
