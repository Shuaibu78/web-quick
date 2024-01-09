import React from "react";
import { IBatch } from "../../../interfaces/batch.interface";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { BatchItem, TextBold } from "./styles";
import ChevRight from "../../../assets/chevRight.svg";
import { Colors } from "../../../GlobalStyles/theme";
import moment from "moment";
import { IsearList } from "./new-sales";

interface IBatchList {
  batches: IBatch[];
  setSelectedBatchNo: Function;
  navbarHeight?: number;
  searchTextList: IsearList;
  currentTab: string;
  setPage: Function;
}

const BatchList: React.FC<IBatchList> = ({
  batches,
  setSelectedBatchNo,
  navbarHeight,
  searchTextList,
  currentTab,
  setPage,
}) => {
  if (batches.length < 1 && searchTextList[currentTab]?.search) {
    return (
      <Flex width="100%" alignItems="center" justifyContent="center" padding="1em">
        <TextBold style={{ margin: "15px 0" }}>
          No Results found for{" "}
          <span style={{ color: Colors.secondaryColor }}>
            “{searchTextList[currentTab]?.search}”
          </span>
        </TextBold>
      </Flex>
    );
  }

  if (batches.length < 1) {
    return (
      <Flex width="100%" alignItems="center" justifyContent="center" padding="1em">
        <TextBold style={{ margin: "15px 0" }}>
          <Span margin="4px 0px" color={Colors.blackLight} fontSize="1.2rem" fontWeight="500">
            There are no batches to display.
          </Span>
        </TextBold>
      </Flex>
    );
  }

  return (
    <Flex
      width="100%"
      direction="column"
      style={{ height: `calc(80vh - ${navbarHeight! + 10}px)`, overflowY: "scroll" }}
    >
      {batches.map((batch) => {
        const targetDate = moment(batch?.expiryDate);
        const today = moment();
        const remainingDays = targetDate.diff(today, "days");

        return (
          <BatchItem
            key={batch.batchId}
            onClick={() => {
              setSelectedBatchNo(batch.batchNumber);
              setPage(1);
            }}
          >
            <div className="top-row">
              <Span color={Colors.primaryColor} fontSize="1.2em" fontWeight="700">
                {batch.batchNumber}
              </Span>
              <div className="img">
                <img src={ChevRight} alt="" />
              </div>
            </div>
            <div className="bottom-row">
              <Span color={Colors.blackLight}>
                <em>Date Added: {moment(batch.dateAdded).format("Do MMM YYYY")}</em>
              </Span>
              <Flex alignItems="center" gap="5px">
                <Span color={Colors.blackLight}>Expires in:</Span>
                <Span fontWeight="600" color={Colors.red}>
                  {remainingDays} {remainingDays > 1 ? "days" : "day"}
                </Span>
              </Flex>
            </div>
          </BatchItem>
        );
      })}
    </Flex>
  );
};

export default BatchList;
