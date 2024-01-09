import { Outlet, useNavigate } from "react-router-dom";
import TopNav from "../../components/top-nav/top-nav";
import { Container } from "./invoices.style";
import { useState, useEffect, useRef } from "react";
import NewInvoice from "./NewInvoice";
import { ModalContainer } from "../settings/style";
import { SalesCard } from "../home/style";
import { Flex, Span, Text } from "../../GlobalStyles/CustomizableGlobal.style";
import { formatAmountIntl } from "../../helper/format";
import { Colors } from "../../GlobalStyles/theme";
import { TBody, THead, TRow, Table, Td } from "../sales/style";
import { Body } from "../expenses/style";
import SearchInput from "../../components/search-input/search-input";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import dropIcon from "../../assets/dropIcon2.svg";
import filterIcon from "../../assets/FilterIconGroup.svg";
import fullyPaid from "../../assets/fullyPaid.svg";
import partlyPaid from "../../assets/partlyPaid.svg";
import unpaid from "../../assets/unpaid.svg";
import balance from "../../assets/balance.svg";
import InvoiceDetails from "./InvoiceDetails";
import { ButtonWithIcon } from "../../components/top-nav/style";

function Invoices() {
  const [showAddInvoice, setShowAddInvoice] = useState<boolean>(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<boolean>(false);
  const [navbarHeight, setNavBarHeight] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>();
  const [searchVal, setSearchVal] = useState<string>("");
  const [optionSelected, setOptionSelected] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const filterOptions = ["All Entries", "Upcoming", "Drafts", "Totally Paid"];

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && containerRef.current.offsetHeight) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const InvoiceCards = () => {
    return (
      <>
        <Flex gap="1rem" width="98.5%" margin="0.625rem 0px">
          <Flex bg={Colors.primaryColor} borderRadius="1rem" padding="0.625rem" alignItems="center">
            <Flex height="80%" width="fit-content">
              <img src={fullyPaid} alt="fully Paid Icon" />
            </Flex>
            <Flex width="" justifyContent="space-between" direction="column">
              <Span fontSize="0.8125rem" fontWeight="normal" color="#9EA8B7">
                200 Fully Paid
              </Span>
              <Span fontSize="1.2rem" fontWeight="500" color={Colors.white}>
                {formatAmountIntl(undefined, Math.abs(300000))}
              </Span>
            </Flex>
          </Flex>

          <Flex
            bg={Colors.primaryColor}
            borderRadius="1rem"
            padding="0.8125rem"
            alignItems="center"
          >
            <Flex height="80%" width="fit-content">
              <img src={partlyPaid} alt="fully Paid Icon" />
            </Flex>
            <Flex width="" justifyContent="space-between" direction="column">
              <Span fontSize="0.8125rem" fontWeight="normal" color="#9EA8B7">
                200 Partly Paid
              </Span>
              <Span fontSize="1.2rem" fontWeight="500" color={Colors.white}>
                {formatAmountIntl(undefined, Math.abs(300000))}
              </Span>
            </Flex>
          </Flex>

          <Flex
            bg={Colors.primaryColor}
            borderRadius="1rem"
            padding="0.8125rem"
            alignItems="center"
          >
            <Flex height="80%" width="fit-content">
              <img src={unpaid} alt="partly Paid Icon" />
            </Flex>
            <Flex width="" justifyContent="space-between" direction="column">
              <Span fontSize="0.8125rem" fontWeight="normal" color="#9EA8B7">
                200 Unpaid
              </Span>
              <Span fontSize="1.2rem" fontWeight="500" color={Colors.white}>
                {formatAmountIntl(undefined, Math.abs(100000))}
              </Span>
            </Flex>
          </Flex>

          <Flex
            bg={Colors.primaryColor}
            borderRadius="1rem"
            padding="0.8125rem"
            alignItems="center"
          >
            <Flex height="80%" width="fit-content">
              <img src={balance} alt="partly Paid Icon" />
            </Flex>
            <Flex width="" justifyContent="space-between" direction="column">
              <Span fontSize="0.8125rem" fontWeight="normal" color="#9EA8B7">
                Balances Remaining
              </Span>
              <Span fontSize="1.2rem" fontWeight="500" color={Colors.white}>
                {formatAmountIntl(undefined, Math.abs(100000))}
              </Span>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          width="98.5%"
          margin="1rem 0 0.4rem 0"
        >
          <Flex width="60%" gap="0.625rem">
            <SearchInput
              placeholder="Search customer name"
              width="60%"
              handleSearch={setSearchVal}
              borderRadius="0.75rem"
            />
            <CustomDropdown
              width="30%"
              height="2.5rem"
              color="#607087"
              borderRadius="0.75rem"
              containerColor="#fff"
              dropdownIcon={dropIcon}
              fontSize="0.875rem"
              fontWeight="normal"
              icon={filterIcon}
              selected={optionSelected}
              setValue={setOptionSelected}
              options={filterOptions}
              padding="0 4px"
            />
          </Flex>
          <ButtonWithIcon
            bgColor={Colors.secondaryColor}
            id="add-new-invoice"
            style={{ margin: "0" }}
            onClick={() => navigate("/dashboard/invoices/new")}
          >
            <div
              style={{
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "50%",
                backgroundColor: Colors.white,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "1.25rem", color: Colors.secondaryColor }}>+</p>
            </div>
            <span>Create New Invoice</span>
          </ButtonWithIcon>
        </Flex>
      </>
    );
  };

  return (
    <Container>
      <div>
        <TopNav
          setShowAddInvoice={setShowAddInvoice}
          setNavBarHeight={setNavBarHeight}
          header={`Invoices (${300})`}
          navContent={InvoiceCards}
        />

        {/* <Flex
          bg={Colors.primaryColor}
          padding="1rem"
          borderRadius="0.625rem"
          direction="column"
          gap="1rem"
        >
          <Flex gap="1rem">
            <SalesCard height="70px" width="25%" style={{ padding: "5px 1rem" }}>
              <Flex width="" justifyContent="space-between" direction="column">
                <Span fontSize="0.625rem" fontWeight="normal" color="#9EA8B7">
                  Fully Paid Invoice (20)
                </Span>
                <Span fontSize="1rem" fontWeight="500" color={Colors.green}>
                  {formatAmountIntl(undefined, Math.abs(300000))}
                </Span>
              </Flex>
            </SalesCard>

            <SalesCard height="70px" width="25%" style={{ padding: "5px 1rem" }}>
              <Flex width="" justifyContent="space-between" direction="column">
                <Span fontSize="0.625rem" fontWeight="normal" color="#9EA8B7">
                  Balance Remaining
                </Span>
                <Span fontSize="1rem" fontWeight="500" color={Colors.secondaryColor}>
                  {formatAmountIntl(undefined, Math.abs(300000))}
                </Span>
              </Flex>
            </SalesCard>

            <SalesCard background="#ECEFF4" height="70px" width="25%">
              <Flex width="" justifyContent="space-between" direction="column">
                <Flex>
                  <Span fontSize="0.625rem" color="#9EA8B7" fontWeight="normal">
                    20 Partly Paid
                  </Span>
                </Flex>
                <Span color={Colors.blackishBlue} fontSize="1rem" fontWeight="500">
                  {formatAmountIntl(undefined, 300000)}
                </Span>
              </Flex>
            </SalesCard>

            <SalesCard background="#ECEFF4" height="70px" width="25%">
              <Flex width="" justifyContent="space-between" direction="column">
                <Flex>
                  <Span fontSize="0.625rem" color="#9EA8B7" fontWeight="normal">
                    58 Unpaid
                  </Span>
                </Flex>
                <Span fontSize="1rem" color="#F65151" fontWeight="500">
                  {formatAmountIntl(undefined, Math.abs(300000))}
                </Span>
              </Flex>
            </SalesCard>
          </Flex>
          <Text color="#fff" fontSize="1.25rem">
            <i>
              <Span color="#F65151">58</Span> Invoice have passed due dates
            </i>
          </Text>
        </Flex> */}

        <Body ref={containerRef} navBarHeight={navbarHeight}>
          <Table style={{ position: "relative", width: "100%", padding: "0 1rem" }} height="70vh">
            <THead fontSize="0.875rem" justifyContent="flex-start">
              <Td width="15%">Id</Td>
              <Td width="15%">Client</Td>
              <Td width="15%">Mobile</Td>
              <Td width="15%">Email</Td>
              <Td width="15%">Total</Td>
              <Td width="15%">State</Td>
              <Td width="15%">Date</Td>
            </THead>
            <TBody height={`calc(${containerHeight}px - 9.375rem)`} width="100%" overflowY="scroll">
              <TRow onClick={() => setShowInvoiceDetails(true)}>
                <Td width="15%">INV_0132933 (Settled)</Td>
                <Td width="15%">Muhammad Kabir</Td>
                <Td width="15%">+234 803 675 9786</Td>
                <Td width="15%">example@gmail.com</Td>
                <Td width="15%">₦ 2,000</Td>
                <Td width="15%">Unpaid</Td>
                <Td width="15%">23 Jul 2023 23:09</Td>
              </TRow>
              <TRow onClick={() => setShowInvoiceDetails(true)}>
                <Td width="15%">INV_0132933 (Settled)</Td>
                <Td width="15%">Muhammad Kabir</Td>
                <Td width="15%">+234 803 675 9786</Td>
                <Td width="15%">example@gmail.com</Td>
                <Td width="15%">₦ 2,000</Td>
                <Td width="15%">Unpaid</Td>
                <Td width="15%">23 Jul 2023 23:09</Td>
              </TRow>
              <TRow onClick={() => setShowInvoiceDetails(true)}>
                <Td width="15%">INV_0132933 (Settled)</Td>
                <Td width="15%">Muhammad Kabir</Td>
                <Td width="15%">+234 803 675 9786</Td>
                <Td width="15%">example@gmail.com</Td>
                <Td width="15%">₦ 2,000</Td>
                <Td width="15%">Unpaid</Td>
                <Td width="15%">23 Jul 2023 23:09</Td>
              </TRow>
            </TBody>
          </Table>
        </Body>
      </div>

      {showAddInvoice && (
        <ModalContainer>
          <NewInvoice setShowModal={setShowAddInvoice} />
        </ModalContainer>
      )}

      {showInvoiceDetails && (
        <ModalContainer>
          <InvoiceDetails setShowModal={setShowInvoiceDetails} />
        </ModalContainer>
      )}
    </Container>
  );
}

export default Invoices;
