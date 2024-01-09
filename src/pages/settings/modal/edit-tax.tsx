import React, { FunctionComponent, useEffect, useState } from "react";
import { ModalBox } from "../style";
import { InputWrapper } from "../../inventory/style";
import { InputField } from "../../../components/input-field/input";
import cancelIcon from "../../../assets/cancel.svg";
import toggleOn from "../../../assets/toggleOn.svg";
import toggleOff from "../../../assets/toggleOff.svg";
import { Button } from "../../../components/button/Button";
import { ToggleButton, ToggleCont } from "../../staffs/style";
import { SubText } from "../../inventory/add/style";
import Checkbox from "../../../components/checkbox/checkbox";
import { useMutation, useQuery } from "@apollo/client";
import { ITax } from "../../../interfaces/tax.interface";
import { ADD_TAX, DELETE_TAX, GET_ALL_TAXES, UPDATE_TAX } from "../../../schema/tax.schema";
import { isLoading } from "../../../app/slices/status";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { validateInputNum } from "../../../utils/formatValues";

interface TaxProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  tax: ITax;
  refetch: any;
}

const EditTax: FunctionComponent<TaxProps> = ({ setShowModal, tax, refetch }) => {
  const [taxName, setTaxName] = useState(tax.name);
  const [taxValue, setTaxValue] = useState(Number(tax.value ?? ""));
  const [isAllSales, setIsAllSales] = useState(tax.includeOnEverySales);
  const [taxInclusive, setTaxInclusive] = useState(tax.isInclusive);
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();
  const [updateTax] = useMutation<{ updateTax: ITax }>(UPDATE_TAX, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });
  const [deleteTax] = useMutation<{ deleteTax: ITax }>(DELETE_TAX, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const [appliedTaxes, setAppliedTaxes] = useState<ITax[]>();

  const { data: TaxData } = useQuery<{ getAllTaxes: [ITax] }>(GET_ALL_TAXES, {
    fetchPolicy: "network-only",
    variables: {
      shopId: currentShop.shopId,
    },
    onError(fetchTaxErr) {
      dispatch(toggleSnackbarOpen(fetchTaxErr?.message || fetchTaxErr?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    if (TaxData?.getAllTaxes) {
      const taxes = TaxData.getAllTaxes.filter((tx) => tx.includeOnEverySales);
      setAppliedTaxes(taxes);
    }
  }, [TaxData]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isAllSales && appliedTaxes?.length) {
      dispatch(
        toggleSnackbarOpen({
          message: "You have aready added a tax to all sales.",
          color: "DANGER",
        })
      );
      return;
    }
    dispatch(isLoading(true));
    updateTax({
      variables: {
        taxId: tax.taxId,
        input: {
          includeOnEverySales: isAllSales,
          isInclusive: taxInclusive,
          name: taxName,
          shopId: currentShop?.shopId,
          value: Number(taxValue),
        },
      },
    })
      .then((data) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen("Updated Successfully"));
        setShowModal(false);
        refetch();
      })
      .catch((error) => {
        console.log(error);
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };
  const handleDelete = (e: any) => {
    e.preventDefault();
    dispatch(isLoading(true));
    deleteTax({
      variables: {
        taxId: tax.taxId,
      },
    })
      .then((data) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen("Deleted Successfully"));
        refetch();
        setShowModal(false);
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
        <span>Edit Tax Settings</span>
      </h3>
      <InputWrapper>
        <label>Tax Name</label>
        <InputField
          placeholder="Enter Tax Name"
          type="text"
          backgroundColor="#F4F6F9"
          size="lg"
          color="#607087"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          value={taxName ?? ""}
          onChange={(e) => setTaxName(e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <label>Tax Value</label>
        <InputField
          placeholder="Enter Tax Value"
          type="text"
          backgroundColor="#F4F6F9"
          size="lg"
          color="#607087"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          value={taxValue}
          onChange={(e) =>
            validateInputNum(
              setTaxValue,
              !isNaN(Number(e.target.value)) ? e.target.value : taxValue
            )
          }
        />
      </InputWrapper>
      <ToggleCont style={{ height: "1.875rem" }}>
        <Checkbox
          isChecked={!!taxInclusive}
          onChange={(e) => setTaxInclusive(e.target.checked)}
          color="#130F26"
          size="1.125rem"
        />
        <span style={{ marginLeft: "1rem" }}>Tax Inclusive</span>
      </ToggleCont>
      <SubText>Tax amount is included in the price of purchase</SubText>
      <ToggleCont style={{ height: "1.875rem" }}>
        <Checkbox
          isChecked={!taxInclusive}
          onChange={(e) => setTaxInclusive(!e.target.checked)}
          color="#130F26"
          size="1.125rem"
        />
        <span style={{ marginLeft: "1rem" }}>Tax Exclusive</span>
      </ToggleCont>
      <SubText>Tax amount is added at the point of final transaction</SubText>
      <ToggleButton onClick={() => setIsAllSales(!isAllSales)} style={{ height: "1.875rem" }}>
        <img src={isAllSales ? toggleOn : toggleOff} alt="" />
        <span style={{ marginLeft: "1rem" }}>Include in every sales</span>
      </ToggleButton>
      <SubText>Tax is added to all sales by default</SubText>
      <div style={{ marginBottom: "1.25rem" }}></div>
      <Button
        label="Update Tax"
        onClick={handleSubmit}
        backgroundColor="#FFBE62"
        size="lg"
        color="#fff"
        borderColor="transparent"
        borderRadius="0.75rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
      />
      <Button
        label="Delete Tax"
        onClick={handleDelete}
        backgroundColor="red"
        size="lg"
        color="#fff"
        borderColor="transparent"
        borderRadius="0.75rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
        margin="0.9375rem 0 0 0"
      />
      <div style={{ marginBottom: "1.25rem" }}></div>
    </ModalBox>
  );
};

export default EditTax;
