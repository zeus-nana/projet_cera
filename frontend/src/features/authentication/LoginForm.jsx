import { useState } from "react";
import { useLogin } from "./useLogin";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinnerMini";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import Logo from "../../ui/Logo.jsx";
import styled from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-bottom: 3rem;
  margin-top: 3rem;
`;

const LoginTitle = styled.h2`
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const TitleContainer = styled.div`
  border-radius: 5px;
  background-color: var(--color-grey-200);
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

function LoginForm({ onResetPassword }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, isLoading } = useLogin(onResetPassword);

  function handleSubmit(e) {
    e.preventDefault();
    if (!login || !password) {
      return toast.error("Veuillez renseigner tous les champs");
    }

    signIn(
      { login, password },
      {
        onSettled: () => {
          setLogin("");
          setPassword("");
        },
      },
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Logo />

      <StyledHeader>
        <TitleContainer>
          <LoginTitle>Welcome</LoginTitle>
        </TitleContainer>
      </StyledHeader>

      <FormRowVertical label="Login">
        <Input
          type="text"
          id="login"
          autoComplete="username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>
      <FormRowVertical label="Mot de passe">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={isLoading}>
          {!isLoading ? "Se connecter" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

LoginForm.propTypes = {
  onResetPassword: PropTypes.func,
};

export default LoginForm;
