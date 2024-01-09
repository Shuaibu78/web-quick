/* eslint-disable indent */
import React from "react";
import { Item, TextBold, ItemsContainer } from "./styles";
import { CustomText } from "../../staffs/style";
import { IInventory } from "../../../interfaces/inventory.interface";
import { formatAmountIntl } from "../../../helper/format";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { getImageUrl } from "../../../helper/image.helper";
import { CartIcon } from "../../../assets/CustomizableSvgIcons";
import { IsearList } from "./new-sales";

interface IProduct {
  searchTextList: IsearList;
  currentTab: string;
  selectedBatchNo: string;
  searchData: { getAllShopInventory: [IInventory] } | undefined;
  page: number;
  handlePrevPage: () => void;
  totalPages: number;
  handleNextPage: () => void;
  navbarHeight: number | undefined;
  inventoryDataList: IInventory[];
  batchInvDataList: IInventory[];
  handleAddToCart: (datum: IInventory, activeTab?: string) => void;
  qtyInStock: (val: IInventory) => string;
}

const ProductsList: React.FC<IProduct> = ({
  searchTextList,
  currentTab,
  searchData,
  navbarHeight,
  inventoryDataList,
  batchInvDataList,
  handleAddToCart,
  qtyInStock,
  selectedBatchNo,
}) => {
  const getInvData = () => {
    if (selectedBatchNo) {
      return batchInvDataList;
    } else {
      return inventoryDataList;
    }
  };

  return (
    <Flex direction="column" width="100%">
      {searchTextList[currentTab]?.search && !selectedBatchNo && (
        <TextBold style={{ margin: "15px 0" }}>
          Found{" "}
          <span>
            {selectedBatchNo ? batchInvDataList.length : searchData?.getAllShopInventory.length}
          </span>{" "}
          Results for{" "}
          <span style={{ color: Colors.secondaryColor }}>
            “{searchTextList[currentTab]?.search}”
          </span>
        </TextBold>
      )}

      <ItemsContainer
        style={{ height: `calc(80vh - ${navbarHeight! + 10}px)`, overflowY: "scroll" }}
      >
        {getInvData?.().length > 0 ? (
          <>
            {getInvData()?.map((val, i) => {
              if (
                val?.inventoryType === "PIECES" ||
                val?.inventoryType === "PACK" ||
                val?.inventoryType === "PIECES_AND_PACK" ||
                val?.inventoryType === "NON_TRACKABLE" ||
                val?.inventoryType === "VARIATION"
              ) {
                return (
                  <Item key={i} onClick={() => handleAddToCart(val)}>
                    <img
                      src={getImageUrl(val?.Images)}
                      alt=""
                      style={{
                        borderRadius: "10px",
                        marginRight: "15px",
                        maxWidth: "50px",
                      }}
                    />
                    <Flex direction="column" justifyContent="space-between" width="100%">
                      <p className="overflow">{val.inventoryName}</p>
                      <Flex justifyContent="space-between" width="100%">
                        <CustomText fontSize="14px">
                          In stock:{" "}
                          <span
                            style={{
                              color: Colors.blackLight,
                            }}
                          >
                            {val?.isVariation
                              ? `${qtyInStock(val)} - variation`
                              : val?.inventoryType === "PIECES"
                              ? `${val.quantityInPieces ?? 0}`
                              : val?.inventoryType === "PACK"
                              ? `${val.quantityInPacks ?? 0} packs`
                              : val?.inventoryType === "PIECES_AND_PACK"
                              ? `${val.quantityInPieces ?? 0} pieces | ${
                                  val.quantityInPacks ?? 0
                                } packs`
                              : val?.inventoryType === "NON_TRACKABLE"
                              ? "∞"
                              : `${val.quantity ?? 0}`}
                          </span>
                        </CustomText>
                        <p
                          style={{
                            fontWeight: "500",
                            color: Colors.primaryColor,
                            marginRight: "0.5rem",
                          }}
                        >
                          {formatAmountIntl(val)}
                        </p>
                      </Flex>
                    </Flex>
                    <button style={{ cursor: "pointer" }}>
                      <CartIcon color={Colors.secondaryColor} />
                    </button>
                  </Item>
                );
              }
              return null;
            })}
          </>
        ) : (
          <>
            <Flex
              direction="column"
              justifyContent="center"
              margin="100px 0px 0 0"
              alignItems="center"
            >
              <Span margin="4px 0px" color={Colors.blackLight} fontSize="1.2rem" fontWeight="500">
                There are no products to display.
              </Span>
              {searchTextList[currentTab]?.search && (
                <Span color={Colors.grey} fontSize=".8rem">
                  No product match your filter "<b>{searchTextList[currentTab]?.search}</b>"
                </Span>
              )}
            </Flex>
          </>
        )}
      </ItemsContainer>
    </Flex>
  );
};

export default ProductsList;
