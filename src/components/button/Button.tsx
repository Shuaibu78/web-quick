import React from "react";

// Note: import useAppSelector and useAppDispatch this way
// import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Button as ButtonWrapper } from "./style";

interface ButtonProps {
  label?: string;
  children?: any;
  onClick?: (e?: any) => void;
  backgroundColor: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  borderSize?: string;
  borderRadius?: string;
  borderColor?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  margin?: string;
  border?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  style?: any;
  display?: string;
}

export function Button({
  label,
  onClick,
  backgroundColor,
  size,
  color,
  borderColor,
  borderRadius,
  borderSize,
  fontSize,
  width,
  height,
  margin,
  border,
  type,
  disabled = false,
  style,
  children,
  display,
}: ButtonProps) {
  return (
    <ButtonWrapper
      aria-label="Increment value"
      size={size}
      buttonColor={backgroundColor}
      valueColor={color}
      borderRadius={borderRadius}
      borderSize={borderSize}
      borderColor={borderColor}
      fontSize={fontSize}
      width={width}
      height={height}
      onClick={onClick}
      type={type}
      margin={margin}
      border={border}
      disabled={disabled}
      style={style}
      display={display}
    >
      {children || label}
    </ButtonWrapper>
  );
}
