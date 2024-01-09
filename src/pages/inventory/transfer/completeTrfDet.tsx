import { Dispatch, FC, SetStateAction } from "react";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { CancelButton } from "../../sales/style";
import Cancel from "../../../assets/cancel.svg";
import Img from "../../../assets/ProductOnline.svg";
import SearchInput from "../../../components/search-input/search-input";
import { TrfHeader } from "../style";
import { InventoryTransferAttr } from "../../../schema/productTransfer.schema";
import { formatDate } from "../../../helper/date";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";

interface ReviewProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  data: InventoryTransferAttr[];
}

const CompleteTransferDetail: FC<ReviewProps> = ({ setShowModal, data }) => {
  const currentShop = useAppSelector(getCurrentShop);

  return (
    <>
      <Flex
        direction="column"
        position="relative"
        margin="0.625rem 0px"
        height="96%"
        style={{ minWidth: "28rem", maxWidth: "28rem" }}
      >
        <Flex padding="0 0.9rem" direction="column">
          <Flex alignItems="center" justifyContent="space-between">
            <h3>
              {currentShop.shopId === data[0]?.FromShop.shopId
                ? data[0]?.ToShop.shopName
                : data[0]?.FromShop.shopName}
            </h3>
            <CancelButton
              style={{
                width: "1.875rem",
                height: "1.875rem",
                display: "grid",
                placeItems: "center",
              }}
              hover
              onClick={() => setShowModal(false)}
            >
              <img src={Cancel} alt="" />
            </CancelButton>
          </Flex>

          <Flex margin="1.5rem 0">
            <SearchInput
              placeholder="Search"
              borderRadius="0.5rem"
              height="44px"
              width="100%"
              fontSize="0.875rem"
              handleSearch={function (search: string): void {
                throw new Error("Function not implemented." + search);
              }}
            />
          </Flex>

          <>
            {data.map((val, i) => (
              <Flex
                key={i}
                justifyContent="space-between"
                margin="0.4rem 0"
                padding="0.2rem 0"
                style={{ borderBottom: `1px solid ${Colors.borderGreyColor}` }}
              >
                <Flex gap="0 0.5rem" alignItems="center" color={Colors.blackLight}>
                  <div style={{ width: "1.5rem" }}>
                    <img src={Img} width="inherit" alt="removeIcon" />
                  </div>
                  <TrfHeader>
                    <p className="black">{val.FromInventory.inventoryName}</p>
                    <p className="small">
                      {val.status} {val.quantity} pieces
                    </p>
                  </TrfHeader>
                </Flex>
                <Flex alignItems="flex-end">
                  <p style={{ fontSize: "0.75rem", color: Colors.grey }}>
                    {formatDate(val.createdAt)}
                  </p>
                </Flex>
              </Flex>
            ))}
          </>
        </Flex>
      </Flex>
    </>
  );
};

export default CompleteTransferDetail;
