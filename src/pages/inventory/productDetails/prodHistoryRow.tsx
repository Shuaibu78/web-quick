import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import ChevRight from "../../../assets/chevRight.svg";
import { IProductHistoryRecord } from "../../../interfaces/inventory.interface";
import { formatDate, formatTime } from "../../../helper/date";
import { useState } from "react";

const ProductHistoryRow = ({
  record,
  isLastItem,
}: {
  record: IProductHistoryRecord;
  isLastItem: boolean;
}) => {
  console.log(record);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Flex margin="0.625rem 0px" justifyContent="space-between" height="3rem">
        <Flex
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          height="100%"
          padding="0.3125rem 0px"
        >
          <Text color={Colors.grey} fontSize="0.6rem">
            {formatDate(record.createdAt)}
          </Text>
          <Text color={Colors.grey} fontSize="0.6rem">
            {formatTime(record.createdAt)}
          </Text>
        </Flex>
        <Flex
          bg={Colors.tabBg}
          height="3rem"
          width="80%"
          borderRadius="0.75rem"
          alignItems="center"
          justifyContent="space-between"
          padding="0.625rem"
        >
          <Flex direction="column" alignItems="start" justifyContent="center" gap="8px" width="33%">
            <Text color={Colors.darkGreen} fontSize="0.6rem">
              {record.displayType}
            </Text>
            <Text color={Colors.blackLight} fontSize="0.6rem">
              {record?.User?.fullName}
            </Text>
          </Flex>
          <Flex
            style={{ transform: `${showDetails ? "rotate(270)" : "rotate(90deg)"}` }}
            width=".8rem"
            height="33%"
            alignItems="flex-end"
            alignSelf="flex-end"
            cursor="pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            <img width="100%" height="100%" src={ChevRight} alt="" />
          </Flex>
          <Text
            color={Colors.blackLight}
            fontSize="0.8rem"
            width="33%"
            style={{ textAlign: "right" }}
          >
            Total: <b>{record.newValue}</b>
          </Text>
        </Flex>
      </Flex>

      <Flex
        style={{ display: isLastItem ? "none" : "flex" }}
        bg="transparent"
        margin="-4px 0 0 0"
        padding="0px 1.25rem"
        justifyContent="flex-start"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4"
          height="22"
          viewBox="0 0 4 22"
          fill="none"
        >
          <circle cx="2" cy="2" r="2" fill="#607087" />
          <circle cx="2" cy="11" r="2" fill="#607087" />
          <circle cx="2" cy="20" r="2" fill="#607087" />
        </svg>
      </Flex>
    </>
  );
};

export default ProductHistoryRow;
