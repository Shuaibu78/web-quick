import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import cancel from "../../../assets/cancel.svg";
import { Colors } from "../../../GlobalStyles/theme";
import { Button } from "../../../components/button/Button";
import { useEffect, useState } from "react";
import { InputWrapper } from "../../register/style";
import { InputField } from "../../../components/input-field/input";
import { setHours } from "../../../helper/date";
import CustomDate from "../../../components/date-picker/customDatePicker";
import { TextArea } from "../../sales/style";
import { useMutation } from "@apollo/client";
import { CREATE_BATCH, UPDATE_BATCH } from "../../../schema/batch.schema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { IBatch } from "../../../interfaces/batch.interface";
import { Form } from "../../settings/style";
import { getCurrentShop } from "../../../app/slices/shops";
import Loader from "../../../components/loader";

const CreateBatchModal = ({
  isEdit,
  refetch,
  setIsEdit,
  selectedBatch,
  setCreateBatchModal,
}: {
  isEdit: boolean;
  refetch: Function;
  setIsEdit: Function;
  selectedBatch?: IBatch;
  setCreateBatchModal: Function;
}) => {
  const dispatch = useAppDispatch();
  const currentShop = useAppSelector(getCurrentShop);

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [batchId, setBatchId] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [batchNumber, setBatchNumber] = useState<string | undefined>("");
  const [dateAdded, setDateAdded] = useState<Date | undefined>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(new Date());
  const [manufacturerNumber, setManufacturerNumber] = useState<string | undefined>("");

  const getAddedDate = (date: Date) => {
    const dateWithSeconds = setHours(date, date);
    setDateAdded(dateWithSeconds?.from);
  };

  const getExpDate = (date: Date) => {
    const dateWithSeconds = setHours(date, date);
    setExpiryDate(dateWithSeconds.from);
  };

  useEffect(() => {
    if (isEdit) {
      setBatchId(selectedBatch?.batchId);
      setBatchNumber(selectedBatch?.batchNumber);
      setDescription(selectedBatch?.description);
      setManufacturerNumber(selectedBatch?.manufacturerNumber);

      const exDate = selectedBatch?.expiryDate;
      const addDate = selectedBatch?.dateAdded;

      if (exDate) setExpiryDate(new Date(exDate));
      if (addDate) setDateAdded(new Date(addDate));
    }
  }, [isEdit, selectedBatch]);

  const onSucces = () => {
    refetch();
    setIsEdit(false);
    setIsLoading(false);
    setCreateBatchModal(false);
  };

  const [createBatch] = useMutation<{ createBatch: IBatch }>(CREATE_BATCH, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },

    onCompleted: () => {
      onSucces();
      dispatch(
        toggleSnackbarOpen({
          color: "SUCCESS",
          message: "Batch Successfully Created",
        })
      );
    },
    onError: (error) => {
      setIsLoading(false);
      dispatch(toggleSnackbarOpen(error.message));
    },
  });

  const [updateBatch] = useMutation<{ updateBatch: IBatch }>(UPDATE_BATCH, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },

    onCompleted: () => {
      onSucces();
      dispatch(
        toggleSnackbarOpen({
          color: "SUCCESS",
          message: "Batch Successfully Updated",
        })
      );
    },
    onError: (error) => {
      setIsLoading(false);
      dispatch(toggleSnackbarOpen(error.message));
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isUpdate: boolean = false) => {
    e.preventDefault();

    if (!batchNumber) {
      dispatch(toggleSnackbarOpen("Batch Number is Required"));
      return;
    }

    setIsLoading(true);

    const variables = {
      batchId,
      dateAdded,
      expiryDate,
      description,
      batchNumber,
      manufacturerNumber,
      shopId: currentShop.shopId,
    };

    if (isUpdate) {
      updateBatch({
        variables,
      });
    } else {
      createBatch({
        variables,
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Flex direction="column" alignItems="center" width="100%" gap="1em">
      <Flex alignItems="center" justifyContent="space-between" margin="0 0 1em 0" width="100%">
        <Span color={Colors.blackishBlue} fontSize="1.2em" fontWeight="700">
          {isEdit ? "Update Batch" : "Create New Batch"}
        </Span>

        <div
          onClick={() => {
            setCreateBatchModal(false);
            setIsEdit(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={cancel} alt="close" />
        </div>
      </Flex>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <InputWrapper>
          <InputField
            type="text"
            label="Batch Number"
            placeholder="Batch Number"
            noFormat
            top="-0.9375rem"
            size="lg"
            backgroundColor="#F4F6F9"
            color="#353e49"
            borderColor="#8196B3"
            borderRadius="12px"
            borderSize="1px"
            border
            fontSize="16px"
            width="100%"
            value={batchNumber as string}
            onChange={(e) => setBatchNumber(e.target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <InputField
            type="text"
            label="Manufacturer Number"
            placeholder="Manufacturer Number"
            noFormat
            top="-0.9375rem"
            size="lg"
            backgroundColor="#F4F6F9"
            color="#353e49"
            borderColor="#8196B3"
            borderRadius="12px"
            borderSize="1px"
            border
            fontSize="16px"
            width="100%"
            value={manufacturerNumber as string}
            onChange={(e) => setManufacturerNumber(e.target.value)}
          />
        </InputWrapper>
        <Flex width="100%" alignItems="center" justifyContent="space-between" gap="2em">
          <CustomDate
            label="Added Date"
            height="40px"
            startDate={dateAdded}
            background="#f4f6f9"
            border="none"
            width="100%"
            setStartDate={getAddedDate}
          />
          <CustomDate
            label="Expiry Date"
            height="40px"
            background="#f4f6f9"
            border="none"
            width="100%"
            startDate={expiryDate}
            setStartDate={getExpDate}
          />
        </Flex>

        <InputWrapper style={{ margin: "1em 0" }}>
          <label
            className="label"
            style={{
              fontSize: "12px",
              margin: "0 0 5px 0px",
              color: `${isFocused ? Colors.primaryColor : "#607087"}`,
            }}
          >
            Description
          </label>
          <TextArea
            placeholder="Description"
            color="#353e49"
            height="6.25rem"
            value={description}
            onChange={(e) => setDescription && setDescription(e.target.value)}
            style={{ fontSize: "16px" }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </InputWrapper>

        <Button
          type="button"
          label={isEdit ? "Update" : "Create Batch"}
          backgroundColor={Colors.primaryColor}
          color="#fff"
          borderColor="none"
          borderRadius="12px"
          borderSize="1px"
          fontSize="16px"
          width="100%"
          height="50px"
          margin="1em 0 0 0"
          onClick={(e) => handleSubmit(e, !!isEdit)}
        />
      </Form>
    </Flex>
  );
};

export default CreateBatchModal;
