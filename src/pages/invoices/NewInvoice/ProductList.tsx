import { Colors } from "../../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../settings/style";
import cancelIcon from "../../../assets/cancel.svg";
import { FunctionComponent, useState, useRef, useEffect } from "react";
import { IInventory } from "../../../interfaces/inventory.interface";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { getImageUrl } from "../../../helper/image.helper";
import { Button } from "../../../components/button/Button";
import ConfirmProduct from "./ConfirmProducts";
import { InventoryListType } from ".";
import SearchInput from "../../../components/search-input/search-input";

const Tick = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="M12.841 6.56859C12.9995 6.41772 13.2104 6.33431 13.4292 6.33596C13.648 6.33762 13.8576 6.42421 14.0138 6.57746C14.1699 6.73072 14.2605 6.93865 14.2662 7.15739C14.272 7.37612 14.1926 7.58855 14.0448 7.74984L9.556 13.3636C9.47882 13.4467 9.38566 13.5134 9.2821 13.5598C9.17854 13.6061 9.06671 13.631 8.95328 13.6331C8.83986 13.6352 8.72718 13.6144 8.62198 13.572C8.51677 13.5295 8.42121 13.4663 8.341 13.3861L5.36425 10.4093C5.28135 10.3321 5.21486 10.2389 5.16875 10.1354C5.12263 10.0319 5.09783 9.92022 5.09583 9.80693C5.09384 9.69364 5.11468 9.5811 5.15711 9.47604C5.19955 9.37098 5.26271 9.27554 5.34283 9.19542C5.42295 9.1153 5.51839 9.05214 5.62345 9.0097C5.72851 8.96727 5.84105 8.94643 5.95434 8.94843C6.06763 8.95042 6.17936 8.97522 6.28286 9.02134C6.38636 9.06745 6.47951 9.13394 6.55675 9.21684L8.9125 11.5715L12.8196 6.59334C12.8267 6.58468 12.833 6.57642 12.841 6.56859Z" fill="white"/>
    </svg>
  );
};

interface IProps {
  setShowProductList: Function;
  setSearch: Function;
  inventories: [IInventory] | undefined;
  setSelectedProducts: Function;
  selectedProducts: InventoryListType[] | undefined;
}

type TabType = "all" | "pieces" | "pack" | "variation" | "services";

