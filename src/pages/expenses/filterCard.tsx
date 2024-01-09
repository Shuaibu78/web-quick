import React, { FunctionComponent, useEffect, useState } from "react";
import { DisplayWrapper, Header, SelectButton, UserObject, Wrapper } from "./style";
import cancel from "../../assets/cancel.svg";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import { Button } from "../../components/button/Button";
import { ModalBox } from "../settings/style";
import dropIcon from "../../assets/dropIcon2.svg";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Box } from "./add-new-card/style";
import { InputWrapper } from "../login/style";
import { ToggleButton } from "../staffs/style";
import checkIcon from "../../assets/check.svg";
import { useQuery } from "@apollo/client";
import { IExpenditureCategory } from "../../interfaces/expenses.interface";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { GET_ALL_EXPENDITURE_CATEGORY } from "../../schema/expenses.schema";
import { getCurrentShop } from "../../app/slices/shops";
import { GET_ALL_USER } from "../../schema/auth.schema";
import { UsersAttr } from "../../interfaces/user.interface";
import { Colors } from "../../GlobalStyles/theme";
import { IFilteredDate } from "../sales/sales";
import { ViewType, viewArray } from "./expenses";
import { CancelButton } from "../sales/style";
import CustomDate from "../../components/date-picker/customDatePicker";
import { setHours } from "../../helper/date";

interface IProps {
  setShowFilterModal: Function;
  dateRange: IFilteredDate;
  filteredDate: IFilteredDate | undefined;
  selectedCategories: IExpenditureCategory[];
  selectedUsers: UsersAttr[];
  includeSales: boolean;
  selectedDate: number;
  dateOptions: string[];
  setSelectedDate: React.Dispatch<React.SetStateAction<number>>;
  setIncludeSales: Function;
  setSelectedUsers: Function;
  setSelectedCategories: Function;
  setDateRange: Function;
  setFilteredDate: Function;
  setView: React.Dispatch<React.SetStateAction<number>>;
  view: number;
  viewArray: ViewType[];
  getAllTransactions: Function;
  handleSetDate: Function;
  applyFilter: Function;
  clearFilter: Function;
}

