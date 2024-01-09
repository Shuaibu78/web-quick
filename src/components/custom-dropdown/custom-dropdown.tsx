import React, { FunctionComponent, useState, useEffect } from "react";
import { ClippedText } from "../../pages/onlinePresence/style.onlinePresence";
import { Container, DropdownBtn, IconContainer, Icon, Selected, Options } from "./style";
interface DropdownProps {
  width?: string;
  minWidth?: string;
  height: string;
  borderRadius: string;
  containerColor?: string;
  iconContainerColor?: string;
  dropdownIcon?: string;
  icon?: string;
  fontSize: string;
  selected: any;
  setValue: (value: any) => void;
  options: (string | number)[];
  color: string;
  boxShadow?: string;
  margin?: string;
  padding?: string;
  placeholder?: string;
  overflowY?: string;
  openModal?: boolean;
  noBorder?: boolean;
  border?: string;
  disabled?: boolean;
  label?: string;
  bgColor?: string;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>> | any;
  specialButton?: boolean;
  fontWeight?: string;
  iconSize?: string;
}
const CustomDropdown: FunctionComponent<DropdownProps> = ({
  width,
  minWidth,
  height,
  containerColor,
  iconContainerColor,
  dropdownIcon,
  icon,
  fontSize,
  selected,
  setValue,
  options,
  borderRadius,
  color,
  boxShadow,
  margin,
  padding,
  placeholder,
  overflowY,
  openModal,
  disabled,
  noBorder,
  border,
  setOpenModal,
  label,
  bgColor,
  specialButton,
  iconSize,
  // fontWeight,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <>
      <Container
        width={width}
        minWidth={minWidth}
        containerColor={containerColor}
        color={color}
        height={height}
        fontSize={fontSize}
        boxShadow={boxShadow}
        margin={margin}
        noBorder={noBorder}
        border={border}
        borderRadius={borderRadius}
        isFocused={isFocused}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
      >
        <span>{label}</span>
        {specialButton ? (
          <div
            style={{
              backgroundColor: containerColor ?? "#F4F6F9",
              width: "100%",
              display: "flex",
              position: "relative",
              cursor: "pointer",
              alignItems: "center",
              fontWeight: "normal",
              whiteSpace: "nowrap",
              borderRadius: borderRadius,
              padding: padding,
            }}
            onClick={(e) => {
              e.preventDefault();
              setShowDropdown(!showDropdown);
            }}
          >
            {icon && (
              <Icon>
                <img src={icon} alt="" />
              </Icon>
            )}
            <Selected color={color} style={{ opacity: `${selected < 0 ? 0.6 : 1}` }}>
              <ClippedText style={{ fontSize: "0.75rem" }} color={color} maxWidth="120px">
                {selected < 0 ? placeholder : options[selected]}
              </ClippedText>
            </Selected>
            <IconContainer iconContainerColor={iconContainerColor} iconSize="unset">
              <img src={dropdownIcon} alt="" />
            </IconContainer>
          </div>
        ) : (
          <DropdownBtn
            bgColor={bgColor}
            disabled={disabled}
            containerColor={containerColor}
            borderRadius={borderRadius}
            onClick={(e) => {
              e.preventDefault();
              setShowDropdown(!showDropdown);
            }}
            fontSize={fontSize}
            padding={padding}
          >
            {icon && (
              <Icon>
                <img src={icon} alt="" />
              </Icon>
            )}
            <Selected color={color} style={{ opacity: `${selected < 0 ? 0.6 : 1}` }}>
              <ClippedText style={{ fontSize: fontSize }} color={color} maxWidth="6.875rem">
                {selected < 0 ? placeholder : options[selected]}
              </ClippedText>
            </Selected>
            <IconContainer
              style={{
                transform: showDropdown ? "rotate(180deg)" : "none",
                transition: ".3s linear",
              }}
              iconContainerColor={iconContainerColor}
              iconSize="unset"
            >
              <img src={dropdownIcon} alt="" />
            </IconContainer>
          </DropdownBtn>
        )}
        {showDropdown && (
          <Options
            height={height}
            width={width}
            minWidth={"200px"}
            containerColor={containerColor}
            color={color}
            borderRadius={borderRadius}
            boxShadow={boxShadow}
            fontSize={fontSize}
            overflowY={overflowY}
          >
            {options.map((value, index) => {
              return (
                <button
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    display: "flex",
                    padding: "0px 0.625rem",
                  }}
                  onClick={() => {
                    setValue(index);
                    setShowDropdown(false);
                    setOpenModal && setOpenModal(true);
                  }}
                  key={index}
                >
                  <p>{value}</p>
                </button>
              );
            })}
          </Options>
        )}
        {showDropdown && <div className="closeDiv" onClick={() => setShowDropdown(false)}></div>}
      </Container>
    </>
  );
};

export default CustomDropdown;
