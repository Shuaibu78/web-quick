import { InputField } from "../../../components/input-field/input";
import orangePlusIcon from "../../../assets/orangePlus.svg";
import greenPlusIcon from "../../../assets/greenPlus.svg";
import {
  AddButton,
  BulkInputContainer,
  DeleteButton,
  ErrorMsg,
  NewOptionContainer,
  SaveButton,
  Variation,
  VariationHeading,
  VariationList,
  VariationListHeading,
  VariationOption,
} from "./style";
import editIcon from "../../../assets/Edit.svg";
import deleteIcon from "../../../assets/Delete.svg";
import whiteBgCancel from "../../../assets/whiteBgCancel.svg";
import { getIsEdit } from "../../../app/slices/isEdit";
import { Hr } from "../style";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { useAppSelector } from "../../../app/hooks";
import { IQuantities } from "./addInterface";
import { Colors } from "../../../GlobalStyles/theme";
import { AiOutlineMinus } from "react-icons/ai";
import { convertToNumber, validateInputNum } from "../../../utils/formatValues";
import { isFigorr } from "../../../utils/constants";
import ReactSelect from "react-select";
import { packMeasurementUnit, piecesMeasurementUnit } from "./measurementUnit";
import NumberInput from "../../../components/input-field/customNumberInput";

