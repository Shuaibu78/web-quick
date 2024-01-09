import { Colors } from "../../../GlobalStyles/theme";
import { ModalBox } from "../../settings/style";
import cancelIcon from "../../../assets/cancel.svg";
import { FunctionComponent, useState } from "react";
import { Button } from "../../../components/button/Button";
import { InputWrapper } from "../../login/style";
import { InputField } from "../../../components/input-field/input";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import Select, { StylesConfig } from "react-select";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";

interface IProps {
  setShowShippingForm: Function;
  setShippingAddress: Function;
  stateValue: string | undefined;
  cityValue: string | undefined;
  location: string | undefined;
}

interface Option {
  value: string;
  label: string;
}

const customStyles: StylesConfig = {
  control: (provided: any, state) => ({
    ...provided,
    backgroundColor: "#F4F6F9",
    border: "1px solid #F4F6F9",
    borderRadius: "0.75rem",
    padding: "0.5rem 0",
    borderColor: state.isFocused ? Colors.secondaryColor : "#F4F6F9",
    boxShadow: state.isFocused ? Colors.secondaryColor : "#F4F6F9",
    "&:hover": {
      borderColor: Colors.secondaryColor,
    },
  }),
  container: (provided: any) => ({
    ...provided,
    width: "100%",
  }),
  option: (provided: any, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "blue" : "white",
    color: "#607087",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  })
};

const ShippingAddress: FunctionComponent<IProps> = ({
  setShowShippingForm,
  setShippingAddress
}) => {
  const [state, setState] = useState<Option | null | undefined>();
  const [city, setCity] = useState<Option | null | undefined>();
  const [location, setLocation] = useState<string>();

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const handleSubmit = () => {
    if (!state || !city || !location) {
      toggleSnackbarOpen({
        message: "Form is not complete",
        color: "DANGER",
      });
    } else {
      setShippingAddress({
        state: state?.value,
        city: city.value,
        location
      });
      setShowShippingForm(false);
      console.log({
        state: state?.value,
        city: city.value,
        location
      });
    }
  };

  const handleStateChange = (option: any) => {
    setState(option);
  };

  const handleCityChange = (option: any) => {
    setCity(option);
  };

  return (
    <ModalBox width="35%">
      <h3
        style={{
          marginBottom: "10px",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          color: Colors.primaryColor,
        }}
      >
        <span>Shipping Address</span>
        <button
          onClick={() => setShowShippingForm(false)}
          style={{ background: "transparent", border: "1px solid black" }}
        >
          <img src={cancelIcon} alt="" />
        </button>
      </h3>
      <Flex direction="column" gap="1rem" margin="2rem 0 0 0">
        <Flex gap="1rem" margin="0.75rem 0">
          <Flex direction="column" gap="0.5rem" width="100%">
            <label style={{ fontSize: "0.7rem", margin: "0.2rem" }}>Country</label>
            <Select
              defaultValue={state}
              onChange={handleStateChange}
              options={options}
              styles={customStyles}
            />
          </Flex>
          <Flex direction="column" gap="0.5rem" width="100%">
            <label style={{ fontSize: "0.7rem", margin: "0.2rem" }}>State</label>
            <Select
              defaultValue={city}
              onChange={handleCityChange}
              options={options}
              styles={customStyles}
            />
          </Flex>
        </Flex>
        <InputWrapper>
          <InputField
            label="Location"
            placeholder="Location"
            type="text"
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            value={location || ""}
            onChange={(e) => setLocation(e.target.value)}
          />
        </InputWrapper>
      </Flex>
      <Button
        label={"Done"}
        onClick={() => handleSubmit()}
        backgroundColor={Colors.primaryColor}
        size="lg"
        color="#fff"
        borderColor="transparent"
        borderRadius="0.75rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
        margin="2rem 0 0 0 "
      />
    </ModalBox>
  );
};

export default ShippingAddress;
