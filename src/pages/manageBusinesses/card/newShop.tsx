import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { isLoading } from "../../../app/slices/status";
import { Button } from "../../../components/button/Button";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { IShop } from "../../../interfaces/shop.interface";
import { CREATE_SHOP, GET_SHOP_CATEGORIES } from "../../../schema/shops.schema";
import { currencyList } from "../../../utils/helper.utils";
import { Form, ImageSection } from "../../settings/style";
import dropIcon2 from "../../../assets/dropIcon2.svg";
import Camera from "../../../assets/Camera.svg";
import ShopCardIcon from "../../../assets/ShopCardIcon.svg";
import { Input } from "../../../components/input-field/style";
import styled from "styled-components";
import { upload } from "../../../helper/image.helper";
import { Colors } from "../../../GlobalStyles/theme";
import { Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { getSessions } from "../../../app/slices/session";
import ReactSelect from "react-select";

interface IForm {
  name: string;
  category: string;
  currency: string;
  address: string;
  phone: string;
}

const Label = styled.label`
  font-size: 13px;
  color: #607087;
`;

const AddNewShop = ({ updateShops }: { updateShops: () => void }) => {
  const dispatch = useAppDispatch();

  const { data: categoryData } = useQuery<{
    getShopCategories: [
      {
        shopCategoryId: string;
        shopCategoryName: string;
      }
    ];
  }>(GET_SHOP_CATEGORIES, {
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });
  const [formErrorState, setFormErrorState] = useState<boolean>();
  const [shopCategoriesName, setShopCategoriesName] = useState<string[]>([]);
  const [shopCategoriesId, setShopCategoriesId] = useState<string[]>([]);
  const [selectedShopCategory, setSelectedShopCategory] = useState(-1);
  const navigate = useNavigate();
  const [image, setImage] = useState<File>();
  // const [imageOnline, setImageOnline] = useState<string | undefined>("");
  const [formInput, setFormInput] = useState<IForm>({
    name: "",
    category: "",
    currency: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const currencyName: string[] = [];
    const currencyId: string[] = [];
    currencyList.forEach((val) => {
      currencyName.push(val.Country);
      currencyId.push(val.Code);
    });
    if (categoryData) {
      const categoriesName: string[] = [];
      const categoriesId: string[] = [];
      categoryData.getShopCategories.forEach((val) => {
        categoriesName.push(val.shopCategoryName);
        categoriesId.push(val.shopCategoryId);
      });
      setShopCategoriesName(categoriesName);
      setShopCategoriesId(categoriesId);
    }
  }, [categoryData]);

  const handleInput = (key: "name" | "address" | "phone", value: string) => {
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

  const [createShop] = useMutation<{ createShop: IShop }>(CREATE_SHOP, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setFormErrorState(false);
    }, 2000);

    if (formErrorState) {
      dispatch(toggleSnackbarOpen({ message: "Fill all the required fields", color: "DANGER" }));
    }
  }, [formErrorState]);

  const sessions = useAppSelector(getSessions);
  const token = sessions.session.token;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formInput.name === "" || formInput.phone === "" || formInput.address === "") {
      setFormErrorState(true);
    } else {
      dispatch(isLoading(true));
      createShop({
        variables: {
          shopName: formInput.name,
          shopPhone: formInput.phone,
          shopAddress: formInput.address,
          shopCategoryId: shopCategoriesId[selectedShopCategory],
          currencyCode: formInput.currency,
        },
      })
        .then(async (res) => {
          dispatch(isLoading(false));
          navigate("/dashboard/manage-businesses");
          updateShops();
          setFormInput({
            name: "",
            category: "",
            currency: "",
            address: "",
            phone: "",
          });
          if (res.data?.createShop) {
            if (image) {
              const uploadedImages = await upload({
                files: [image],
                key: "",
                id: res.data?.createShop?.shopId,
                shopId: res.data?.createShop?.shopId as string,
                token,
              });

              if (!uploadedImages.success) {
                dispatch(toggleSnackbarOpen("Unable to upload shop image"));
              }
            }
          }
          setImage(undefined);
        })
        .catch((err) => {
          console.log(err);
          dispatch(toggleSnackbarOpen(err?.graphQLErrors[0]?.message));
          dispatch(isLoading(false));
        });
    }
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
    <>
      <Form onSubmit={handleSubmit}>
        <div style={{ color: "#607087", width: "100%" }}>
          <h3>Create a Business</h3>
        </div>
        <ImageSection currImage={image && true}>
          {image ? (
            <label htmlFor="img-upload">
              <img src={image && getImageUrl()} alt="" />
            </label>
          ) : (
            <label htmlFor="img-upload">
              <img src={ShopCardIcon} alt="" id="preview" />
              <img src={Camera} alt="" />
            </label>
          )}
          <input
            type="file"
            id="img-upload"
            accept="image/*"
            hidden
            onChange={(e) => handleImageUpload(e.target?.files?.[0])}
          />
          <small style={{ color: "#9EA8B7" }}>Bussiness Image</small>
        </ImageSection>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            rowGap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {formErrorState && <Span color={Colors.red}>Fill all the required fields</Span>}
          <Label>Business Name</Label>
          <Input
            paddingSize="lg"
            buttonColor="#F4F6F9"
            type="text"
            placeholder="Business Name"
            value={formInput.name}
            onChange={(e) => handleInput("name", e.target.value)}
            borderRadius="0.75rem"
            width="100%"
            focus
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            rowGap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <Label>Category (optional)</Label>
          <CustomDropdown
            width="100%"
            height="45px"
            fontSize="1rem"
            borderRadius="0.75rem"
            containerColor="#F4F6F9"
            color="#8196B3"
            placeholder="Business Category"
            selected={selectedShopCategory}
            setValue={setSelectedShopCategory}
            options={shopCategoriesName}
            dropdownIcon={dropIcon2}
            padding="0 0.9375rem"
            specialButton
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            rowGap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <Label>Business Phone</Label>
          <Input
            paddingSize="lg"
            buttonColor="#F4F6F9"
            type="text"
            placeholder="Business Phone"
            value={formInput.phone}
            onChange={(e) => handleInput("phone", e.target.value)}
            borderRadius="0.75rem"
            width="100%"
            focus
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            rowGap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <Label>Business Address</Label>
          <Input
            paddingSize="lg"
            buttonColor="#F4F6F9"
            type="text"
            placeholder="Business Address"
            value={formInput.address}
            onChange={(e) => handleInput("address", e.target.value)}
            borderRadius="0.75rem"
            width="100%"
            focus
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            rowGap: "1rem",
            marginBottom: "2rem",
          }}
        >
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
        </div>
        <Button
          label="Create Business"
          onClick={handleSubmit}
          backgroundColor={Colors.primaryColor}
          size="lg"
          color="#fff"
          borderColor="none"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
        />
      </Form>
    </>
  );
};

export default AddNewShop;
