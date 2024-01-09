import React, { FunctionComponent, useEffect, useState } from "react";
import { Button } from "../../../components/button/Button";
import { InputField } from "../../../components/input-field/input";
import cancelIcon from "../../../assets/cancel.svg";
import { ModalBox } from "../../settings/style";
import { useMutation, useQuery } from "@apollo/client";
import { ICustomer } from "../../../interfaces/inventory.interface";
import { CREATE_CUSTOMER, UPDATE_CUSTOMER } from "../../../schema/customer.schema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop, increaseSyncCount } from "../../../app/slices/shops";
import { isLoading } from "../../../app/slices/status";
import { InputWrapper } from "../../login/style";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { Colors } from "../../../GlobalStyles/theme";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import Toggle from "../../../components/toggle";
import { GET_FEATURE_COUNT } from "../../../schema/subscription.schema";
import { setFeatureCount } from "../../../app/slices/subscriptionslice";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isEdit?: boolean;
  customer?: ICustomer;
}
interface IForm {
  name: string;
  email: string;
  phoneno: string;
  address: string;
  creditLimit: string;
}

const DiamondIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
      <path
        opacity="0.3"
        d="M7.15969 3.75H5.17969L4.05469 6H6.03469L7.15969 3.75ZM14.9447 6L13.8197 3.75H11.8397L12.9647 6H14.9447ZM8.74969 12.51V7.5H4.57969L8.74969 12.51ZM10.2497 12.51L14.4197 7.5H10.2497V12.51ZM10.1597 3.75H8.83969L7.71469 6H11.2847L10.1597 3.75Z"
        fill="#9EA8B7"
      />
      <path
        d="M14.75 2.25H4.25L2 6.75L9.5 15.75L17 6.75L14.75 2.25ZM13.82 3.75L14.945 6H12.9575L11.8325 3.75H13.82ZM5.18 3.75H7.1675L6.0425 6H4.055L5.18 3.75ZM8.75 12.51L4.58 7.5H8.75V12.51ZM7.715 6L8.84 3.75H10.16L11.285 6H7.715ZM10.25 12.51V7.5H14.42L10.25 12.51Z"
        fill="#9EA8B7"
      />
    </svg>
  );
};

