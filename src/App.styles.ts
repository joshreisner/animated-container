import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  gap: 1rem;
  margin: 1rem auto;
  @media (min-width: 768px) {
    margin: 2rem auto;
    max-width: 720px;
  }
  @media (min-width: 992px) {
    margin: 3rem auto;
    max-width: 960px;
  }
  @media (min-width: 1200px) {
    margin: 4rem auto;
    max-width: 1140px;
  }
  @media (min-width: 1400px) {
    margin: 5rem auto;
    max-width: 1320px;
  }
`;

export const Filter = styled.nav`
  display: flex;
  flex-wrap: wrap;
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

export const GridWrapper = styled.div`
  > div {
    align-content: start;
    background-color: beige;
    display: grid;
    gap: 1rem;
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 992px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (min-width: 1400px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }
`;

export const Item = styled.div`
  align-items: center;
  color: white;
  display: flex;
  height: 7rem;
  justify-content: center;
`;
