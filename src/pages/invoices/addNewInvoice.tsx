import { FC, useState } from "react";
import { Container, Content, Header } from "../stockAdjustment/adjustStock.styles";
import { Flex, Text } from "../../GlobalStyles/CustomizableGlobal.style";
import DeleteGray from "../../assets/DeleteGray.svg";
import { Colors } from "../../GlobalStyles/theme";
import { Left, Right } from "../sales/style";
import TopNav from "../../components/top-nav/top-nav";
import { Body } from "../expenses/style";
import { Button } from "../../components/button/Button";
import { formatAmountIntl } from "../../helper/format";
import NumberInput from "../../components/input-field/customNumberInput";

interface ProductProp {}

const NewInvoiceProduct: FC<ProductProp> = () => {
  const [placeholderVal, setPlaceholderVal] = useState<number>(23);
  return (
    <>
      <Container margin="1.7rem 0 0 0" bgColor={Colors.tabBg} isOpen={true}>
        <Header>
          <Flex justifyContent="space-between" padding="0.5rem 0.75rem" alignItems="center">
            <Flex columnGap="0.6rem" width="60%">
              <Flex width="1.5rem" height="inherit">
                <img width="100%" src={DeleteGray} alt="" />
              </Flex>
              <Flex margin="0 0.3rem" direction="column" width="65%">
                <Text fontSize="1.1rem">"product.inventoryName"</Text>
                <Text fontSize="0.75rem" color={Colors.grey}>
                  "product.inventoryType"
                </Text>
              </Flex>
            </Flex>

            <Flex width="25%" justifyContent="flex-end" alignItems="center">
              <h3> {formatAmountIntl(undefined, Math.abs(3000))}</h3>
              <NumberInput
                bgColor={Colors.white}
                buttonBg={Colors.grey}
                value={placeholderVal}
                onChange={(val: number) => setPlaceholderVal(val)}
                increment={() => setPlaceholderVal((prev) => prev + 1)}
                decrement={() => setPlaceholderVal((prev) => prev - 1)}
              />
            </Flex>
          </Flex>
          <div
            style={{
              paddingTop: "0.625rem",
              display: "block",
              width: "98%",
              marginInline: "auto",
              opacity: 0.5,
              borderBottom: "1px solid #9EA8B7",
            }}
          ></div>
        </Header>
        <Content isOpen={true}></Content>
      </Container>
    </>
  );
};

const AddNewInvoice = () => {
  const [navBarHeight, setNavBarHeight] = useState<number>();
  return (
    <>
      <TopNav setNavBarHeight={setNavBarHeight} header="New Invoice" />
      <Body navBarHeight={navBarHeight as number}>
        <Flex justifyContent="space-between" height="100%">
          <Left style={{ width: "80%" }} height="100%">
            <Flex margin="0.5rem 0" justifyContent="space-between">
              <Flex width="60%" alignItems="center">
                <h3>Products/ Services Listing</h3>
              </Flex>

              <Button width="30%" backgroundColor="transparent">
                <Flex gap="10px" height="2.25rem" alignItems="center" justifyContent="center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_28230_72500)">
                      <path
                        d="M8 16C3.58175 16 0 12.4183 0 8C0 3.5815 3.58175 0 8 0C12.4185 0 16 3.5815 16 8C16 12.4183 12.4185 16 8 16ZM8 0.98425C4.14025 0.98425 1 4.14025 1 8.00003C1 11.8598 4.14025 15 8 15C11.8597 15 15 11.8598 15 8.00003C15 4.1403 11.8597 0.98425 8 0.98425ZM11.5 8.5H8.5V11.5C8.5 11.776 8.276 12 8 12C7.724 12 7.5 11.776 7.5 11.5V8.5H4.5C4.224 8.5 4 8.276 4 8C4 7.724 4.224 7.5 4.5 7.5H7.5V4.5C7.5 4.224 7.724 4 8 4C8.276 4 8.5 4.224 8.5 4.5V7.5H11.5C11.776 7.5 12 7.724 12 8C12 8.276 11.776 8.5 11.5 8.5Z"
                        fill="#E47D05"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_28230_72500">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="matrix(1 0 0 -1 0 16)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <Text margin="0" padding="0" color={Colors.secondaryColor}>
                    Add Products/ Services
                  </Text>
                </Flex>
              </Button>
            </Flex>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <NewInvoiceProduct key={item} />
            ))}
          </Left>
          <Right>Wahala be like right</Right>
        </Flex>
      </Body>
    </>
  );
};

export default AddNewInvoice;
