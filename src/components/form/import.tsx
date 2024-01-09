/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from "react";
import { Flex, Span, Text } from "../../GlobalStyles/CustomizableGlobal.style";
import { Section, TitleContainer, FormContainer } from "./style";
import { Colors } from "../../GlobalStyles/theme";
import { Input } from "../input-field/style";
import { Button } from "../button/Button";
import CustomDropdown from "../custom-dropdown/custom-dropdown";
import Cancel from "../../assets/cancel.svg";
import { DB_INVENTORIES_COLUMNS, ColumnNamesI } from "../../helper/dbColumns";
import { ExcelHelper } from "../../helper/excel";
import { IInventory, ISupply, TrackabeItem } from "../../interfaces/inventory.interface";
import { getCurrentShop, increaseSyncCount } from "../../app/slices/shops";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CREATE_INVENTORY, CREATE_INVENTORY_FROM_CSV } from "../../schema/inventory.schema";
import { useMutation, useQuery } from "@apollo/client";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { PackageData } from "../../interfaces/subscription.interface";
import { GET_FEATURE_COUNT } from "../../schema/subscription.schema";
import { setFeatureCount } from "../../app/slices/subscriptionslice";

const { red, white, primaryColor, lightBlue } = Colors;

interface ImportProps {
  setShowImportModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Import: React.FC<ImportProps> = ({ setShowImportModal }) => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [excelColumnNames, setExcelColumnNames] = useState<string[]>([]);
  const [mappers, setMapper] = useState<ColumnNamesI[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedExcelFile, setUploadedExcelFile] = useState<ExcelHelper<IInventory> | null>(null);
  const [recordsToBeSaved, setRecordsToBeSaved] = useState(0);
  const [savedRecords, setSavedRecords] = useState(0);
  const [failedRecords, setFailedRecords] = useState(0);
  const [file, setFile] = useState<any>(undefined);
  const { subscriptions } = useAppSelector((state) => state);
  const userSubscriptions = subscriptions?.subscriptions[0] || [];
  const subscriptionPackages = subscriptions?.subscriptionPackages || [];
  const featureCount = subscriptions?.featureCount || {};
  const subPackage = subscriptionPackages.find(
    (packageData: PackageData) => packageData.packageNumber === userSubscriptions.packageNumber
  );

  const currentShop = useAppSelector(getCurrentShop);
  const shopId = currentShop?.shopId;

