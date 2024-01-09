import React, { FunctionComponent, useEffect, useState } from "react";
import Image from "../../../assets/Image.svg";
import Camera from "../../../assets/Camera.svg";
import { InputField } from "../../../components/input-field/input";
import { Form, InputContainer, ImageSection, SubPageContainer } from "../style";
import { Button } from "../../../components/button/Button";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentUser, setUserInfo } from "../../../app/slices/userInfo";
import { UPDATE_USER } from "../../../schema/auth.schema";
import { useMutation } from "@apollo/client";
import { UsersAttr } from "../../../interfaces/user.interface";
import { useDispatch } from "react-redux";
import { isLoading } from "../../../app/slices/status";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";

interface IForm {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}
const Profile: FunctionComponent = () => {
  const [formInput, setFormInput] = useState<IForm>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [image, setImage] = useState<File>();
  const user = useAppSelector(getCurrentUser);
  const dispatch = useDispatch();

  const handleInput = (
    key: "firstName" | "lastName" | "email" | "password" | "confirmPassword" | "mobileNumber",
    value: string
  ) => {
    setFormInput((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };
  const handleImageUpload = (file: File | undefined) => {
    setImage(file);
  };
  const getImageUrl = () => {
    if (!image) return "";
    return URL.createObjectURL(image);
  };
  useEffect(() => {
    if (user) {
      setFormInput({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        mobileNumber: user.mobileNumber ?? "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const [updateUser] = useMutation<{ updateUser: UsersAttr }>(UPDATE_USER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(isLoading(true));
    updateUser({
      variables: {
        userId: user.userId,
        firstName: formInput.firstName,
        lastName: formInput.lastName,
      },
    })
      .then((data) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen("Successfully Updated"));
        dispatch(setUserInfo(data?.data?.updateUser));
      })
      .catch((error) => {
        console.log(error);
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  return (
    <SubPageContainer>
      <h2>Personal Informations</h2>
      <ImageSection>
        <label htmlFor="img-upload">
          <img src={getImageUrl() || Image} alt="" id="preview" />
          <img src={Camera} alt="" />
        </label>
        <input
          type="file"
          id="img-upload"
          accept="image/*"
          hidden
          onChange={(e) => handleImageUpload(e.target?.files?.[0])}
        />
        <small>Profile Image</small>
      </ImageSection>
      <Form onSubmit={handleSubmit}>
        <Flex alignItems="center" gap="2rem" width="100%">
          <InputContainer>
            <label>First Name</label>
            <InputField
              placeholder="First Name"
              type="text"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              value={formInput.firstName}
              onChange={(e) => handleInput("firstName", e.target.value)}
            />
          </InputContainer>
          <InputContainer>
            <label>Last Name</label>
            <InputField
              placeholder="Last Name"
              type="text"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              value={formInput.lastName}
              onChange={(e) => handleInput("lastName", e.target.value)}
            />
          </InputContainer>
        </Flex>
        <InputContainer>
          <label>Email</label>
          <InputField
            placeholder="Email"
            type="email"
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            value={formInput.email}
            readOnly={true}
            onChange={(e) => handleInput("email", e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label>Phone</label>
          <InputField
            placeholder="Phone"
            type="tel"
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            value={formInput.mobileNumber}
            readOnly={true}
            onChange={(e) => handleInput("mobileNumber", e.target.value)}
          />
        </InputContainer>

        {/* <Flex alignItems="center" gap="2rem" width="100%" margin="0 0 2rem 0">
          <InputContainer>
            <label>Password</label>
            <InputField
              placeholder="Password"
              type="password"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              value={formInput.password}
              onChange={(e) => handleInput("password", e.target.value)}
            />
          </InputContainer>
          <InputContainer>
            <label>Confirm Password</label>
            <InputField
              placeholder="Confirm Password"
              type="password"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              value={formInput.confirmPassword}
              onChange={(e) => handleInput("confirmPassword", e.target.value)}
            />
          </InputContainer>
        </Flex> */}
        <Button
          label="Update"
          type="submit"
          onClick={(e) => handleSubmit(e)}
          backgroundColor="#607087"
          size="lg"
          color="#fff"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          margin="1.25rem 0 0 0"
          width="100%"
        />
      </Form>
    </SubPageContainer>
  );
};

export default Profile;
