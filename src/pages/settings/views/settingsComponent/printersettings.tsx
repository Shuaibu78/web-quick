import { Button, Flex } from "../../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../../GlobalStyles/theme";
import { SubCardSelector } from "../../../subscriptions/subscriptions.style";
import { BoxHeading, ButtonPlusIcon, ShopTitleCont } from "../../settingsComps.style";
import Printericon from "../../../../assets/PrinterSettingsIcon.svg";
import { useEffect, useState } from "react";
import { printReceiptV2, TEST_TEMPLATE } from "../../../../helper/printing";
import Delete from "../../../../assets/LeaveShopALteColor.svg";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { useAppSelector } from "../../../../app/hooks";
import { syncTotalTableCount } from "../../../../helper/comparisons";
import { rpcClient } from "../../../../helper/rpcClient";
import CustomRadioInputWrapper from "../../../../components/customRadioInput/radioInputWrapper";
import { isLoading } from "../../../../app/slices/status";
import { getCurrentShop, increaseSyncCount } from "../../../../app/slices/shops";

interface Printer {
  name: string;
  displayName: string;
  description: string;
}

const PrinterSettings = () => {
  const [printers, setPrinters] = useState<any>([]);
  const [settingsId, setSettingsId] = useState<string | undefined>(undefined);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [autoPrinterCheck, setAutoPrinterCheck] = useState<boolean>(false);
  const [autoPrinterOrder, setAutoPrinterOrder] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const dispatch = useDispatch();
  const currentShop = useAppSelector(getCurrentShop);

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["Settings"])
  );

  const handleTestPrint = () => {
    printReceiptV2(TEST_TEMPLATE, selectedPrinter?.name);
  };

  const handlePrinterSelect = (printer: Printer) => {
    setSelectedPrinter(printer);
  };

  useEffect(() => {
    (async () => {
      try {
        dispatch(isLoading(true));
        const result = await rpcClient.request("getDefaultPrinter", {});
        if (result) {
          setSettingsId(result?.settingsId);
          handlePrinterSelect(JSON.parse(result?.value));
          setAutoPrinterCheck(JSON.parse(result?.value)?.autoPrintOnCheckout);
          setAutoPrinterOrder(JSON.parse(result?.value)?.autoPrintOnOrder);
          setRefetch(false);
          dispatch(isLoading(false));
        } else {
          dispatch(isLoading(false));
        }
      } catch (error) {
        console.log(error);
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error));
      }
    })();
  }, [refetch, syncTableUpdateCount]);

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).manager?.send("get-printers");
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).manager?.receive("send-printers", (_event, value) => {
      setPrinters(value);
    });
  }, []);

  const handleUpdateDefaultPrinter = async () => {
    dispatch(isLoading(true));
    try {
      const updatedPrinter = {
        ...selectedPrinter,
        autoPrintOnOrder: settingsId ? autoPrinterOrder : false,
        autoPrintOnCheckout: settingsId ? autoPrinterCheck : true,
      };

      const result = await rpcClient.request("saveDefaultPrinter", {
        settingsId,
        printerObj: JSON.stringify(updatedPrinter),
        shopId: currentShop?.shopId,
      });

      setRefetch(true);

      if (result) {
        dispatch(isLoading(false));
        dispatch(increaseSyncCount(["Settings"]));
        dispatch(toggleSnackbarOpen("Default printer is set successfully."));
      } else {
        dispatch(isLoading(false));
      }
    } catch (error) {
      dispatch(isLoading(false));
      console.log(error);
      // dispatch(toggleSnackbarOpen(error));
    }
  };

  const handleUpdatePrintOnCheckout = async (shouldAutoPrint: boolean, isOrder: boolean) => {
    try {
      if (!selectedPrinter) {
        dispatch(toggleSnackbarOpen("No printer selected"));
        return;
      }

      if (isOrder) {
        setAutoPrinterOrder(shouldAutoPrint);
      } else {
        setAutoPrinterCheck(shouldAutoPrint);
      }

      const order = { ...selectedPrinter, autoPrintOnOrder: shouldAutoPrint };
      const checkout = { ...selectedPrinter, autoPrintOnCheckout: shouldAutoPrint };

      const updatedPrinter = isOrder ? order : checkout;
      const result = await rpcClient.request("saveDefaultPrinter", {
        settingsId,
        printerObj: JSON.stringify(updatedPrinter),
        shopId: currentShop?.shopId,
      });

      setRefetch(true);

      if (result) {
        setAutoPrinterCheck(JSON.parse(result?.value)?.autoPrintOnCheckout);
        setAutoPrinterOrder(JSON.parse(result?.value)?.autoPrintOnOrder);
        dispatch(toggleSnackbarOpen("Default printer updated successfully."));
      }
      dispatch(increaseSyncCount(["Settings"]));
    } catch (error) {
      console.error(error);
      // dispatch(toggleSnackbarOpen(error));
    }
  };

  const { primaryColor } = Colors;

  return (
    <>
      <Flex justifyContent="space-between">
        <BoxHeading>
          Printer Options
          <p>Add printers to your shop and set their configurations</p>
        </BoxHeading>
        <div
          style={{
            display: "flex",
            rowGap: "4px",
            justifyContent: "flex-end",
          }}
        >
          <Button
            borderRadius="0.5rem"
            padding="0.3125rem 0.625rem"
            height="2.1875rem !important"
            fontSize="0.8rem"
            width="9.375rem !important"
            backgroundColor={`${primaryColor} !important`}
            onClick={handleUpdateDefaultPrinter}
          >
            Save default printer
          </Button>
          <ButtonPlusIcon
            style={{
              fontSize: ".75rem",
              cursor: "pointer",
              border: `1px solid ${Colors.borderGreyColor}`,
            }}
            onClick={handleTestPrint}
            color={Colors.grey}
          >
            <img height=".875rem" src={Delete} alt="" />
            Test Print
          </ButtonPlusIcon>
        </div>
      </Flex>

      <Flex margin="0.625rem 0" flexWrap="wrap" style={{ columnGap: "1rem", maxWidth: "98%" }}>
        {printers.map((printer: Printer) => (
          <SubCardSelector
            checkedBg="#DBF9E8"
            height="11rem"
            width="9.625rem"
            checked={
              selectedPrinter === printer || selectedPrinter?.displayName === printer?.displayName
            }
            onClick={() => {
              setSelectedPrinter(printer);
            }}
            key={printer?.displayName}
          >
            <div style={{ width: "100%", margin: ".625rem .0625rem" }}>
              <Flex justifyContent="flex-end" width="100%">
                <div
                  style={{
                    width: "1.125rem",
                    height: "1.125rem",
                    border: selectedPrinter === printer ? "unset" : "1px solid #9EA8B7",
                    borderRadius: ".1875rem",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "1.125rem",
                      height: "1.125rem",
                      backgroundColor:
                        selectedPrinter === printer ||
                        selectedPrinter?.displayName === printer?.displayName
                          ? Colors.green
                          : "transparent",
                      borderRadius: ".1875rem",
                      color: Colors.white,
                      fontSize: ".75rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "500",
                    }}
                  >
                    ✓
                  </div>
                </div>
              </Flex>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  fontSize: ".9rem",
                }}
              >
                <img src={Printericon} alt="" />
                <p style={{ color: Colors.blackishBlue, marginTop: "1rem" }}>
                  {printer.displayName}
                </p>
              </div>
            </div>
          </SubCardSelector>
        ))}
      </Flex>

      <Flex
        border={`1px solid ${Colors.borderGreyColor}`}
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="100%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        <Flex
          width="100%"
          margin="0px 0 0.625rem 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <ShopTitleCont fontWeight="500" color={Colors.blackishBlue}>
            Additional Settings
          </ShopTitleCont>
        </Flex>

        <CustomRadioInputWrapper
          radioValue={autoPrinterCheck}
          handleChange={() => handleUpdatePrintOnCheckout(!autoPrinterCheck, false)}
          radioText="Auto print on checkout"
          radioHelperText="This will allow automated printing of receipts after each checkouts."
        />

        <CustomRadioInputWrapper
          radioValue={autoPrinterOrder}
          handleChange={() => handleUpdatePrintOnCheckout(!autoPrinterOrder, true)}
          radioText="Auto print on kitchen display order"
          radioHelperText="This will allow automated printing of receipts on each kitchen display order."
        />
      </Flex>
    </>
  );
};

export default PrinterSettings;