  const [createProductFromCsv] = useMutation<{ createProductFromCsv: IInventory[] }>(
    CREATE_INVENTORY_FROM_CSV,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const { refetch: refetchFeatureCount } = useQuery<{
    getFeatureCount: { inventoriesCount: number; debtCount: number };
  }>(GET_FEATURE_COUNT, {
    variables: {
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "cache-and-network",
    onCompleted(arrData) {
      dispatch(setFeatureCount(arrData?.getFeatureCount ?? {}));
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const addInventoriesFromExcel = async () => {
    if (uploading) return;
    // if (!uploadedExcelFile) return showSnackbar("No file uploaded!");

    setUploading(true);

    const excelData: any[] | undefined = (await uploadedExcelFile?.getJSON(mappers)) || [];

    setRecordsToBeSaved(excelData?.length);

    const inventoryItems: any[] = [];

    for (let i = 0; i < excelData?.length; i++) {
      const json = excelData[i];
      const inventoryData: IInventory = {
        inventoryName: json.inventoryName,
        inventoryDescription: json.inventoryDescription,
        shopId,
      };

      const trackableItemsData: TrackabeItem = {
        unitPrice: json.unitPrice ? Math.floor(json.unitPrice) : 0,
        unitPiecesCostPrice: json.unitPiecesCostPrice ? Math.floor(json.unitPiecesCostPrice) : 0,
      };
      const suppliesData: ISupply = {
        inventoryName: json.inventoryName,
        costPrice: json.unitPiecesCostPrice ? Math.floor(json.unitPiecesCostPrice) : 0,
        quantity: json.quantityInPieces ? Math.floor(json.quantityInPieces) : 0,
        shopId,
        inventoryExpiryDate: json.inventoryExpiryDate,
      };

      inventoryItems.push({
        inventoryName: String(inventoryData?.inventoryName),
        inventoryDescription: String(inventoryData?.inventoryDescription),
        shopId: currentShop?.shopId,
        quantityInPacks: Number(suppliesData?.quantityInPacks || 0),
        quantityInPieces: Number(suppliesData?.quantity || 0),
        isVariation: false,
        trackable: !!trackableItemsData,
        piecesCostPrice: Number(trackableItemsData?.unitPiecesCostPrice || 0),
        isPack: false,
        isPieces: true,
        isPublished: false,
        costPrice: Number(trackableItemsData?.unitPiecesCostPrice || 0),
        sellingPrice: Number(trackableItemsData?.unitPrice || 0),
        packCostPrice: 0,
        fixedPackPrice: 0,
        perPack: 0,
      });
    }

    createProductFromCsv({
      variables: {
        inventoryData: inventoryItems,
        productPackageLimit: subPackage?.inventoryCount,
        shopId,
      },
    })
      .then(async (res) => {
        if (res.data) {
          setSavedRecords((previousValue) => previousValue + 1);
          setErrorMsg("");
          dispatch(
            toggleSnackbarOpen({ message: "Products created successfully", color: "SUCCESS" })
          );
          setUploading(false);
          dispatch(
            increaseSyncCount([
              "Inventory",
              "TrackableItems",
              "NonTrackableItems",
              "Supplies",
              "Variations",
              "InventoryQuantity",
            ])
          );
          refetchFeatureCount();
        }
      })
      .catch((error) => {
        dispatch(toggleSnackbarOpen({ message: "Unsuccessful", color: "DANGER" }));
        console.log("Not saved", error);
        setUploading(false);
        setFailedRecords((previousValue) => previousValue + 1);
      });

    setUploadedExcelFile(null);
    setExcelColumnNames([]);
  };

  const mapColumn = (columnNameObject: ColumnNamesI) => {
    setMapper((mapper) => {
      return [...mapper, columnNameObject];
    });
  };

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const excelFile = new ExcelHelper<IInventory>(file[0] as File);
      setUploadedExcelFile(excelFile);
      const excelData: any[] | undefined = (await excelFile?.getJSON(mappers)) || [];
      setRecordsToBeSaved(excelData?.length);

      if (
        subPackage?.packageNumber !== -1 &&
        subPackage?.inventoryCount !== -1 &&
        excelData?.length + featureCount.inventoriesCount > (subPackage?.inventoryCount || 0)
      ) {
        setErrorMsg(
          `With your current inventory count of ${
            featureCount.inventoriesCount
          }, you are only allowed to add ${
            (subPackage?.inventoryCount ?? 0) - featureCount.inventoriesCount
          } more products based on your subscription limit. Please consider upgrading your package for uninterrupted service.`
        );
      }

      const columnNames = await excelFile.getHeaders();

      setExcelColumnNames(columnNames);
      setLoading(false);
      dispatch(toggleSnackbarOpen({ message: "uploading csv file successful", color: "SUCCESS" }));
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>, columnName: any) => {
    columnName.excelColumnName = event.target.value as string;
    mapColumn(columnName);
  };

  return (
    <Section>
      <Flex padding="2rem" direction="column">
        <TitleContainer>
          <Flex width="31.25rem" alignItems="center" justifyContent="space-between">
            <Flex gap="1.25rem">
              <Flex alignItems="center" gap="0.625rem">
                <Span fontSize="1rem" color={lightBlue}>
                  Total:
                </Span>
                <Span fontSize="1rem">{recordsToBeSaved}</Span>
              </Flex>
              <Flex alignItems="center" gap="0.625rem">
                <Span fontSize="1rem" color={lightBlue}>
                  Failed:
                </Span>
                <Span color={red} fontSize="1rem">
                  {failedRecords}
                </Span>
              </Flex>
              <Flex alignItems="center" gap="0.625rem">
                <Span fontSize="1rem" color={lightBlue}>
                  Succeeded:
                </Span>
                <Span fontSize="1rem">{savedRecords}</Span>
              </Flex>
            </Flex>
            <img
              src={Cancel}
              alt="close modal"
              onClick={() => setShowImportModal(false)}
              style={{ cursor: "pointer" }}
            />
          </Flex>
        </TitleContainer>
        <FormContainer onSubmit={onSubmit}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            <Flex cursor="pointer">
              <Input
                accept="doc/*"
                type="file"
                onChange={(e) => setFile(e.target.files)}
                name="file"
                required
                style={{ cursor: "pointer", padding: 0 }}
              />
            </Flex>
            <Button
              type="button"
              label="Add"
              backgroundColor={primaryColor}
              borderRadius="0.5rem"
              fontSize="0.9rem"
              color={white}
              height="2.1875rem"
              width="6.25rem"
              onClick={onSubmit}
            />
          </Flex>
          <Span style={{ fontStyle: "italics" }} fontSize="0.8em" color={Colors.blackLight}>
            FIle must be in CSV format
          </Span>
          <Text color={primaryColor} fontSize="1rem" fontWeight="700" margin="1rem 0px">
            Map Columns
          </Text>
          <Flex
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            direction="column"
            gap="0.5rem"
          >
            {DB_INVENTORIES_COLUMNS.map((columnName, i) => {
              return (
                <Flex key={i} width="100%" alignItems="center" justifyContent="space-between">
                  <Span fontSize="1rem" color={lightBlue}>
                    {columnName?.displayName}
                  </Span>
                  <select
                    name={`${columnName?.dbColumnName}`}
                    defaultValue={columnName?.excelColumnName}
                    onChange={(e) => handleChange(e, columnName)}
                    style={{
                      width: "30%",
                      padding: ".5rem",
                      fontSize: "0.875rem",
                      borderRadius: "0.75rem",
                      height: "2.5rem",
                      cursor: "pointer",
                    }}
                    required={columnName?.required}
                  >
                    <option style={{ color: "red" }}>Select...</option>
                    {excelColumnNames.map((dbColumnName: string, i) => (
                      <option key={i}>{dbColumnName}</option>
                    ))}
                  </select>
                </Flex>
              );
            })}
            <Text color="red" width="450px">
              {errorMsg}
            </Text>
            <Button
              type="button"
              label={
                subPackage?.inventoryCount !== -1 &&
                recordsToBeSaved > (subPackage?.inventoryCount || 0)
                  ? `Upload ${
                      (subPackage?.inventoryCount || 0) - featureCount.inventoriesCount
                    } out of ${recordsToBeSaved}`
                  : "Upload"
              }
              disabled={uploading}
              backgroundColor={primaryColor}
              borderRadius="0.5rem"
              fontSize="1rem"
              color={white}
              height="2.5rem"
              width="100%"
              margin="1rem 0 0 0"
              onClick={addInventoriesFromExcel}
            />
          </Flex>
        </FormContainer>
      </Flex>
    </Section>
  );
};

export default Import;
