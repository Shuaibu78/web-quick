import styled from "styled-components";
interface ICardProps {
  width: string;
}
export const Card = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1.875rem 48px 1.875rem;
  max-width: ${(props: ICardProps) => props.width};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 434px) {
    padding: 1.25rem 28px 1.25rem;
  }
`;
