import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { SubPageContainer } from "../style";
import { Box, DarkText } from "../../onlinePresence/style.onlinePresence";
import { Button } from "../../../components/button/Button";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import {
  GET_SHOP_OFFLINE_ORDER_STATUS,
  UPDATE_SHOP_OFFLINE_ORDER_STATUS,
} from "../../../schema/orders.schema";
import { syncTotalTableCount } from "../../../helper/comparisons";
import CustomConfirm from "../../../components/confirmComponent/cofirmComponent";

export default function OfflineOrderSettingsView() {
  const currentShop = useAppSelector(getCurrentShop);
  const [isActive, setIsActive] = useState(false);
  const dispatch = useDispatch();

  const updateOnSync = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["Shops"])
  );

  const keyword = isActive ? "Disable" : "Enable";

  const { refetch, loading: isLoadingStatus } = useQuery<{
    getShopOfflineOrderStatus: boolean;
  }>(GET_SHOP_OFFLINE_ORDER_STATUS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onCompleted(result) {
      setIsActive(result?.getShopOfflineOrderStatus);
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [updateStatus] = useMutation(UPDATE_SHOP_OFFLINE_ORDER_STATUS, {
    variables: {
      shopId: currentShop?.shopId,
      status: !isActive,
    },
    onCompleted() {
      dispatch(toggleSnackbarOpen(`Offline order ${keyword}d for (${currentShop?.shopName})`));
      refetch();
    },
  });

  useEffect(() => {
    refetch();
  }, [currentShop, updateOnSync]);

  const handleActiveOfflineOrder = async () => {
    await CustomConfirm(
      `Are you sure you want to ${keyword} offline order for (${currentShop?.shopName})`
    );

    updateStatus();
  };

  return (
    <SubPageContainer>
      <h2>Offline order setting for ({currentShop?.shopName})</h2>
      <Box m="1rem auto .5rem">
        <Button
          label={`${keyword} offline order`}
          onClick={handleActiveOfflineOrder}
          disabled={isLoadingStatus}
          backgroundColor="#607087"
          size="lg"
          color="#fff"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="12.5rem"
        />
      </Box>
      <DarkText fontWeight="600">
        If active, all sales will now go through an order process before completion.
      </DarkText>
    </SubPageContainer>
  );
}
