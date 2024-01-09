import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import NoInternet from "../../../assets/NoInternet.svg";
import { Colors } from "../../../GlobalStyles/theme";

const NoInternetComp = () => {
  return (
    <Flex direction="column" justifyContent="center" margin="6.25rem 0px 0 0" alignItems="center">
      <img src={NoInternet} alt="" />
      <Text margin="4px 0px" color={Colors.blackLight} fontSize="1.2rem" fontWeight="500">
        No Internet Connection
      </Text>
      <Text color={Colors.grey} fontSize=".8rem">
        You need to be connected to the internet to be able to view this page.
      </Text>
    </Flex>
  );
};

export default NoInternetComp;
