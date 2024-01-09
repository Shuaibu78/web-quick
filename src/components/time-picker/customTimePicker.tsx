import React, { useEffect, useRef, useState } from "react";
import { CustomTimeContainer } from "./style";
import timeIcon from "../../assets/time-icon.svg";
import { Flex } from "../../GlobalStyles/CustomizableGlobal.style";

interface ICustomDate {
  height?: string;
  width?: string;
  setTime: Function;
  time: string;
  background?: string;
  border?: string;
  label?: string;
  marginTop?: string;
  icon?: string;
}
const CustomTime: React.FC<ICustomDate> = ({
  height,
  width,
  time,
  setTime,
  background,
  border,
  label,
  marginTop,
  icon,
}) => {
  const onChange = (e: any): void => {
    setTime(e.target.value);
  };

  return (
    <CustomTimeContainer
      background={background}
      marginTop={marginTop}
      border={border}
      height={height}
      width={width}
    >
      <label>{label}</label>
      <Flex width="100%" gap="0.5rem" alignItems="center">
        <img id="clock-img" src={icon ?? timeIcon} alt="" />
        <input className="time" type="time" onChange={onChange} value={time} />
      </Flex>
    </CustomTimeContainer>
  );
};

export default CustomTime;
