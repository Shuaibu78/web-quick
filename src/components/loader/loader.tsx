import React from "react";
import { Container } from "./style";
import logo from "../../assets/timart-logo.png";
import figorrLogo from "../../assets/figorr-small-logo.svg";
import { isFigorr } from "../../utils/constants";

const Loader = ({ noBg }: { noBg?: boolean }) => {
  return (
    <Container noBg={noBg}>
      <img src={isFigorr ? figorrLogo : logo} alt="" />
    </Container>
  );
};

export default Loader;
