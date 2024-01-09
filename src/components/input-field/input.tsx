import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input, InputContainer, ShowHide } from "./style";
import { AiOutlineMinus } from "react-icons/ai";

interface InputProps {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  backgroundColor?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  height?: string;
  borderSize?: string;
  borderRadius?: string;
  borderColor?: string;
  fontSize?: string;
  readOnly?: boolean;
  isSideButton?: boolean;
  labelMargin?: string;
  type:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  value: string | number;
  register?: any;
  errors?: any;
  name?: string;
  style?: any;
  border?: boolean;
  marginBottom?: string;
  width?: string;
  label?: string;
  top?: string;
  placeholderColor?: string;
  valueColor?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  required?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxlength?: number;
  noFormat?: boolean;
  defaultValue?: string;
  pattern?: string;
  inputMode?: string;
  sideButtonClick?: any;
  padding?: string;
  step?: string;
}

export function InputField({
  placeholder,
  type = "text",
  onChange,
  backgroundColor,
  size,
  color,
  borderColor,
  borderRadius,
  borderSize,
  fontSize,
  width,
  value,
  register,
  name,
  errors,
  style,
  border,
  marginBottom,
  readOnly,
  label,
  top,
  pattern,
  onKeyDown,
  onKeyPress,
  onFocus,
  autoFocus,
  required = false,
  maxlength,
  height,
  placeholderColor,
  noFormat,
  defaultValue,
  inputMode,
  isSideButton,
  sideButtonClick,
  labelMargin,
  step,
}: InputProps) {
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formattedValue, setFormattedValue] = useState<string | number>("");

  const formatNumberWithCommas = (newValue: string | number) => {
    return noFormat ? newValue : newValue?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useMemo(() => {
    setFormattedValue(formatNumberWithCommas(value));
  }, [value]);

  return (
    <InputContainer
      marginBottom={marginBottom}
      width={width}
      height={height}
      top={top}
      isFocused={isFocused}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      borderRadius={borderRadius}
      labelMargin={labelMargin}
    >
      <label style={{ color: errors ? errors[name!] && "red" : null }} htmlFor="">
        {label}
      </label>
      <Input
        {...register}
        ref={inputRef}
        pattern={pattern}
        inputMode={inputMode}
        paddingSize={size}
        buttonColor={backgroundColor}
        valueColor={color}
        borderRadius={borderRadius}
        borderSize={borderSize}
        borderColor={borderColor}
        fontSize={fontSize}
        width={width}
        height={height || "3.125rem"}
        placeholder={placeholder}
        type={passwordShown ? "text" : type}
        onChange={onChange}
        value={formattedValue}
        border={border}
        name={name}
        readOnly={readOnly}
        style={{ border: name && errors[name] && "1px solid #F75151", ...style }}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        autoFocus={autoFocus}
        required={required}
        onKeyPress={onKeyPress}
        maxLength={maxlength}
        placeholderColor={placeholderColor}
        defaultValue={defaultValue}
        step={step}
      />

      {isSideButton && (
        <div className="minimize" onClick={sideButtonClick}>
          <AiOutlineMinus />
        </div>
      )}

      {type === "password" && (
        <ShowHide onClick={() => setPasswordShown(!passwordShown)}>
          {passwordShown ? "Hide" : "Show"}
        </ShowHide>
      )}
    </InputContainer>
  );
}
