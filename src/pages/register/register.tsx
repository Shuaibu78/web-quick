import React, { FunctionComponent, useState } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import AuthCard from "../../components/auth-card/auth-card";
import { Button } from "../../components/button/Button";
import { InputField } from "../../components/input-field/input";
import { Flex } from "../../components/receipt/style";
import { setItem } from "../../utils/localStorage.utils";
import Loader from "./loader/loader";
import { Container, Form, TopContainer } from "./style";
import { SIGNUP } from "../../schema/auth.schema";
import { useMutation, useQuery } from "@apollo/client";
import { Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { InputWrapper, SubHeader } from "../login/style";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { useDispatch } from "react-redux";
import { SYNC_START, company, isFigorr } from "../../utils/constants";
import FigorrLogo from "../../assets/figorrLogoWhite.jpg";
import { setSession } from "../../app/slices/session";
import { SAVE_SERVER_CATEGORIES } from "../../schema/shops.schema";
import { socketClient } from "../../helper/socket";

interface IForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
}

const Register: FunctionComponent = () => {
  const { blackishBlue, blackLight, primaryColor, secondaryColor } = Colors;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [signup] = useMutation<{
    signup: {
      token: string;
      userId: string;
      success: boolean;
    };
  }>(SIGNUP, {
    onError: (error) => {
      setIsLoading(false);
      dispatch(toggleSnackbarOpen(error?.message));
      navigate("/register");
    },
  });

  const [formInput, setFormInput] = useState<IForm>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleInput = (
    key: "firstname" | "email" | "password" | "lastname" | "phone",
    value: string
  ) => {
    setFormInput((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { email, firstname, password, lastname, phone } = formInput;

    if (formInput.email) {
      e.preventDefault();
    }

    if (!(firstname && lastname && email && password && phone)) {
      dispatch(toggleSnackbarOpen({ color: "DANGER", message: "All fields are required" }));
      return;
    }

    setIsLoading(true);

    signup({
      variables: {
        firstName: formInput.firstname,
        lastName: formInput.lastname,
        email: formInput.email,
        password: formInput.password,
        mobileNumber: formInput.phone,
        companyName: company || "TIMART",
        countryCode: formInput.phone.slice(0, 3),
      },
    }).then(({ data }) => {
      if (data?.signup.success) {
        const { token, userId } = data?.signup;
        socketClient.emit(SYNC_START);
        setItem("session", { token, userId });
        dispatch(setSession({ token, userId }));
        setIsLoading(false);
        const { data: serverCat } = useQuery<{ done: number }>(SAVE_SERVER_CATEGORIES);
        if (serverCat?.done) {
          navigate("/create-business");
        }
      }
    });
  };

  return (
    <Container>
      {isFigorr && <img src={FigorrLogo} alt="figorr logo" width="200px" />}
      <AuthCard width="450px" showLogo={!isFigorr}>
        {!isLoading ? (
          <Form onSubmit={handleSubmit} style={{ gap: "1rem" }}>
            <TopContainer style={{ flexFlow: "column", alignSelf: "start", margin: "1rem 0" }}>
              <SubHeader marginBottom="0.9375rem">
                Welcome to {isFigorr ? "Figorr" : "Timart Business app"}
              </SubHeader>
              <Span color={blackishBlue} fontWeight="700" fontSize="1.1em">
                Create your free account
              </Span>
            </TopContainer>
            <Flex style={{ columnGap: "0.9375rem" }}>
              <InputWrapper>
                <label htmlFor="" style={{ color: blackLight, fontSize: "0.8em" }}>
                  First Name
                </label>
                <InputField
                  placeholder="First Name"
                  backgroundColor="#F4F6F9"
                  size="lg"
                  color="#8196B3"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="0px"
                  fontSize="1rem"
                  width="100%"
                  type="text"
                  value={formInput.firstname}
                  onChange={(e) => handleInput("firstname", e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                <label htmlFor="" style={{ color: blackLight, fontSize: "0.8em" }}>
                  Last Name
                </label>
                <InputField
                  placeholder="Last Name"
                  backgroundColor="#F4F6F9"
                  size="lg"
                  color="#8196B3"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="0px"
                  fontSize="1rem"
                  width="100%"
                  type="text"
                  value={formInput.lastname}
                  onChange={(e) => handleInput("lastname", e.target.value)}
                />
              </InputWrapper>
            </Flex>
            <InputWrapper gap="0.5em">
              <label htmlFor="" style={{ color: blackLight, fontSize: "0.8em" }}>
                Phone number
              </label>
              <PhoneInput
                country={"ng"}
                value={formInput.phone}
                placeholder="Phone Number"
                containerStyle={{
                  width: "100%",
                  background: "#F4F6F9",
                  borderRadius: "0.75rem",
                  border: "none",
                  padding: "0.5rem 0.9375rem",
                }}
                inputStyle={{
                  width: "100%",
                  background: "#F4F6F9",
                  borderRadius: "0.75rem",
                  border: "none",
                  fontSize: "1rem",
                  color: "#8196B3",
                }}
                buttonStyle={{
                  background: "#F4F6F9",
                  borderRadius: "0.75rem",
                  border: "none",
                }}
                countryCodeEditable={false}
                onChange={(phone) => handleInput("phone", phone)}
              />
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="email" style={{ color: blackLight, fontSize: "0.8em" }}>
                Email
              </label>
              <InputField
                noFormat={true}
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
                value={formInput.email}
                onChange={(e) => handleInput("email", e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="password" style={{ color: blackLight, fontSize: "0.8em" }}>
                Password
              </label>
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
                noFormat={true}
                type="password"
                value={formInput.password}
                onChange={(e) => handleInput("password", e.target.value)}
              />
            </InputWrapper>
            <Button
              label="Create Account"
              onClick={handleSubmit}
              backgroundColor={primaryColor}
              size="lg"
              color="#fff"
              borderColor="none"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              margin="1rem 0 0 0"
            />
            {/* <Bottom>
              <Checkbox
                isChecked={keepMeLoggedIn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setKeepMeLoggedIn(e.target.checked)
                }
                color="#8196B3"
                size="1.125rem"
              />
              <p>Keep me logged in</p>
            </Bottom> */}
            <SubHeader marginBottom="0.9375rem" justifyContent="center">
              Are you an exsting user?{" "}
              <Span
                cursor="pointer"
                color={isFigorr ? secondaryColor : primaryColor}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Span>
            </SubHeader>
          </Form>
        ) : (
          <Loader isSignup={true} />
        )}
      </AuthCard>
    </Container>
  );
};

export default Register;
