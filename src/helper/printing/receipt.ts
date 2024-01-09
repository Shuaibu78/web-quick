/* eslint-disable quotes */
/* eslint-disable no-tabs */
/* eslint-disable indent */
import moment from "moment";
import { IReceipt } from "../../interfaces/receipt.interface";
import { formatAmount, getReceiptNumber, toNegativeNumber } from "../format";
import { IShop } from "../../interfaces/shop.interface";
import { isPositive } from "../../utils/helper.utils";

export const getReceiptTemplate = async (data: IReceipt, shop: IShop) => {
  const {
    User,
    Cashier,
    createdAt,
    Sales,
    totalDiscount,
    comment,
    customerName,
    totalTaxAmount,
    taxName,
    isTaxInclusive,
    totalAmount,
  } = data as IReceipt;
  const attendedBy = User?.fullName || "";
  const cashier = Cashier?.fullName || "";
  const onCredit = customerName !== null;
  const getTaxOnProduct = (price: number) => {
    const taxAmount = isTaxInclusive
      ? price * ((totalTaxAmount || 0) / ((totalAmount || 0) + totalDiscount))
      : 0;

    return parseFloat(taxAmount.toFixed(2));
  };

  const itemsList = Sales?.map((sale) => {
    const isPack = sale?.pack || false;
    const perPack = sale?.Inventory?.TrackableItem?.perPack || 0;
    const nameForPiecesAndPack = `${sale?.inventoryName} (${isPack ? "pack" : "pieces"})`;
    const isPiecesAndPack =
      sale?.Inventory?.inventoryType === "PIECES_AND_PACK"
        ? nameForPiecesAndPack
        : sale.inventoryName;
    const unitPrice = isPack
      ? Number((sale.amount! + sale.discount!) / (sale.quantity! / perPack!))
      : Number((sale.amount! + sale.discount!) / sale.quantity!);
    return `
		<tr class="trwidth">
			<td class="tdwidth">${isPiecesAndPack}</td>
			<td class="tdMiddle">${formatAmount(
        Number(Number(unitPrice - getTaxOnProduct(unitPrice)).toFixed(2))
      )} x ${isPack ? sale.quantity! / perPack! : sale.quantity}</td>
			<td class="align-right tdLast">${formatAmount(
        Number(
          Number(
            (sale.amount ?? 0) +
              (sale.discount || 0) -
              getTaxOnProduct((sale.amount ?? 0) + (sale.discount ?? 0))
          ).toFixed(2)
        )
      )}</td>
		</tr>
	`;
  });

  const getSubTotal = () => {
    return data?.version === 2
      ? (data?.totalTaxAmount as number) > 0 ||
        ((data?.totalDisplayedAmount as number) > 0 &&
          isPositive(data?.totalDiscount as number) === false)
        ? (data?.totalDisplayedAmount as number)
        : (data?.totalAmount as number) + (data?.totalDiscount as number)
      : (data?.totalAmount as number) + (data?.totalDiscount as number);
  };

  const receiptTemplate = `
	<html>
	<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		*, html, body {
			height: fit-content;
			font-family: Arial, Helvetica, sans-serif;
		}
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
			margin-top: .5rem;
			text-align: center;
			font-size: 0.625rem;
		}
		.total {
			font-weight: bold;
			padding-top: 1rem;
		}
		.totalCustomer {
			font-weight: bold;
			padding-top: 0.4rem;
		}
		.serialNoAndDate {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 0.6875rem;
			margin: .7rem 0;
		}
		.attendedBy {
			margin-top: .5rem;
			font-size: 0.6875rem;
		}
		.comment-box {
			display: flex;
			width: 100%;
			margin-top: .5rem;
			justify-content: start;
			font-size: 0.6875rem;
			margin-bottom: 1rem;
			word-wrap: break-word;
			flex-direction: column;
			align-items: flex-start;
			gap: .25rem;
		}
		.comment-title {
			font-weight: bold;
		}
		.trwidth, thead, tbody {
			width: 100%;
		}
		.tdwidth {
			width: 34%;
		}
		.tdMiddle {
			width: 32%;
		}
		.tdLast {
			width: 30%;
		}
	</style>
	</head>
	<body style="margin: 0;">
		<div class="header">
			<div class="title">${shop.shopName}</div>
			<div class="subTitle">${shop.shopAddress || ""}</div>
			<div>${shop.shopPhone || ""}</div>
		</div>
		<div class="serialNoAndDate">
			<div><span style="font-weight: bold">Receipt No: </span>${getReceiptNumber(data)}</div>
			<div><span style="font-weight: bold">Date: </span>${moment(createdAt).format(
        "DD/MM/YY hh:mmA"
      )}</div>
		</div>
		<div class="container">
			<table>
				<thead>
					<tr class="trwidth">
						<th class="tdwidth">Item</th>
						<th class="tdMiddle">Price x Qty</th>
						<th class="align-right tdLast">Amount</th>
					</tr>
				</thead>
				<tbody>
					${itemsList.join(" ")}
				</tbody>
				${
          (totalDiscount && totalDiscount > 0) || onCredit || taxName
            ? `<tr class="totalCustomer">
						<td colspan="2">Subtotal</td>
						<td class="align-right">${getSubTotal()}
            </td>
					</tr>`
            : ""
        }
					${
            totalDiscount && totalDiscount > 0
              ? '<tr class="total"><td colspan="2">Discount</td><td class="align-right">' +
                formatAmount(toNegativeNumber(totalDiscount)) +
                "</td></tr>"
              : ""
          }
		  ${
        taxName
          ? `
			<tr class="total">
				<td colspan="2">Tax ${taxName} (${isTaxInclusive ? "Inclusive" : "Exclusive"})</td>
				<td class="align-right">${formatAmount(totalTaxAmount)}</td>
			</tr>
			`
          : ""
      }
					<tr class="total">
						<td colspan="2">${onCredit ? "Amount Paid" : "Total"}</td>
						 <td class="align-right">${
               data.version === 1
                 ? formatAmount(data.totalAmount)
                 : formatAmount(data.totalAmount - data.creditAmount)
             }</td>
			 ${
         customerName || data.creditAmount
           ? `
			<tr class="total">
				<td colspan="2">Balance</td>
				<td class="align-right">${formatAmount(data.creditAmount)}</td>
			</tr>
			`
           : ""
       }
					${
            onCredit
              ? `<tr class="totalCustomer">
				<td colspan="2">CustomerName:</td>
			  	<td class="align-right">${customerName}</td>
              </tr>`
              : " "
          }
			</table>
			${
        comment && comment !== ""
          ? '<div class="comment-box"><div class="comment-title">Comment:</div><div class="comment-detail">' +
            comment +
            "</div></div>"
          : ""
      }
			<br />
			<div style="font-weight: bold; font-size: 10.0.3125rem; margin-top: .5rem; margin-bottom: .25rem;">Attended By: ${attendedBy}</div>
			<div style="font-weight: bold; font-size: 10.0.3125rem">Cashier: ${cashier}</div>
			<div class="footer">
				<div class="subTitle">Powered by Timart Biz App</div>
				<div style="font-style: italic;">www.timart.com.ng</div>
			</div>
		</div>
		</body>
		</html>
`;

  return receiptTemplate;
};
