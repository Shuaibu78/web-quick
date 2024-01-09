/* eslint-disable quotes */
/* eslint-disable no-tabs */
import { IShop } from "./../../interfaces/shop.interface";
import { UsersAttr } from "./../../interfaces/user.interface";
import { IOrder, IOrderItems } from "./../../interfaces/order.interface";

import moment from "moment";
import { formatAmount } from "../format";
import { ISales, ISalesReceipt } from "../../interfaces/sales.interface";

export const getInvoiceTemplate = async (
  order: IOrder,
  user: UsersAttr,
  shop: IShop,
  pendingSales: ISalesReceipt
) => {
  const orderItems = order?.OrderItems || [];
  const { createdAt, comment } = order;
  const attendedBy = user?.fullName || "";
  const isOrderItem = orderItems?.length > 0;

  const generateInvoiceNumber = () => {
    const { shopName } = shop;
    const shortName = String(shopName).slice(0, 2);

    return `${shortName.toUpperCase()}-${Math.floor(
      (createdAt ? new Date(createdAt as Date).getTime() : new Date().getTime()) / 1000
    )}`;
  };

  const itemsList = orderItems?.map((item: IOrderItems) => {
    return `<tr>
              <td>${item.inventoryName}</td>
              <td>${formatAmount(item?.amountPerItem || 0)} x ${item.quantity}</td>
              <td class="align-right">${formatAmount(item.amount || 0)}</td>
             </tr>`;
  });

  const pendingitemsList = pendingSales?.Sales?.map((sale: ISales) => {
    const saleTotalAmount = Number(sale.amount || 0) * Number(sale.quantity);
    return `
		<tr>
			<td>${sale.inventoryName}</td>
			<td>${formatAmount(sale.amount || 0)} x ${sale.quantity || 0}</td>
			<td class="align-right">${formatAmount(saleTotalAmount)}</td>
		</tr>
	`;
  });

  const totalAmount = pendingSales?.Sales?.reduce(
    (sum: number, { amount, quantity }: ISales) => (sum += Number(amount) * Number(quantity)),
    0
  );

  const invoiceTemplate = `
	<html>
	<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		// eslint-disable-next-line no-tabs
		*, html, body {
			height: fit-content;;
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
	</style>
	</head>
	<body style="margin: 0;">
		<div class="header">
			<div class="title">${shop.shopName}</div>
			<div class="subTitle">${shop.shopAddress || ""}</div>
			<div>${shop.shopPhone || ""}</div>
		</div>
		<div class="serialNoAndDate">
			<div><span style="font-weight: bold">Invoice No: </span>${generateInvoiceNumber()}</div>
			<div><span style="font-weight: bold">Date: </span>${moment(createdAt).format(
        "DD/MM/YY hh:mmA"
      )}</div>
		</div>
		<div class="container">
			<table>
					<tr>
						<th>Item</th>
						<th>Price x Qty</th>
						<th class="align-right">Amount</th>
					</tr>
					${isOrderItem ? itemsList : pendingitemsList}
					<tr class="total">
					${
            isOrderItem
              ? `<td colspan="2">Total (${order?.paymentStatus})</td>`
              : '<td colspan="2">Total (UNPAID)</td>'
          }
						<td class="align-right">${
              isOrderItem ? formatAmount(order?.totalAmount) : formatAmount(totalAmount)
            }</td>
					</tr>
			</table>
			${
        comment && comment !== ""
          ? `
		  <div class='comment-box'><div class='comment - title'>Comment:
			<div>
		  		<div class='comment - detail'>
            		${comment} 
            	</div>
		   	</div>`
          : ""
      }
<br />
	<div style="font-weight: bold; font-size: 10.0.3125rem; margin-top: .5rem; margin-bottom: .25rem;"> Attended By: ${attendedBy} </div>
		<div class="footer" >
			<div class="subTitle" > Powered by Timart Biz App </div>
				<div style = "font-style: italic;;" > www.timart.com.ng </div>
					</div>
					</div>
					</body>
					</html>
						`;

  return invoiceTemplate;
};
