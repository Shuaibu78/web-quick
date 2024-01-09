import React, { FunctionComponent, useEffect, useState } from "react";
import AuthCard from "../../components/auth-card/auth-card";
import { Button } from "../../components/button/Button";
import { InputField } from "../../components/input-field/input";
import { Form, SubHeader, InputWrapper, TopContainer, ErrorMsg } from "../login/style";
import { Colors } from "../../GlobalStyles/theme";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { useNavigate } from "react-router-dom";
import { Back, Container } from "./style";
import BackArrow from "../../assets/back-arrow.svg";
import { useMutation } from "@apollo/client";
import { SET_NEW_PASSWORD } from "../../schema/auth.schema";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../app/hooks";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import Loader from "../../components/loader";
import FigorrLogo from "../../assets/figorrLogo.png";
import { isFigorr } from "../../utils/constants";

const PasswordChange: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { blackishBlue, blackLight, primaryColor, secondaryColor } = Colors;
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { handleSubmit } = useForm();

  const [newPw, setNewPw] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [confirmPw, setConfirmPw] = useState<string>("");
  const [errors, setErrors] = useState<{
    confirmPw: boolean;
    newPw: boolean;
  }>({
    confirmPw: false,
    newPw: false,
  });

  const [setNewPassword] = useMutation(SET_NEW_PASSWORD, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleChangePassword = () => {
    if (newPw === confirmPw) {
      setIsLoading(true);
      setNewPassword({
        variables: {
          newPassword: newPw,
          passwordResetCode: code.trim(),
        },
      })
        .then(() => {
          dispatch(
            toggleSnackbarOpen({ message: "Password changed successfully", color: "SUCCESS" })
          );
          setIsLoading(false);
          setNewPw("");
          setConfirmPw("");
          navigate("/login");
        })
        .catch((err) => {
          dispatch(
            toggleSnackbarOpen({
              message: err?.message || err?.graphQLErrors[0]?.message,
              color: "DANGER",
            })
          );
          setIsLoading(false);
        });
    } else {
      setErrors({
        confirmPw: true,
        newPw: true,
      });
      dispatch(toggleSnackbarOpen({ message: "Passwords do not match", color: "DANGER" }));
    }
  };

  useEffect(() => {
    const errorTimeOut = setTimeout(() => {
      setErrors({
        confirmPw: false,
        newPw: false,
      });
    }, 2000);

    return () => clearTimeout(errorTimeOut);
  }, [errors]);

  return (
    <Container>
      {isFigorr && (
        <Flex width="3.125rem">
          <img src={FigorrLogo} alt="figorr logo" />
        </Flex>
      )}
      <AuthCard width="450px" showLogo={false}>
        <Form onSubmit={handleSubmit(handleChangePassword)}>
          <Back onClick={() => navigate("/login")}>
            <img src={BackArrow} alt="Back button" />
          </Back>
          <TopContainer style={{ flexFlow: "column", alignSelf: "start", margin: "1rem 0" }}>
            <Span color={blackishBlue} fontWeight="700" fontSize="1.1em" margin="0 0 1em 0">
              Verify Password Reset Code
            </Span>
            <SubHeader marginBottom="0.9375rem">Enter your verification code.</SubHeader>
          </TopContainer>

          <InputWrapper gap="0.2em" margin="0.625rem 0">
            <label htmlFor="email" style={{ color: blackLight, fontSize: "0.8em" }}>
              Code
            </label>
            <InputField
              placeholder="Code"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#8196B3"
              borderColor="transparent"
              borderRadius="0.625rem"
              borderSize="0px"
              fontSize="0.875rem"
              width="100%"
              height="2.5rem"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper gap="0.2em" margin="0.625rem 0">
            <label htmlFor="email" style={{ color: blackLight, fontSize: "0.8em" }}>
              New Password
            </label>
            <InputField
              noFormat={true}
              placeholder="Confirm password"
              type="password"
              backgroundColor="#F4F6F9"
              size="lg"
              color={Colors.blackLight}
              borderColor="transparent"
              borderRadius="0.625rem"
              borderSize="0px"
              fontSize="0.875rem"
              width="100%"
              height="2.5rem"
              value={newPw}
              name="newPw"
              errors={errors}
              onChange={(e) => setNewPw(e.target.value)}
            />
            {errors.newPw && <ErrorMsg>New Password does not match confirm Password</ErrorMsg>}
          </InputWrapper>
          <InputWrapper gap="0.2em" margin="0.625rem 0">
            <label htmlFor="email" style={{ color: blackLight, fontSize: "0.8em" }}>
              Confirm Password
            </label>
            <InputField
              noFormat={true}
              placeholder="Confirm password"
              type="password"
              backgroundColor="#F4F6F9"
              size="lg"
              color={Colors.blackLight}
              borderColor="transparent"
              borderRadius="0.625rem"
              borderSize="0px"
              fontSize="0.875rem"
              width="100%"
              height="2.5rem"
              value={confirmPw}
              name="confirmPw"
              errors={errors}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
            {errors.confirmPw && <ErrorMsg>New Password does not match confirm Password</ErrorMsg>}
          </InputWrapper>

          <Button
            label="Change Password"
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

export default PasswordChange;
