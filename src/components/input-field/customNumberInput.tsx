import { Flex } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { InputField } from "./input";
import CounterBtn from "../../assets/CounterBtn.svg";
import { FC } from "react";

interface NumberInputAttr {
  value: number | string;
  onChange: Function;
  increment: Function;
  decrement: Function;
  bgColor?: string;
  width?: string;
  label?: string;
  type?: "text" | "number";
  step?: string;
  buttonBg?: string;
}

const NumberInput: FC<NumberInputAttr> = ({
  value,
  onChange,
  increment,
  decrement,
  bgColor,
  width,
  label,
  type,
  step,
}) => {
  return (
    <Flex
      bg={bgColor ?? Colors.tabBg}
      height="2.5rem"
      width={width ?? "5rem"}
      alignItems="center"
      justifyContent="space-between"
      padding="0 0.1rem"
      borderRadius="0.5rem"
      position="relative"
    >
      <InputField
        placeholder="00"
        placeholderColor={Colors.blackLight}
        type={type ?? "number"}
        width="inherit"
        height="inherit"
        backgroundColor="transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        borderRadius="0.5rem"
        label={label}
        noFormat
        step={step}
      />
      <div style={{ position: "absolute", right: "0.2rem", cursor: "pointer" }}>
        <div onClick={() => increment()} style={{ transform: "rotate(180deg)" }}>
          <img src={CounterBtn} alt="" />
        </div>
        <div onClick={() => decrement()} style={{ cursor: "pointer" }}>
          <img src={CounterBtn} alt="" />
        </div>
      </div>
    </Flex>
  );
};

export default NumberInput;
