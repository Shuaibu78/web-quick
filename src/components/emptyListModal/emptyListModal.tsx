import cancel from "../../assets/close-with-border.svg";
import { Colors } from "../../GlobalStyles/theme";
import { Button } from "../../components/button/Button";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";

interface IProps {
  setEmptyListModal: Function;
  textArray: string[];
  title: string;
  description: string;
  image: string;
}
const EmptyListModal: React.FC<IProps> = ({
  setEmptyListModal,
  textArray,
  title,
  description,
  image,
}) => {
  return (
    <Flex direction="column" alignItems="center" width="100%">
      <div onClick={() => setEmptyListModal(false)} style={{ alignSelf: "end", cursor: "pointer" }}>
        <img src={cancel} alt="close" />
      </div>

      <img src={image} alt="close" width="150px" />
      <Span color={Colors.blackishBlue} fontWeight="700" fontSize="22px" margin="0.5rem 0">
        {title}
      </Span>
      <Span color={Colors.grey} fontSize="0.75rem" textAlign="center" margin="0 0 1em 0">
        {description}
      </Span>
      <Flex direction="column" width="100%" margin="1em 0">
        {textArray.map((text, index) => {
          return (
            <Flex gap="1em" alignItems="center" margin="0 0 10px 0">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="16" fill={Colors.lightSecondaryColor} />
                  <path
                    d="M14.1335 17.4938L19.6402 11.9871C19.8113 11.816 20.0291 11.7305 20.2935 11.7305C20.558 11.7305 20.7758 11.816 20.9469 11.9871C21.118 12.1582 21.2035 12.376 21.2035 12.6405C21.2035 12.9049 21.118 13.1227 20.9469 13.2938L14.7869 19.4538C14.6002 19.6405 14.3824 19.7338 14.1335 19.7338C13.8847 19.7338 13.6669 19.6405 13.4802 19.4538L11.0535 17.0271C10.8824 16.856 10.7969 16.6382 10.7969 16.3738C10.7969 16.1094 10.8824 15.8916 11.0535 15.7205C11.2247 15.5494 11.4424 15.4638 11.7069 15.4638C11.9713 15.4638 12.1891 15.5494 12.3602 15.7205L14.1335 17.4938Z"
                    fill={Colors.secondaryColor}
                  />
                </svg>
              </div>

              <Span color={Colors.blackLight} fontSize="0.7rem" key={index}>
                {text}
              </Span>
            </Flex>
          );
        })}
      </Flex>

      <Button
        type="button"
        label="Proceed"
        backgroundColor={Colors.primaryColor}
        color="#fff"
        borderColor="none"
        borderRadius="12px"
        borderSize="1px"
        fontSize="16px"
        width="100%"
        height="50px"
        onClick={() => setEmptyListModal(false)}
      />
    </Flex>
  );
};

export default EmptyListModal;
