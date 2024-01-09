import React, { FunctionComponent, useState } from "react";
import { CardDetails, Entry } from "./style";
import documentIcon from "../../assets/Document.svg";
import Me from "../../assets/Profile-Img.png";
import { PreReceiptContainer } from "../receipt/style";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import CustomDropdown from "../custom-dropdown/custom-dropdown";
import dropIcon from "../../assets/dropIcon2.svg";
import Calender from "../../assets/Calendar.svg";
import Ellipses from "../../assets/ellipses.svg";
import { Colors, FontSizes } from "../../GlobalStyles/theme";
import { IInventoryHistory } from "../../interfaces/inventory.interface";
import { formatAmountIntl } from "../../helper/format";

const { blackLight, primaryColor, darkGreen, red, white } = Colors;
const { descriptionFontSize } = FontSizes;

interface CardProps {
  showReceipt: boolean;
  historyData: IInventoryHistory;
}

const AdjumentCard: FunctionComponent<CardProps> = ({ showReceipt, historyData }) => {
  const dateOptions = ["All-Time", "Testing 1"];
  const historyOptions = ["All history", "Restock", "Damaged", "Sold", "Lost", "Sales"];
  const [selectedDate, setSelectedDate] = useState(0);
  const [expand, setExpand] = useState<boolean>(false);
  const [index, setIndex] = useState<number | undefined>(undefined);

  const myArray = [
    { type: "Income", comment: "Lorem ipsum dolor sit amet consectetur." },
    { type: "expenditure", comment: "Lorem ipsum dolor sit amet consectetur." },
    { type: "Income", comment: "Lorem ipsum dolor sit amet consectetur." },
  ];
  return (
    <>
      {!showReceipt && (
        <PreReceiptContainer>
          <img src={documentIcon} alt="" />
          <h3>View Adjustment Details</h3>
          <p>Click on a history on the left panel to view the details here.</p>
        </PreReceiptContainer>
      )}
      {showReceipt && (
        <CardDetails>
          <Flex width="100%" alignItems="center" justifyContent="space-between">
            <h3>Product Report</h3>
            <CustomDropdown
              boxShadow="0px 4px 1.875rem rgba(140, 157, 181, 0.06)"
              width="9.375rem"
              height="1.875rem"
              fontSize="0.875rem"
              borderRadius="0.75rem"
              containerColor="#FFFFFF"
              color="#8196B3"
              selected={selectedDate}
              setValue={setSelectedDate}
              options={dateOptions}
              dropdownIcon={dropIcon}
              icon={Calender}
              margin="0px"
              padding="0px"
            />
          </Flex>
          <div className="flex profile-container">
            <div className="product-img">
              <img src={Me} alt="" />
            </div>
            <div className="product-detail-cont">
              <p>{historyData.inventoryName}</p>
              <div className="detail">
                <p className="sold">{historyData.adjustmentQuantity} Adjusted</p>
                <p className="p2">{} in Stock</p>
              </div>
            </div>
          </div>
          <Flex
            bg="#dde2e9"
            borderRadius="0.625rem"
            width="100%"
            padding="1rem"
            justifyContent="space-between"
          >
            <Flex alignItems="center" direction="column">
              <Span fontSize="0.75rem" fontWeight="500" color={blackLight}>
                Total Sales
              </Span>
              <Span fontSize="0.875rem" fontWeight="600" color={primaryColor}>
                {formatAmountIntl(undefined, 23000)}
              </Span>
            </Flex>
            <Flex alignItems="center" direction="column">
              <Span fontSize="0.75rem" fontWeight="500" color={blackLight}>
                Profit made
              </Span>
              <Span fontSize="0.875rem" fontWeight="600" color={darkGreen}>
                {formatAmountIntl(undefined, 23000)}
              </Span>
            </Flex>
            <Flex alignItems="center" direction="column">
              <Span fontSize="0.75rem" fontWeight="500" color={blackLight}>
                Damaged
              </Span>
              <Span fontSize="0.875rem" fontWeight="600" color={red}>
                {formatAmountIntl(undefined, 23000)}
              </Span>
            </Flex>
          </Flex>
          <Flex width="100%" alignItems="center" justifyContent="space-between" margin="1rem 0">
            <h3>History</h3>
            <CustomDropdown
              boxShadow="0px 4px 1.875rem rgba(140, 157, 181, 0.06)"
              width="9.375rem"
              label="History"
              height="1.875rem"
              fontSize="0.875rem"
              borderRadius="0.75rem"
              containerColor="#FFFFFF"
              color="#8196B3"
              selected={selectedDate}
              setValue={setSelectedDate}
              options={historyOptions}
              dropdownIcon={dropIcon}
              margin="0px"
              padding="0px"
            />
          </Flex>
          {myArray.map((entry, i) => {
            return (
              <Entry expand={index === i && expand} key={i}>
                <Flex
                  alignItems="center"
                  justifyContent="flex-start"
                  width=" 100%"
                  direction="column"
                >
                  <Flex alignItems="center" justifyContent="flex-start" width="100%">
                    <Flex alignItems="center" width="20%" direction="column" gap="0.625rem">
                      <Span color={blackLight} fontSize={descriptionFontSize} fontWeight="600">
                        12 Jan 2021
                      </Span>
                      <Span color={blackLight} fontSize={descriptionFontSize} fontWeight="600">
                        09:32am
                      </Span>
                    </Flex>

                    <Flex
                      alignItems="center"
                      width="80%"
                      bg={white}
                      borderRadius="0.875rem"
                      padding="1rem"
                      justifyContent="space-between"
                      cursor="pointer"
                      onClick={() => {
                        setExpand(!expand);
                        setIndex(i);
                      }}
                    >
                      <Flex
                        alignItems="start"
                        justifyContent="space-between"
                        direction="column"
                        height="100%"
                        gap="0.625rem"
                      >
                        <Span color={darkGreen} fontSize={descriptionFontSize} fontWeight="600">
                          Qty Added: {"   "}(10)
                        </Span>
                        <Span color={blackLight} fontSize={descriptionFontSize} fontWeight="600">
                          Sales Person 1
                        </Span>
                      </Flex>
                      <Flex alignItems="center" justifyContent="space-between">
                        <Span color={blackLight} fontSize={descriptionFontSize} fontWeight="600">
                          Qty left:{"   "}
                        </Span>
                        <Span color={blackLight} fontSize={descriptionFontSize} fontWeight="600">
                          (6)
                        </Span>
                      </Flex>
                    </Flex>
                    {expand && index === i && (
                      <div className="expand-details">
                        <Span color={red} fontWeight="600">
                          {entry.type}
                        </Span>
                        <Span color={blackLight} fontWeight="600">
                          Comments
                        </Span>
                        <Span color={blackLight}>{entry.comment}</Span>
                      </div>
                    )}
                  </Flex>
                  <img className="expand" src={dropIcon} alt="" />
                </Flex>
                <div className="ellipses">
                  <img src={Ellipses} alt="ellipses" />
                </div>
              </Entry>
            );
          })}
        </CardDetails>
      )}
    </>
  );
};

export default AdjumentCard;
