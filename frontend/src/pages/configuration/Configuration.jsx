import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const StyledConfiguration = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;
function Configuration() {
  return (
    <StyledConfiguration>
      <Outlet />
    </StyledConfiguration>
  );
}

export default Configuration;
