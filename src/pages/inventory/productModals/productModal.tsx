import React, { useEffect, useRef, useState } from "react";
import {
  ActionContainer,
  ModalWrapper,
  CategoryModalContainer,
  ModalFlex,
  CategoryList,
  CategoryListBtn,
  Hr,
} from "../style";
import cancel from "../../../assets/cancel.svg";
import Delete from "../../../assets/Delete.svg";
import Edit from "../../../assets/editPen.svg";
import { Button } from "../../../components/button/Button";
import { IInventory, IInventoryCategory } from "../../../interfaces/inventory.interface";
import { DELETE_CATEGORY, UPDATE_CATEGORY } from "../../../schema/shops.schema";
import { useMutation } from "@apollo/client";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppDispatch } from "../../../app/hooks";
import { isLoading } from "../../../app/slices/status";
import { CREATE_INVENTORY_CATEGORY } from "../../../schema/inventory.schema";
import { setSingleInventory } from "../../../app/slices/inventory";
import { useNavigate } from "react-router-dom";
import { setIsEdit } from "../../../app/slices/isEdit";
import { Colors } from "../../../GlobalStyles/theme";
import { isFigorr } from "../../../utils/constants";

export const ActionModal = ({
  toggle,
  show,
  inventory,
  setCurrentInventory,
  setShowProductModal,
  setAdjustModalPopup,
  saveSelectedInventory,
  isUp,
  handleMakeProductOnline,
}: {
  toggle: () => void;
  show: boolean;
  inventory: IInventory;
  setCurrentInventory: (inventory: IInventory) => void;
  saveSelectedInventory: (inventory: IInventory) => void;
  setPopup: (value: boolean) => void;
  setShowProductModal: (value: boolean) => void;
  setAdjustModalPopup: (value: boolean) => void;
  isUp: boolean;
  handleMakeProductOnline: (inventoryId: string, isPublished: boolean) => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClose = (e: any) => {
      if (show) {
        if (modalRef.current && !modalRef.current.innerHTML.includes(e.target.innerHTML)) {
          toggle();
        }
      }
    };
    window.addEventListener("click", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, [show]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const editInventory = (value: IInventory) => {
    dispatch(setSingleInventory(value));
    navigate("/dashboard/product/add");
  };
  return (
    <ModalWrapper show={show} isUp={isUp} ref={modalRef}>
      <ActionContainer>
        <ul>
          <li
            onClick={() => {
              setShowProductModal(true);
              setCurrentInventory(inventory);
              toggle();
            }}
          >
            View Product
          </li>
          <li
            onClick={() => {
              setCurrentInventory(inventory);
              editInventory(inventory);
              dispatch(setIsEdit(true));
              toggle();
            }}
          >
            Edit
          </li>
          {inventory?.inventoryType !== "NON_TRACKABLE" && (
            <li
              onClick={() => {
                setAdjustModalPopup(true);
                setCurrentInventory(inventory);
                saveSelectedInventory(inventory);
                toggle();
              }}
            >
              Adjust Quantity
            </li>
          )}
          {isFigorr ? null : (
            <li
              onClick={() => {
                handleMakeProductOnline(inventory?.inventoryId!, !inventory?.isPublished);
                toggle();
              }}
            >
              Make Product {!inventory?.isPublished ? "Online" : "Offline"}
            </li>
          )}
        </ul>
        {/* <img src={cancel} alt="close modal" onClick={toggle} style={{ cursor: "pointer" }} /> */}
      </ActionContainer>
    </ModalWrapper>
  );
};

export const ManageCategoryModal = ({
  refetch,
  data,
  toggle,
  shopId,
}: {
  refetch: () => void;
  data: IInventoryCategory[];
  toggle: () => void;
  shopId?: string;
}) => {
  const [deleteCategory] = useMutation<{ deleteInventoryCategory: IInventoryCategory }>(
    DELETE_CATEGORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const [updateCategory] = useMutation<{ UpdateInventoryCategory: IInventoryCategory }>(
    UPDATE_CATEGORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const [createCategory] = useMutation<{ createInventoryCategory: IInventoryCategory }>(
    CREATE_INVENTORY_CATEGORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<IInventoryCategory>({
    inventorycategoryName: "",
    inventoryCategoryId: "",
  });

  const dispatch = useAppDispatch();

  const handleCategoryDelete = (id: string) => {
    if (disableBtn) {
      return;
    }
    setDisableBtn(true);
    dispatch(isLoading(true));
    deleteCategory({
      variables: { inventoryCategoryId: id },
    })
      .then(() => {
        dispatch(isLoading(false));
        refetch();
        setDisableBtn(false);
        dispatch(toggleSnackbarOpen("Successful"));
      })
      .catch((error) => {
        dispatch(isLoading(false));
        setDisableBtn(false);
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  const handleUpdateCategory = (category: IInventoryCategory) => {
    dispatch(isLoading(true));
    updateCategory({
      variables: {
        inventoryCategoryId: category?.inventoryCategoryId,
        inventorycategoryName: selectedCategory?.inventorycategoryName,
        shopId: category?.shopId,
      },
    })
      .then(() => {
        dispatch(isLoading(false));
        refetch();
        setDisableBtn(false);
        setSelectedCategory({
          ...selectedCategory,
          inventorycategoryName: "",
          inventoryCategoryId: "",
        });
        dispatch(toggleSnackbarOpen("Successful"));
      })
      .catch((error) => {
        dispatch(isLoading(false));
        setDisableBtn(false);
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  const addNewCategory = (category: IInventoryCategory) => {
    dispatch(isLoading(true));
    createCategory({
      variables: {
        name: category?.inventorycategoryName,
        shopId,
      },
    })
      .then((res) => {
        dispatch(isLoading(false));
        if (res.data?.createInventoryCategory.inventorycategoryName) {
          dispatch(toggleSnackbarOpen("Successful"));
          setSelectedCategory({
            ...selectedCategory,
            inventorycategoryName: "",
            inventoryCategoryId: "",
          });
          refetch();
          setDisableBtn(false);
        }
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
        <img src={cancel} alt="close modal" onClick={toggle} style={{ cursor: "pointer" }} />
        <span>Manage Category</span>
      </ModalFlex>
      <ModalFlex direction="column" gap="0.625rem 0px">
        <label htmlFor="categoryName">New Category Name</label>
        <input
          type="text"
          name="categoryName"
          placeholder="Enter category name"
          value={selectedCategory?.inventorycategoryName}
          onChange={(e) =>
            setSelectedCategory({ ...selectedCategory, inventorycategoryName: e.target.value })
          }
          id="categoryName"
        />
        <Button
          size="lg"
          borderRadius="0.5rem"
          fontSize="0.875rem"
          label={!disableBtn ? "Add Category" : "Update Category"}
          backgroundColor={Colors.primaryColor}
          type="button"
          color="white"
          height="2.5rem"
          width="100%"
          onClick={() =>
            !disableBtn ? addNewCategory(selectedCategory) : handleUpdateCategory(selectedCategory)
          }
        />
      </ModalFlex>
      <Hr />
      <ModalFlex direction="column" gap="0px 0.9375rem">
        {data?.length > 0 && <h4>List of available categories</h4>}
        <div className="categoryContainer">
          {data?.length > 0 ? (
            data?.map((category) => (
              <CategoryList key={category?.inventoryCategoryId}>
                <div>{category?.inventorycategoryName}</div>
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
                    onClick={() => handleCategoryDelete(category?.inventoryCategoryId!)}
                    alt="delete"
                  />
                </CategoryListBtn>
              </CategoryList>
            ))
          ) : (
            <div>no inventory category available</div>
          )}
        </div>
      </ModalFlex>
    </CategoryModalContainer>
  );
};
