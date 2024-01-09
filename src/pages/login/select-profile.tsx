import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import AuthCard from "../../components/auth-card/auth-card";
import { Button } from "../../components/button/Button";
import Checkbox from "../../components/checkbox/checkbox";
import { InputField } from "../../components/input-field/input";
import { EmailRequired, Required } from "../../utils/formValidation.utils";
import { getItem, setItem } from "../../utils/localStorage.utils";
import Loader from "./loader/loader";
import {
  Container,
  Form,
  TopContainer,
  ToggleButton,
  SubHeader,
  InputWrapper,
  Bottom,
  Span,
  ErrorMsg,
} from "./style";
import { setSession } from "../../app/slices/session";

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(mobileOrEmail: $email, password: $password) {
      success
      userId
      token
    }
  }
`;

const SelectProfile: FunctionComponent = () => {
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const [login, { error }] = useMutation<any>(LOGIN_USER, {
    onCompleted({ login: { token, userId } }) {
      // setItem("session", { token, userId });
      dispatch(setSession({ token, userId }));
    },
  });
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await login({ variables: { email, password } });
    } catch (e) {
      setIsLoading(false);
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      console.log(e);
    }
  };

  return (
    <Container>
      <AuthCard width="450px">
        {!isLoading ? (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <TopContainer>
              <ToggleButton
                state="active"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Login
              </ToggleButton>
              <ToggleButton
                state="not-active"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Create an Account
              </ToggleButton>
            </TopContainer>
            <SubHeader marginBottom="0.9375rem">Welcome Back!</SubHeader>

            <InputWrapper>
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
                type="email"
                value={email}
                errors={errors}
                name="email"
                register={register("email", EmailRequired)}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputWrapper>
            {errors.email && <ErrorMsg>Field required</ErrorMsg>}
            <InputWrapper>
              <InputField
                placeholder="Password"
                backgroundColor="#F4F6F9"
                size="lg"
                color="#8196B3"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
                type="password"
                value={password}
                errors={errors}
                name="password"
                register={register("password", Required)}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputWrapper>
            {errors.password && <ErrorMsg>Field required</ErrorMsg>}
            <SubHeader marginBottom="0.9375rem">
              Forgot Password?{" "}
              <Span
                spanColor="#FFBE62"
                onClick={() => {
                  navigate("/recover-password");
                }}
              >
                Recover
              </Span>
            </SubHeader>
            <Button
              label="Login"
              onClick={handleSubmit(onSubmit)}
              backgroundColor="#607087"
              size="lg"
              color="#fff"
              borderColor="none"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              type="submit"
            />
            <Bottom>
              <Checkbox
                isChecked={keepMeLoggedIn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setKeepMeLoggedIn(e.target.checked)
                }
                color="#8196B3"
                size="1.125rem"
              />
              <p>Keep me logged in</p>
            </Bottom>
          </Form>
        ) : (
          <Loader />
        )}
      </AuthCard>
    </Container>
  );
};

export default SelectProfile;
