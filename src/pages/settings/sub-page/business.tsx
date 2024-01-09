/* eslint-disable no-debugger */
import React, { FunctionComponent, useEffect, useState } from "react";
import Image from "../../../assets/Image.svg";
import Camera from "../../../assets/Camera.svg";
import dropIcon from "../../../assets/dropIcon2.svg";
import { InputField } from "../../../components/input-field/input";
import { Form, InputContainer, ImageSection, SubPageContainer, ModalContainer } from "../style";
import { Button } from "../../../components/button/Button";
import { Flex } from "../../../components/receipt/style";
import { ToggleButton } from "../../staffs/style";
import toggleOn from "../../../assets/toggleOn.svg";
import toggleOff from "../../../assets/toggleOff.svg";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { IShop } from "../../../interfaces/shop.interface";
import { GET_SHOP, UPDATE_SHOP } from "../../../schema/shops.schema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { isLoading } from "../../../app/slices/status";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import clm from "country-locale-map";
import { ModalBox } from "../../../components/expenseModal/style";
import OnlineTerms from "../../../components/online-terms/online-terms";
import { upload } from "../../../helper/image.helper";
import { formatImageUrl } from "../../../utils/formatImageUrl.utils";
import { syncTotalTableCount } from "../../../helper/comparisons";
import { getSessions } from "../../../app/slices/session";

export interface CountryAttr {
  name: string;
  countryCode: string;
  shortName: string;
  countryId: string;
}

