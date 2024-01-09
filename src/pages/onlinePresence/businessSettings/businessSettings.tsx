import { Flex } from "../style.onlinePresence";

function BusinessSettingsPage() {
  const boxStyle = {
    border: "1px solid red",
    width: "100%",
  };
  return (
    <Flex w="100%" h="100%" gap=".5rem">
      <div style={boxStyle} className="box">
        <h2 color="red">Hello Business Page 1</h2>
      </div>
      <div style={boxStyle} className="box">
        <h2 color="red">Hello Business Page 2</h2>
      </div>
    </Flex>
  );
}

export default BusinessSettingsPage;
