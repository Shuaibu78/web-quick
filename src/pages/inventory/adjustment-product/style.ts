import styled from "styled-components";

interface IDropDownProps {
  width?: string;
  margin?: string;
}
interface IMobileProps {
  margin?: string;
}

export const Button = styled.button`
  border: none;
  height: 43px;
  background: #130f26;
  border-radius: 0.75rem;
  padding: 0.75rem 24px;
  cursor: pointer;
  color: #fff;
  margin-left: 3%;
  font-size: 1rem;
`;

export const PreReceiptContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #fff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1.25rem;
  h3 {
    color: #607087;
    font-size: 1.125rem;
    margin: 0.625rem 0;
  }
  p {
    color: #8196b3;
    font-size: 0.875rem;
  }
`;

export const TitleHead = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  @media screen and (max-width: 1059px) {
    flex-direction: column;
  }
`;

export const IconCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70vh;
`;

export const ProductCard = styled.div`
  position: relative;
  padding: 1.25rem;
  margin-top: 2%;
  border-radius: 1.25rem;
  background: #f4f6f9;
  display: flex;
  width: 100%;

  flex-direction: column;
  p {
    margin: 0.625rem 0;
  }
  span {
    color: #607087;
  }
`;

export const InputOptions = styled.div`
  display: flex;
  .unit-type {
    margin-left: 1.875rem;
  }
  .input1,
  .input2,
  .input3 {
    p {
      color: #607087;
    }
  }
  @media screen and (max-width: 934px) {
    flex-direction: column;
    .unit-type {
      margin-left: 0;
    }
  }
`;

export const DropDown = styled.div`
  border: 1px solid #8196b3;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  width: ${(props: IDropDownProps) => props.width};
  margin: ${(props: IDropDownProps) => props.margin};
  @media screen and (max-width: 934px) {
    margin: 0 0;
  }
`;

export const BulkInputContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0 0.625rem;
  input {
    background: #f4f6f9;
    color: #8196b3;
    border-radius: 0.75rem;
    border: none;
    font-size: 1rem;
    height: 2.5rem;
    outline: none;
    width: 100%;
  }
  :hover button {
    display: block;
  }
`;

export const Hr = styled.hr`
  margin: 2% 0;
  border: none;
  border-bottom: 1px solid #8196b3;
`;

export const ToggleContainer = styled.div`
  /* display: flex; */
  @media screen and (max-width: 934px) {
    flex-direction: column;
    .unit-type {
      margin-left: 0;
    }
  }
  .all {
    display: flex;
  }
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Right = styled.div`
  margin-left: 5%;
  display: flex;
  flex-direction: column;
`;

export const Rightt = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BtnContainer = styled.div`
  /* margin: 13% 0; */
  display: flex;
  flex-direction: column;
  padding: 2% 0;
  @media screen and (max-width: 934px) {
    margin: 2% 0;
  }
`;

export const BtnContentWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 700px) {
    flex-direction: column;
  }
`;

export const InputContainer = styled.div`
  margin-left: 2%;
  align-items: center;
  display: flex;
`;

export const CustomInput = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.25rem;
  outline: none;
  border-radius: 0.75rem;
  border: 1px solid #8196b3;
  width: ${(props: IDropDownProps) => props.width};
  height: 2.5rem;
  background: #f4f6f9;
  box-sizing: border-box;
`;

export const CustomTextArea = styled.textarea`
  display: flex;
  padding: 1rem 1.25rem;
  outline: none;
  border-radius: 0.75rem;
  border: 1px solid #8196b3;
  width: ${(props: IDropDownProps) => props.width};
  background: #f4f6f9;
  box-sizing: border-box;
  height: 54px;
`;

export const DeleteButton = styled.button`
  position: absolute;
  display: flex;
  background: transparent;
  border: none;
  height: 100%;
  align-items: flex-start;
  right: 0;
  cursor: pointer;
  padding: 1.25rem 1.25rem;
  top: 0;
`;

export const ProductCardContainer = styled.div`
  border-radius: 1.25rem;
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const AdjustmentWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 3% 0;
  justify-content: space-between;
`;

export const LeftWrapper = styled.div`
  position: relative;
  width: 54%;
  height: 580px;
  padding: 2%;
  background: #ffffff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  @media screen and (max-width: 1149px) {
    margin-bottom: 5%;
  }

  .tableContainer {
    height: 480px;
  }

  .table {
    height: 440px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .nav {
    display: flex;
    @media screen and (max-width: 700px) {
      flex-direction: column;
    }

    h3 {
      margin-right: 5%;
    }
  }

  .control-container {
    display: flex;
    position: absolute;
    right: 1.25rem;
    top: 1.875rem;
    @media screen and (max-width: 516px) {
      top: 1.25rem;
      right: 0;
    }
    h3 {
      position: absolute;
      left: 0;
      color: #607087;
      font-size: 1.125rem;
    }
  }

  .IconContainer {
    display: flex;
    height: 90%;
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-direction: column;
  }
`;

export const RightWrapper = styled.div`
  width: 45%;
  height: 580px;
  background: #f6f8fb;
  border-radius: 1.25rem;
  padding: 0.9375rem;
`;

export const CustomFilterModal = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 2rem;
  height: 80%;
  max-width: 18.75rem;
  width: 100%;
  background: #fff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1.25rem;
  @media screen and (max-width: 530px) {
    right: 0;
  }
  h3 {
    color: #607087;
  }
  h4 {
    font-size: 0.875rem;
    color: #607087;
    padding: 0.625rem 0 0.3125rem 0;
  }
  button {
    cursor: pointer;
    background: transparent;
    border: none;
  }
`;
