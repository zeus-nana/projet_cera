import styled from "styled-components";
import Heading from "../ui/Heading";
import { useMoveBack } from "../hooks/useMoveBack.js";
import Button from "../ui/Button.jsx";

const StyledPageNotFound = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;

const Box = styled.div`
  /* box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 4.8rem;
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: 3.2rem;
  }
`;

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <StyledPageNotFound>
      <Box>
        <Heading as="h1">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          La page que vous recherchez n'existe pas 😢
        </Heading>
        <Button onClick={moveBack} size="large">
          &larr; Retour
        </Button>
      </Box>
    </StyledPageNotFound>
  );
}

export default PageNotFound;
