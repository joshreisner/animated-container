import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  gap: 1rem;
  margin: 5rem auto;
  max-width: 75rem;
`;

export const Filter = styled.nav`
  display: flex;
  gap: 1rem;
  button {
    background-color: white;
    border: 1px solid black;
    cursor: pointer;
    font-size: 1rem;
    margin: 0;
    padding: 0.5rem 1rem;
    &.selected {
      background-color: black;
      color: white;
    }
  }
`;

export const Item = styled.div`
  align-items: center;
  color: white;
  display: flex;
  height: 7rem;
  justify-content: center;
  width: calc(25% - 0.75rem);
`;
