import React, { FunctionComponent } from "react";
import logo from "../../assets/timart-logo.png";
import figorrLogo from "../../assets/figorr-small-logo.svg";
import { Card } from "./style";
import { isFigorr } from "../../utils/constants";

interface Props {
  children: JSX.Element | JSX.Element[];
  width: string;
  showLogo?: boolean;
}
const AuthCard: FunctionComponent<Props> = ({ children, width, showLogo = true }) => {
  return (
    <Card width={width}>
      {showLogo && <img src={isFigorr ? figorrLogo : logo} alt="logo" />}
      {children}
    </Card>
  );
};

export default AuthCard;
