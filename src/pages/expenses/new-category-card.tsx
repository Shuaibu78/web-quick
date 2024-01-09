/* eslint-disable max-len */
import React, { FunctionComponent, useState } from "react";
import cancel from "../../assets/cancel.svg";
import { Button } from "../../components/button/Button";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getCurrentShop } from "../../app/slices/shops";
import { useMutation, useQuery } from "@apollo/client";
import Delete from "../../assets/Delete.svg";
import Edit from "../../assets/editPen.svg";
import {
  CREATE_EXPENDITURE_CATEGORY,
  DELETE_EXPENDITURE_CATEGORY,
  GET_ALL_EXPENDITURE_CATEGORY,
  UPDATE_EXPENDITURE_CATEGORY,
} from "../../schema/expenses.schema";
import { IExpenditureCategory } from "../../interfaces/expenses.interface";
import { isLoading } from "../../app/slices/status";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import {
  CategoryList,
  CategoryListBtn,
  CategoryModalContainer,
  Hr,
  ModalFlex,
} from "../inventory/style";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import ConfirmAction from "../../components/modal/confirmAction";
import { ModalBox, ModalContainer } from "../settings/style";
import { CancelButton } from "../sales/style";

interface IProps {
  setShowCatModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewCategory: FunctionComponent<IProps> = ({ setShowCatModal }) => {
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<IExpenditureCategory>();
  const [selectedCategory, setSelectedCategory] = useState<IExpenditureCategory>({
    expenditureCategoryName: "",
    expenditureCategoryId: "",
  });

  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();

  const { data, refetch: rCategory } = useQuery<{
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

  const [create] = useMutation<{ createExpenditureCategory: IExpenditureCategory }>(
    CREATE_EXPENDITURE_CATEGORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const [deleteCategory] = useMutation<{ deleteExpenditureCategory: IExpenditureCategory }>(
    DELETE_EXPENDITURE_CATEGORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const [updateCategory] = useMutation<{ updateExpenditureCategory: IExpenditureCategory }>(
    UPDATE_EXPENDITURE_CATEGORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const handleAddCategory = () => {
    if (!selectedCategory?.expenditureCategoryName) {
      dispatch(toggleSnackbarOpen({ message: "Enter expenditure category name", color: "INFO" }));
      return;
    }
    dispatch(isLoading(true));
    create({
      variables: {
        name: selectedCategory?.expenditureCategoryName,
        shopId: currentShop?.shopId,
      },
    })
      .then((res) => {
        if (res.data) {
          dispatch(isLoading(false));
          setSelectedCategory({ ...selectedCategory, expenditureCategoryName: "" });
          dispatch(toggleSnackbarOpen("Successfully Added"));
          rCategory();
        }
      })
      .catch((error) => {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  const handleCategoryDelete = (id: string) => {
    if (disableBtn) {
      return;
    }
    setDisableBtn(true);
    dispatch(isLoading(true));
    deleteCategory({
      variables: { expenditureCategoryId: id },
    })
      .then(() => {
        dispatch(isLoading(false));
        rCategory();
        setDisableBtn(false);
        dispatch(toggleSnackbarOpen("Successfully Deleted"));
      })
      .catch((error) => {
        dispatch(isLoading(false));
        setDisableBtn(false);
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  const handleUpdateCategory = () => {
    dispatch(isLoading(true));
    updateCategory({
      variables: {
        expenditureCategoryId: selectedCategory?.expenditureCategoryId,
        expenditureCategoryName: selectedCategory?.expenditureCategoryName,
        shopId: currentShop?.shopId,
      },
    })
      .then(() => {
        dispatch(isLoading(false));
        rCategory();
        setDisableBtn(false);
        setSelectedCategory({
          ...selectedCategory,
          expenditureCategoryName: "",
          expenditureCategoryId: "",
        });
        dispatch(toggleSnackbarOpen("Successfully Updated"));
      })
      .catch((error) => {
        dispatch(isLoading(false));
        setDisableBtn(false);
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  return (
    <CategoryModalContainer>
      <ModalFlex gap="0px 0.625rem" align="center">
        <img
          src={cancel}
          alt="close modal"
          onClick={() => setShowCatModal(false)}
          style={{ cursor: "pointer" }}
        />
        <span>Manage Category</span>
      </ModalFlex>
      <ModalFlex direction="column" gap="0.625rem 0px">
        <label htmlFor="categoryName">New Expense Category Name</label>
        <input
          type="text"
          name="categoryName"
          placeholder="Enter category name"
          value={selectedCategory?.expenditureCategoryName}
          style={{ backgroundColor: "transparent", border: "1px solid" }}
          onChange={(e) =>
            setSelectedCategory({ ...selectedCategory, expenditureCategoryName: e.target.value })
          }
          id="categoryName"
        />
        <Flex alignItems="center" width="100%" gap="1rem">
          <Button
            size="lg"
            borderRadius="0.5rem"
            fontSize="0.875rem"
            label={!disableBtn ? "Add Category" : "Update Category"}
            backgroundColor={Colors.primaryColor}
            type="button"
            color="white"
            height="2.5rem"
            width={disableBtn ? "70%" : "100%"}
            onClick={!disableBtn ? handleAddCategory : handleUpdateCategory}
          />

          {disableBtn && (
            <Button
              size="lg"
              borderRadius="0.5rem"
              fontSize="0.875rem"
              label="Cancel"
              backgroundColor="#E9EFF6"
              type="button"
              color="#8196B3"
              height="2.5rem"
              width="30%"
              onClick={() => {
                setDisableBtn(false);
                setSelectedCategory({ ...selectedCategory, expenditureCategoryName: "" });
              }}
            />
          )}
        </Flex>
      </ModalFlex>
      <Hr />
      <ModalFlex direction="column" gap="0px 0.9375rem">
        {data?.getAllExpenditureCategory.length! > 0 && <h4>List of available categories</h4>}
        <div className="categoryContainer">
          {data?.getAllExpenditureCategory.length! > 0 ? (
            data?.getAllExpenditureCategory.map((category) => (
              <CategoryList key={category?.expenditureCategoryId}>
                <div>{category?.expenditureCategoryName}</div>
                <CategoryListBtn>
                  <img
                    src={Edit}
                    alt="edit"
                    style={disableBtn ? { opacity: "0.5" } : { opacity: "1" }}
                    onClick={() => {
                      disableBtn === false && setSelectedCategory(category);
                      disableBtn === false && setDisableBtn(true);
                    }}
                  />
                  <img
                    src={Delete}
                    style={
                      disableBtn
                        ? { opacity: "0.5", marginLeft: "1.25rem" }
                        : { opacity: "1", marginLeft: "1.25rem" }
                    }
                    onClick={() => {
                      setCurrentCategory(category!);
                      setShowDeleteModal(true);
                    }}
                    alt="delete"
                  />
                </CategoryListBtn>
              </CategoryList>
            ))
          ) : (
            <div>No inventory category available</div>
          )}
        </div>
      </ModalFlex>
      <>
        {showDeleteModal && (
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
                  onClick={() => setShowDeleteModal(false)}
                >
                  <img src={cancel} alt="" />
                </CancelButton>
              </Flex>
              <Flex
                height="fit-content"
                direction="column"
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Span color={Colors.grey} textAlign="center">
                  <h3>Delete Category</h3>
                </Span>
                <Span color={Colors.grey} textAlign="center" margin="0.625rem 0">
                  Are you sure you want to delete {currentCategory?.expenditureCategoryName}
                </Span>
              </Flex>
              <Flex gap="1em">
                <Button
                  margin="0.9375rem 0"
                  label="Cancel"
                  width="100%"
                  height="2.5rem"
                  fontSize="1em"
                  borderRadius="0.75rem"
                  color={Colors.grey}
                  backgroundColor={Colors.offWhite}
                  onClick={() => setShowDeleteModal(false)}
                />
                <Button
                  margin="0.9375rem 0"
                  label="Delete Category"
                  width="100%"
                  fontSize="1em"
                  height="2.5rem"
                  borderRadius="0.75rem"
                  color={Colors.white}
                  backgroundColor={Colors.red}
                  onClick={() => {
                    handleCategoryDelete(currentCategory?.expenditureCategoryId!);
                    setShowDeleteModal(false);
                  }}
                />
              </Flex>
            </ModalBox>
          </ModalContainer>
        )}
      </>
    </CategoryModalContainer>
  );
};

export default NewCategory;
