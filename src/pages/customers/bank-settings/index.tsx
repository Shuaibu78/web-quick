import React, { FunctionComponent, useEffect, useState } from "react";
import { ModalBox } from "../../settings/style";
import cancelIcon from "../../../assets/cancel.svg";
import { BannerPlugin } from "webpack";
import { BankOption, BankSelect, BankSettingsContainer, InfoBox, InputWrapper, Seperator, WarningBox } from "./style";
import { Colors } from "../../../GlobalStyles/theme";
import { Flex, Span, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { InputField } from "../../../components/input-field/input";
import { validateInputNum } from "../../../utils/formatValues";
import { Button } from "../../../components/button/Button";
import { CREATE_BANK_DETAILS, DELETE_BANK_DETAILS, GET_BANKS, GET_BANK_DETAILS, UPDATE_BANK_DETAILS } from "../../../schema/banks.schema";
import { IBankDetails, IBanks } from "../../../interfaces/banks.interface";
import { useMutation, useQuery } from "@apollo/client";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { isLoading } from "../../../app/slices/status";
import { TransparentBtn } from "../view-customer/style";
import editIcon from "../../../assets/Edit.svg";
import deleteIcon from "../../../assets/Delete.svg";
import { DeleteContainer } from "../../inventory/style";
import PopupCard from "../../../components/popUp/PopupCard";

const OrangeInfo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M8.5 6.90625C8.6409 6.90625 8.77602 6.96222 8.87565 7.06185C8.97528 7.16148 9.03125 7.2966 9.03125 7.4375V12.2188C9.03125 12.3596 8.97528 12.4948 8.87565 12.5944C8.77602 12.694 8.6409 12.75 8.5 12.75C8.3591 12.75 8.22398 12.694 8.12435 12.5944C8.02472 12.4948 7.96875 12.3596 7.96875 12.2188V7.4375C7.96875 7.2966 8.02472 7.16148 8.12435 7.06185C8.22398 6.96222 8.3591 6.90625 8.5 6.90625ZM8.5 5.84375C8.71134 5.84375 8.91403 5.75979 9.06348 5.61035C9.21292 5.46091 9.29688 5.25822 9.29688 5.04688C9.29688 4.83553 9.21292 4.63284 9.06348 4.4834C8.91403 4.33396 8.71134 4.25 8.5 4.25C8.28866 4.25 8.08597 4.33396 7.93652 4.4834C7.78708 4.63284 7.70312 4.83553 7.70312 5.04688C7.70312 5.25822 7.78708 5.46091 7.93652 5.61035C8.08597 5.75979 8.28866 5.84375 8.5 5.84375ZM1.0625 8.5C1.0625 4.39237 4.39237 1.0625 8.5 1.0625C12.6076 1.0625 15.9375 4.39237 15.9375 8.5C15.9375 12.6076 12.6076 15.9375 8.5 15.9375C4.39237 15.9375 1.0625 12.6076 1.0625 8.5ZM8.5 2.125C4.97941 2.125 2.125 4.97941 2.125 8.5C2.125 12.0206 4.97941 14.875 8.5 14.875C12.0206 14.875 14.875 12.0206 14.875 8.5C14.875 4.97941 12.0206 2.125 8.5 2.125Z" fill="#E47D05"/>
    </svg>
  );
};

const DangerIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.49984 1.9231C5.13169 1.9231 1.58984 5.46494 1.58984 9.8331C1.58984 14.2013 5.13169 17.7431 9.49984 17.7431C13.868 17.7431 17.4098 14.2013 17.4098 9.8331C17.4098 5.46494 13.868 1.9231 9.49984 1.9231ZM9.49984 16.4012C5.87325 16.4012 2.93172 13.4597 2.93172 9.8331C2.93172 6.2065 5.87325 3.26497 9.49984 3.26497C13.1264 3.26497 16.068 6.2065 16.068 9.8331C16.068 13.4597 13.1264 16.4012 9.49984 16.4012Z" fill="#F65151"/>
      <path d="M9.49977 3.26514C5.87317 3.26514 2.93164 6.20667 2.93164 9.83326C2.93164 13.4599 5.87317 16.4014 9.49977 16.4014C13.1264 16.4014 16.0679 13.4599 16.0679 9.83326C16.0679 6.20667 13.1264 3.26514 9.49977 3.26514ZM10.0648 13.647C10.0648 13.7247 10.0012 13.7883 9.92352 13.7883H9.07602C8.99833 13.7883 8.93477 13.7247 8.93477 13.647V8.84451C8.93477 8.76682 8.99833 8.70326 9.07602 8.70326H9.92352C10.0012 8.70326 10.0648 8.76682 10.0648 8.84451V13.647ZM9.49977 7.57326C9.27799 7.56873 9.06683 7.47746 8.91158 7.31901C8.75634 7.16057 8.66939 6.94758 8.66939 6.72576C8.66939 6.50394 8.75634 6.29096 8.91158 6.13251C9.06683 5.97407 9.27799 5.88279 9.49977 5.87826C9.72154 5.88279 9.93271 5.97407 10.0879 6.13251C10.2432 6.29096 10.3301 6.50394 10.3301 6.72576C10.3301 6.94758 10.2432 7.16057 10.0879 7.31901C9.93271 7.47746 9.72154 7.56873 9.49977 7.57326Z" fill="#F75151" fill-opacity="0.15"/>
      <path d="M8.65234 6.72567C8.65234 6.95044 8.74163 7.16601 8.90057 7.32495C9.05951 7.48388 9.27507 7.57317 9.49984 7.57317C9.72461 7.57317 9.94018 7.48388 10.0991 7.32495C10.2581 7.16601 10.3473 6.95044 10.3473 6.72567C10.3473 6.5009 10.2581 6.28534 10.0991 6.1264C9.94018 5.96746 9.72461 5.87817 9.49984 5.87817C9.27507 5.87817 9.05951 5.96746 8.90057 6.1264C8.74163 6.28534 8.65234 6.5009 8.65234 6.72567ZM9.92359 8.70317H9.07609C8.99841 8.70317 8.93484 8.76674 8.93484 8.84442V13.6469C8.93484 13.7246 8.99841 13.7882 9.07609 13.7882H9.92359C10.0013 13.7882 10.0648 13.7246 10.0648 13.6469V8.84442C10.0648 8.76674 10.0013 8.70317 9.92359 8.70317Z" fill="#F65151"/>
    </svg>
  );
};

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BankSettings: FunctionComponent<IProps> = ({ setShowModal }) => {
  const [accName, setAccName] = useState<string>("");
  const [accNum, setAccNum] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [selectedBankDetailId, setSelectedBanDetailsId] = useState<string>("");
  const dispatch = useAppDispatch();
  const { shops } = useAppSelector((state) => state);
  const currentShop = shops.currentShop;

  const { data: banksData } = useQuery<{ getBanks: [IBanks] }>(GET_BANKS, {
    fetchPolicy: "network-only",
    onError: (error) => {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const {
    data: bankDetails,
    refetch: refetchBankDetails
  } = useQuery<{ getAllBankDetails: [IBankDetails] }>(GET_BANK_DETAILS, {
    fetchPolicy: "network-only",
    variables: { shopId: currentShop.shopId },
    onError: (error) => {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const bankDetailsCount = bankDetails?.getAllBankDetails?.length ?? 0;

  const setSelectedDetails = (details: IBankDetails | null) => {
    setAccNum(details?.accountNumber || "");
    setAccName(details?.accountName || "");
    setBankName(details?.bankName || "");
    setSelectedBanDetailsId(details?.bankDetailId || "");
  };

  const [createBankDetails] = useMutation(CREATE_BANK_DETAILS);
  const [deleteBankDetails] = useMutation(DELETE_BANK_DETAILS);
  const [updateBankDetails] = useMutation(UPDATE_BANK_DETAILS);

  const handleDeleteBankDetails = () => {
    deleteBankDetails({
      variables: {
        shopId: currentShop.shopId,
        bankDetailId: selectedBankDetailId
      },
    })
      .then(() => {
        dispatch(isLoading(false));
        dispatch(
          toggleSnackbarOpen({
            message: "Bank Details Deleted Successfully",
            color: "SUCCESS"
          })
        );
        setShowDelete(false);
      })
      .catch((error) => {
        dispatch(isLoading(false));
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        });
      });
  };

  const handleSubmit = () => {
    dispatch(isLoading(false));
    const data = {
      bankName,
      accountName: accName,
      accountNumber: `${accNum}`,
      shopId: currentShop?.shopId || ""
    };

    if (isEdit) {
      updateBankDetails({
        variables: { ...data, bankDetailId: selectedBankDetailId },
      })
        .then(() => {
          dispatch(isLoading(false));
          dispatch(
            toggleSnackbarOpen({
              message: "Bank Details Updated Successfully",
              color: "SUCCESS"
            })
          );
          setShowForm(false);
          refetchBankDetails();
          setSelectedDetails(null);
        })
        .catch((error) => {
          dispatch(isLoading(false));
          toggleSnackbarOpen({
            message: error?.message || error?.graphQLErrors[0]?.message,
            color: "DANGER",
          });
        });
    } else {
      createBankDetails({
        variables: data,
      })
        .then(() => {
          dispatch(isLoading(false));
          dispatch(
            toggleSnackbarOpen({
              message: "Bank Details Created Successfully",
              color: "SUCCESS"
            })
          );
          setShowForm(false);
          refetchBankDetails();
          setSelectedDetails(null);
        })
        .catch((error) => {
          dispatch(isLoading(false));
          toggleSnackbarOpen({
            message: error?.message || error?.graphQLErrors[0]?.message,
            color: "DANGER",
          });
        });
    }
  };

  useEffect(() => {
    refetchBankDetails();
  }, [showDelete]);

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
        <span>Debt Settings</span>
        <button
          onClick={() => setShowModal(false)}
          style={{ background: "transparent", border: "1px solid black" }}
        >
          <img src={cancelIcon} alt="" />
        </button>
      </h3>
      <BankSettingsContainer>
        <Flex justifyContent="space-between">
          <p className="section-title">Bank account (for debt payment)</p>
          <OrangeInfo />
        </Flex>
        <Seperator />

        {(bankDetails?.getAllBankDetails && !showForm) &&
            <>
              {bankDetails?.getAllBankDetails?.map((bank) => {
                const { bankDetailId, accountName, accountNumber } = bank;
                return (
                  <Flex key={bankDetailId} width="100%" margin="0.5rem 0" bg={Colors.lightBg}>
                    <Flex direction="column" gap="0.5rem" padding="0.75rem 1rem" borderRadius="10px" width="100%">
                      <Text color={Colors.blackLight} fontSize="1rem">{accountName}</Text>
                      <Text color={Colors.blackLight} fontSize="1rem">{accountNumber}</Text>
                      <Text color={Colors.blackLight} fontSize="1rem">{bank.bankName}</Text>
                    </Flex>
                    <Flex width="30%" justifyContent="flex-end" gap="0.5rem" margin="0 1rem">
                      <TransparentBtn>
                        <img
                          src={editIcon}
                          alt=""
                          onClick={() => {
                            setShowForm(true);
                            setIsEdit(true);
                            setSelectedDetails(bank);
                          }}
                        />
                      </TransparentBtn>
                      <TransparentBtn>
                        <img
                          src={deleteIcon}
                          alt=""
                          onClick={() => {
                            setShowDelete(true);
                            setSelectedBanDetailsId(bankDetailId);
                          }}
                        />
                      </TransparentBtn>
                    </Flex>
                  </Flex>
                );
              })}
            </>
        }

        {(bankDetailsCount < 1 || showForm) &&
           <>
              <InputWrapper>
                <label style={{ fontSize: "0.875rem", fontWeight: "400", color: "#9EA8B7" }}>
                  Account Name
                </label>
                <InputField
                  placeholder={"John Doe"}
                  type="text"
                  onChange={(e) => setAccName(e.target.value)}
                  backgroundColor="#F4F6F9"
                  size="lg"
                  color="#607087"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="0px"
                  fontSize="1rem"
                  width="100%"
                  noFormat
                  value={accName}
                  required
                />
              </InputWrapper>

              <InputWrapper>
                <label style={{ fontSize: "0.875rem", fontWeight: "400", color: "#9EA8B7" }}>
                  Account Number
                </label>
                <InputField
                  placeholder={"0123456789"}
                  type="number"
                  maxlength={10}
                  onChange={(e) => setAccNum(e.target.value)}
                  backgroundColor="#F4F6F9"
                  size="lg"
                  color="#607087"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="0px"
                  fontSize="1rem"
                  width="100%"
                  noFormat
                  value={accNum}
                  required
                />
              </InputWrapper>

              <InputWrapper>
                <label style={{ fontSize: "0.875rem", fontWeight: "400", color: "#9EA8B7" }}>
                  Select Bank
                </label>
                <BankSelect
                  style={{
                    opacity: `${bankName ? "1" : "0.6"}`,
                  }}
                  onChange={(e) => setBankName(e.target.value)}
                  value={bankName}
                  required
                >
                  <BankOption value="" disabled selected>Select bank Name</BankOption>
                  {banksData?.getBanks?.map((bank) => {
                    return (
                      <BankOption value={bank.bankName}>
                        {bank.bankName.toLowerCase()}
                      </BankOption>
                    );
                  })}
                </BankSelect>
              </InputWrapper>
            </>
        }

        <InfoBox>
          Dear “Customer Name”, you have outstanding bill of <br />
          <span style={{ fontWeight: "600" }}>(₦ Amount)</span> @ <span style={{ fontWeight: "600" }}>(Your Shop Name)</span> with due date<br />
          <span style={{ fontWeight: "600" }}>(7 Jan, 2023)</span> as agreed.
          <p className="mini-text">(Timart will attach your bank details if provided above).</p>
          <p className="label">SMS Information</p>
        </InfoBox>

        <WarningBox gap="0.2rem" alignItems="center">
          <DangerIcon />
          <p className="message">
            <span style={{ fontWeight: "600", color: "#F65151" }}>Attention:</span> You cannot make changes to this sms template.
            But if you have complaints or addition to this please
            <span style={{ color: Colors.secondaryColor, textDecorationLine: "underline" }}> Contact us</span>
          </p>
        </WarningBox>

        <Flex gap="0.75rem">
          <Button
            label={(bankDetailsCount < 1) ? "Save" : (isEdit ? "Update" : "Add New")}
            onClick={(showForm || bankDetailsCount < 1) ? handleSubmit : () => setShowForm(true)}
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
          {(bankDetails?.getAllBankDetails && showForm) &&
            <Button
              label={"Cancel"}
              onClick={() => {
                setShowForm(false);
                setSelectedDetails(null);
              }}
              backgroundColor={Colors.red}
              size="lg"
              color="#fff"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              margin="2rem 0 0 0 "
            />
          }
        </Flex>
      </BankSettingsContainer>
      {showDelete && (
        <PopupCard close={() => setShowDelete(false)}>
          <DeleteContainer>
            <Span
              className="text"
              fontSize="1rem"
              fontWeight="500"
              margin="2rem 0 0 0"
              textAlign="center"
              color={Colors.blackLight}
            >
              Do you want to delete this bank information?
            </Span>
            <Flex gap="0.5rem">
              <Button
                type="button"
                size="lg"
                label="Delete"
                color={Colors.white}
                backgroundColor={Colors.red}
                borderSize="0px"
                fontSize="0.875rem"
                borderRadius="0.625rem"
                onClick={() => handleDeleteBankDetails()}
              />
              <Button
                type="button"
                size="lg"
                label="Cancel"
                color={"#fff"}
                backgroundColor={Colors.blackLight}
                borderSize="0px"
                fontSize="0.875rem"
                borderRadius="0.625rem"
                onClick={() => setShowDelete(false)}
              />
            </Flex>
          </DeleteContainer>
        </PopupCard>
      )}
    </ModalBox>
  );
};

export default BankSettings;
