import { UsersAttr } from "./../../interfaces/user.interface";
import { IOrder } from "./../../interfaces/order.interface";
/* eslint-disable no-tabs */
import { IReceipt } from "../../interfaces/receipt.interface";
import { IShop } from "../../interfaces/shop.interface";
import { getReceiptTemplate } from "./receipt";
import { getInvoiceTemplate } from "./invoice";
import { ISalesReceipt } from "../../interfaces/sales.interface";
import { rpcClient } from "../rpcClient";

interface Printer {
  name: string;
  displayName: string;
  description: string;
}

export const TEST_TEMPLATE: string = `
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  table {
    width: 100%;
    text-align: left;
    font-size: 0.75rem;
  }
  .align-right {
    text-align: right;
  }
  .header {
    text-align: center;
    margin-bottom: 1rem;
  }
  .title {
    font-size: 13px;
    font-weight: bold;
  }
  .subTitle {
    font-size: 0.625rem;
    padding: 0 1rem;
  }
  .footer {
    text-align: center;
    font-size: 0.625rem;
  }
  .total {
    font-weight: bold;
    padding-top: 1rem;
  }
  .serialNoAndDate {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.6875rem;
    margin: .7rem 0;
  }
  .cashier {
    margin-top: 1rem;
    font-size: 0.6875rem;
  }
</style>
</head>
<body style="margin: 0;">
  <div class="header">
    <div class="title">Timart Biz App</div>
    <div class="subTitle">White House Cafe, Behind Abdulsalam Garage, Tunga, Minna, Niger State.</div>
    <div>08012345678</div>
  </div>
  <div class="serialNoAndDate">
    <div><span style="font-weight: bold">Receipt No: </span>1633943141</div>
    <div><span style="font-weight: bold">Date: </span>11/10/21 10:05 AM</div>
  </div>
  <div class="container">
    <table>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th class="align-right">Amount</th>
        </tr>

        <tr>
          <td>
            Indomie
          </td>
          <td>
            4
          </td>
          <td class="align-right">
            N4,500
          </td>
        </tr>

        <tr>
          <td>
            Indomie Pack
          </td>
          <td>
            1
          </td>
          <td class="align-right">
            N53,500
          </td>
        </tr>
      </table>
		<div style="font-weight: bold; font-size: 10.0.3125rem">Attended By: Umar Sanda</div>
      <div class="footer">
        <div class="subTitle">Powered by Timart Biz App</div>
        <div style="font-style: italic;;">www.timart.com.ng</div>
      </div>
    </div>
</body>
</html>
`;

export const print = (PRINT_TEMPLATE: string = TEST_TEMPLATE) => {
  const printWindow = window.open(
    "",
    "_blank",
    "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=1, height=1, visible=none"
  );
  printWindow?.document.write(`${PRINT_TEMPLATE}`);
  printWindow?.window.print();
  printWindow?.close();
};

export const printReceiptV2 = (
  PRINT_TEMPLATE: string = TEST_TEMPLATE,
  printName: string = "Microsoft Print to PDF"
) => {
  (window as any).manager.send("perform-printing", { html: `${PRINT_TEMPLATE}`, name: printName });
};

export const getDefaultPrinter = async () => {
  try {
    const result = await rpcClient.request("getDefaultPrinter", {});
    if (!result) {
      return null;
    }
    return JSON.parse(result?.value) as Printer;
  } catch (error) {
    console.log(error);
  }
};

export const printReceipt = async (receipt: IReceipt, shop: IShop) => {
  const receiptTemplate = (await getReceiptTemplate(receipt, shop)) || TEST_TEMPLATE;
  const printerName = (await getDefaultPrinter())?.name;
  printReceiptV2(receiptTemplate, printerName);
};

export const printInvoice = async (
  invoice: IOrder,
  currentUser: UsersAttr,
  currentShop: IShop,
  pendingSales: ISalesReceipt = {} as ISalesReceipt
) => {
  const invoiceTemplate = await getInvoiceTemplate(invoice, currentUser, currentShop, pendingSales);
  const printerName = (await getDefaultPrinter())?.name;
  printReceiptV2(invoiceTemplate, printerName);
};