const FilterCard: FunctionComponent<IProps> = (props) => {
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();

  const [showDateInput, setShowDateInput] = useState<boolean>(false);
  const [categories, setCategories] = useState<IExpenditureCategory[]>([]);
  const [shopUsers, setShopUsers] = useState<UsersAttr[]>([]);
  const [usersFilterOpen, setUsersFilterOpen] = useState<boolean>(false);
  const [catFilterOpen, setCatFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props.selectedDate === 8) {
      setShowDateInput(true);
    } else {
      setShowDateInput(false);
    }
  }, [props.selectedDate]);

  const { data } = useQuery<{
    getAllExpenditureCategory: [IExpenditureCategory];
  }>(GET_ALL_EXPENDITURE_CATEGORY, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const { data: allUsers } = useQuery<{
    getAllUsers: UsersAttr[];
  }>(GET_ALL_USER, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
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
    function getCats() {
      if (data) {
        setCategories(data.getAllExpenditureCategory);
      }
    }
    getCats();
  }, [data]);

  useEffect(() => {
    function getUsers() {
      if (allUsers) {
        setShopUsers(allUsers?.getAllUsers);
      }
    }
    getUsers();
  }, [allUsers]);

  const getStartDate = (date: Date) => {
    const dateWithSeconds = setHours(date, date);
    props.setDateRange({ from: dateWithSeconds?.from, to: props.dateRange?.to });
  };
  const getEndDate = (date: Date) => {
    const dateWithSeconds = setHours(date, date);
    props.setDateRange({ to: dateWithSeconds.to, from: props.dateRange?.from });
  };

  const handleRemoveUser = (user: UsersAttr) => {
    props.setSelectedUsers(props.selectedUsers.filter((entry) => entry.userId !== user.userId));
  };

  const handleAddUser = (user: UsersAttr) => {
    const inList = props.selectedUsers.find((entry) => entry.userId === user.userId);
    if (!inList) {
      props.setSelectedUsers([user]);
    }
  };

  const handleRemoveCategory = (category: IExpenditureCategory) => {
    props.setSelectedCategories(
      props.selectedCategories.filter(
        (entry) => entry.expenditureCategoryId !== category.expenditureCategoryId
      )
    );
  };

  const handleAddCategory = (category: IExpenditureCategory) => {
    const inList = props.selectedCategories.find(
      (cat) => cat.expenditureCategoryId === category.expenditureCategoryId
    );
    if (!inList) {
      props.setSelectedCategories([...props.selectedCategories, category]);
    }
  };

  const formattedViewArray = viewArray.map((item) => {
    const replaced = item.replace(/_/g, " ");

    const capitalized = replaced
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return capitalized;
  });

  return (
    <ModalBox>
      <Box>
        <Header style={{ justifyContent: "flex-end" }}>
          <CancelButton hover onClick={() => props.setShowFilterModal(false)}>
            <img src={cancel} alt="" />
          </CancelButton>
        </Header>

        <Flex alignItems="center" width="100%" direction="column" gap="1rem" margin="0.5rem 0 0 0">
          <Flex alignItems="flex-start" direction="column" justifyContent="flex-start" width="100%">
            {showDateInput && (
              <Flex alignItems="center" justifyContent="space-between" gap="1rem">
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="0.3125rem"
                >
                  <Span>From:- </Span>
                  <CustomDate
                    height="2.1875rem"
                    startDate={props.dateRange?.from}
                    setStartDate={getStartDate}
                    border="none"
                  />
                </Flex>
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="0.3125rem"
                >
                  <Span>To:- </Span>
                  <CustomDate
                    height="2.1875rem"
                    startDate={props.dateRange?.to}
                    setStartDate={getEndDate}
                    border="none"
                  />
                </Flex>
              </Flex>
            )}
            <Span color="#8196B3" fontSize="0.7rem">
              Date Filter
            </Span>
            <InputWrapper>
              <CustomDropdown
                width="100%"
                height="2.5rem"
                fontSize="0.875rem"
                borderRadius="0.75rem"
                containerColor="#F4F6F9"
                color="#8196B3"
                selected={props.view}
                setValue={props.setView}
                options={formattedViewArray}
                dropdownIcon={dropIcon}
                margin="0px"
                padding="0 0.625rem"
              />
            </InputWrapper>
          </Flex>

          {props.view === 2 && (
            <Flex
              alignItems="flex-start"
              direction="column"
              justifyContent="flex-start"
              width="100%"
            >
              <Span color="#8196B3" fontSize="0.7rem" margin="0.5rem 0">
                Sort expenditure by Category
              </Span>
              <Wrapper>
                <SelectButton
                  color="#8196B3"
                  background="#F4F6F9"
                  fontSize="0.9rem"
                  onClick={() => setCatFilterOpen(!catFilterOpen)}
                >
                  Select Category
                  <img src={dropIcon} alt="" />
                </SelectButton>
                {catFilterOpen && (
                  <DisplayWrapper>
                    {categories.map((category) => {
                      return (
                        <Span
                          color="#8196B3"
                          key={category.expenditureCategoryId}
                          onClick={() => {
                            handleAddCategory(category);
                            setCatFilterOpen(false);
                          }}
                        >
                          {category.expenditureCategoryName}
                        </Span>
                      );
                    })}
                  </DisplayWrapper>
                )}
              </Wrapper>
              <Flex
                style={{ flexWrap: "wrap" }}
                alignItems="center"
                margin="0.3125rem 0 0 0"
                gap="0.3rem"
              >
                {props.selectedCategories.length > 0 &&
                  props.selectedCategories.map((category) => {
                    return (
                      <UserObject key={category.expenditureCategoryId}>
                        {category.expenditureCategoryName}
                        <span onClick={() => handleRemoveCategory(category)}>
                          <img src={cancel} alt="" />
                        </span>
                      </UserObject>
                    );
                  })}
              </Flex>
            </Flex>
          )}

          <Flex alignItems="flex-start" direction="column" justifyContent="flex-start" width="100%">
            <Span color="#8196B3" fontSize="0.7rem" margin="0.5rem 0">
              Sort by User
            </Span>
            <Wrapper>
              <SelectButton
                color="#8196B3"
                background="#F4F6F9"
                fontSize="0.9rem"
                onClick={() => setUsersFilterOpen(!usersFilterOpen)}
              >
                Select Users
                <img src={dropIcon} alt="" />
              </SelectButton>
              {usersFilterOpen && (
                <DisplayWrapper>
                  {shopUsers.map((user) => {
                    return (
                      <Span
                        color="#8196B3"
                        key={user.userId}
                        onClick={() => {
                          handleAddUser(user);
                          setUsersFilterOpen(false);
                        }}
                      >
                        {user.fullName}
                      </Span>
                    );
                  })}
                </DisplayWrapper>
              )}
            </Wrapper>
            <Flex
              style={{ flexWrap: "wrap" }}
              alignItems="center"
              margin="0.3125rem 0 0 0"
              gap="0.3rem"
            >
              {props.selectedUsers.length > 0 &&
                props.selectedUsers.map((user) => {
                  return (
                    <UserObject key={user.userId}>
                      {user.firstName}
                      <span onClick={() => handleRemoveUser(user)}>
                        <img src={cancel} alt="" />
                      </span>
                    </UserObject>
                  );
                })}
            </Flex>
          </Flex>

          <ToggleButton
            onClick={() => {
              props.setIncludeSales(!props.includeSales);
            }}
            isActive={props.includeSales}
            style={{ width: "100%" }}
          >
            <Flex width="100%" alignItems="center">
              <span style={{ marginLeft: "0px" }}>
                {props.includeSales && <img src={props.includeSales && checkIcon} alt="" />}
              </span>
              <p className="title">Include Income from sales</p>
            </Flex>
          </ToggleButton>

          <Button
            label="Apply"
            onClick={() => {
              props.applyFilter();
              props.setShowFilterModal(false);
            }}
            backgroundColor={Colors.primaryColor}
            size="lg"
            fontSize="1rem"
            borderRadius="0.75rem"
            width="100%"
            color="#fff"
            borderColor="transparent"
            borderSize="0px"
          />
          <Button
            label="Clear Filter"
            onClick={() => {
              props.clearFilter();
              props.setShowFilterModal(false);
            }}
            backgroundColor={Colors.tabBg}
            size="lg"
            fontSize="1rem"
            borderRadius="0.75rem"
            width="100%"
            color={Colors.primaryColor}
            borderColor="transparent"
            borderSize="0px"
          />
        </Flex>
      </Box>
    </ModalBox>
  );
};

export default FilterCard;
