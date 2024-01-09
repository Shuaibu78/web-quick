import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CAN_USER_SET_PIN, CREATE_USER_PIN } from "../../../../schema/auth.schema";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { isLoading } from "../../../../app/slices/status";
import { UserCredentialsAttr } from "../../../../interfaces/user.interface";
import { SmallHeader, SubPageContainer } from "../../style";
import { Form } from "../../../login/style";
import { InputField } from "../../../../components/input-field/input";
import { Colors } from "../../../../GlobalStyles/theme";
import { Button } from "../../../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { BoxHeading } from "../../settingsComps.style";

const LockSettings = () => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { primaryColor, blackLight } = Colors;

  const [getUserPinData] = useLazyQuery<{
    canSetUserPin: boolean;
  }>(CAN_USER_SET_PIN, {
    fetchPolicy: "cache-and-network",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    getUserPinData();
  }, [isSubmitted]);

  const [createUserPin] = useMutation<{ createUserPin: UserCredentialsAttr }>(CREATE_USER_PIN, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!pin) {
      dispatch(toggleSnackbarOpen("Fields cannot be blank!"));
      return;
    }

    if (pin !== confirmPin) {
      dispatch(toggleSnackbarOpen("Pin doesn't match!"));
      return;
    }

    createUserPin({
      variables: {
        pin,
      },
    })
      .then(async (res) => {
        if (res.data?.createUserPin.pin) {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen("Pin Successfully Set"));
          setIsSubmitted(true);
          getUserPinData();
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  return (
    <SubPageContainer>
      <>
        <BoxHeading>
          Create Lock Pin
          <p>Please enter a PIN you want to use in ending shift</p>
        </BoxHeading>
        <div>
          <Form style={{ marginTop: "2em", gap: "2em" }}>
            <InputField
              noFormat={true}
              label="Enter new pin"
              placeholder="Enter new pin"
              type="password"
              backgroundColor="#F4F6F9"
              size="lg"
              color={blackLight}
              borderColor="transparent"
              borderRadius=".75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              height="2.5rem"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <InputField
              noFormat={true}
              label="Confirm pin"
              placeholder="Confirm pin"
              type="password"
              backgroundColor="#F4F6F9"
              size="lg"
              color={blackLight}
              borderColor="transparent"
              borderRadius=".75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              height="2.5rem"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
            />
            <Button
              label="Create PIN"
              borderColor="transparent"
              backgroundColor={primaryColor}
              borderRadius=".75rem"
              fontSize="1rem"
              margin="2rem 0 0 0"
              color="#fff"
              width="100%"
              onClick={handleSubmit}
              style={{
                backgroundColor: primaryColor,
                height: "2.5rem",
                width: "100%",
              }}
            />
          </Form>
        </div>
      </>
    </SubPageContainer>
  );
};

export default LockSettings;
