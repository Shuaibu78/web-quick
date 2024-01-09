import React, { useEffect, useState } from "react";
import { Button } from "../../../components/button/Button";
import { InputField } from "../../../components/input-field/input";
import TopNav from "../../../components/top-nav/top-nav";
import { Container, ControlNav } from "./style";
import { useAppDispatch } from "../../../app/hooks";
import { isLoading } from "../../../app/slices/status";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SHOP, GET_SHOP_CATEGORIES } from "../../../schema/shops.schema";
import { IShop } from "../../../interfaces/shop.interface";
import dropIcon2 from "../../../assets/dropIcon2.svg";
import { currencyList } from "../../../utils/helper.utils";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { InputWrapper } from "../../register/style";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { Colors } from "../../../GlobalStyles/theme";

const NewShop = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");

  const [createShop] = useMutation<{ createShop: IShop }>(CREATE_SHOP, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

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

  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [currencySymbols, setCurrencySymbols] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(0);
  const [shopCategoriesName, setShopCategoriesName] = useState<string[]>([]);
  const [shopCategoriesId, setShopCategoriesId] = useState<string[]>([]);
  const [selectedShopCategory, setSelectedShopCategory] = useState(-1);

  useEffect(() => {
    const currencyName: string[] = [];
    const currencyId: string[] = [];
    currencyList.forEach((val) => {
      currencyName.push(val.Country);
      currencyId.push(val.Code);
    });
    setCurrencyNames(currencyName);
    setCurrencySymbols(currencyId);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(isLoading(true));
    createShop({
      variables: {
        shopName: businessName,
        shopAddress: "",
        shopCategoryId: shopCategoriesId[selectedShopCategory],
        currencyCode: currencySymbols[selectedCurrency],
      },
    })
      .then((res) => {
        if (res.data?.createShop) {
          dispatch(isLoading(false));
          navigate("/dashboard/shops");
        }
      })
      .catch(() => {
        dispatch(isLoading(false));
      });
  };
  return (
    <div>
      <TopNav header="Shops" />
      <ControlNav>
        <h2>Create New Business</h2>
      </ControlNav>
      <Container>
        <form onSubmit={(e) => e.preventDefault()}>
          <InputWrapper>
            <InputField
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
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
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
            <CustomDropdown
              width="100%"
              height="45px"
              fontSize="1rem"
              borderRadius="0.75rem"
              containerColor="#F4F6F9"
              color="#8196B3"
              placeholder="Business Currency"
              selected={selectedCurrency}
              setValue={setSelectedCurrency}
              options={currencyNames}
              dropdownIcon={dropIcon2}
              padding="0 0.9375rem"
            />
          </InputWrapper>
          <Button
            label="Create Business"
            type="submit"
            onClick={handleSubmit}
            backgroundColor={Colors.primaryColor}
            size="lg"
            color="#fff"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
          />
        </form>
      </Container>
    </div>
  );
};

export default NewShop;