export const Quantities: React.FC<IQuantities> = (props) => {
  const { isEdit } = useAppSelector(getIsEdit);
  const { blackLight, primaryColor } = Colors;

  const formatNumberWithCommas = (newValue: string | number) => {
    if (newValue !== null && newValue !== undefined) {
      return newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return "";
  };

  const measurementUnitList =
    props.sellTypeOption[props.sellType] === "Sell Single"
      ? piecesMeasurementUnit
      : packMeasurementUnit;

  const handleQuantityChange = (val: number | string) => {
    props.validateInputNum(props.setQuantityInPieces, val);
  };
  const handleQuantityIncrement = () => {
    props.setQuantityInPieces((prev: string | number) => Number(prev) + 1);
  };
  const handleQuantityDecrement = () => {
    props.setQuantityInPieces((prev: string | number) => Number(prev) - 1);
  };

  return (
    <Flex width="100%" direction="column" margin="1rem 0 0 0">
      {props.type === "product" && (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", flexFlow: "column", gap: "1em", width: "100%" }}
        >
          {props.trackQuantity && (
            <>
              {props.errorMessage.variationError && (
                <ErrorMsg>{props.errorMessage.variationError}</ErrorMsg>
              )}
              {props.sellTypeOption[props.sellType] === "Sell in Variation" && (
                <div>
                  {!isEdit && (
                    <>
                      <div>
                        <InputField
                          placeholder="Variation Name eg. Color"
                          type="text"
                          height="3rem"
                          readOnly={isEdit}
                          label="Variation Name"
                          backgroundColor="#F4F6F9"
                          color="#353e49"
                          borderColor={props.errorMessage.nameError ? "red" : "#8196B3"}
                          size="lg"
                          borderRadius=".75rem"
                          borderSize="1px"
                          fontSize="1rem"
                          width="100%"
                          value={props.newVariationName}
                          onChange={(e) => props.setNewVariationName!(e.target.value)}
                        />
                        {props.newVariationOption?.map((value, index) => {
                          if (index === props.newVariationOption.length - 1) {
                            return (
                              <NewOptionContainer key={index}>
                                <div className="variation-option">
                                  <input
                                    type="text"
                                    style={{ height: "3rem" }}
                                    value={props.newVariationOption[index]}
                                    onChange={(e) =>
                                      props.updateVariationOption(index, e.target.value)
                                    }
                                    placeholder="Variation Option"
                                  />
                                  <AiOutlineMinus
                                    color={primaryColor}
                                    id="minus-icon"
                                    onClick={() => props.removeVariationOption(index)}
                                  />
                                </div>

                                <button onClick={props.addNewOptionField}>
                                  <img src={isFigorr ? greenPlusIcon : orangePlusIcon} alt="" />
                                </button>
                              </NewOptionContainer>
                            );
                          } else {
                            return (
                              <NewOptionContainer key={index}>
                                <input
                                  type="text"
                                  style={{ height: "3rem" }}
                                  value={props.newVariationOption[index]}
                                  onChange={(e) =>
                                    props.updateVariationOption(index, e.target.value)
                                  }
                                  placeholder="Variation Option"
                                />
                              </NewOptionContainer>
                            );
                          }
                        })}
                      </div>

                      <SaveButton onClick={props.saveNewVariation}>Save</SaveButton>
                      <VariationList>
                        <h3>Variations</h3>
                        {Object.keys(props.productVariation).map((val, index) => {
                          return (
                            <Variation key={index}>
                              <VariationHeading>
                                <h4>{val}</h4>
                                <div>
                                  <button onClick={() => props.editVariation!(val)}>
                                    <img src={editIcon} alt="edit" />
                                  </button>
                                  <button onClick={() => props.deleteVariation!(val)}>
                                    <img src={deleteIcon} alt="del" />
                                  </button>
                                </div>
                              </VariationHeading>
                              <Flex flexWrap="wrap">
                                {props.productVariation[val].map((optVal, optIndex) => {
                                  return (
                                    <VariationOption key={optIndex}>
                                      <span>{optVal}</span>0
                                      <button
                                        onClick={() =>
                                          props.deleteVariationOption!(optIndex, val, optVal)
                                        }
                                      >
                                        <img src={whiteBgCancel} alt="" />
                                      </button>
                                    </VariationOption>
                                  );
                                })}
                              </Flex>
                            </Variation>
                          );
                        })}
                      </VariationList>
                    </>
                  )}

                  <VariationList>
                    <h3>Variations Options Settings</h3>
                    {props.variationTypeList?.map((val, i) => (
                      <Variation key={i}>
                        <VariationListHeading>{val}</VariationListHeading>
                        <BulkInputContainer
                          style={{ borderBottom: "1px solid gray", paddingBottom: ".3125rem" }}
                        >
                          <NewOptionContainer>
                            <p>Purchased Price</p>
                            <InputField
                              type="text"
                              style={{ height: "3rem" }}
                              value={props.variationList[val]?.cost}
                              onChange={(e) =>
                                props.changeVariationCost!(val, convertToNumber(e.target.value))
                              }
                              placeholder="₦ 0.00"
                            />
                          </NewOptionContainer>
                          <NewOptionContainer
                            style={{ marginLeft: ".625rem", marginRight: ".625rem" }}
                          >
                            <p>Selling Price</p>
                            <InputField
                              type="text"
                              style={{ height: "3rem" }}
                              value={props.variationList[val]?.price}
                              onChange={(e) =>
                                props.changeVariationPrice!(val, convertToNumber(e.target.value))
                              }
                              placeholder="₦ 0.00"
                            />
                          </NewOptionContainer>
                          <NewOptionContainer>
                            <p>Quantity</p>
                            <InputField
                              type="text"
                              style={{ height: "3rem" }}
                              readOnly={isEdit}
                              value={props.variationList[val]?.quantity}
                              onChange={(e) =>
                                props.changeVariationQuantity!(val, convertToNumber(e.target.value))
                              }
                              placeholder="Qty"
                            />
                          </NewOptionContainer>
                        </BulkInputContainer>
                      </Variation>
                    ))}
                  </VariationList>
                </div>
              )}

              {!props.showProductVariation && (
                <>
                  {props.errorMessage.priceError && (
                    <ErrorMsg>{props.errorMessage.priceError}</ErrorMsg>
                  )}
                  {props.trackQuantity ? (
                    <>
                      {(props.sellTypeOption[props.sellType] === "Sell Single" ||
                        props.sellInPP) && (
                        <>
                          {props.sellInPP && (
                            <Span fontWeight="600" color={blackLight}>
                              Pieces Details
                            </Span>
                          )}
                          <Flex justifyContent="space-between" margin="1em 0 1.5em 0">
                            <InputField
                              placeholder="Purchased Price"
                              type="text"
                              height="3rem"
                              size="lg"
                              label={props.sellInPP ? "Pieces Purchased Price" : "Purchased Price"}
                              backgroundColor="#F4F6F9"
                              color="#353e49"
                              borderColor={props.errorMessage.nameError ? "red" : "#8196B3"}
                              borderRadius=".75rem"
                              borderSize="1px"
                              fontSize="1rem"
                              width="100%"
                              value={props.piecesCostPrice}
                              onChange={(e) =>
                                props.validateInputNum(props.setPiecesCostPrice, e.target.value)
                              }
                            />
                            <div style={{ width: "1.875rem" }}></div>
                            <InputField
                              placeholder="Selling Price"
                              type="text"
                              height="3rem"
                              size="lg"
                              label={props.sellInPP ? "Pieces Selling Price" : "Selling Price"}
                              backgroundColor="#F4F6F9"
                              color="#353e49"
                              borderColor={props.errorMessage.nameError ? "red" : "#8196B3"}
                              borderRadius=".75rem"
                              borderSize="1px"
                              fontSize="1rem"
                              width="100%"
                              value={props.fixedUnitPrice}
                              onChange={(e) =>
                                props.validateInputNum(props.setFixedUnitPrice, e.target.value)
                              }
                            />
                          </Flex>
                          <Flex justifyContent="space-between" gap="1rem" margin="0 0 .5em 0">
                            <NumberInput
                              value={props.quantityInPieces}
                              onChange={(val: string) => props.setQuantityInPieces(parseFloat(val))}
                              increment={handleQuantityIncrement}
                              decrement={handleQuantityDecrement}
                              width="100%"
                              label="Quantity in Stock"
                              type="number"
                              step="0.5"
                            />
                            {!props.sellInPP && (
                              <ReactSelect
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                isClearable={true}
                                isSearchable={false}
                                value={props.measurementUnit}
                                onChange={(newValue) => props.setMeasurementUnit(newValue)}
                                options={measurementUnitList}
                                placeholder="Select Unit"
                                styles={{
                                  control: (provided: {}, state) => ({
                                    ...provided,
                                    border: "none",
                                    borderColor: state.isFocused ? Colors.grey : "none",
                                    backgroundColor: "#F4F6F9",
                                    borderRadius: "0.5rem",
                                    width: "12rem",
                                    boxShadow: "none",
                                  }),

                                  menu: (provided: {}) => ({
                                    ...provided,
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: Colors.lightBg,
                                  }),

                                  option: (provided: {}, state) => ({
                                    ...provided,
                                    backgroundColor: Colors.white,
                                    color: state.isFocused ? Colors.grey : "black",
                                    "&:hover": {
                                      backgroundColor: Colors.tabBg,
                                    },
                                  }),

                                  singleValue: (provided: {}) => ({
                                    ...provided,
                                    color: Colors.grey,
                                  }),

                                  indicatorSeparator: (provided: {}) => ({
                                    ...provided,
                                    backgroundColor: Colors.grey,
                                  }),

                                  dropdownIndicator: (provided: {}) => ({
                                    ...provided,
                                    color: Colors.grey,
                                  }),

                                  clearIndicator: (provided: {}) => ({
                                    ...provided,
                                    color: Colors.grey,
                                  }),

                                  placeholder: (provided: {}) => ({
                                    ...provided,
                                    color: Colors.grey,
                                  }),
                                }}
                              />
                            )}
                          </Flex>
                        </>
                      )}
                      {props.sellInPP && <Hr margin="0.5rem 0" opacity="0.1" />}
                      {(props.sellTypeOption[props.sellType] === "Sell in Pack" ||
                        props.sellInPP) && (
                        <>
                          {props.sellInPP && (
                            <Span fontWeight="600" color={blackLight}>
                              Pack Details
                            </Span>
                          )}

                          <Flex justifyContent="space-between" margin="1em 0 1.5em 0">
                            <InputField
                              placeholder="Purchased Price"
                              type="text"
                              height="3rem"
                              label={props.sellInPP ? "Pack Purchased Price" : "Purchased Price"}
                              backgroundColor="#F4F6F9"
                              color="#353e49"
                              borderColor={props.errorMessage.nameError ? "red" : "#8196B3"}
                              size="lg"
                              borderRadius=".75rem"
                              borderSize="1px"
                              fontSize="1rem"
                              width="100%"
                              value={props.packCostPrice}
                              onChange={(e) =>
                                validateInputNum(props.setPackCostPrice, e.target.value)
                              }
                            />
                            <div style={{ width: "1.875rem" }}></div>
                            <InputField
                              placeholder="Selling Price"
                              type="text"
                              height="3rem"
                              label={props.sellInPP ? "Pack Selling Price" : "Selling Price"}
                              backgroundColor="#F4F6F9"
                              color="#353e49"
                              borderColor={props.errorMessage.nameError ? "red" : "#8196B3"}
                              size="lg"
                              borderRadius=".75rem"
                              borderSize="1px"
                              fontSize="1rem"
                              width="100%"
                              value={props.fixedPackPrice}
                              onChange={(e) =>
                                props.validateInputNum(props.setFixedPackPrice, e.target.value)
                              }
                            />
                          </Flex>

                          {props.sellTypeOption[props.sellType] === "Sell in Pack" && (
                            <ReactSelect
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              isClearable={true}
                              isSearchable={false}
                              value={props.measurementUnit}
                              onChange={(newValue) => props.setMeasurementUnit(newValue)}
                              options={measurementUnitList}
                              placeholder="Select Unit"
                              styles={{
                                control: (provided: {}, state) => ({
                                  ...provided,
                                  border: "none",
                                  borderColor: state.isFocused ? Colors.grey : "none",
                                  backgroundColor: "#F4F6F9",
                                  borderRadius: "0.5rem",
                                  width: "100%",
                                  margin: "0em 0 1em 0",
                                  boxShadow: "none",
                                }),
                                menu: (provided: {}) => ({
                                  ...provided,
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                  backgroundColor: Colors.lightBg,
                                }),
                                option: (provided: {}, state) => ({
                                  ...provided,
                                  backgroundColor: Colors.white,
                                  color: state.isFocused ? Colors.grey : "black",
                                  "&:hover": {
                                    backgroundColor: Colors.tabBg,
                                  },
                                }),
                                singleValue: (provided: {}) => ({
                                  ...provided,
                                  color: Colors.grey,
                                }),
                                indicatorSeparator: (provided: {}) => ({
                                  ...provided,
                                  backgroundColor: Colors.grey,
                                }),
                                dropdownIndicator: (provided: {}) => ({
                                  ...provided,
                                  color: Colors.grey,
                                }),
                                clearIndicator: (provided: {}) => ({
                                  ...provided,
                                  color: Colors.grey,
                                }),
                                placeholder: (provided: {}) => ({
                                  ...provided,
                                  color: Colors.grey,
                                }),
                              }}
                            />
                          )}
                          <Flex
                            justifyContent="space-between"
                            gap="1rem"
                            margin="0 0 0.5em 0"
                            width="100%"
                          >
                            <NumberInput
                              value={props.perPack}
                              onChange={(e: number | string) =>
                                props.validateInputNum(props.setPerPack, e)
                              }
                              increment={() =>
                                props.setPerPack((prev: number | string) => Number(prev) + 1)
                              }
                              decrement={() =>
                                props.setPerPack((prev: number | string) => Number(prev) - 1)
                              }
                              width="100%"
                              label="Quantity per Pack"
                            />
                            <NumberInput
                              value={props.quantityInPacks}
                              onChange={(val: string) => props.setQuantityInPacks(parseFloat(val))}
                              increment={() =>
                                props.setQuantityInPacks(
                                  (prev: number | string) => Number(prev) + 1
                                )
                              }
                              decrement={() =>
                                props.setQuantityInPacks(
                                  (prev: number | string) => Number(prev) - 1
                                )
                              }
                              width="100%"
                              label="Quantity in Stock"
                              type="number"
                              step="0.5"
                            />
                          </Flex>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Flex justifyContent="space-between" margin="0 0 0.5em 0">
                        <InputField
                          placeholder="Purchased Price"
                          type="text"
                          height="3rem"
                          backgroundColor="#F4F6F9"
                          color="#353e49"
                          borderColor={props.errorMessage.nameError ? "red" : "#8196B3"}
                          size="lg"
                          borderRadius=".75rem"
                          borderSize="1px"
                          fontSize="1rem"
                          width="100%"
                          value={props.costPrice}
                          onChange={(e) => props.setCostPrice(e.target.value)}
                        />
                        <div style={{ width: "1.875rem" }}></div>
                        <InputField
                          placeholder="Selling Price"
                          type="text"
                          height="3rem"
                          backgroundColor="#F4F6F9"
                          color="#353e49"
                          borderColor={props.errorMessage.nameError ? "red" : "#8196B3"}
                          size="lg"
                          borderRadius=".75rem"
                          borderSize="1px"
                          fontSize="1rem"
                          width="100%"
                          value={props.sellingPrice}
                          onChange={(e) => props.setSellingPrice(e.target.value)}
                        />
                      </Flex>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {props.bulkSales && (
            <div>
              {props.bulkOptions.map((val, index) => {
                return (
                  <BulkInputContainer key={index}>
                    <input
                      type="number"
                      height="3rem"
                      placeholder="Quantity"
                      value={val.quantity ? val.quantity : undefined}
                      onChange={(e) => {
                        props.updateBulkOption(index, "quantity", e.target.value);
                      }}
                    />
                    <input
                      type="text"
                      height="3rem"
                      placeholder="Price"
                      value={val.price}
                      onChange={(e) => {
                        props.updateBulkOption(index, "price", e.target.value);
                      }}
                    />
                    <DeleteButton onClick={() => props.handleBulkOptionDelete(index)}>
                      <img src={deleteIcon} alt="" />
                    </DeleteButton>
                  </BulkInputContainer>
                );
              })}
              <AddButton onClick={props.handleAddBulkPrice}>
                <img src={orangePlusIcon} alt="" />
                <span>Add Another Bulk Price</span>
              </AddButton>
            </div>
          )}
        </form>
      )}
    </Flex>
  );
};

export default Quantities;
