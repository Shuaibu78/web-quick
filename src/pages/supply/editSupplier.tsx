import React, { FunctionComponent, useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { InputField } from "../../components/input-field/input";
import cancelIcon from "../../assets/cancel.svg";
import { ModalBox } from "../settings/style";
import { useMutation } from "@apollo/client";
import { ICustomer } from "../../interfaces/inventory.interface";
import { UPDATE_SUPPLIER } from "../../schema/supplier.schema";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getCurrentShop, increaseSyncCount } from "../../app/slices/shops";
import { isLoading } from "../../app/slices/status";
import { InputWrapper } from "../login/style";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { SupplierAttr } from "../../interfaces/supplies.interface";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  supplier?: SupplierAttr;
}
interface IForm {
  name: string;
  email: string;
  phoneno: string;
  address: string;
}

const EditSupplier: FunctionComponent<IProps> = ({ setShowModal, refetch, supplier }) => {
  const dispatch = useAppDispatch();
  const currentShop = useAppSelector(getCurrentShop);
  const [formInput, setFormInput] = useState<IForm>({
    name: "",
    email: "",
    phoneno: "",
    address: "",
  });

  const [updateSupplier] = useMutation<{ successful: boolean }>(UPDATE_SUPPLIER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleInput = (key: "name" | "email" | "phoneno" | "address", value: string) => {
    setFormInput((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  useEffect(() => {
    setFormInput({
      ...formInput,
      name: supplier?.firstName ?? "",
      email: supplier?.email ?? "",
      phoneno: supplier?.mobileNumber ?? "",
      address: supplier?.address ?? "",
    });
  }, [supplier]);

  const handleSubmit = (type: string | null) => {
    if (!formInput.name) {
      dispatch(toggleSnackbarOpen("Please enter supplier name"));
      return;
    }

    if (type === "edit") {
      dispatch(isLoading(true));
      updateSupplier({
        variables: {
          shopId: currentShop?.shopId,
          firstName: formInput.name,
          email: formInput.email,
          address: formInput.address,
          mobileNumber: formInput.phoneno,
          supplierId: supplier?.supplierId,
        },
      })
        .then((res) => {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen(`${supplier?.firstName} Successfully Updated`));
          dispatch(increaseSyncCount(["Supplier"]));
          setShowModal(false);
          refetch();
        })
        .catch((error) => {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        });
    }
  };

  return (
    <ModalBox>
      <h3 style={{ marginBottom: "32px" }}>
        <button onClick={() => setShowModal(false)}>
          <img src={cancelIcon} alt="" />
        </button>
        <span>{`Editing ${supplier?.firstName}`}</span>
      </h3>
      <InputWrapper>
        <label>Full Name</label>
        <InputField
          placeholder="Enter Full Name"
          type="text"
          backgroundColor="#F4F6F9"
          size="lg"
          color="#607087"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          value={formInput.name}
          onChange={(e) => handleInput("name", e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <label>Email</label>
        <InputField
          placeholder="Enter Email"
          type="email"
          backgroundColor="#F4F6F9"
          size="lg"
          color="#607087"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          value={formInput.email}
          onChange={(e) => handleInput("email", e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <label>Phone Number</label>
        <InputField
          placeholder="Enter Phone Number"
          type="tel"
          noFormat
          backgroundColor="#F4F6F9"
          size="lg"
          color="#607087"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          value={formInput.phoneno}
          onChange={(e) => handleInput("phoneno", e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <label>Address</label>
        <InputField
          placeholder="Enter Address"
          type="tel"
          backgroundColor="#F4F6F9"
          size="lg"
          color="#607087"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          value={formInput.address}
          onChange={(e) => handleInput("address", e.target.value)}
        />
      </InputWrapper>
      <div style={{ marginBottom: "1.25rem" }}></div>
      <Button
        label="Update"
        onClick={() => handleSubmit("edit")}
        backgroundColor="#FFBE62"
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

export default EditSupplier;
