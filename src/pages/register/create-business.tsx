/* eslint-disable no-debugger */
import React, { FunctionComponent, useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/Button";
import { InputField } from "../../components/input-field/input";
import Loader from "./loader/loader";
import { Container, Form, TopContainer, SubHeader } from "./style";
import { useMutation, useQuery } from "@apollo/client";
import { IShop } from "../../interfaces/shop.interface";
import { CREATE_SHOP, GET_SHOP_CATEGORIES } from "../../schema/shops.schema";
import dropIcon2 from "../../assets/dropIcon2.svg";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import { currencyList } from "../../utils/helper.utils";
import { isLoading } from "../../app/slices/status";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { increaseSyncCount, setCurrentShop } from "../../app/slices/shops";
import { InputWrapper } from "../login/style";
import { Colors } from "../../GlobalStyles/theme";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import CreateBusinessImage from "../../assets/createBusiness.png";
import FallBackImage from "../../assets/Image.svg";
import FigorrLogo from "../../assets/figorrLogo.png";
import { ImageSection } from "../settings/style";
import { upload } from "../../helper/image.helper";
import { socketClient } from "../../helper/socket";
import { SYNC_START, isFigorr } from "../../utils/constants";
import BackArrow from "../../assets/back-arrow.svg";
import { Back } from "../recover-password/style";
import { getSessions } from "../../app/slices/session";
import { Label } from "../sales/style";
import ReactSelect from "react-select";

interface IForm {
  name: string;
  category: string;
  currency: string;
  address: string;
  phone: string;
}

const CreateBusiness: FunctionComponent = () => {
  const { blackishBlue, blackLight, primaryColor } = Colors;

  const [shouldProceed, setShouldProceed] = useState(false);

  const dispatch = useAppDispatch();

  const { data: categoryData } = useQuery<{
    getShopCategories: [
      {
        shopCategoryId: string;
        shopCategoryName: string;
        description: string;
      }
    ];
  }>(GET_SHOP_CATEGORIES, {
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [isLoadingT, setIsLoadingT] = useState(false);
  const [shopCategoriesName, setShopCategoriesName] = useState<string[]>([]);
  const [shopCategoriesId, setShopCategoriesId] = useState<string[]>([]);
  const [selectedShopCategory, setSelectedShopCategory] = useState(-1);
  const [image, setImage] = useState<File>();

  const navigate = useNavigate();
  const [formInput, setFormInput] = useState<IForm>({
    name: "",
    category: "",
    currency: "",
    address: "",
    phone: "",
  });

  const handleImageUpload = (file: File | undefined) => {
    setImage(file);
  };

  useEffect(() => {
    const cuName: string[] = [];
    const cuId: string[] = [];
    currencyList.forEach((val) => {
      cuName.push(val.Country);
      cuId.push(val.Code);
    });
    if (categoryData) {
      const cName: string[] = [];
      const cId: string[] = [];
      categoryData.getShopCategories.forEach((val) => {
        cName.push(val.shopCategoryName);
        cId.push(val.shopCategoryId);
      });
      setShopCategoriesName(cName);
      setShopCategoriesId(cId);
    }
  }, [categoryData]);

  const handleInput = (key: "name" | "phone" | "address", value: string) => {
    setFormInput((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };
  const [createShop] = useMutation<{ createShop: IShop }>(CREATE_SHOP, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error.message));
    },
  });

  const sessions = useAppSelector(getSessions);
  const token = sessions.session.token;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(formInput.name && formInput.address && shopCategoriesId[selectedShopCategory])) {
      dispatch(toggleSnackbarOpen("Please fill the form"));
      return;
    }

    setIsLoadingT(true);
    createShop({
      variables: {
        shopName: formInput.name,
        shopAddress: formInput.address,
        shopCategoryId: shopCategoriesId[selectedShopCategory],
        shopCategoryName: shopCategoriesName[selectedShopCategory],
        shopPhone: formInput.phone,
        currencyCode: formInput.currency,
      },
    })
      .then(async ({ data: shopData }) => {
        if (shopData?.createShop.shopId) {
          if (image) {
            const uploadedImages = await upload({
              files: [image],
              key: "",
              id: shopData?.createShop?.shopId,
              shopId: shopData?.createShop?.shopId,
              token,
            });

            if (!uploadedImages.success) {
              dispatch(toggleSnackbarOpen("Unable to upload shop image"));
            }
          }

          if (shopData.createShop?.currencyCode) {
            localStorage.setItem("currencyCode", shopData?.createShop?.currencyCode);
          }

          dispatch(increaseSyncCount(["Shops"]));
          dispatch(isLoading(false));
          setShouldProceed(true);
          dispatch(setCurrentShop(shopData.createShop));
          socketClient.emit(SYNC_START, { shopId: shopData?.createShop?.shopId });
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error.message);
        setIsLoadingT(false);
        dispatch(isLoading(false));
      });
  };

  type OptionType = { value: string; label: string };
  const convertedArr: OptionType[] = currencyList.map((item) => ({
    value: item.Code,
    label: `${item.Country} ${item.Code}`,
  }));

  const handleStateChange = (newValue: OptionType | null) => {
    setFormInput({
      ...formInput,
      currency: newValue?.value as string,
    });
  };

  return (
    <Container bg={isFigorr ? "" : CreateBusinessImage} position="right">
      {isFigorr && (
        <img
          src={FigorrLogo}
          alt="figorr logo"
          style={{ width: "12rem", height: "12rem", background: "white" }}
          width="10rem"
        />
      )}
      <Flex
        width="450px"
        bg="white"
        borderRadius="1rem"
        padding="1rem"
        maxHeight="90vh"
        overflowY="scroll"
      >
        {!isLoadingT ? (
          <Form onSubmit={handleSubmit} style={{ gap: "1rem" }}>
            <TopContainer
              style={{ flexFlow: "column", alignSelf: "start", margin: "1rem 0", gap: "1rem" }}
            >
              <Flex alignItems="center" justifyContent="space-between" width="100%">
                <Span color={blackishBlue} fontWeight="700" fontSize="1.2em">
                  Create Business
                </Span>
                <Back
                  onClick={() => {
                    navigate("/login");
                    localStorage.clear();
                  }}
                  style={{ marginBottom: 0 }}
                >
                  <img src={BackArrow} alt="" />
                  <Span margin="0 0 0 1em" color={Colors.blackLight}>
                    Login
                  </Span>
                </Back>
              </Flex>
              <SubHeader marginBottom="0.9375rem">
                Fill in the information to create a business/shop
              </SubHeader>
            </TopContainer>
            <ImageSection>
              <label htmlFor="img-upload">
                <img
                  src={(image && URL.createObjectURL(image)) || FallBackImage}
                  alt=""
                  id="preview"
                />
              </label>
              <input
                type="file"
                id="img-upload"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(e.target?.files?.[0])}
              />
              <small style={{ color: primaryColor }}> + Add bussiness image / logo</small>
            </ImageSection>
            <InputWrapper margin="0 0 1.2rem 0">
              <InputField
                label="Business Name"
                noFormat={true}
                placeholder="Business Name"
                backgroundColor="#F4F6F9"
                size="lg"
                color="#8196B3"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
                type="text"
                value={formInput.name}
                onChange={(e) => handleInput("name", e.target.value)}
              />
            </InputWrapper>
            <InputWrapper margin="0 0 1.2rem 0">
              <InputField
                label="Business Address"
                noFormat={true}
                placeholder="Business Address"
                backgroundColor="#F4F6F9"
                size="lg"
                color="#8196B3"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
                type="text"
                value={formInput.address}
                onChange={(e) => handleInput("address", e.target.value)}
              />
            </InputWrapper>

            <InputWrapper>
              <CustomDropdown
                width="100%"
                height="45px"
                fontSize="1rem"
                borderRadius="0.75rem"
                containerColor="#F4F6F9"
                color="#8196B3"
                placeholder="Category"
                label="Business Category"
                noBorder={true}
                selected={selectedShopCategory}
                setValue={setSelectedShopCategory}
                options={shopCategoriesName}
                dropdownIcon={dropIcon2}
                padding="0 0.9375rem"
              />
            </InputWrapper>

            <InputWrapper gap="0.5em" margin="0 0 1.2rem 0">
              <label htmlFor="" style={{ color: blackLight, fontSize: "0.8em" }}>
                Business Phone
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
              <Label>Currency</Label>
              <ReactSelect
                className="basic-single"
                classNamePrefix="select"
                defaultValue={convertedArr[0]}
                onChange={(d) => handleStateChange(d)}
                isClearable={true}
                isSearchable={true}
                name="Currency List"
                options={convertedArr}
              />
            </InputWrapper>
            <Button
              label="Create Business"
              onClick={handleSubmit}
              backgroundColor={primaryColor}
              size="lg"
              color="white"
              borderColor="none"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              margin="1em 0 0 0"
            />
          </Form>
        ) : (
          <Loader shouldProceed={shouldProceed} />
        )}
      </Flex>
    </Container>
  );
};

export default CreateBusiness;
