import React, { useState } from "react";
import { CheckBox, Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import cancelIcon from "../../../assets/cancel.svg";
import { CancelButton } from "../style";
import { Colors } from "../../../GlobalStyles/theme";
import { Button } from "../../../components/button/Button";
import { ITax } from "../../../interfaces/tax.interface";
import { Tax } from "./style";

interface IAddTax {
  setShowAddTax: (value: boolean) => void;
  taxList: ITax[];
  selectedTax?: ITax;
  setSelectedTax: (value: ITax) => void;
}

const AddTax: React.FC<IAddTax> = ({ setShowAddTax, taxList, setSelectedTax }) => {
  const [selected, setSelected] = useState<ITax>({});

  return (
    <Flex bg="white" borderRadius="1rem" direction="column" padding="1rem" width="25rem">
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Span color={Colors.primaryColor} fontSize="1.4rem" fontWeight="600">
          Add Tax
        </Span>
        <CancelButton
          onClick={() => {
            setShowAddTax(false);
          }}
        >
          <img src={cancelIcon} alt="" />
        </CancelButton>
      </Flex>

      <Flex alignItems="center" direction="column" gap="0.6rem" margin="1rem 0 0 0">
        {taxList.map((tax) => {
          const isSelected = tax.taxId === selected.taxId;
          return (
            <Tax selected={isSelected} key={tax.taxId} onClick={() => setSelected(tax)}>
              <span id="bar" />
              <Flex width="100%">
                <Flex width="90%" direction="column" alignItems="flex-start">
                  <Span color={isSelected ? Colors.green : Colors.primaryColor}>{tax.name}</Span>
                  <Span color={isSelected ? Colors.green : Colors.blackLight}>{`${tax.value}% ${
                    tax.isInclusive ? "inclusive" : "exclusive"
                  }`}</Span>
                </Flex>
              </Flex>
              <CheckBox
                radius="50%"
                margin="0 0.3rem 0 0 "
                color={isSelected ? Colors.green : Colors.primaryColor}
                checked={isSelected}
              >
                <span></span>
              </CheckBox>
            </Tax>
          );
        })}
      </Flex>

      <Button
        label="Save"
        disabled={!selected.value}
        onClick={() => {
          setShowAddTax(false);
          setSelectedTax(selected);
        }}
        backgroundColor={Colors.primaryColor}
        size="lg"
        fontSize="1rem"
        borderRadius="0.9rem"
        width="100%"
        color="#fff"
        margin="2rem 0 0 0"
        borderColor="transparent"
        borderSize="0px"
      />
    </Flex>
  );
};

export default AddTax;