const ProductList: FunctionComponent<IProps> = ({
  setShowProductList,
  setSearch,
  inventories,
  setSelectedProducts,
  selectedProducts
}) => {
  const [selectedInventory, setSelectedInventory] = useState<InventoryListType[]>(
    selectedProducts || []
  );
  const [showConfirmProduct, setShowConfirmProduct] = useState<boolean>();
  const [confirmProduct, setConfirmProduct] = useState<IInventory>();
  const [tab, setTab] = useState<TabType>("all");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [buttonsHeight, setButtonsHeight] = useState(0);
  const [searchVal, setSearchVal] = useState<string>("");

  const headerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (headerRef.current) {
      const divHeightInPixels = headerRef.current.offsetHeight;
      setHeaderHeight(divHeightInPixels);
    }
  }, [headerRef]);

  useEffect(() => {
    if (buttonsRef.current) {
      const divHeightInPixels = buttonsRef.current.offsetHeight;
      setButtonsHeight(divHeightInPixels);
    }
  }, [buttonsRef]);

  const handleAddToList = (data: InventoryListType) => {
    setSelectedInventory(prevInventory => {
      if (prevInventory) {
        const updatedInventory = [...prevInventory];
        updatedInventory.push(data);
        return updatedInventory;
      } else {
        return [data];
      }
    });
  };

  const proceed = () => {
    setSelectedProducts(selectedInventory);
    setShowProductList(false);
  };

  return (
    <>
      <ModalBox width="35%" minHeight="90vh">
        <div style={{ background: "#F3F4FA" }}>
          <Flex direction="column" width="32%" ref={headerRef} style={{ zIndex: "10", background: "#fff", top: "5vh", position: "fixed" }}>
            <h3
              style={{
                marginBottom: "10px",
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",
                color: Colors.primaryColor,
              }}
            >
              <span>Product List</span>
              <button
                onClick={() => setShowProductList(false)}
                style={{ background: "transparent", border: "1px solid black" }}
              >
                <img src={cancelIcon} alt="" />
              </button>
            </h3>
            <Flex margin="0 0 1rem 0" gap="0.75rem">
              <Text
                onClick={() => setTab("all")}
                className={`details-tab ${tab === "all" ? "active-details-tab" : ""}`}
              >
                All
              </Text>
              <Text
                onClick={() => setTab("pieces")}
                className={`details-tab ${tab === "pieces" ? "active-details-tab" : ""}`}
              >
                Pieces
              </Text>
              <Text
                onClick={() => setTab("pack")}
                className={`details-tab ${tab === "pack" ? "active-details-tab" : ""}`}
              >
                Pack
              </Text>
              <Text
                onClick={() => setTab("variation")}
                className={`details-tab ${tab === "variation" ? "active-details-tab" : ""}`}
              >
                Variation
              </Text>
              <Text
                onClick={() => setTab("services")}
                className={`details-tab ${tab === "services" ? "active-details-tab" : ""}`}
              >
                Services
              </Text>
            </Flex>
            <SearchInput
              placeholder="Search customer name"
              width="100%"
              handleSearch={setSearchVal}
              borderRadius="0.75rem"
            />
          </Flex>
          <Flex direction="column" position="relative" margin={`${headerHeight}px 0 ${buttonsHeight}px 0`}>
            {inventories?.map((inventory) => {
              const {
                inventoryId,
                inventoryName,
                fixedPackPrice,
                fixedUnitPrice,
                Images
              } = inventory;
              const isSelected = !!selectedInventory
                .find(inv => inv.inventoryId === inventoryId);

              return (
                <Flex
                  key={inventoryId}
                  hover
                  cursor="pointer"
                  justifyContent="space-between"
                  alignItems="flex-end"
                  margin="0.354rem 0"
                  bg={isSelected ? Colors.lightPrimary : "#F3F4FA"}
                  padding="0.5rem"
                  borderRadius="0.5rem"
                  onClick={() => {
                    setShowConfirmProduct(true);
                    setConfirmProduct(inventory);
                  }}
                >
                  <Flex gap="0.5rem" alignItems="center">
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      width="40px"
                      height="40px"
                      margin="0 0.5rem"
                      borderRadius="0.5rem"
                      bg={isSelected ? Colors.secondaryColor : "transparent"}
                    >
                      {isSelected ? <Tick /> : <img style={{ width: "100%", height: "100%" }} src={getImageUrl(Images)} />}
                    </Flex>
                    <Flex gap="0.5rem" direction="column" color="red">
                      <Text color={Colors.primaryGrey} fontSize="0.85rem">{inventoryName}</Text>
                      <Text color={Colors.grey} fontSize="0.75rem">{fixedUnitPrice || fixedPackPrice || "N/A"}</Text>
                    </Flex>
                  </Flex>
                  <Text color={Colors.blackishBlue} fontSize="0.85rem">{fixedUnitPrice || "N/A"}</Text>
                </Flex>
              );
            })}
          </Flex>
          <Flex
            gap="0.75rem"
            position="absolute"
            ref={buttonsRef}
            style={{ zIndex: "10", bottom: "7vh", width: "32%", backdropFilter: "blur(1px)" }}
          >
            <Button
              label={"New Product"}
              onClick={() => setShowConfirmProduct(true)}
              backgroundColor={Colors.primaryColor}
              size="lg"
              color="#fff"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="50%"
              margin="2rem 0 0 0 "
            />
            <Button
                label={"Proceed"}
                onClick={() => proceed()}
                backgroundColor={Colors.green}
                size="lg"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="50%"
                margin="2rem 0 0 0 "
              />
          </Flex>
        </div>
      </ModalBox>

      {showConfirmProduct &&
        <ModalContainer>
          <ConfirmProduct
            inventory={confirmProduct}
            setShowConfirmProduct={setShowConfirmProduct}
            setConfirmProduct={setConfirmProduct}
            addToList={handleAddToList}
          />
        </ModalContainer>
      }
    </>
  );
};

export default ProductList;
