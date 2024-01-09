import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import cancel from "../../../assets/cancel.svg";
import NoBatchImage from "../../../assets/no-batch.svg";
import GreenCheck from "../../../assets/green-check.svg";
import { Colors } from "../../../GlobalStyles/theme";
import { Button } from "../../../components/button/Button";

const EmptyBatchModal = ({ setEmptyBatchModal }: { setEmptyBatchModal: Function }) => {
  const textArray = [
    "Create batches and add products by batch",
    "Track and monitor batch expiration date",
    "Ability to modify batching details",
    "Access total batch count, quantity and value",
  ];

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <div
        onClick={() => setEmptyBatchModal(false)}
        style={{ alignSelf: "end", cursor: "pointer" }}
      >
        <img src={cancel} alt="close" />
      </div>
      <img src={NoBatchImage} alt="close" width="150px" />
      <Span color={Colors.blackishBlue} fontWeight="700" fontSize="1.2em" margin="1em 0">
        Product Batching
      </Span>
      <Span color={Colors.grey} fontSize="14px" textAlign="center" margin="0 0 1em 0">
        Introducing product batching for easier quality control, efficient production, and
        streamlined distribution.
      </Span>
      <Flex direction="column" width="100%">
        {textArray.map((text, index) => {
          return (
            <Flex gap="1em" alignItems="center" margin="0 0 10px 0">
              <img src={GreenCheck} alt="check" />
              <Span color={Colors.grey} fontSize="14px" key={index}>
                {text}
              </Span>
            </Flex>
          );
        })}
      </Flex>

      <Button
        type="button"
        label="Proceed"
        backgroundColor={Colors.secondaryColor}
        color="#fff"
        borderColor="none"
        borderRadius="12px"
        borderSize="1px"
        fontSize="16px"
        width="100%"
        height="50px"
        onClick={() => setEmptyBatchModal(false)}
      />
    </Flex>
  );
};

export default EmptyBatchModal;
