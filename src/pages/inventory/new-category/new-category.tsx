/* eslint-disable comma-dangle */
import React, { FunctionComponent, useState } from "react";
import { Button } from "../../../components/button/Button";
import { InputField } from "../../../components/input-field/input";
import cancelIcon from "../../../assets/cancel.svg";
import { ModalBox } from "../../settings/style";
import { useMutation } from "@apollo/client";
import { IInventoryCategory } from "../../../interfaces/inventory.interface";
import { CREATE_INVENTORY_CATEGORY } from "../../../schema/inventory.schema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { isLoading } from "../../../app/slices/status";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { InputWrapper } from "../../login/style";
import { Colors } from "../../../GlobalStyles/theme";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: any;
}

const NewCategory: FunctionComponent<IProps> = ({ setShowModal, refetch }) => {
  const [name, setName] = useState("");
  const shopId = useAppSelector(getCurrentShop).shopId;
  const [createCategory] = useMutation<{ createInventoryCategory: IInventoryCategory }>(
    CREATE_INVENTORY_CATEGORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );
  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    dispatch(isLoading(true));
    createCategory({
      variables: {
        name,
        shopId,
      },
    })
      .then((res) => {
        dispatch(isLoading(false));
        if (res.data?.createInventoryCategory.inventorycategoryName) {
          setShowModal(false);
          dispatch(toggleSnackbarOpen("Successful"));
          refetch();
        }
      })
      .catch((error) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  return (
    <ModalBox>
      <h3 style={{ marginBottom: "32px" }}>
        <button onClick={() => setShowModal(false)}>
          <img src={cancelIcon} alt="" />
        </button>
        <span>New Inventory Category</span>
      </h3>
      <InputWrapper>
        <InputField
          placeholder="Enter Category Name"
          type="text"
          label="Category Name"
          labelMargin="0 0 0.5em 0"
          backgroundColor="#F4F6F9"
          size="lg"
          color="#607087"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </InputWrapper>

      <div style={{ marginBottom: "1.25rem" }}></div>
      <Button
        label="Create Category"
        onClick={() => handleSubmit()}
        backgroundColor={Colors.primaryColor}
        size="lg"
        color="#fff"
        borderColor="transparent"
        borderRadius="0.75rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
      />
      <div style={{ marginBottom: "1.25rem" }}></div>
    </ModalBox>
  );
};

export default NewCategory;
