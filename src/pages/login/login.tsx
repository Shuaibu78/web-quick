import { useMutation } from "@apollo/client";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import AuthCard from "../../components/auth-card/auth-card";
import { Button } from "../../components/button/Button";
import { InputField } from "../../components/input-field/input";
import { LOGIN_USER } from "../../schema/auth.schema";
import { EmailRequired, Required } from "../../utils/formValidation.utils";
import { setCurrentShop, setShops } from "../../app/slices/shops";
import { getItemAsObject, setItem } from "../../utils/localStorage.utils";
import Loader from "./loader/loader";
import Wave from "../../assets/wave.svg";
import FigorrLogo from "../../assets/figorrLogoWhite.jpg";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Container, Form, TopContainer, SubHeader, InputWrapper, ErrorMsg } from "./style";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { socketClient } from "../../helper/socket";
import { SYNC_START, isFigorr, isStaging } from "../../utils/constants";
import { IShop } from "../../interfaces/shop.interface";
import { getFCMToken } from "../../utils/firebase.utils";
import { Colors } from "../../GlobalStyles/theme";
import { setSession } from "../../app/slices/session";
import { setShowSelectShop } from "../../app/slices/accountLock";

const Login: FunctionComponent = () => {
  // const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShop, setIsShop] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useAppDispatch();
  const { blackishBlue, blackLight, primaryColor, secondaryColor } = Colors;
  const [login] = useMutation<any>(LOGIN_USER);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const deviceTokenId = await getFCMToken();

      const data = await login({ variables: { email, password, deviceTokenId } });

      if (data?.data?.login?.shops?.length > 0) {
        setIsShop(true);
        const { token, userId, shops } = data?.data?.login;
        dispatch(setShops(shops));
        setItem("session", { token, userId });
        dispatch(setSession({ token, userId }));

        const previousShop = getItemAsObject("currentShop");
        const shop = shops.find(({ shopId }: IShop) => shopId === previousShop?.shopId) || shops[0];

        dispatch(setCurrentShop(shop));
        dispatch(setShops(shops));

        if (shops.length > 1) {
          dispatch(setShowSelectShop());
        }

        if (shop) {
          localStorage.setItem("currencyCode", shop.currencyCode);
          setItem("currentShop", shop);
        }

        socketClient.emit(SYNC_START, { shopId: shops[0]?.shopId });
      } else {
        const { token, userId } = data?.data?.login;
        // setItem("session", { token, userId });
        dispatch(setSession({ token, userId }));
        navigate("/create-business");
      }
    } catch (e) {
      setIsLoading(false);
      dispatch(toggleSnackbarOpen(e));
    }
  };

  return (
    <Container>
      {isFigorr && <img src={FigorrLogo} alt="figorr logo" width="200px" />}
      <AuthCard width="450px" showLogo={!isFigorr}>
        {!isLoading ? (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <TopContainer>
              <SubHeader marginBottom="0.9375rem">
                Hi! <img src={Wave} alt="" />
              </SubHeader>
              <Span color={blackishBlue} fontWeight="700" fontSize="1.1em">
                Login your {isStaging && <Span color={Colors.red}>staging</Span>} Account
              </Span>
            </TopContainer>

            <InputWrapper gap="0.2em" margin="0 0 2em 0">
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
                type="email"
                value={email}
                errors={errors}
                noFormat={true}
                name="email"
                register={register("email", EmailRequired)}
                onChange={(e) => {
                  setValue("email", e.target.value);
                  setEmail(e.target.value);
                }}
              />
            </InputWrapper>
            {errors.email && <ErrorMsg>Field required</ErrorMsg>}
            <InputWrapper gap="0.2em">
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
                type="password"
                value={password}
                errors={errors}
                noFormat={true}
                name="password"
                register={register("password", Required)}
                onChange={(e) => {
                  setValue("password", e.target.value);
                  setPassword(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSubmit();
                  }
                }}
              />
            </InputWrapper>
            {errors.password && <ErrorMsg>Field required</ErrorMsg>}
            {/* TODO: to be worked on */}
            <SubHeader marginBottom="0.9375rem" justifyContent="flex-end">
              Forgot Password?{" "}
              <Span
                cursor="pointer"
                color={isFigorr ? secondaryColor : "#FFBE62"}
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
              backgroundColor={primaryColor}
              size="lg"
              color="#fff"
              borderColor="none"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              type="submit"
              margin="2rem 0 0 0"
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
            <SubHeader
              marginBottom="0.9375rem"
              style={{ marginTop: "1rem" }}
              justifyContent="center"
            >
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
        ) : (
          <Loader />
        )}
      </AuthCard>
    </Container>
  );
};

export default Login;
