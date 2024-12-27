import PropTypes from "prop-types";
import { useUser } from "../features/authentication/useUser.js";
import Spinner from "./Spinner.jsx";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-0);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      }
      setIsCheckingAuth(false);
    }
  }, [navigate, isAuthenticated, isLoading]);

  if (isLoading || isCheckingAuth) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  return isAuthenticated ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
