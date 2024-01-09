/* eslint-disable quotes */
import styled from "styled-components";
import { BoxShadows } from "../../GlobalStyles/theme";

const { cardBoxShadow } = BoxShadows;

export const CardDetails = styled.div`
  .flex {
    width: 100%;
    display: flex;
  }

  .profile-container {
    margin: 5% 0;
    display: flex;
    width: 100%;
  }

  .product-img {
    display: flex;
    margin-right: 1rem;
    align-items: center;
  }

  .product-detail-cont {
    display: flex;
    gap: 0.8rem;
    flex-direction: column;
    justify-content: space-between;
  }
  .detail {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10rem;
    justify-content: space-between;
  }

  h3 {
    font-style: normal;
    font-weight: 600;
    font-size: 1rem;
    line-height: 19px;
    color: #607087;
  }

  p {
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1rem;
    color: #607087;
  }

  .sold {
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 0.875rem;
    color: #607087;
  }
  .p2 {
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 0.875rem;
    color: #ffbe62;
  }

  .label-items-container {
    p {
      padding: 10% 0;
      font-style: normal;
      font-weight: 400;
      font-size: 0.875rem;
      line-height: 1rem;
      color: #8196b3;
      @media screen and (max-width: 1115px) {
        font-size: 0.75rem;
      }
    }
    margin-right: 20%;
  }

  .items-container {
    p {
      padding: 6.2% 0;
      font-style: normal;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1rem;
      color: #607087;
      @media screen and (max-width: 1115px) {
        font-size: 0.75rem;
        padding: 7% 0;
      }
    }
  }
`;
interface IExpand {
  expand?: boolean;
}
export const Entry = styled.div<IExpand>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 0.625rem;
  flex-direction: column;
  position: relative;
  margin-bottom: 1.25rem;

  &:last-child {
    .ellipses {
      display: none;
    }
  }

  .expand {
    position: absolute;
    left: 60%;
    right: 40%;
    bottom: 0.3rem;
    transition: all 0.3s ease-out;
    transform: ${({ expand }) => (expand ? `rotate(180deg)` : `rotate(0deg)`)};
  }
  .ellipses {
    position: absolute;
    left: 2.8rem;
    bottom: -1.5rem;

    @media only screen and (min-width: 1600px) {
      left: 3.7rem;
    }
    @media only screen and (min-width: 1400px) {
      left: 3.3rem;
    }
  }

  .expand-details {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    width: 80%;
    background-color: #fff;
    border-radius: 0.75rem;
    top: 5rem;
    right: 0rem;
    z-index: 20;
    box-shadow: ${cardBoxShadow};
  }
`;
