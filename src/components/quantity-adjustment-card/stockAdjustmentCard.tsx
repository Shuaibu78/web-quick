import React, { FunctionComponent } from "react";
import { CardDetails } from "./stockStyle";
import documentIcon from "../../assets/Document.svg";
import Me from "../../assets/Profile-Img.png";
import { PreReceiptContainer } from "../receipt/style";
import { Flex } from "../../GlobalStyles/CustomizableGlobal.style";
import { IInventoryHistory } from "../../interfaces/inventory.interface";
import formatRelative from "date-fns/formatRelative";
import { parseISO } from "date-fns";
import { Hr } from "../../pages/inventory/adjustment-product/style";
import { useAppSelector } from "../../app/hooks";
import { formatAmountIntl } from "../../helper/format";

interface CardProps {
  showReceipt: boolean;
  historyData: IInventoryHistory;
}

const StockAdjumentCard: FunctionComponent<CardProps> = ({ showReceipt, historyData }) => {
  const { user } = useAppSelector((state) => state);
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
            <h3>Stock Adjsutment Details</h3>
            <div>
              <p>{formatRelative(parseISO(historyData?.createdAt!), new Date())}</p>
            </div>
          </Flex>
          <div className="flex profile-container">
            <div className="profile-img">
              <img src={Me} alt="" />
            </div>
            <div>
              <p className="p2">Adjusted By:</p>
              <p>{user?.fullName}</p>
            </div>
          </div>
          <Hr />
          <div className="flex">
            <div className="label-items-container">
              <p>Product Name</p>
              <p>Reason For Adjustment</p>
              <p>Inventory Type</p>
              <p>Quantity Adjusted</p>
              <p>Cost Per Item</p>
              <p>Selling Price Per Item</p>
              <p>Comment</p>
            </div>
            <div className="items-container">
              <p>{historyData?.inventoryName}</p>
              <p>{historyData?.reason}</p>
              <p>{historyData?.inventoryType}</p>
              <p>{historyData.adjustmentQuantity}</p>
              <p>{formatAmountIntl(undefined, Number(historyData?.unitCost))}</p>
              <p>{formatAmountIntl(undefined, Number(historyData?.price))}</p>
              <p>
                {historyData?.notes && historyData?.notes?.length > 1
                  ? historyData?.notes
                  : "-----"}
              </p>
            </div>
          </div>
        </CardDetails>
      )}
    </>
  );
};

export default StockAdjumentCard;
