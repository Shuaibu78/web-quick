import React, { FunctionComponent, useState } from "react";
import { SubPageContainer, TaxCard, TaxListing } from "../style";
import { Button } from "../../../components/button/Button";
import PopupCard from "../../../components/popUp/PopupCard";
import NewTax from "../modal/new-tax";
import { useQuery } from "@apollo/client";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { GET_ALL_TAXES } from "../../../schema/tax.schema";
import { ITax } from "../../../interfaces/tax.interface";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import EditTax from "../modal/edit-tax";
import { getCurrentShop } from "../../../app/slices/shops";
import { BoxHeading } from "../settingsComps.style";
import { Colors } from "../../../GlobalStyles/theme";

const Tax: FunctionComponent = () => {
  const [showAddTax, setShowAddTax] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [currentTax, setCurrentTax] = useState<ITax>({});
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();

  const { data, refetch } = useQuery<{ getAllTaxes: [ITax] }>(GET_ALL_TAXES, {
    fetchPolicy: "network-only",
    variables: {
      shopId: currentShop.shopId,
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const handleShowUpdate = (val: ITax) => {
    setCurrentTax(val);
    setShowUpdate(true);
  };

  return (
    <SubPageContainer style={{ paddingInline: "1.25rem" }}>
      <BoxHeading>
        Tax Settings
        <p>Add, Edit, Delete or Modify different Tax </p>
      </BoxHeading>
      <TaxListing>
        {data?.getAllTaxes.map((val, i) => (
          <TaxCard key={i} onClick={() => handleShowUpdate(val)}>
            <div>
              <p>{val.name}</p>
              <p>{val.value}%</p>
            </div>
            <p>{val.isInclusive ? "Tax Inclusive" : "Tax Exclusive"}</p>
          </TaxCard>
        ))}
      </TaxListing>
      <Button
        type="button"
        onClick={() => setShowAddTax(true)}
        backgroundColor={Colors.primaryColor}
        size="lg"
        color="#fff"
        borderColor="transparent"
        borderRadius=".75rem"
        borderSize="0px"
        fontSize="1rem"
        margin="1.25rem 0 0 0"
        width="100%"
      >
        Add New Tax
      </Button>
      {showAddTax && (
        <PopupCard close={() => setShowAddTax(false)}>
          <NewTax setShowModal={setShowAddTax} refetch={refetch} />
        </PopupCard>
      )}
      {showUpdate && (
        <PopupCard close={() => setShowUpdate(false)}>
          <EditTax setShowModal={setShowUpdate} tax={currentTax} refetch={refetch} />
        </PopupCard>
      )}
    </SubPageContainer>
  );
};

export default Tax;
