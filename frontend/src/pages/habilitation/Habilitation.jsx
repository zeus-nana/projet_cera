import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const StyledHabilitation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;
function Habilitation() {
  return (
    <StyledHabilitation>
      <Outlet />
    </StyledHabilitation>
  );
}

export default Habilitation;
