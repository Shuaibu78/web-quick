import React, { FunctionComponent, useState } from "react";
import { ModalBox, ModalContainer, ModalHeader, UserCard } from "../style";
import logo from "../../../assets/timart-logo.png";
import { Flex } from "../../../components/receipt/style";
import userImage from "../../../assets/user-img-1.png";
import userImage2 from "../../../assets/user-img-2.png";
import userImage3 from "../../../assets/user-img-3.png";
import backArrow from "../../../assets/back-arrow.svg";
import orangeShop from "../../../assets/orange-shop.svg";
import cancelIcon from "../../../assets/cancel.svg";
import { InputField } from "../../../components/input-field/input";
import { Button } from "../../../components/button/Button";

interface UnlockAccountProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UnlockAccount: FunctionComponent<UnlockAccountProps> = ({ setShowModal }) => {
  const [stage, setStage] = useState(1);
  const dummyLength = [1, 2, 3];
  const [pin, setPin] = useState("");
  return (
    <ModalContainer>
      <ModalBox>
        <img src={logo} alt="" style={{ margin: "0 auto 1.5625rem auto", display: "block" }} />
        <h3>
          {stage === 2 ? (
            <button onClick={() => setStage(1)}>
              <img src={backArrow} alt="" />
            </button>
          ) : (
            <button onClick={() => setShowModal(false)}>
              <img src={cancelIcon} alt="" />
            </button>
          )}
          <span>Unlock Account</span>
        </h3>
        <ModalHeader>
          <p>Choose account to Login</p>
          <a href="">New Login</a>
        </ModalHeader>
        <div>
          {stage === 1 ? (
            dummyLength.map((val, index) => (
              <UserCard onClick={() => setStage(2)} key={index}>
                <img
                  src={val === 1 ? userImage : val === 2 ? userImage2 : userImage3}
                  alt=""
                  style={{ borderRadius: "0.5rem" }}
                />
                <Flex
                  flexDirection="column"
                  justifyContent="space-between"
                  padding="0 0 0 0.9375rem"
                >
                  <div>
                    <p>{val === 3 ? "Jennifer Kunle" : "Ademola Sani"}</p>
                    <small style={{ color: "#8196b3" }}>Cashier</small>
                  </div>
                  <small style={{ color: "#FFC97C" }}>
                    <img src={orangeShop} alt="" /> Nana’s Store Main
                  </small>
                </Flex>
              </UserCard>
            ))
          ) : (
            <UserCard>
              <img src={userImage3} alt="" style={{ borderRadius: "0.5rem" }} />
              <Flex flexDirection="column" justifyContent="space-between" padding="0 0 0 0.9375rem">
                <div>
                  <p>Jennifer Kunle</p>
                  <small style={{ color: "#8196b3" }}>Cashier</small>
                </div>
                <small style={{ color: "#FFC97C" }}>
                  <img src={orangeShop} alt="" /> Nana’s Store Main
                </small>
              </Flex>
            </UserCard>
          )}
          {stage === 2 && (
            <div style={{ paddingTop: "0.9375rem" }}>
              <InputField
                placeholder="Enter PIN"
                type="text"
                backgroundColor="#F4F6F9"
                size="lg"
                color="#607087"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <div style={{ marginBottom: "0.9375rem" }}></div>
              <Button
                label="Unlock"
                onClick={() => setShowModal(false)}
                backgroundColor="#607087"
                size="lg"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
              />
              <div style={{ marginBottom: "3.125rem" }}></div>
            </div>
          )}
        </div>
      </ModalBox>
    </ModalContainer>
  );
};

export default UnlockAccount;
