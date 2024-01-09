import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeLockModal, lock } from "../../app/slices/accountLock";
import { IRole, setRole } from "../../app/slices/roles";
import { getCurrentShop, setCurrentShop, setShops } from "../../app/slices/shops";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { setUserInfo } from "../../app/slices/userInfo";
import { IShop } from "../../interfaces/shop.interface";
import { CAN_USER_SET_PIN, COMFIRM_USER_PIN, GET_USERS_WITH_PIN } from "../../schema/auth.schema";
import { getItemAsObject, saveItemAsString, setItem } from "../../utils/localStorage.utils";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import LockImage from "../../assets/lock-image.svg";
import Shop from "../../assets/shop.svg";
import { Colors } from "../../GlobalStyles/theme";
import AuthCard from "../auth-card/auth-card";
import { Button } from "../button/Button";
import { InputField } from "../input-field/input";
import { Back } from "../../pages/recover-password/style";
import BackArrow from "../../assets/back-arrow.svg";
import { setSession } from "../../app/slices/session";

export const Input = styled.input`
  appearance: none;
  outline: none;
  font-size: 0.75rem;
  background-color: transparent;
  color: black;
  border-style: solid;
  padding-block: 1rem;
  padding-inline: 1rem;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
  border: 1px solid black;
  width: 100%;
  height: 3.125rem;
  ::placeholder {
    color: #8196b3;
    opacity: 0.7;
  }

  &:hover {
    cursor: unset;
  }
`;

interface IUnlockAccount {
  userId: string;
  fullName: string;
}

interface IConfirm {
  success: boolean;
  token: string;
  shops: IShop[];
  roles: IRole[];
  isUserLoggedIn: boolean;
}

const UnlockAccount = ({ currentUserRole }: { currentUserRole?: string }) => {
  const [userId, setUserId] = useState("");
  const [pin, setPin] = useState("");
  const [allUsers, setAllUsers] = useState<IUnlockAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUnlockAccount | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentShop = useAppSelector(getCurrentShop);

  const { blackLight, blackishBlue, primaryColor } = Colors;

  const { data } = useQuery<{
    getAuthenticatedUsersWithPin: IUnlockAccount[];
  }>(GET_USERS_WITH_PIN, {
    fetchPolicy: "cache-and-network",
    onCompleted(user) {
      setUserId(user?.getAuthenticatedUsersWithPin[0]?.userId);
      setAllUsers(user?.getAuthenticatedUsersWithPin);
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

  const [confirmPin] = useMutation<{ confirmPin: IConfirm }>(COMFIRM_USER_PIN, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await confirmPin({
        variables: {
          pin,
          userId,
        },
      });

      if (!res.data?.confirmPin || !res.data?.confirmPin?.success) {
        throw Error("Incorrect Pin.");
      }

      const resData = res.data?.confirmPin as any;

      // setItem("session", { token: resData.token, userId });
      dispatch(setSession({ token: resData.token, userId }));
      const previousShop = getItemAsObject("currentShop");

      const shop =
        resData.shops.find(({ shopId }: IShop) => shopId === previousShop?.shopId) ||
        resData.shops[0];

      dispatch(setCurrentShop(shop || null));

      if (shop) {
        saveItemAsString("currencyCode", shop?.currencyCode);
      }
      navigate("/dashboard");
      dispatch(lock({ lock: false }));

      dispatch(closeLockModal());
    } catch (error: any) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    }
  };

  const getUser = () => {
    return allUsers.find((user) => user.userId === selectedUser?.userId);
  };

  const handleAddAccount = async () => {
    dispatch(setShops([]));
    dispatch(lock({ lock: false }));
    dispatch(setCurrentShop({}));
    dispatch(setRole([]));
    dispatch(setUserInfo({}));
    dispatch(closeLockModal());
    dispatch(setSession({}));
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    setPin("");
  }, [selectedUser]);

  return (
    <>
      {selectedUser ? (
        <AuthCard width="450px" showLogo={false}>
          <Flex direction="column" width="100%" gap="1em" margin="1em 0 0 0">
            <h3 style={{ margin: "0px", marginBottom: "1em" }}>
              <Back onClick={() => setSelectedUser(null)} style={{ width: "3.125rem" }}>
                <img src={BackArrow} alt="" />
              </Back>
            </h3>

            <Span color={blackishBlue} fontWeight="600" fontSize="1.1em">
              Continue with this user?
            </Span>

            <Flex direction="column" alignItems="center" gap="0.5em" margin="0 0 2em 0">
              <img src={LockImage} alt="lock-user-image" width="4.375rem" height="4.375rem" />

              <Span fontSize="1em" fontWeight="700" color={blackishBlue}>
                {getUser()?.fullName}
              </Span>
              <Span fontSize="0.8em" color={blackLight}>
                {currentUserRole}
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
            />
            <Button
              label="Continue"
              onClick={handleSubmit}
              type="submit"
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
          </Flex>
        </AuthCard>
      ) : (
        <AuthCard width="450px">
          <Flex direction="column" width="100%" gap="2em" margin="2em 0 0 0">
            <Flex alignItems="center" justifyContent="space-between" width="100%">
              <Span color={blackLight} fontWeight="700">
                Choose account to Login
              </Span>
              <Button
                type="button"
                style={{ fontWeight: "bold" }}
                onClick={handleAddAccount}
                // border="none"
                width="auto"
                color={Colors.primaryColor}
                backgroundColor="transparent"
                // paddingInline="0px"
              >
                New Login
              </Button>
            </Flex>
            <Flex
              direction="column"
              width="100%"
              overflowY="scroll"
              maxHeight="22.5rem"
              padding="0 0.3125rem 0 0"
              gap="0.5em"
            >
              {data?.getAuthenticatedUsersWithPin.map((user) => (
                <Flex
                  bg="#F4F6F9"
                  borderRadius="0.75rem"
                  key={user.userId}
                  width="100%"
                  height="4.375rem"
                  cursor="pointer"
                  onClick={() => {
                    setUserId(user.userId);
                    setSelectedUser(user);
                  }}
                >
                  <Flex
                    alignItems="center"
                    justifyContent="flex-start"
                    padding="0.625rem"
                    height="100%"
                    width="100%"
                  >
                    <img src={LockImage} alt="lock-user-image" width="3.125rem" height="3.125rem" />
                    <Flex direction="column" gap="1em" height="3.125rem" margin="0 0 0 1em">
                      <Flex direction="column" height="100%">
                        <Span fontSize="1em" fontWeight="700" color={blackishBlue}>
                          {user.fullName}
                        </Span>
                        <Span fontSize="0.8em" color={blackLight}>
                          {currentUserRole}
                        </Span>
                        <Flex alignItems="center" gap="0.625rem">
                          <img src={Shop} alt="shop icon" width="0.9375rem" />
                          <Span fontSize="0.8em" color={primaryColor}>
                            {currentShop?.shopName}
                          </Span>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </AuthCard>
      )}
    </>
  );
};

export default UnlockAccount;
