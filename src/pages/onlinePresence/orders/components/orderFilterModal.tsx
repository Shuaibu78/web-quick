import {
  FilterDropdown,
  FilterItem,
  FilterModal,
  FilterModalContainer,
  ProductFilterCard,
  ResultContainer,
  SelectionList,
} from "../../../sales/style";
import { Flex } from "../../style.onlinePresence";
import CancelIcon from "../../../../assets/cancel.svg";
import RoundCancelIcon from "../../../../assets/r-cancel.svg";
import CustomDropdown from "../../../../components/custom-dropdown/custom-dropdown";
import dropIcon2 from "../../../../assets/dropIcon2.svg";
import { Button } from "../../../../components/button/Button";
import { PaymentStatus } from "../utils.orders";
import _ from "lodash";
import { ITag } from "../../../../interfaces/order.interface";

interface OrderFilterModalProps {
  showFilterModal: boolean;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  displayAllTags: boolean;
  setDisplayAllTags: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPaymentStatusIdx: number;
  setSelectedPaymentStatusIdx: React.Dispatch<React.SetStateAction<number>>;
  selectedTagsList: ITag[];
  setSearchTagsQuery: React.Dispatch<React.SetStateAction<string>>;
  AllShopTags: ITag[];
  handleClearFilter: () => void;
  handleAddToTagsFilter: (tag: ITag) => void;
  handleRemoveFromTagsFilter: (tag: ITag) => void;
}

function OrderFilterModal({
  showFilterModal,
  setShowFilterModal,
  displayAllTags,
  setDisplayAllTags,
  selectedPaymentStatusIdx,
  setSelectedPaymentStatusIdx,
  selectedTagsList,
  setSearchTagsQuery,
  AllShopTags = [],
  handleClearFilter,
  handleAddToTagsFilter,
  handleRemoveFromTagsFilter,
}: OrderFilterModalProps) {
  return (
    <FilterModalContainer>
      <FilterModal>
        <Flex pb="1.25rem" alignItems="center">
          <button id="cancel-btn" onClick={() => setShowFilterModal(false)}>
            <img src={CancelIcon} alt="" />
          </button>
          <h3>Orders Filter</h3>
        </Flex>
        {!displayAllTags && (
          <>
            <label>Filter by Tags</label>
            <FilterDropdown onClick={() => setDisplayAllTags(true)}>
              <SelectionList>
                {selectedTagsList.map((tag, i) => (
                  <FilterItem key={i}>
                    <button onClick={() => handleRemoveFromTagsFilter(tag)}>
                      <img src={RoundCancelIcon} alt="" />
                    </button>
                    <span>{tag?.tagName}</span>
                  </FilterItem>
                ))}
              </SelectionList>
              <button id="dropdown" onClick={() => setDisplayAllTags(true)}>
                <img src={dropIcon2} alt="" />
              </button>
            </FilterDropdown>
            <label>Filter by payment status</label>
            <CustomDropdown
              width="100%"
              height="2.5rem"
              fontSize="0.875rem"
              borderRadius="0.75rem"
              containerColor="#F4F6F9"
              color="#8196B3"
              selected={selectedPaymentStatusIdx}
              setValue={setSelectedPaymentStatusIdx}
              options={PaymentStatus}
              dropdownIcon={dropIcon2}
              placeholder="-:Select payment status:-"
              margin="0"
              padding="0.625rem 0.625rem"
            />

            <Button
              label="Clear all Selection"
              onClick={handleClearFilter}
              backgroundColor="#607087"
              size="md"
              color="#fff"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="0.875rem"
              width="100%"
              height="2.5rem"
              margin="0.75rem auto 4px"
            />
          </>
        )}
        {displayAllTags && (
          <>
            <input
              placeholder="Search products"
              style={{
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                height: "2.5rem",
                width: "100%",
                background: "#f4f6f9",
                paddingInline: "0.625rem",
              }}
              type="text"
              name=""
              onChange={_.debounce(
                ({ target }: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTagsQuery(target.value),
                400
              )}
            />
            <button
              style={{
                marginTop: "1.25rem",
                fontSize: "1rem",
                color: "white",
                padding: "6px 0.625rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#ffbe62",
                cursor: "pointer",
              }}
              onClick={() => setDisplayAllTags(false)}
            >
              back
            </button>
            <ResultContainer>
              {AllShopTags?.map((tag, idx) => (
                <ProductFilterCard
                  key={idx}
                  onClick={() => handleAddToTagsFilter(tag)}
                  isActive={selectedTagsList.some((item) => item.tagId === tag.tagId)}
                >
                  <p>{tag.tagName}</p>
                </ProductFilterCard>
              ))}
            </ResultContainer>
          </>
        )}
      </FilterModal>
    </FilterModalContainer>
  );
}

export default OrderFilterModal;