interface IForm {
  name: string;
  email: string;
  address: string;
  phoneno: string;
  city: string;
  country: string;
  discount: number;
  state: string;
  currency: string;
}
const Business: FunctionComponent = () => {
  const [countries, setCountries] = useState<CountryAttr[]>([]);
  const [imageOnline, setImageOnline] = useState<string | undefined>("");
  const [enableExpiring, setEnableExpiring] = useState<boolean>(false);
  const [enableDiscount, setEnableDiscount] = useState<boolean>(false);
  const [enableSurplus, setEnableSurplus] = useState<boolean>(false);
  const [onlinePresence, setOnlinePresence] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [incompleteSettings, setIncompleteSettings] = useState<boolean>(false);
  const [image, setImage] = useState<File>();

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["Shops"])
  );

  const countryOption = countries?.map((country) => country.name);
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();
  const [getSingleShop, { data, refetch }] = useLazyQuery<{
    getShop: {
      countries: CountryAttr[];
      result: IShop;
    };
  }>(GET_SHOP, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onCompleted(country) {
      if (country?.getShop) {
        setCountries(country?.getShop?.countries);
      }
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    getSingleShop();
  }, [syncTableUpdateCount]);

  useEffect(() => {
    if (data) {
      setImageOnline(data?.getShop?.result?.Images![0]?.largeImageOnlineURL);
      setOnlinePresence(data?.getShop?.result?.isPublished ?? false);
    }
  }, [data]);

  const [updateShop, { error }] = useMutation<{ updateShop: boolean }>(UPDATE_SHOP, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });
  const [formInput, setFormInput] = useState<IForm>({
    name: "",
    email: "",
    address: "",
    phoneno: "",
    state: "",
    city: "",
    discount: 0,
    currency: "",
    country: "",
  });

  const handleInput = (
    key:
      | "name"
      | "email"
      | "currency"
      | "address"
      | "state"
      | "city"
      | "country"
      | "phoneno"
      | "discount",
    value: string
  ) => {
    setFormInput((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };

  const sessions = useAppSelector(getSessions);
  const token = sessions.session.token;

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    isShopPublished: boolean = onlinePresence
  ) => {
    e.preventDefault();
    if (!formInput.name) {
      dispatch(toggleSnackbarOpen("Shopname must be provided"));
      return;
    }

    dispatch(isLoading(true));
    updateShop({
      variables: {
        shopId: currentShop?.shopId,
        shopName: formInput.name,
        shopAddress: formInput.address,
        shopPhone: formInput.phoneno,
        city: formInput.city,
        state: formInput.state,
        currencyCode: formInput.currency,
        maximumDiscount: Number(formInput.discount),
        discountEnabled: enableDiscount,
        isExpiryDateEnabled: enableExpiring,
        isPublished: isShopPublished,
      },
    })
      .then(async (res) => {
        if (res.data) {
          if (image) {
            const imgData = {
              key: "shopId",
              id: "",
              shopId: currentShop?.shopId,
            };
            const uploadedImages = await upload({
              files: [image],
              key: "",
              id: imgData?.id as string,
              shopId: imgData?.shopId || "",
              token,
            });
            if (!uploadedImages.success) {
              console.log("Unable to upload shop image");
            }
          }
          refetch();
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen("Updated Successfully"));
        }
        refetch();
      })
      .catch((_) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  useEffect(() => {
    if (data) {
      const {
        shopName,
        shopAddress,
        shopPhone,
        city,
        state,
        maximumDiscount,
        discountEnabled,
        currencyCode,
      } = data.getShop?.result;

      if (discountEnabled) {
        setEnableDiscount(true);
      } else {
        setEnableDiscount(false);
      }

      const country = clm.getCountryNameByAlpha2(currencyCode?.slice(0, 2) ?? "");
      localStorage.setItem("currencyCode", currencyCode as string);
      setFormInput({
        name: shopName ?? "",
        email: "",
        address: shopAddress ?? "",
        phoneno: shopPhone ?? "",
        state: state ?? "",
        city: city ?? "",
        currency: currencyCode ?? "",
        country: country ?? "",
        discount: maximumDiscount ?? 0,
      });
    }
  }, [data]);

  const handleImageUpload = (file: File | undefined) => {
    setImage(file);
  };
  const getImageUrl = () => {
    if (!image) return "";
    return URL.createObjectURL(image);
  };

  const handleCountryCurrency = (currency: string) => {
    const parsedObj = JSON.parse(currency);
    handleInput("currency", parsedObj?.currency as string);
    handleInput("country", parsedObj?.countryName as string);
  };

  const handleOnlinePresence = () => {
    if (onlinePresence) {
      setOnlinePresence(false);
    } else {
      setShowTerms(true);
      setIncompleteSettings(false);
    }
  };

  const handleActivate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { address, phoneno, currency } = formInput;
    if (address && phoneno && currency && imageOnline) {
      setOnlinePresence(true);
      setShowTerms(false);
      handleSubmit(e, true);
    } else {
      setIncompleteSettings(true);
      refetch();
      dispatch(
        toggleSnackbarOpen(
          "Please ensure that your shop image, address, phone and currency are correctly set, then try again"
        )
      );
    }
  };

  return (
    <SubPageContainer>
      <h2>Business Information</h2>
      <ImageSection>
        <label htmlFor="img-upload">
          <img
            src={image ? getImageUrl() : formatImageUrl(imageOnline)}
            alt=""
            id="preview"
            style={{ width: "3.125rem" }}
          />

          <img src={Camera} alt="" />
        </label>
        <input
          type="file"
          id="img-upload"
          accept="image/*"
          hidden
          onChange={(e) => handleImageUpload(e.target?.files?.[0])}
        />
        <small>Business Image</small>
      </ImageSection>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label>Business Name</label>
          <InputField
            placeholder="Business Name"
            type="text"
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            value={formInput.name}
            onChange={(e) => handleInput("name", e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label>Business Address</label>
          <InputField
            placeholder="Business Address"
            type="text"
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            value={formInput.address}
            onChange={(e) => handleInput("address", e.target.value)}
          />
        </InputContainer>
        {/* <InputContainer>
              <label>Business Email</label>
              <InputField
                placeholder="Business Email"
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
                onChange={ (e) => handleInput("email", e.target.value)}
                />
          </InputContainer> */}
        <InputContainer>
          <label>Business Phone</label>
          <InputField
            placeholder="Business Phone"
            type="tel"
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            value={formInput.phoneno}
            onChange={(e) => handleInput("phoneno", e.target.value.replace(/[^\d+]/g, ""))}
          />
        </InputContainer>
        <Flex style={{ columnGap: "0.9375rem" }}>
          <InputContainer>
            <label>City</label>
            <InputField
              placeholder="City"
              type="text"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              value={formInput.city}
              onChange={(e) => handleInput("city", e.target.value)}
            />
          </InputContainer>
          <InputContainer>
            <label>State</label>
            <InputField
              placeholder="State"
              type="text"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              value={formInput.state}
              onChange={(e) => handleInput("state", e.target.value)}
            />
          </InputContainer>
        </Flex>
        <InputContainer>
          <label>
            Select a country and currency:
            <select
              style={{
                backgroundColor: "#F4F6F9",
                color: "#607087",
                fontSize: "1rem",
                width: "100%",
                borderColor: "transparent",
                paddingBlock: "0.85rem",
                paddingInline: "1rem",
                marginTop: "6px",
                borderRadius: "0.75rem",
              }}
              value={formInput.country}
              onChange={(e) => handleCountryCurrency(e.target.value)}
            >
              <option value="">-- Select --</option>
              {countries.map((country, index) => {
                const i = clm.getCountryByAlpha2(country?.shortName);
                return (
                  <option
                    key={index}
                    value={JSON.stringify({ currency: i?.currency, countryName: country.name })}
                  >
                    {i?.emoji} {country.name} ({i?.currency})
                  </option>
                );
              })}
            </select>
          </label>
        </InputContainer>
        <InputContainer>
          <label>Country</label>
          <InputField
            placeholder="Country"
            type="text"
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            readOnly
            value={formInput.country}
            onChange={(e) => handleInput("country", e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label>Currency</label>
          <InputField
            placeholder="Currency"
            type="text"
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            value={formInput.currency}
            readOnly
            onChange={(e) => handleInput("currency", e.target.value)}
          />
        </InputContainer>
        <Flex
          flexDirection="column"
          alignItems="left"
          style={{ rowGap: "0.625rem" }}
          padding="0 0 1.25rem 0"
        >
          <ToggleButton type="button" onClick={handleOnlinePresence}>
            <img src={onlinePresence ? toggleOn : toggleOff} alt="" />
            <span>Activate Online Presence</span>
          </ToggleButton>
          <ToggleButton
            onClick={(e) => {
              e.preventDefault();
              setEnableExpiring(!enableExpiring);
            }}
          >
            <img src={enableExpiring ? toggleOn : toggleOff} alt="" />
            <span>Enable Expiring Date on Product</span>
          </ToggleButton>
          <ToggleButton
            onClick={(e) => {
              e.preventDefault();
              setEnableDiscount(!enableDiscount);
            }}
          >
            <img src={enableDiscount ? toggleOn : toggleOff} alt="" />
            <span>Enable Discount</span>
          </ToggleButton>
          {enableDiscount && (
            <div style={{ display: "block" }}>
              <label style={{ fontSize: "0.75rem", color: "#607087" }}>
                Enter the maximum discount(%) for the shop
              </label>
              <InputField
                placeholder=""
                type="text"
                backgroundColor="#F4F6F9"
                size="lg"
                color="#607087"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
                value={formInput.discount}
                onChange={(e) => handleInput("discount", e.target.value)}
              />
            </div>
          )}
          <ToggleButton
            onClick={(e) => {
              e.preventDefault();
              setEnableSurplus(!enableSurplus);
            }}
          >
            <img src={enableSurplus ? toggleOn : toggleOff} alt="" />
            <span>Enable surplus</span>
          </ToggleButton>
        </Flex>
        <Button
          label="Update"
          type="submit"
          backgroundColor="#607087"
          size="lg"
          color="#fff"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
        />
      </Form>
      {showTerms && (
        <ModalContainer>
          <ModalBox>
            <OnlineTerms
              setShowTerms={setShowTerms}
              handleActivate={handleActivate}
              incompleteSettings={incompleteSettings}
              setIncompleteSettings={setIncompleteSettings}
            />
          </ModalBox>
        </ModalContainer>
      )}
    </SubPageContainer>
  );
};

export default Business;
