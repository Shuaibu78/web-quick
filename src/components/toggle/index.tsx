// src/components/Toggle.tsx
import React, { useState } from "react";
import styled from "styled-components";

interface ToggleProps {
  onToggle: () => void;
  value?: boolean;
}

const Container = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Slider = styled.div<{ isChecked: boolean }>`
  width: 30px;
  height: 15px;
  background-color: ${(props) => (props.isChecked ? "#E47D05" : "#828282")};
  border-radius: 15px;
  position: relative;
  transition: background-color 0.3s ease;

  ::before {
    content: '';
    width: 17px;
    height: 17px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: ${(props) => (props.isChecked ? "15px" : "0")};
    transition: left 0.3s ease;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
`;

const Toggle: React.FC<ToggleProps> = ({ onToggle, value = false }) => {
  // const [isChecked, setIsChecked] = useState(value);

  // const handleToggle = () => {
  //   const newValue = !isChecked;
  //   setIsChecked(newValue);
  //   onToggle(newValue);
  // };

  return (
    <Container>
      <Slider isChecked={value} onClick={onToggle} />
    </Container>
  );
};

export default Toggle;
