import Form from '../../ui/Form.jsx';
import FormRowVertical from '../../ui/FormRowVertical.jsx';
import Input from '../../ui/Input.jsx';
import Button from '../../ui/Button.jsx';
import SpinnerMini from '../../ui/SpinnerMini.jsx';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useChangePassword } from './useChangePassword.js';
import validator from 'validator/es';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ButtonStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;

// const StyledHeader = styled.header`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
//   padding-bottom: 1rem;
//   padding-left: 1rem;
//   padding-right: 1rem;
//   margin-bottom: 1rem;
// `;
//
// const LoginTitle = styled.h2`
//   text-align: center;
//   font-weight: 600;
//   margin-top: 0.4rem;
// `;

function ChangePasswordForm({ onCloseModal, onPasswordChanged, userId }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading, changePass } = useChangePassword(onCloseModal);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
  };

  function handleCancel() {
    if (!onCloseModal) {
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-undef
        window.location.reload();
      } else {
        // Si window n'est pas défini, utilisez navigate pour recharger la page
        navigate(0);
      }
    } else {
      onCloseModal();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!currentPassword || !password || !confirmPassword) {
      return toast.error('Veuillez renseigner tous les champs');
    }
    if (password !== confirmPassword) {
      return toast.error('Les mots de passe ne correspondent pas');
    }

    if (!validatePassword(password)) {
      return toast.error(
        "Le mot de passe n'est pas assez fort. Il doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un symbole."
      );
    }

    changePass(
      { userId, currentPassword, newPassword: password },
      {
        onSuccess: () => {
          onPasswordChanged();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Ancien mot de passe">
        <Input
          type="password"
          id="oldPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="current-password"
        />
      </FormRowVertical>
      <FormRowVertical label="Nouveau mot de passe">
        <Input
          type="password"
          id="newPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="new-password"
        />
      </FormRowVertical>
      <FormRowVertical label="Confirmer le mot de passe">
        <Input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="new-password"
        />
      </FormRowVertical>
      <FormRowVertical>
        <ButtonStyled>
          <Button $variation="secondary" type="reset" onClick={handleCancel} disabled={isLoading}>
            Annuler
          </Button>
          <Button size="medium" disabled={isLoading}>
            {!isLoading ? 'Enregistrer' : <SpinnerMini />}
          </Button>
        </ButtonStyled>
      </FormRowVertical>
    </Form>
  );
}

ChangePasswordForm.propTypes = {
  onPasswordChanged: PropTypes.func,
  onCloseModal: PropTypes.func,
  userId: PropTypes.number,
};

export default ChangePasswordForm;
