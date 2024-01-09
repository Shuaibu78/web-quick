import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;

  #add-new-invoice {
    margin: 0 1.75rem;
  }

  input[type='date']::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
  }

  .details-tab {
    cursor: pointer;
    padding: 0.5rem;
    color: ${Colors.grey};
    font-size: 1.2rem;
  }

  .active-details-tab {
    color: ${Colors.secondaryColor};
    border-bottom: 3px solid ${Colors.secondaryColor};
  }
`;
