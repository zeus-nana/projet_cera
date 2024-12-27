import { Outlet } from "react-router-dom";
import styled from "styled-components";

const StyledReport = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;
function Reporting() {
  return (
    <StyledReport>
      <Outlet />
    </StyledReport>
  );
}

export default Reporting;
