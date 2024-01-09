/* eslint-disable no-debugger */
import React, { FunctionComponent, useEffect, useState } from "react";
import arrowL from "../../../../assets/ArrowL.svg";
import arrowR from "../../../../assets/ArrowR.svg";
import MoreSquare from "../../../../assets/MoreSquare.svg";
import emptyImage from "../../../../assets/empty.svg";
import {
  CustomCont,
  SwitchLabel,
  SwitchInput,
  Slider,
  Table,
  THead,
  TBody,
  TRow,
  Td,
} from "./style";
import { PerPage, CurrentPage, JumpTo } from "../../../../pages/sales/style";
import { PageControl, DeleteContainer, ButtonContainer } from "../../../../pages/inventory/style";
import { Flex } from "../../../../components/receipt/style";
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_INVENTORY } from "../../../../schema/inventory.schema";
import { IInventory } from "../../../../interfaces/inventory.interface";
import { getCurrentShop } from "../../../../app/slices/shops";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { setSingleInventory } from "../../../../app/slices/inventory";
import { hasPermission } from "../../../../helper/comparisons";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import dropIcon2 from "../../../../assets/dropIcon2.svg";
import {
  getInventoryQuantity,
  getProductCostPrice,
  getProductSellingPrice,
  productValue,
} from "../../../../helper/inventory.helper";
import { getImageUrl } from "../../../../helper/image.helper";
import _ from "lodash";
import { Link } from "react-router-dom";
import { getUserPermissions } from "../../../../app/slices/roles";
import CustomDropdown from "../../../../components/custom-dropdown/custom-dropdown";
import { TEmpty } from "../../../home/style";
import { setIsEdit } from "../../../../app/slices/isEdit";
import { InView } from "react-intersection-observer";

type DynamicObject = {
  [key: string]: boolean;
};

