/* eslint-disable comma-dangle */
import React, { FunctionComponent, useEffect, useState } from "react";
import TopNav from "../../components/top-nav/top-nav";
import { Container, ControlContainer, TabButton, TabContainer } from "./style";
import RolePage from "./sub-pages/role-page";
import StaffPage from "./sub-pages/staff-page";
import RequestPage from "./sub-pages/request-page";
import { GET_USER_INVITES } from "../../schema/staff.schema";
import { IUserInvite } from "../../interfaces/user.interface";
import { useQuery } from "@apollo/client";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Staffs: FunctionComponent = () => {
  const [staffButtonState, setStaffButtonState] = useState<boolean>(true);
  const [roleButtonState, setRoleButtonState] = useState<boolean>(false);
  const [requestButtonState, setRequestButtonState] = useState(false);
  const [navBarHeight, setNavBarHeight] = useState<number>(0);

  const dispatch = useAppDispatch();
  const {
    shops: { currentShop },
  } = useAppSelector((state) => state);

  const { data: inviteData, refetch } = useQuery<{
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
    refetch();
  });

  const staffNavContent = () => {
    return (
      <ControlContainer style={{ justifyContent: "left" }} margin="0px" height="3.75rem">
        <h3>Manage Users</h3>
        <TabContainer>
          <TabButton
            isActive={staffButtonState}
            style={{ width: "calc(100%/3)" }}
            onClick={() => {
              setStaffButtonState(true);
              setRoleButtonState(false);
              setRequestButtonState(false);
            }}
          >
            Staff
          </TabButton>
          <TabButton
            isActive={requestButtonState}
            style={{
              width: "calc(100%/3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
            onClick={() => {
              setStaffButtonState(false);
              setRoleButtonState(false);
              setRequestButtonState(true);
            }}
          >
            Pending Requests <span>{inviteData?.getPendingInvites?.length || 0}</span>
          </TabButton>
          <TabButton
            style={{ width: "calc(100%/3)" }}
            isActive={roleButtonState}
            onClick={() => {
              setStaffButtonState(false);
              setRoleButtonState(true);
              setRequestButtonState(false);
            }}
          >
            Roles
          </TabButton>
        </TabContainer>
      </ControlContainer>
    );
  };

  return (
    <div>
      <TopNav header="Users" staffNavContent={staffNavContent} setNavBarHeight={setNavBarHeight} />
      <Container navBarHeight={navBarHeight}>
        {staffButtonState ? <StaffPage /> : null}
        {roleButtonState ? <RolePage navBarHeight={navBarHeight} /> : null}
        {requestButtonState ? <RequestPage /> : null}
      </Container>
    </div>
  );
};

export default Staffs;