const NewCustomer: FunctionComponent<IProps> = ({ setShowModal, refetch, isEdit, customer }) => {
  const dispatch = useAppDispatch();
  const currentShop = useAppSelector(getCurrentShop);
  const [showAddress, setShowAddress] = useState(!!customer?.address);
  const [showEmail, setShowEmail] = useState(!!customer?.email);
  const [showCreditLimit, setShowCreditLimit] = useState(!!customer?.creditLimit);
  const [formInput, setFormInput] = useState<IForm>({
    name: "",
    email: "",
    phoneno: "",
    address: "",
    creditLimit: "",
  });

  const [createCustomer] = useMutation<{ customer: ICustomer }>(CREATE_CUSTOMER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });
  const [updateCustomer] = useMutation<{ customer: ICustomer }>(UPDATE_CUSTOMER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });
  const handleInput = (
    key: "name" | "email" | "phoneno" | "address" | "creditLimit",
    value: string
  ) => {
    setFormInput((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  const { refetch: refetchFeatureCount } = useQuery<{
    getFeatureCount: { inventoriesCount: number; debtCount: number };
  }>(GET_FEATURE_COUNT, {
    variables: {
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "cache-and-network",
    onCompleted(arrData) {
      dispatch(setFeatureCount(arrData?.getFeatureCount ?? {}));
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    if (isEdit) {
      setFormInput({
        ...formInput,
        name: customer?.customerName ?? "",
        email: customer?.email ?? "",
        phoneno: customer?.phoneNumber ?? "",
        address: customer?.address ?? "",
        creditLimit: customer?.creditLimit ?? "",
      });
    }
  }, [isEdit, customer]);

  const handleSubmit = (type: string | null) => {
    if (!formInput.name) {
      dispatch(toggleSnackbarOpen({ message: "Please enter customer name", color: "INFO" }));
      return;
    }

    if (showCreditLimit && Number(formInput.creditLimit) < 1) {
      dispatch(toggleSnackbarOpen({ message: "Enter credit limit or toggle it off" }));

      return;
    }

    if (!type) {
      setShowModal(false);
      dispatch(isLoading(true));
      createCustomer({
        variables: {
          shopId: currentShop?.shopId,
          customerName: formInput.name,
          email: formInput.email,
          address: formInput.address,
          phoneNumber: formInput.phoneno,
          creditLimit: Number(formInput.creditLimit),
        },
      })
        .then((res) => {
          if (res.data) {
            dispatch(isLoading(false));
            dispatch(toggleSnackbarOpen({ message: "Customer Added", color: "SUCCESS" }));
            dispatch(increaseSyncCount(["Customer"]));
            setShowModal(false);
            refetch();
            refetchFeatureCount();
          }
        })
        .catch((error) => {
          dispatch(isLoading(false));
          dispatch(
            toggleSnackbarOpen({
              message: error?.message || error?.graphQLErrors[0]?.message,
              color: "DANGER",
            })
          );
        });
    }

    if (type === "edit") {
      dispatch(isLoading(true));
      updateCustomer({
        variables: {
          shopId: currentShop?.shopId,
          customerName: formInput.name,
          email: formInput.email,
          address: formInput.address,
          phoneNumber: formInput.phoneno,
          customerId: customer?.customerId,
          creditLimit: Number(formInput.creditLimit),
        },
      })
        .then((res) => {
          if (res.data) {
            dispatch(isLoading(false));
            dispatch(
              toggleSnackbarOpen({
                message: `${customer?.customerName} Successfully Updated`,
                color: "SUCCESS",
              })
            );
            setShowModal(false);
            refetch();
          }
        })
        .catch((error) => {
          dispatch(isLoading(false));
          dispatch(
            toggleSnackbarOpen({
              message: error?.message || error?.graphQLErrors[0]?.message,
              color: "DANGER",
            })
          );
        });
    }
  };

  return (
    <ModalBox width="30%">
      <h3
        style={{
          marginBottom: "32px",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
        }}
      >
        <span>{isEdit ? `Editing ${customer?.customerName}` : "New Customer"}</span>
        <button
          onClick={() => setShowModal(false)}
          style={{ background: "transparent", border: "1px solid black" }}
        >
          <img src={cancelIcon} alt="" />
        </button>
      </h3>
      <Flex gap="1em" direction="column">
        <InputWrapper>
          <label style={{ fontSize: "14px", fontWeight: "400", color: "#607087" }}>Full Name</label>
          <InputField
            // label="Full Name"
            placeholder="John Doe"
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
          <label style={{ fontSize: "14px", fontWeight: "400", color: "#607087" }}>
            Phone number
          </label>
          <InputField
            // label="Phone number"
            placeholder="Phone number"
            noFormat={true}
            type="tel"
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
        <Flex justifyContent="space-between" alignItems="center">
          <p style={{ color: "#130F26", fontWeight: "500", fontSize: "12px" }}>
            Set customer credit limit
          </p>
          <Toggle onToggle={() => setShowCreditLimit(!showCreditLimit)} value={showCreditLimit} />
        </Flex>
        {showCreditLimit && (
          <InputWrapper>
            <label style={{ fontSize: "14px", fontWeight: "400", color: "#607087" }}>
              Credit Limit
            </label>
            <InputField
              // label="Credit Limit"
              placeholder="0.0"
              noFormat={true}
              type="number"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="12px"
              borderSize="0px"
              fontSize="16px"
              width="100%"
              value={formInput.creditLimit}
              onChange={(e) => handleInput("creditLimit", e.target.value)}
            />
          </InputWrapper>
        )}
        {/* <div style={{ border: "2px dashed #607087", padding: "0.5rem 1rem 1rem 1rem", borderRadius: "8px", marginTop: "0.8rem", margin: "0 0 1em 0" }}>
          <p style={{
            color: "#130F26",
            fontStyle: "italic",
            padding: "0.5rem 0",
          }}
          >
            Credit Information
          </p>
          <hr style={{ background: "#9EA8B7" }} />
          <Flex justifyContent="space-between" margin="0.5rem 0 0 0">
            <div style={{ width: "48%" }}>
              <label style={{ fontSize: "14px", fontWeight: "400", color: "#607087" }}>Total Credit</label>
              <InputWithIcon width="100%">
                <input className="no-default-icon" placeholder="0.0" type="number" id="credit-amount" name="credit-amount" />
              </InputWithIcon>
            </div>
            <div style={{ width: "48%" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#607087",
                }}
              >
                Due Date
              </label>
              <InputWithIcon>
                <img src={CalendarIcon} />
                <input className="no-default-icon" type="date" id="date" name="date" placeholder="12:00 PM" />
              </InputWithIcon>
            </div>
          </Flex>
          {showCreditLimit &&
            <Flex padding="1rem" bg="#F65151" color="#F65151">
              Credit Limit: ₦ {formInput.creditLimit}
            </Flex>
          }
        </div> */}
        {showEmail && (
          <InputWrapper>
            <label style={{ fontSize: "14px", fontWeight: "400", color: "#607087" }}>
              Customer Email
            </label>
            <InputField
              // label="Customer Email"
              placeholder="Customer Email"
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
              isSideButton
              sideButtonClick={() => setShowEmail(false)}
            />
          </InputWrapper>
        )}
        {showAddress && (
          <InputWrapper>
            <label style={{ fontSize: "14px", fontWeight: "400", color: "#607087" }}>Address</label>
            <InputField
              // label="Address(Optional)"
              placeholder="Address(Optional)"
              type="text"
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
              isSideButton
              sideButtonClick={() => setShowAddress(false)}
            />
          </InputWrapper>
        )}
      </Flex>
      {(!showAddress || !showEmail) && (
        <Text fontSize="13px" color="#9EA8B7" margin="10px 4px 0px" style={{ fontStyle: "italic" }}>
          More Options. Simply click on any to add
        </Text>
      )}
      <Flex margin="10px 0">
        {!showEmail && (
          <Button
            borderRadius="12px"
            fontSize="12px"
            label="Import Products"
            backgroundColor="#FFF6EA"
            type="button"
            color="#E47D05"
            height="14px"
            width="fit-content"
            margin="0px 4px 0px"
            onClick={() => setShowEmail(true)}
            style={{
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontStyle: "italic",
            }}
          >
            + Email
          </Button>
        )}
        {!showAddress && (
          <Button
            borderRadius="12px"
            fontSize="12px"
            label="Import Products"
            backgroundColor="#FFF6EA"
            type="button"
            color="#E47D05"
            height="14px"
            width="fit-content"
            margin="0px 4px 0px"
            onClick={() => setShowAddress(true)}
            style={{
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontStyle: "italic",
            }}
          >
            + Address
          </Button>
        )}
      </Flex>
      {/* <Flex justifyContent="space-between" margin="1rem 0 0 0">
        <p style={{ color: "#9EA8B7", fontSize: "12px" }}>Additional Details</p>
        <DiamondIcon />
      </Flex> */}
      <Button
        label={isEdit ? "Update" : "Save"}
        onClick={() => handleSubmit(isEdit ? "edit" : null)}
        backgroundColor={Colors.primaryColor}
        size="lg"
        color="#fff"
        borderColor="transparent"
        borderRadius="0.75rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
        margin="2rem 0 0 0 "
      />
    </ModalBox>
  );
};

export default NewCustomer;
