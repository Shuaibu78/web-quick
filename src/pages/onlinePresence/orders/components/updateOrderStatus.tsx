import { Box, DarkText, Flex } from "../../style.onlinePresence";
import { useAppSelector } from "../../../../app/hooks";
import { getCurrentShop } from "../../../../app/slices/shops";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { IStep, UpdateOrderStatusProps } from "../../../../interfaces/order.interface";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "../../../../components/button/Button";
import { RadioLabel } from "../../../sales/new-sales/styles";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { ModalContainer } from "../../../settings/style";
import Cancel from "../../../../assets/cancel.svg";
import { Colors } from "./../../../../GlobalStyles/theme";
import { GET_SHOP_STEPS, UPDATE_ORDER_STATUS } from "../../../../schema/orders.schema";

export default function UpdateOrderStep({
  orderItemIds,
  showUpdateOrderStep,
  closeModal,
  triggerRefetch,
}: UpdateOrderStatusProps) {
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useDispatch();

  const [selectedStepId, setSelectedStepId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: shopStepsData } = useQuery<{ getShopSteps: IStep[] }>(GET_SHOP_STEPS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "cache-first",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted() {
      triggerRefetch();
    },
  });

  useEffect(() => {
    return () => setSelectedStepId("");
  }, [closeModal]);

  const handleUpdateOrderStatus = async () => {
    setIsLoading(true);

    updateStatus({
      variables: {
        shopId: currentShop?.shopId,
        orderItemIds,
        stepId: selectedStepId,
      },
    })
      .then((res) => {
        if (res.data) {
          const updated = res.data.updateOrderItemStep?.successful;
          setIsLoading(false);
          if (updated) {
            dispatch(toggleSnackbarOpen("Successful"));
          }
          // refetch();
          closeModal();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  return showUpdateOrderStep ? (
    <ModalContainer>
      <Box
        h="max-content"
        minW="18.75rem"
        w="max-content"
        p="1rem"
        bgColor="#fff"
        borderRadius="0.75rem"
      >
        <Box w="100%" display="flex" justifyContent="space-between" p="0.625rem auto">
          <DarkText fontSize="1.2rem">Update Status</DarkText>
          <img src={Cancel} alt="close modal" onClick={closeModal} style={{ cursor: "pointer" }} />
        </Box>
        <Box mt="1rem">
          {Number(shopStepsData?.getShopSteps?.length) > 0 &&
            shopStepsData?.getShopSteps?.map(({ stepId, stepName }, idx) => (
              <Flex direction="column" my="0.625rem" key={idx}>
                <RadioLabel
                  htmlFor={`${stepName}`}
                  onClick={() => setSelectedStepId(stepId as string)}
                  isActive={selectedStepId === stepId}
                  style={{ marginRight: "1.125rem" }}
                >
                  <span>
                    <span></span>
                  </span>
                  {String(stepName).replace(/[_]/, " ")}
                </RadioLabel>
                <input type="radio" name={`${stepName}`} id={`${stepName}`} hidden />
              </Flex>
            ))}

          <Flex mt="1.5625rem" w="100%" justifyContent="center">
            <Button
              label={isLoading ? "Updating..." : "Save"}
              disabled={isLoading}
              onClick={() => handleUpdateOrderStatus()}
              backgroundColor={Colors.primaryColor}
              size="sm"
              fontSize="0.875rem"
              borderRadius="9px"
              height="2rem"
              width="60%"
              color="#fff"
              borderColor="transparent"
              borderSize="0px"
            />
          </Flex>
        </Box>
      </Box>
    </ModalContainer>
  ) : null;
}
