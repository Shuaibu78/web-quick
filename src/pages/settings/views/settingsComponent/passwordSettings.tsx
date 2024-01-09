import { useEffect, useState } from "react";
import { BoxHeading } from "../../settingsComps.style";
import { Colors } from "../../../../GlobalStyles/theme";
import { Button } from "../../../../components/button/Button";
import { InputField } from "../../../../components/input-field/input";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "../../../../schema/auth.schema";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { isLoading } from "../../../../app/slices/status";
import { ErrorMsg } from "../../../login/style";

const PasswordSettings = () => {
  const [oldPw, setOldPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");
  const [confirmPw, setConfirmPw] = useState<string>("");
  const [errors, setErrors] = useState<{
    confirmPw: boolean;
    newPw: boolean;
  }>({
    confirmPw: false,
    newPw: false,
  });
  const dispatch = useDispatch();

  const [changePassword] = useMutation(CHANGE_PASSWORD, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleChangePassword = () => {
    if (newPw === confirmPw) {
      dispatch(isLoading(true));
      changePassword({
        variables: {
          currentPassword: oldPw,
          newPassword: newPw,
        },
      })
        .then(() => {
          console.log("wahalalaaa");
          dispatch(
            toggleSnackbarOpen({ message: "Password changed successfully", color: "SUCCESS" })
          );
          dispatch(isLoading(false));
          setOldPw("");
          setNewPw("");
          setConfirmPw("");
        })
        .catch((err) => {
          dispatch(
            toggleSnackbarOpen({
              message: err?.message || err?.graphQLErrors[0]?.message,
              color: "DANGER",
            })
          );
          dispatch(isLoading(false));
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
    <>
      <BoxHeading>
        Password Settings
        <p>Please enter your current passowrd to change your password</p>
      </BoxHeading>

      <div style={{ marginBlock: "1rem", width: "355px" }}>
        <div>
          <p style={{ fontSize: ".8125rem", color: Colors.blackLight, marginBlock: "0.625rem" }}>
            Old Password
          </p>
          <InputField
            noFormat={true}
            placeholder="Enter old password"
            type="password"
            backgroundColor="#F4F6F9"
            size="lg"
            color={Colors.blackLight}
            borderColor="transparent"
            borderRadius=".75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            height="2.5rem"
            value={oldPw}
            onChange={(e) => setOldPw(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "0.9375rem" }}>
          <p style={{ fontSize: ".8125rem", color: Colors.blackLight, marginBlock: "0.625rem" }}>
            New Password
          </p>
          <InputField
            noFormat={true}
            placeholder="Enter new password"
            type="password"
            backgroundColor="#F4F6F9"
            size="lg"
            color={Colors.blackLight}
            borderColor="transparent"
            borderRadius=".75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            height="2.5rem"
            value={newPw}
            errors={errors}
            name={"newPw"}
            onChange={(e) => setNewPw(e.target.value)}
          />
          {errors.newPw && <ErrorMsg>New Password does not match confirm Password</ErrorMsg>}
        </div>

        <div style={{ marginTop: "0.9375rem" }}>
          <p style={{ fontSize: ".8125rem", color: Colors.blackLight, marginBlock: "0.625rem" }}>
            Confirm Password
          </p>
          <InputField
            noFormat={true}
            placeholder="Confirm password"
            type="password"
            backgroundColor="#F4F6F9"
            size="lg"
            color={Colors.blackLight}
            borderColor="transparent"
            borderRadius=".75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            height="2.5rem"
            value={confirmPw}
            name="confirmPw"
            errors={errors}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
          {errors.confirmPw && <ErrorMsg>New Password does not match confirm Password</ErrorMsg>}
        </div>

        <div style={{ marginTop: "1.875rem" }}>
          <Button
            onClick={handleChangePassword}
            width="100%"
            color={Colors.white}
            style={{
              backgroundColor: Colors.primaryColor,
              width: "355px",
              margin: "0.9375rem 0px",
              height: "2.5rem",
            }}
            backgroundColor={Colors.primaryColor}
            label="Change Password"
            borderRadius=".75rem"
          />
        </div>
      </div>
    </>
  );
};

export default PasswordSettings;
