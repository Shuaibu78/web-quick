import React, { FunctionComponent, useEffect, useRef } from "react";
import { Container, CancelButton, SearchButton } from "./style";
import searchIcon from "../../assets/search.svg";
import cancelIcon from "../../assets/cancel.svg";
import _ from "lodash";

interface SearchProps {
  placeholder: string;
  borderRadius?: string;
  height?: string;
  width?: string;
  fontSize?: string;
  background?: string;
  border?: string;
  clear?: Function;
  handleSearch: (search: string) => void;
}

const SearchInput: FunctionComponent<SearchProps> = ({
  placeholder,
  borderRadius,
  height,
  width,
  fontSize,
  handleSearch,
  background,
  border,
  clear,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    if (searchInputRef?.current) {
      searchInputRef.current.value = "";
      handleSearch("");
    }
  };

  useEffect(() => {
    if (searchInputRef?.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <Container
      borderRadius={borderRadius}
      background={background}
      border={border}
      height={height}
      width={width}
      fontSize={fontSize}
    >
      <SearchButton onClick={() => handleSearch(searchInputRef?.current?.value || "")}>
        <img src={searchIcon} alt="" />
      </SearchButton>
      <input
        type="text"
        placeholder={placeholder}
        ref={searchInputRef}
        onChange={_.debounce(() => handleSearch(searchInputRef?.current?.value || ""), 500)}
      />
      {searchInputRef?.current?.value && (
        <CancelButton onClick={clearInput}>
          <img src={cancelIcon} alt="" />
        </CancelButton>
      )}
    </Container>
  );
};

export default SearchInput;
