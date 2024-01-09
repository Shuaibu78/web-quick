import React, { FunctionComponent } from "react";
import { CustomCheck, NotChecked, RealCheckbox } from "./style";
import { Colors } from "../../GlobalStyles/theme";
interface Props {
  isChecked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color?: string;
  size: string;
  marginLeft?: number;
  isDisabled?: boolean;
  title?: string;
  id?: string;
  checkedColor?: string;
  borderColor?: string;
}
const Checkbox: FunctionComponent<Props> = ({
  isChecked,
  onChange,
  color,
  size,
  marginLeft,
  isDisabled,
  title,
  id,
  checkedColor,
  borderColor
}) => {
  return (
    <CustomCheck
      color={color}
      size={size}
      marginLeft={marginLeft}
      id={id}
      checkedColor={checkedColor}
      checked={isChecked}
      borderColor={borderColor}
    >
      {isChecked ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.59834 4.34892C9.7216 4.23157 9.88562 4.1667 10.0558 4.16799C10.226 4.16928 10.389 4.23662 10.5105 4.35582C10.6319 4.47502 10.7024 4.63675 10.7069 4.80687C10.7114 4.977 10.6496 5.14222 10.5346 5.26767L7.04334 9.63392C6.98331 9.69858 6.91085 9.75047 6.8303 9.78649C6.74976 9.82251 6.66278 9.84192 6.57456 9.84355C6.48634 9.84518 6.3987 9.82901 6.31688 9.796C6.23505 9.76299 6.16072 9.71382 6.09834 9.65142L3.78309 7.33617C3.71861 7.27609 3.6669 7.20364 3.63103 7.12314C3.59516 7.04264 3.57588 6.95574 3.57432 6.86763C3.57277 6.77951 3.58898 6.69199 3.62198 6.61027C3.65499 6.52856 3.70411 6.45433 3.76643 6.39201C3.82875 6.3297 3.90298 6.28057 3.98469 6.24756C4.06641 6.21456 4.15393 6.19835 4.24205 6.1999C4.33016 6.20146 4.41706 6.22075 4.49756 6.25661C4.57806 6.29248 4.65051 6.3442 4.71059 6.40867L6.54284 8.24005L9.58171 4.36817C9.58719 4.36143 9.59215 4.35501 9.59834 4.34892Z"
            fill={color || Colors.primaryColor}
          />
        </svg>
      ) : (
        <NotChecked></NotChecked>
      )}
      <RealCheckbox
        type="checkbox"
        checked={isChecked}
        isDisbaled={isDisabled}
        onChange={onChange}
        title={title}
      />
    </CustomCheck>
  );
};
export default Checkbox;
