import React, { useEffect } from "react";
import { Button, Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { ActiveContainer, Feature, InactiveContainer, Wrapper } from "./Exclusives.styles";
import { Colors } from "../../GlobalStyles/theme";
import CloseIcon from "../../assets/cancel.svg";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router";
import { getUserPermissions } from "../../app/slices/roles";
import { hasAnyPermission } from "../../helper/comparisons";
import { ExclusiveItemsType } from "./sidebarItems";

const { grey, blackishBlue, blackLight, primaryColor } = Colors;

interface IExclusives {
  setActiveItems: Function;
  activeItems: ExclusiveItemsType[];
  inactiveItems: ExclusiveItemsType[];
  setOpenExclusives: Function;
  setInactiveItems: Function;
}

const Exclusives: React.FC<IExclusives> = ({
  setOpenExclusives,
  activeItems,
  setActiveItems,
  inactiveItems,
  setInactiveItems,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, shops } = useAppSelector((state) => state);
  const userPermissions = useAppSelector(getUserPermissions);
  const isMerchant = user?.userId === shops?.currentShop?.userId;

  useEffect(() => {
    localStorage.setItem("ActiveTExclusive", JSON.stringify(activeItems));
  }, [activeItems]);

  const handleMakeActive = (id: number) => {
    if (activeItems.length <= 3) {
      const selectedItem = inactiveItems?.find((entry) => entry.id === id)!;

      setActiveItems((prev: ExclusiveItemsType[]) => [...prev, selectedItem]);
      setInactiveItems((prev: ExclusiveItemsType[]) => prev.filter((item) => item.id !== id));
    } else {
      dispatch(
        toggleSnackbarOpen({ message: "Maximum number of shortcuts reached", color: "INFO" })
      );
    }
  };

  const handleRemoveActive = (id: number) => {
    if (activeItems.length === 1) {
      dispatch(toggleSnackbarOpen({ message: "Minimum of 1 shortcut required", color: "INFO" }));
      return;
    }

    const filteredActiveItems = activeItems.filter((item) => item.id !== id);
    const selectedItem = activeItems.find((entry) => entry.id === id)!;

    setActiveItems(filteredActiveItems);
    setInactiveItems((prev: ExclusiveItemsType[]) => [selectedItem, ...prev]);

    localStorage.setItem("ActiveExclusive", JSON.stringify(filteredActiveItems));
  };

  const handleOpen = (path: string, shouldAccess: boolean) => {
    if (path === "#" || !shouldAccess) {
      !shouldAccess &&
        dispatch(
          toggleSnackbarOpen({
            message: "Access denied, Contact your manager",
            color: "INFO",
          })
        );
      return;
    }
    navigate(`/dashboard${path}`);
    setOpenExclusives(false);
  };

  return (
    <Wrapper>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Span color={blackishBlue} fontWeight="700" fontSize="1.2rem">
          Timart Business Exclusives
        </Span>
        <Flex
          bg="#F4F6F9"
          height="1.875rem"
          width="1.875rem"
          borderRadius="0.625rem"
          cursor="pointer"
          alignItems="center"
          justifyContent="center"
          onClick={() => setOpenExclusives(false)}
        >
          <img src={CloseIcon} alt="close" />
        </Flex>
      </Flex>
      <ActiveContainer>
        <Span color={grey} margin="0 0 1rem 0">
          Shortcuts ({activeItems.length} of 4 added)
        </Span>
        <div className="active">
          {activeItems.map((entry: ExclusiveItemsType) => {
            const shouldAccess =
              hasAnyPermission(entry.allowedRoles, userPermissions) || isMerchant;

            return (
              <Feature active={true} key={entry?.id}>
                <img src={entry?.icon} alt="" />
                <Span color={blackLight}>{entry?.name}</Span>
                <Flex
                  bg="transparent"
                  width="100%"
                  height="1.875rem"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Button
                    height="1.5625rem"
                    borderRadius="0.5rem"
                    fontSize="0.7rem"
                    padding="0.3125rem 1.25rem"
                    backgroundColor="#FCE9E9"
                    color="#FF5050"
                    onClick={() => handleRemoveActive(entry.id)}
                  >
                    Remove
                  </Button>
                  <Button
                    borderRadius="0.5rem"
                    padding="0.3125rem 0.625rem"
                    height="1.5625rem"
                    fontSize="0.7rem"
                    width="40%"
                    disable={!shouldAccess}
                    backgroundColor={primaryColor}
                    onClick={() => handleOpen(entry.path, shouldAccess)}
                  >
                    Open
                  </Button>
                </Flex>
              </Feature>
            );
          })}
        </div>
      </ActiveContainer>
      <InactiveContainer>
        <Span margin="0 0 1rem 0" color={grey}>
          Exclusive features
        </Span>
        <div className="inactive">
          {inactiveItems.map((entry: ExclusiveItemsType) => {
            const shouldAccess =
              hasAnyPermission(entry.allowedRoles, userPermissions) || isMerchant;

            return (
              <Feature key={entry.id}>
                <img src={entry?.icon} alt="" />
                <Span color={blackLight}>{entry.name}</Span>
                <Flex
                  bg="transparent"
                  width="100%"
                  height="1.875rem"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Button
                    height="1.5625rem"
                    borderRadius="0.5rem"
                    fontSize="0.7rem"
                    padding="0.3125rem 0.625rem"
                    backgroundColor={blackLight}
                    color="#fff"
                    onClick={() => handleMakeActive(entry.id)}
                  >
                    Add Shortcut
                  </Button>
                  <Button
                    borderRadius="0.5rem"
                    padding="0.3125rem 0.625rem"
                    height="1.5625rem"
                    fontSize="0.7rem"
                    width="40%"
                    disable={!shouldAccess}
                    backgroundColor={primaryColor}
                    onClick={() => handleOpen(entry.path, shouldAccess)}
                  >
                    Open
                  </Button>
                </Flex>
              </Feature>
            );
          })}
        </div>
      </InactiveContainer>
    </Wrapper>
  );
};

export default Exclusives;
