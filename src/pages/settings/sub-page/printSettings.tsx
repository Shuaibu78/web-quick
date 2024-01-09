import React, { FunctionComponent, useEffect, useState } from "react";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import { rpcClient } from "../../../helper/rpcClient";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { isLoading } from "../../../app/slices/status";
import {
  PrintTestButton,
  PrinterSettingsContainer,
  PrinterSelectContainer,
  PrinterSelectWrapper,
  PrinterSelect,
  PrinterOption,
  SwitchLabel,
  SwitchInput,
  Slider,
} from "../style";
import { TEST_TEMPLATE, printReceiptV2 } from "../../../helper/printing";
import { increaseSyncCount } from "../../../app/slices/shops";
import _ from "lodash";
import { syncTotalTableCount } from "../../../helper/comparisons";

interface Printer {
  name: string;
  displayName: string;
  description: string;
  autoPrintOnCheckout: boolean;
  autoPrintOnOrder: boolean;
}

interface PrinterProps {
  printers: Printer[];
  selectedPrinter: any;
  settingsId: string | undefined;
  autoPrinterCheck: boolean;
  autoPrinterOrder: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  handlePrinterSelect: (printer: any) => void;
  setAutoPrinterCheck: React.Dispatch<React.SetStateAction<boolean>>;
  setAutoPrinterOrder: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISaveItemToValue {
  shouldAutoPrint: boolean;
}

const PrinterSettingsPage: FunctionComponent<PrinterProps> = ({
  printers,
  selectedPrinter,
  settingsId,
  autoPrinterCheck,
  autoPrinterOrder,
  setRefetch,
  handlePrinterSelect,
  setAutoPrinterCheck,
  setAutoPrinterOrder,
}) => {
  const {
    shops: { currentShop },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const handleTestPrint = () => {
    printReceiptV2(TEST_TEMPLATE, selectedPrinter?.name);
  };

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
      }
      dispatch(increaseSyncCount(["Settings"]));
      dispatch(toggleSnackbarOpen("Default printer is set successfully."));
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

  return (
    <PrinterSettingsContainer>
      <PrinterSelectContainer>
        <PrinterSelectWrapper>
          <PrinterSelect
            value={selectedPrinter?.displayName}
            onChange={(event) =>
              handlePrinterSelect(
                printers.find((printer) => printer?.displayName === event.target.value) as Printer
              )
            }
          >
            <option value="">Select a printer</option>
            {printers.map((printer: Printer) => (
              <PrinterOption key={printer.displayName} value={printer.displayName}>
                {printer.displayName} - {printer.description}
              </PrinterOption>
            ))}
          </PrinterSelect>
        </PrinterSelectWrapper>
        <PrintTestButton onClick={handleUpdateDefaultPrinter}>Save default Printer</PrintTestButton>
      </PrinterSelectContainer>
      <Flex width="40%" justifyContent="space-between">
        <PrintTestButton onClick={handleTestPrint}>Test Print</PrintTestButton>
      </Flex>

      <Flex justifyContent="center" alignItems="center" margin="1.25rem 0px 0.3125rem">
        <span
          style={{ fontWeight: "bolder", textTransform: "capitalize", paddingRight: "1.875rem" }}
        >
          Auto print on checkout
        </span>
        <SwitchLabel>
          <SwitchInput
            type="checkbox"
            checked={autoPrinterCheck}
            onChange={(e) => handleUpdatePrintOnCheckout(e.target.checked, false)}
          />
          <Slider className="round"></Slider>
        </SwitchLabel>
      </Flex>

      <Flex justifyContent="center" alignItems="center" margin="1.25rem 0px 0.3125rem">
        <span
          style={{ fontWeight: "bolder", textTransform: "capitalize", paddingRight: "0.625rem" }}
        >
          Auto print on Offline Order
        </span>
        <SwitchLabel>
          <SwitchInput
            type="checkbox"
            checked={autoPrinterOrder}
            onChange={(e) => handleUpdatePrintOnCheckout(e.target.checked, true)}
          />
          <Slider className="round"></Slider>
        </SwitchLabel>
      </Flex>
    </PrinterSettingsContainer>
  );
};

export default PrinterSettingsPage;
