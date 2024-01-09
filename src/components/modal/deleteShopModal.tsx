import { useState } from "react";
import { Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { Input } from "../input-field/style";
import { Flex } from "../receipt/style";

interface Iprops {
  action: string;
  shopName: string;
  actionhandler: () => void;
  closeModal: () => void;
}

const DeleteModal = (props: Iprops) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleDelete = () => {
    if (inputValue === props.shopName) {
      props.actionhandler();
      props.closeModal();
    } else {
      setError(true);
    }
  };
  return (
    <div
      style={{
        backgroundColor: Colors.white,
        padding: "1.25rem 0.9375rem",
        width: "422px",
        height: "fit-content",
        borderRadius: "0.75rem",
        display: "flex",
        flexDirection: "column",
        rowGap: "2rem",
      }}
    >
      <div>
        <h3>{props.action}</h3>
        <p style={{ marginTop: "0.625rem" }}>
          Enter your shop name <b style={{ color: Colors.primaryColor }}>“{props.shopName}”</b>. To
          confirm delete
        </p>
      </div>

      <div>
        <Span
          color="#607087"
          fontSize="13px"
          style={{ margin: "0.625rem 0.625rem", padding: "0.9375rem 0" }}
        >
          Shop Name
        </Span>
        <Flex
          alignItems="center"
          bgColor="#F4F6F9"
          padding="0.625rem 0.625rem"
          height="42px"
          borderRadius="0.75rem"
          margin="0.625rem 0"
          style={{
            border: error ? "1px solid red" : "none",
          }}
        >
          <Input
            placeholder="Shop Name..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setError(false)}
            style={{
              background: "transparent",
              paddingInline: "0.625rem",
              marginRight: "0.625rem",
              border: "none",
            }}
            width="100%"
            type="text"
            name=""
          />
        </Flex>
        {error ? (
          <Span color="red" fontSize="13px" style={{ margin: "0px 0.625rem", padding: "0px 0" }}>
            Shop name is Incorrect
          </Span>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          columnGap: "2.5rem",
          justifyContent: "flex-end",
        }}
      >
        <button
          style={{
            border: "none",
            height: "3.125rem",
            width: "fit-content",
            backgroundColor: "transparent",
            color: "#9EA8B7",
            cursor: "pointer",
          }}
          onClick={props.closeModal}
        >
          Cancel
        </button>
        <button
          style={{
            backgroundColor: "#FF5050",
            height: "3.125rem",
            width: "170px",
            color: "#fff",
            border: "none",
            borderRadius: "0.75rem",
            cursor: "pointer",
          }}
          onClick={() => handleDelete()}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