const ProductViewList = ({
  inventoryList,
  productTotal,
  handleSearch,
  setPage,
  page,
  refetch,
  setPerPage,
  perPage,
  setTotalPages,
  totalPages,
  setSearch,
}: {
  inventoryList: IInventory[];
  productTotal: number;
  handleSearch: (val: string) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  refetch: () => void;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedRow, setSelectedRow] = useState<DynamicObject>({});
  const currentShop = useAppSelector(getCurrentShop);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const userPermissions = useAppSelector(getUserPermissions);
  const { user: userInfo } = useAppSelector((state) => state);
  const reduxSelector = useAppSelector((state) => state);
  const isMerchant = userInfo?.userId === reduxSelector?.shops?.currentShop?.userId;
  const shouldManageInventory = hasPermission("MANAGE_INVENTORY", userPermissions);

  useEffect(() => {
    setTotalPages(Math.ceil(productTotal / (isNaN(perPage) ? 8 : perPage)));
  }, [productTotal, perPage, setTotalPages]);

  const dispatch = useAppDispatch();

  const filterOptions = ["All Products", "Out of Stock", "Less Than 10", "In Stock"];

  const [updateInventory] = useMutation<{ updateInventory: IInventory }>(UPDATE_INVENTORY, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const changeProductStatus = (status: boolean, currentProduct: IInventory) => {
    updateInventory({
      variables: {
        inventoryId: currentProduct?.inventoryId,
        inventoryName: currentProduct?.inventoryName,
        shopId: currentProduct?.shopId,
        isActive: status,
      },
    })
      .then(() => {
        refetch();
      })
      .catch((error) => {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <Flex flexDirection="column" width="100%" height="100%">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        margin="1.25rem 0 0.625rem"
      >
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Flex justifyContent="right">
            <input
              placeholder="Search Inventory"
              style={{
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                height: "2.5rem",
                width: "12.5rem",
                background: "white",
                paddingInline: "0.625rem",
                marginRight: "0.625rem",
              }}
              type="text"
              name=""
              onChange={_.debounce(
                ({ target }: React.ChangeEvent<HTMLInputElement>) => setSearch(target.value),
                500
              )}
            />
            {/* <CustomDropdown
              width="12.5rem"
              label="Filter options"
              color="#8196B3"
              containerColor="#F4F6F9"
              borderRadius="0.75rem"
              height="45px"
              dropdownIcon={dropIcon2}
              options={filterOptions}
              setValue={setSelectedOption}
              fontSize="0.875rem"
              selected={selectedOption}
              margin="0 0 0.875rem 0"
              padding="0.625rem 1.25rem"
            /> */}
          </Flex>
        </Flex>
      </Flex>

      <Table width="900px">
        <THead fontSize="0.875rem" minWidth="100%">
          <Td width="3.75rem"></Td>
          <Td width="180px">
            <span>Product name</span>
          </Td>
          <Td width="115px">
            <span>Quantity</span>
          </Td>
          <Td width="105px">
            <span>Cost Price</span>
          </Td>
          <Td width="105px">
            <span>Selling Price</span>
          </Td>
          <Td width="105px">
            <span>Product Value</span>
          </Td>
          {(isMerchant || shouldManageInventory) && (
            <Td width="3.75rem">
              <span>Action</span>
            </Td>
          )}
        </THead>
        <TBody overflowY="visible">
          {inventoryList.map((val, i) => {
            return (
              <TRow background={(i + 1) % 2 ? "#F6F8FB" : ""} key={i}>
                <Td width="3.75rem">
                  <CustomCont imgHeight="100%">
                    <img src={getImageUrl(val?.Images)} alt="" />
                  </CustomCont>
                </Td>
                <Td width="180px">
                  <span style={{ textOverflow: "ellipsis" }}>
                    {val.inventoryName}
                    {val.isVariation && " - variation"}
                  </span>
                </Td>
                <Td
                  width="6.25rem"
                  color={getInventoryQuantity(val) === "Out of Stock" ? "red" : "currentColor"}
                >
                  <span
                    style={val?.inventoryType === "NON_TRACKABLE" ? { paddingLeft: "1.25rem" } : {}}
                  >
                    {val?.inventoryType === "NON_TRACKABLE" ? "∞" : getInventoryQuantity(val)}
                  </span>
                </Td>
                <Td width="105px">
                  <span>{getProductCostPrice(val)}</span>
                </Td>
                <Td width="105px">
                  <span>{getProductSellingPrice(val)}</span>
                </Td>
                <Td width="105px">
                  <span>
                    {val?.inventoryType !== "NON_TRACKABLE"
                      ? productValue(val)
                      : getProductSellingPrice(val)}
                  </span>
                </Td>
                <Td width="3.75rem" style={{ position: "relative" }} className="action-btn">
                  <SwitchLabel>
                    <SwitchInput
                      type="checkbox"
                      checked={val.isActive}
                      onChange={(e) => changeProductStatus(e.target.checked, val!)}
                    />
                    <Slider className="round"></Slider>
                  </SwitchLabel>
                </Td>
              </TRow>
            );
          })}
        </TBody>
      </Table>

      {inventoryList.length < 1 && (
        <TEmpty>
          <img src={emptyImage} alt="empty-img" />
          <h3>No Records to Show Yet</h3>
          <p>Start adding products to see them appear here.</p>
          <Link
            to="/dashboard/product/add"
            onClick={() => {
              dispatch(setSingleInventory({}));
              dispatch(setIsEdit(false));
            }}
          >
            Add Your First Product
          </Link>
        </TEmpty>
      )}

      {inventoryList.length > 0 && (
        <PageControl style={{ position: "static" }}>
          <PerPage>
            <p>Per page</p>
            <input
              type="number"
              placeholder="perPage"
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
            />
          </PerPage>
          <CurrentPage>
            <button style={{ opacity: `${page > 1 ? "1" : "0.4"}` }} onClick={handlePrevPage}>
              <img src={arrowL} alt="" />
            </button>
            <div>
              <p>
                <span>{page}</span> of {totalPages}
              </p>
            </div>
            <button
              onClick={handleNextPage}
              style={{ opacity: `${page === totalPages ? "0.4" : "1"}` }}
            >
              <img src={arrowR} alt="" />
            </button>
          </CurrentPage>
          <JumpTo>
            <p>Jump To</p>
            <div>
              <input
                type="number"
                max={totalPages}
                style={{
                  paddingInline: "6px 0.625rem",
                  paddingBlock: "6px",
                  border: "1px solid black",
                }}
                onChange={(e) => setPage(Math.min(totalPages, Number(e.target.value)))}
                placeholder="Page No."
              />
            </div>
          </JumpTo>
        </PageControl>
      )}
    </Flex>
  );
};

export default ProductViewList;
