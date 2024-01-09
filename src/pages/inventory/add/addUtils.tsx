import React from "react";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { TabButton } from "./style";
import { Colors } from "../../../GlobalStyles/theme";
import { isFigorr } from "../../../utils/constants";
import { useAppSelector } from "../../../app/hooks";
import { getIsEdit } from "../../../app/slices/isEdit";

interface IProps {
  activeTab?: string;
  setActiveTab?: Function;
  setSellType?: Function;
}

export const tabs = [
  { name: "Add in Single Sets", value: "SINGLE" },
  { name: "Add in Packs", value: "PACK" },
  { name: "Add in Pieces & Pack", value: "PIECES_AND_PACK" },
  { name: "Add in Variation", value: "VARIATION" },
];

const { secondaryColor, blackLight } = Colors;
let timeout: NodeJS.Timeout | null = null;
let keys: string = "";

const inputTypes = ["text", "textarea", "number", "password"];

export const ProductNavContent: React.FC<IProps> = ({ activeTab, setActiveTab, setSellType }) => {
  const { isEdit } = useAppSelector(getIsEdit);

  if (isEdit) return null;

  return (
    <Flex width="100%" alignItems="center" justifyContent="flex-start" margin="1rem 0 -0.5rem 0">
      {tabs.map((tab, index) => (
        <TabButton
          active={activeTab === tab.value}
          key={tab.name}
          onClick={() => {
            setActiveTab!(tab.value);
            setSellType && setSellType(index);
          }}
        >
          {tab.name}
        </TabButton>
      ))}
    </Flex>
  );
};

export const headerContent = (activeTab: string, type: string) => {
  const tabName = tabs.find((tab) => tab.value === activeTab)?.name;
  const lastWord = tabName!.trim().split("Sell in")[1] || "single sets";
  return (
    <Flex alignItems="flex-start" justifyContent="space-between" direction="column">
      <Span color={blackLight} fontWeight="700" fontSize="1rem">
        {type === "product" ? tabName : "Service Product"}
      </Span>

      {type === "product" ? (
        <Span fontSize="0.9rem" color={blackLight}>
          Your product and quantity will be added in {lastWord.toLowerCase()}. Turn off{" "}
          <Span color={secondaryColor}>
            “<u>add product with quantity</u>”
          </Span> if your product has no
          quantity
        </Span>
      ) : (
        <Span fontSize="0.9rem" color={blackLight}>
          You are adding a service product without quantity. Turn on{" "}
          <Span color={Colors.secondaryColor}> “add product with quantity”</Span> if your product
          has quantity
        </Span>
      )}
    </Flex>
  );
};

export const getBarcode = (updateBarcode: (keys: string) => void) => {
  const barcodeListener = function (e: any) {
    if (e.key !== "Enter" && timeout !== null) {
      clearTimeout(timeout);
    }
    if (e.keyCode < 48 || e.keyCode > 111) {
      return;
    }

    keys += e.key;
    timeout = setTimeout(
      ((target) => () => {
        if (keys.length > 4) {
          updateBarcode(keys);
          if (inputTypes.includes(e?.target?.type)) {
            target.value = target.value.replace(keys, "");
          }
        }
        keys = "";
      })(e.target),
      200
    );

    if (e.key === "Enter" && keys.length > 4) {
      e.preventDefault();
    }
  };
  return barcodeListener;
};
