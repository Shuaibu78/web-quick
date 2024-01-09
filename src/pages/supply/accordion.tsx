import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import ArrowDown from "../../assets/AccordionArrowDown.svg";
import ArrowUp from "../../assets/AccordionArrowUp.svg";

const AccordionContainer = styled.div`
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
  transition: all 0.3s ease;
  background-color: #f4f6f9;
  margin-block: 0.3125rem;
  width: 100%;
  padding-bottom: 0.625rem;
`;

const AccordionHeader = styled.div`
  padding: 0.625rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const AccordionContent = styled.div<{ isOpen: boolean }>`
  // padding: 0.625rem;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  transition: all 0.3s ease;
`;

const Accordion = ({
  onAccordionToggle,
  openAccordion,
  activeAccordionId,
  title,
  children,
}: {
  openAccordion?: string;
  activeAccordionId?: string;
  onAccordionToggle: () => void;
  title: ReactNode;
  children: ReactNode;
}) => {
  const isOpen = openAccordion === activeAccordionId;
  return (
    <div
      style={{
        display: "flex",
        width: "98%",
      }}
    >
      <AccordionContainer style={{ maxHeight: isOpen ? "31.25rem" : "4rem" }}>
        <AccordionHeader onClick={onAccordionToggle}>
          {title}
          <div
            style={{
              paddingTop: "0.625rem",
              display: isOpen ? "block" : "none",
              width: "98%",
              marginInline: "auto",
              opacity: 0.5,
              borderBottom: "2px solid #9EA8B7",
            }}
          ></div>
        </AccordionHeader>
        <AccordionContent
          style={{ opacity: isOpen ? 1 : 0, maxHeight: isOpen ? "31.25rem" : "0" }}
          isOpen={isOpen}
        >
          {children}
        </AccordionContent>
      </AccordionContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#DDE3EB",
          width: "2.5rem",
          height: "inherit",
          marginBlock: "0.3125rem",
          borderTopRightRadius: "0.75rem",
          borderBottomRightRadius: "0.75rem",
          cursor: "pointer",
        }}
        onClick={onAccordionToggle}
      >
        <img
          style={{ marginLeft: "-0.3125rem" }}
          src={isOpen ? ArrowUp : ArrowDown}
          alt="Accordion Arrow"
        />
      </div>
    </div>
  );
};

export default Accordion;
