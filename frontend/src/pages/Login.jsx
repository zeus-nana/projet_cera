import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm.jsx";
import ChangePasswordForm from "../features/authentication/ChangePasswordForm.jsx";
import { useState } from "react";
import Modal from "../ui/Modal.jsx";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-200);
`;

function Login() {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleResetPassword = (id) => {
    setShowResetPassword(true);
    setUserId(id);
  };

  return (
    <LoginLayout>
      <Modal>
        {showResetPassword ? (
          <ChangePasswordForm
            userId={userId}
            onPasswordChanged={() => setShowResetPassword(false)}
          />
        ) : (
          <LoginForm onResetPassword={handleResetPassword} />
        )}
      </Modal>
    </LoginLayout>
  );
}

export default Login;
