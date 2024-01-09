import React, { FunctionComponent, useState } from "react";
import AuthCard from "../../components/auth-card/auth-card";
import { Button } from "../../components/button/Button";
import { InputField } from "../../components/input-field/input";
import { Form, SubHeader, InputWrapper, TopContainer } from "../login/style";
import { Colors } from "../../GlobalStyles/theme";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { useNavigate } from "react-router-dom";
import { Back, Container } from "./style";
import BackArrow from "../../assets/back-arrow.svg";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../../schema/auth.schema";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../app/hooks";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import Loader from "../../components/loader";
import FigorrLogo from "../../assets/figorrLogoWhite.jpg";
import { isFigorr } from "../../utils/constants";

const RecoverPassword: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { blackishBlue, blackLight, primaryColor, secondaryColor } = Colors;
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { handleSubmit } = useForm();

  const [resetPassword] = useMutation<boolean>(RESET_PASSWORD);

  const onSubmit = async () => {
    if (!email) return;

    try {
      setIsLoading(true);
      const data = await resetPassword({ variables: { mobileOrEmail: email } });
      if (data.data) {
        setIsLoading(false);
        navigate("/password-change");
        dispatch(
          toggleSnackbarOpen({
            message: "Check your email for a password reset code",
            color: "SUCCESS",
          })
        );
      }
    } catch (err) {
      setIsLoading(false);
      dispatch(toggleSnackbarOpen({ message: err, color: "DANGER" }));
    }
  };

  return (
    <Container>
      {isFigorr && (
        <Flex width="3.125rem">
          <img src={FigorrLogo} alt="figorr logo" width="200px" />
        </Flex>
      )}
      <AuthCard width="450px" showLogo={false}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Back onClick={() => navigate("/login")}>
            <img src={BackArrow} alt="" />
          </Back>
          <TopContainer style={{ flexFlow: "column", alignSelf: "start", margin: "1rem 0" }}>
            <Span color={blackishBlue} fontWeight="700" fontSize="1.1em" margin="0 0 1em 0">
              Recover Password
            </Span>
            <SubHeader marginBottom="0.9375rem">
              Enter your registered email, a password reset link will be sent to your email
            </SubHeader>
          </TopContainer>

          <InputWrapper gap="0.5em">
            <label htmlFor="email" style={{ color: blackLight, fontSize: "0.8em" }}>
              Email
            </label>
            <InputField
              placeholder="Email"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#8196B3"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              type="text"
              value={email}
              noFormat
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>

          <Button
            label="Send Reset Link"
            backgroundColor={primaryColor}
            size="lg"
            color="#fff"
            borderColor="none"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            margin="2rem 0 0 0"
            type="submit"
          />
          <SubHeader marginBottom="0.9375rem" style={{ marginTop: "1rem" }} justifyContent="center">
            Are you a new user?{" "}
            <Span
              cursor="pointer"
              color={isFigorr ? secondaryColor : primaryColor}
              onClick={() => {
                navigate("/register");
              }}
            >
              Create Account
            </Span>
          </SubHeader>
        </Form>
      </AuthCard>
      {isLoading && <Loader />}
    </Container>
  );
};

export default RecoverPassword;
