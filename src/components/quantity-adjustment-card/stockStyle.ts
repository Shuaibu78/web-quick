import styled from "styled-components";

export const CardDetails = styled.div`
  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    grid-row-gap: 220px;
    width: 100%;
  }

  .profile-container {
    margin: 5% 0;
  }

  .profile-img {
    margin-right: 8%;
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

  .p2 {
    margin-top: 8%;
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 0.875rem;
    color: #ffbe62;
  }

  .label-items-container {
    width: 45%;
    p {
      padding: 1.25rem 0;
      font-style: normal;
      font-weight: 400;
      font-size: 0.875rem;
      line-height: 1rem;
      color: #8196b3;
      @media screen and (max-width: 1115px) {
        font-size: 0.75rem;
      }
    }
  }

  .items-container {
    width: 45%;
    p {
      padding: 1.25rem 0;
      font-style: normal;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1rem;
      color: #607087;
      @media screen and (max-width: 1115px) {
        font-size: 0.75rem;
      }
    }
  }
`;
