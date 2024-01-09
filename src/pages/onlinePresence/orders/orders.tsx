import { useEffect, useState } from "react";
import { useAppSelector, useCurrentShop } from "../../../app/hooks";
import { syncTotalTableCount } from "../../../helper/comparisons";
import { IOrder } from "../../../interfaces/order.interface";
import { useLocation } from "react-router-dom";
import { Box, Flex } from "../style.onlinePresence";
import OrderDetails from "./orderDetails";
import OrdersView from "./ordersView";

interface LocationState {
  orderId?: string;
}

function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [itemList, setItemList] = useState<IOrder[]>([]);
  const currentShop = useCurrentShop();
  const location = useLocation();

  const [updateOnSyncCount, setUpdateOnSyncCount] = useState(0);

  useEffect(() => {
    setSelectedOrderId(null);
  }, [currentShop]);

  useEffect(() => {
    // type cast state to avoid ts error
    const state = location?.state as LocationState ?? {};
    const orderId = state.orderId;
    if (orderId) {
      setSelectedOrderId(orderId);
    }
  }, []);

  const triggerRefetch = () => {
    setUpdateCount((count) => count + 1);
  };

  const updateOrdersView = (latest: IOrder = {}, type = "UPDATE") => {
    const orderId = latest?.orderId;
    if (!orderId) return;

    const idx = itemList.findIndex((item) => item.orderId === orderId);
    if (idx < 0) return;

    let newList: IOrder[] = [];

    if (type === "DELETE") {
      newList = itemList.filter((item) => item.orderId !== orderId);
    } else {
      newList = itemList.map((item, position) => {
        if (position === idx) {
          return { ...latest };
        }
        return item;
      });
    }

    setItemList([...newList]);
  };

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, [
      "Order",
      "OrderItems",
      "Steps",
      "Groups",
      "Group",
      "GroupCategories",
      "GroupSteps",
      "GroupUsers",
    ])
  );

  useEffect(() => setUpdateOnSyncCount((count) => count + 1), [syncTableUpdateCount]);

  return (
    <Flex w="100%" gap=".5rem">
      <OrdersView
        selectedOrderId={selectedOrderId}
        itemList={itemList}
        setItemList={setItemList}
        setSelectedOrderItemId={setSelectedOrderId}
        updateCount={updateCount}
        syncUpdateCount={updateOnSyncCount}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      />
      <Box size="80%" h="100%" p="0.625rem">
        <OrderDetails
          orderId={selectedOrderId}
          updateCount={updateCount}
          activeTabIndex={activeTabIndex}
          triggerRefetch={triggerRefetch}
          updateOrdersView={updateOrdersView}
        />
      </Box>
    </Flex>
  );
}

export default OrdersPage;
