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
import { ADD_TAX, GET_ALL_TAXES } from "../../../schema/tax.schema";
import { isLoading } from "../../../app/slices/status";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { validateInputNum } from "../../../utils/formatValues";
import { Colors } from "../../../GlobalStyles/theme";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";

interface TaxProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: any;
}

const NewTax: FunctionComponent<TaxProps> = ({ setShowModal, refetch }) => {
  const [taxName, setTaxName] = useState("");
  const [taxValue, setTaxValue] = useState(0);
  const [isAllSales, setIsAllSales] = useState(false);
  const [taxInclusive, setTaxInclusive] = useState<boolean>(false);
  const [taxExclusive, setTaxExclusive] = useState<boolean>(false);
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();
  const [addTax] = useMutation<{ addTax: ITax }>(ADD_TAX, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
    onCompleted(data) {
      if (data.addTax) {
        setShowModal(false);
      }
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
    if (taxName === "" || taxValue === 0 || (taxExclusive === false && taxInclusive === false)) {
      dispatch(
        toggleSnackbarOpen({
          message: "You have not filled all the necessary fields",
          color: "DANGER",
        })
      );
    } else {
      dispatch(isLoading(true));
      addTax({
        variables: {
          input: {
            includeOnEverySales: isAllSales,
            isInclusive: taxInclusive ?? false,
            name: taxName,
            shopId: currentShop?.shopId,
            value: Number(taxValue),
          },
        },
      })
        .then((data) => {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen({ message: "Successfully Created", color: "SUCCESS" }));
          refetch();
        })
        .catch((error) => {
          console.log(error);
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        });
    }
  };

  const handleTaxSelect = (tax: "exclusive" | "inclusive") => {
    if (tax === "inclusive") {
      setTaxExclusive(false);
      setTaxInclusive(true);
    } else {
      setTaxExclusive(true);
      setTaxInclusive(false);
    }
  };

  return (
    <ModalBox>
      <h3 style={{ marginBottom: "32px" }}>
        <button onClick={() => setShowModal(false)}>
          <img src={cancelIcon} alt="" />
        </button>
        <span>Add New Tax Settings</span>
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
          value={taxName}
          onChange={(e) => setTaxName(e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <label>Tax Value</label>
        <div className="taxWrapper">
          <InputField
            placeholder="Enter Tax Value"
            type="number"
            noFormat
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            value={taxValue}
            onChange={(e) => setTaxValue(parseFloat(e.target.value))}
          />
          <span>%</span>
        </div>
      </InputWrapper>

      <Flex gap="1em" width="350px" direction="column">
        <ToggleCont style={{ height: "1.875rem" }}>
          <Checkbox
            isChecked={taxInclusive as boolean}
            onChange={() => handleTaxSelect("inclusive")}
            color="#130F26"
            size="1.125rem"
          />
          <span style={{ marginLeft: "1rem" }}>Tax Inclusive</span>
        </ToggleCont>
        <SubText>Tax amount is included in the price of purchase</SubText>
        <ToggleCont style={{ height: "1.875rem" }}>
          <Checkbox
            isChecked={taxExclusive}
            onChange={() => handleTaxSelect("exclusive")}
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
      </Flex>
      <Button
        label="Add Tax"
        onClick={handleSubmit}
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

export default NewTax;
