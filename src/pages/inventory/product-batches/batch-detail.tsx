import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import cancel from "../../../assets/cancel.svg";
import Timer from "../../../assets/timer.svg";
import { Colors } from "../../../GlobalStyles/theme";
import { Button } from "../../../components/button/Button";
import { IBatch } from "../../../interfaces/batch.interface";
import moment from "moment";

const BatchDetailModal = ({
  setIsEdit,
  setIsDelete,
  selectedBatch,
  setBatchDetailModal,
}: {
  setIsEdit: Function;
  setIsDelete: Function;
  selectedBatch?: IBatch;
  setBatchDetailModal: Function;
}) => {
  const targetDate = moment(selectedBatch?.expiryDate);
  const today = moment();
  const remainingDays = targetDate.diff(today, "days");

  return (
    <Flex direction="column" alignItems="center" width="100%" gap="1em">
      <Flex alignItems="center" justifyContent="space-between" margin="0 0 1em 0" width="100%">
        <Span color={Colors.blackishBlue} fontSize="1.2em" fontWeight="700">
          {selectedBatch?.batchNumber}
        </Span>
        <div
          onClick={() => {
            setBatchDetailModal(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={cancel} alt="close" />
        </div>
      </Flex>

      <Flex width="100%" alignItems="center" justifyContent="space-between" gap="1em">
        <Flex width="50%" alignItems="flex-start" justifyContent="space-between" direction="column">
          <Span color={Colors.grey} fontSize="0.8em">
            Batch No
          </Span>
          <Span color={Colors.blackLight} fontWeight="600">
            {" "}
            {selectedBatch?.batchNumber}
          </Span>
        </Flex>
        <Flex width="50%" alignItems="flex-start" justifyContent="space-between" direction="column">
          <Span color={Colors.grey} fontSize="0.8em">
            Manufacturer Number
          </Span>
          <Span color={Colors.blackLight} fontWeight="600">
            {" "}
            {selectedBatch?.manufacturerNumber}
          </Span>
        </Flex>
      </Flex>

      <Flex width="100%" alignItems="center" justifyContent="space-between" gap="1em">
        <Flex width="50%" alignItems="flex-start" justifyContent="space-between" direction="column">
          <Span color={Colors.grey} fontSize="0.8em">
            Date Added
          </Span>
          <Span color={Colors.blackLight} fontWeight="600">
            {selectedBatch?.dateAdded
              ? moment(selectedBatch?.dateAdded).format("Do MMM YYYY")
              : "Not Added"}
          </Span>
        </Flex>
        <Flex width="50%" alignItems="flex-start" justifyContent="space-between" direction="column">
          <Span color={Colors.grey} fontSize="0.8em">
            Expiry Date
          </Span>
          <Span color={Colors.blackLight} fontWeight="600">
            {selectedBatch?.expiryDate
              ? moment(selectedBatch?.expiryDate).format("Do MMM YYYY")
              : "Not Added"}
          </Span>
        </Flex>
      </Flex>

      <Flex width="100%" alignItems="flex-start" justifyContent="space-between" direction="column">
        <Span color={Colors.grey} fontSize="0.8em">
          Countdown
        </Span>
        <Flex alignItems="flex-start">
          <Span color={Colors.blackLight} fontWeight="600" textAlign="start">
            Batch products will expire in{" "}
          </Span>
          <img src={Timer} alt="timer" style={{ margin: "0 10px" }} />
          <Span fontWeight="600" color={Colors.red}>
            {" "}
            {remainingDays} days{" "}
          </Span>
        </Flex>
      </Flex>

      <Flex width="100%" alignItems="flex-start" justifyContent="space-between" direction="column">
        <Span color={Colors.grey} fontSize="0.8em">
          Description
        </Span>
        <Span color={Colors.blackLight} fontWeight="600">
          {selectedBatch?.description}
        </Span>
      </Flex>
      <Flex alignItems="center" width="100%" gap="1em" margin="2em 0 0 0">
        <Button
          type="button"
          label="Edit Batch"
          backgroundColor="#e0eaff"
          color={Colors.secondaryColor}
          borderColor="none"
          borderRadius="12px"
          borderSize="1px"
          fontSize="16px"
          width="100%"
          height="50px"
          onClick={() => {
            setIsEdit(true);
            setBatchDetailModal(false);
          }}
        />
        <Button
          type="button"
          label="Delete Batch"
          backgroundColor={Colors.red}
          color="#fff"
          borderColor="none"
          borderRadius="12px"
          borderSize="1px"
          fontSize="16px"
          width="100%"
          height="50px"
          onClick={() => {
            setIsDelete(true);
          }}
        />
      </Flex>
    </Flex>
  );
};

export default BatchDetailModal;
