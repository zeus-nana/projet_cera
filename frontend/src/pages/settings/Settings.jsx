import { Outlet } from "react-router-dom";
import styled from "styled-components";

const StyledSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

function Settings() {
  return (
    <StyledSettings>
      <Outlet />
    </StyledSettings>
  );
}

export default Settings;
