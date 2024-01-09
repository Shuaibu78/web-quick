import { FC } from "react";
import { Colors } from "../../GlobalStyles/theme";
import CustomRadioInput from "./customRadioInput";

interface RadioInputProps {
  radioValue: boolean;
  handleChange: Function;
  radioText: string;
  radioHelperText: string;
}
const CustomRadioInputWrapper: FC<RadioInputProps> = ({
  radioValue,
  handleChange,
  radioText,
  radioHelperText,
}) => {
  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          columnGap: ".5rem",
          alignItems: "flex-end",
          paddingBottom: ".5rem",
          fontSize: "1rem",
        }}
      >
        <CustomRadioInput isChecked={radioValue as boolean} onChange={handleChange} />
        <p
          onClick={() => handleChange()}
          style={{ color: radioValue ? Colors.black : "#8196B3", padding: "0", cursor: "pointer" }}
        >
          {radioText}
        </p>
      </div>
      <p style={{ color: "#9EA8B7", fontSize: "0.75rem" }}>{radioHelperText}</p>
    </div>
  );
};

export default CustomRadioInputWrapper;
