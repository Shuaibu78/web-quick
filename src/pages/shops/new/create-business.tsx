import React, { FunctionComponent, useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import AuthCard from "../../../components/auth-card/auth-card";
import { Button } from "../../../components/button/Button";
import { InputField } from "../../../components/input-field/input";
import Loader from "../../register/loader/loader";
import {
  Container,
  Form,
  TopContainer,
  ToggleButton,
  SubHeader,
  InputWrapper,
} from "../../register/style";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { IShop } from "../../../interfaces/shop.interface";
import { CREATE_SHOP, GET_ALL_SHOPS, GET_SHOP_CATEGORIES } from "../../../schema/shops.schema";
import dropIcon2 from "../../../assets/dropIcon2.svg";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { currencyList } from "../../../utils/helper.utils";
import { isLoading } from "../../../app/slices/status";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import TopNav from "../../../components/top-nav/top-nav";
import { ControlNav } from "./style";
import { Input } from "../../../components/input-field/style";
import { Label } from "../../sales/style";
import { getCurrentUser } from "../../../app/slices/userInfo";

interface IForm {
  name: string;
  category: string;
  currency: string;
  address: string;
}

const CreateShop: FunctionComponent = () => {
  const currentUser = useAppSelector(getCurrentUser);
  const isUserAvailable = Number(currentUser?.userId?.length) > 0;
  const dispatch = useAppDispatch();

  const [getUserShop] = useLazyQuery<{ getUsersShops: [IShop] }>(GET_ALL_SHOPS, {
    variables: {
      userId: currentUser?.userId
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    getUserShop();
  }, [isUserAvailable]);

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

  const [isLoadingT, setIsLoadingT] = useState(false);
  const [shopCategoriesName, setShopCategoriesName] = useState<string[]>([]);
  const [shopCategoriesId, setShopCategoriesId] = useState<string[]>([]);
  const [selectedShopCategory, setSelectedShopCategory] = useState(-1);
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState<IForm>({
    name: "",
    category: "",
    currency: "",
    address: "",
  });

  useEffect(() => {
    const currencyName: string[] = [];
    const currencyId: string[] = [];
    currencyList.forEach((val) => {
      currencyName.push(val.Country);
      currencyId.push(val.Code);
    });
    if (categoryData) {
      const categoryName: string[] = [];
      const categoryId: string[] = [];
      categoryData.getShopCategories.forEach((val) => {
        categoryName.push(val.shopCategoryName);
        categoryId.push(val.shopCategoryId);
      });
      setShopCategoriesName(categoryName);
      setShopCategoriesId(categoryId);
    }
  }, [categoryData]);

  const handleInput = (key: "name" | "address", value: string) => {
    setFormInput((prevInput) => {
      const inputCopy: IForm = { ...prevInput, [key]: value };
      return inputCopy;
    });
  };
  const [createShop] = useMutation<{ createShop: IShop }>(CREATE_SHOP, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createShop({
      variables: {
        shopName: formInput.name,
        shopAddress: formInput.address,
        shopCategoryId: shopCategoriesId[selectedShopCategory],
        currencyCode: formInput.currency,
      },
    })
      .then((res) => {
        if (res.data?.createShop) {
          dispatch(isLoading(false));
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(toggleSnackbarOpen(err?.graphQLErrors[0]?.message));
      });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({
      ...formInput,
      currency: e.target.value,
    });
  };

  return (
    <div>
      <TopNav header="Shops" />
      <ControlNav>
        <h2>Create New Business</h2>
      </ControlNav>
      <Container>
        <AuthCard width="450px">
          {!isLoadingT ? (
            <Form onSubmit={handleSubmit}>
              <TopContainer>
                <ToggleButton
                  state="active"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Create a Business
                </ToggleButton>
              </TopContainer>
              <SubHeader marginBottom="0.9375rem">Add a buiness to your account</SubHeader>
              <InputWrapper>
                <InputField
                  type="text"
                  label="Business Name"
                  placeholder="Business Name"
                  size="lg"
                  backgroundColor="#fff"
                  color="#353e49"
                  borderColor="#8196B3"
                  borderRadius="0.75rem"
                  borderSize="1px"
                  border
                  fontSize="1rem"
                  width="100%"
                  value={formInput.name}
                  onChange={(e) => handleInput("name", e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                <InputField
                  type="text"
                  label="Business Address"
                  placeholder="Business Address"
                  size="lg"
                  backgroundColor="#fff"
                  color="#353e49"
                  borderColor="#8196B3"
                  borderRadius="0.75rem"
                  borderSize="1px"
                  border
                  fontSize="1rem"
                  width="100%"
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
                  placeholder="Business Category"
                  selected={selectedShopCategory}
                  setValue={setSelectedShopCategory}
                  options={shopCategoriesName}
                  dropdownIcon={dropIcon2}
                  padding="0 0.9375rem"
                />
              </InputWrapper>
              <InputWrapper>
                <Label>Currency</Label>
                <datalist id="currencies">
                  {currencyList.map((curr) => (
                    <option value={curr.Code}>{curr.Code + " " + curr.Country}</option>
                  ))}
                </datalist>
                <Input
                  paddingSize="lg"
                  buttonColor="#F4F6F9"
                  type="text"
                  placeholder="Business Currency"
                  borderRadius="0.75rem"
                  width="100%"
                  focus
                  onChange={(e) => handleStateChange(e)}
                  list="currencies"
                />
              </InputWrapper>
              <Button
                label="Create"
                onClick={handleSubmit}
                backgroundColor="#607087"
                size="lg"
                color="#fff"
                borderColor="none"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
              />
            </Form>
          ) : (
            <Loader />
          )}
        </AuthCard>
      </Container>
    </div>
  );
};

export default CreateShop;
