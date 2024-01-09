import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../../pages/settings/style";
import dropIcon2 from "../../../assets/dropIcon2.svg";
import { CancelButton } from "../../../pages/sales/style";
import Cancel from "../../../assets/cancel.svg";
import { StyledNavLink } from "../settingsComps.style";
import { InputField } from "../../../components/input-field/input";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { IShop } from "../../../interfaces/shop.interface";
import { useEffect } from "react";
import { currencyList } from "../../../utils/helper.utils";
import ReactSelect from "react-select";

interface IForm {
  businessName: string;
  category: string;
  phoneNo: string;
  currency: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface EditProp {
  update: string;
  setUpdate: Function;
  setShowEditModal: Function;
  handleUpdateShop: Function;
  setFormInput: Function;
  formInput: IForm;
  handleInput: Function;
  selectedCurrency: number;
  shopCategoriesName: string[];
  selectedShopCategory: number;
  currencyNames: string[];
  setSelectedCurrency: (value: number) => void;
  setSelectedShopCategory: (value: number) => void;
  currentShop: IShop;
}

const EditBizDetails: React.FC<EditProp> = ({
  update,
  setUpdate,
  formInput,
  handleInput,
  selectedShopCategory,
  shopCategoriesName,
  setSelectedShopCategory,
  currentShop,
  setShowEditModal,
  handleUpdateShop,
  setFormInput,
}) => {
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

  useEffect(() => {
    setFormInput((prevInput: IForm) => {
      const inputCopy = {
        ...prevInput,
        businessName: currentShop.shopName,
        phoneNo: currentShop.shopPhone,
        country: "Nigeria",
        state: currentShop.state,
        city: currentShop.city,
        address: currentShop.shopAddress,
      };
      return inputCopy;
    });
  }, []);
  const currentCurrencyIndex = convertedArr.findIndex(
    (arrr) => arrr.value === currentShop.currencyCode
  );

  return (
    <>
      <ModalContainer>
        <ModalBox position width="26rem" textMargin="0 0">
          <Flex justifyContent="space-between">
            <div>
              <h3>Update Businesses</h3>
              <Span color={Colors.grey}>Update and save new changes to your business</Span>
            </div>
            <CancelButton
              style={{
                width: "1.875rem",
                height: "1.875rem",
                display: "grid",
                placeItems: "center",
              }}
              hover
              onClick={() => setShowEditModal(false)}
            >
              <img src={Cancel} alt="" />
            </CancelButton>
          </Flex>
          <Flex height="fit-content" direction="column" justifyContent="center">
            <Flex columnGap="2rem" margin="1.25rem 0px" justifyContent="space-between">
              <StyledNavLink
                width="145px"
                onClick={() => setUpdate("Business Information")}
                active={update === "Business Information"}
              >
                Business Information
              </StyledNavLink>
              <StyledNavLink
                width="145px"
                onClick={() => setUpdate("Business Location")}
                active={update === "Business Location"}
              >
                Business Location
              </StyledNavLink>
            </Flex>

            <Flex direction="column">
              {update === "Business Information" && (
                <>
                  <Flex margin="0.625rem 0px" direction="column">
                    <p>Business Name</p>
                    <InputField
                      type="text"
                      backgroundColor="#F4F6F9"
                      size="lg"
                      color="#607087"
                      borderColor="transparent"
                      borderRadius="0.75rem"
                      borderSize="0px"
                      fontSize="1rem"
                      width="100%"
                      noFormat
                      value={formInput.businessName}
                      onChange={(e) => handleInput("businessName", e.target.value)}
                    />
                  </Flex>
                  <Flex margin="0.625rem 0px" direction="column">
                    <p>Business Category</p>
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
                  </Flex>
                  <Flex margin="0.625rem 0px" direction="column">
                    <p>Business Phone</p>
                    <InputField
                      type="text"
                      backgroundColor="#F4F6F9"
                      size="lg"
                      color="#607087"
                      borderColor="transparent"
                      borderRadius="0.75rem"
                      borderSize="0px"
                      fontSize="1rem"
                      width="100%"
                      noFormat={true}
                      value={formInput.phoneNo}
                      onChange={(e) => handleInput("phoneNo", e.target.value)}
                    />
                  </Flex>
                  <Flex margin="0.625rem 0px" direction="column">
                    <p>Currency</p>
                    <ReactSelect
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={convertedArr[currentCurrencyIndex]}
                      onChange={(newValue) => handleStateChange(newValue)}
                      isClearable={true}
                      isSearchable={true}
                      name="Currency List"
                      options={convertedArr}
                    />
                  </Flex>
                  <Flex
                    margin="0.9375rem 0"
                    width="100%"
                    height="2.5rem"
                    borderRadius="0.75rem"
                    alignItems="center"
                    justifyContent="center"
                    color={Colors.white}
                    cursor="pointer"
                    bg={Colors.primaryColor}
                    onClick={() => handleUpdateShop("Information")}
                  >
                    Update Business Information
                  </Flex>
                </>
              )}
              {update === "Business Location" && (
                <>
                  <Flex margin="0.625rem 0px" direction="column">
                    <p>Country</p>
                    <InputField
                      type="text"
                      backgroundColor="#F4F6F9"
                      size="lg"
                      color="#607087"
                      borderColor="transparent"
                      borderRadius="0.75rem"
                      borderSize="0px"
                      fontSize="1rem"
                      width="100%"
                      value={formInput.country}
                      onChange={(e) => handleInput("country", e.target.value)}
                    />
                  </Flex>
                  <Flex margin="0.625rem 0px" direction="column">
                    <p>State</p>
                    <InputField
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
                  </Flex>
                  <Flex margin="0.625rem 0px" direction="column">
                    <p>City</p>
                    <InputField
                      type="tel"
                      backgroundColor="#F4F6F9"
                      size="lg"
                      color="#607087"
                      borderColor="transparent"
                      borderRadius="0.75rem"
                      borderSize="0px"
                      fontSize="1rem"
                      width="100%"
                      value={formInput.city}
                      onChange={(e) => {
                        handleInput("city", e.target.value);
                      }}
                    />
                  </Flex>
                  <Flex margin="0.625rem 0px" direction="column">
                    <p>Address</p>
                    <InputField
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
                  </Flex>
                  <Flex
                    margin="0.9375rem 0"
                    width="100%"
                    height="2.5rem"
                    borderRadius="0.75rem"
                    alignItems="center"
                    justifyContent="center"
                    color={Colors.white}
                    cursor="pointer"
                    bg={Colors.primaryColor}
                    onClick={() => handleUpdateShop("Location")}
                  >
                    Update Business Location
                  </Flex>
                </>
              )}
            </Flex>
          </Flex>
        </ModalBox>
      </ModalContainer>
    </>
  );
};

export default EditBizDetails;
