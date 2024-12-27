import styled from 'styled-components';
import Button from './Button';
import PropTypes from 'prop-types';
import { useActivateUser } from '../features/users/useActivateUser.js';
import { useDeactivateUser } from '../features/users/useDeactivateUser.js';
import { useResetUserPassword } from '../features/users/useResetUserPassword.js';

const StyledConfirmAction = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmAction({ onConfirm, disabled, onCloseModal, action, id }) {
  const { isActivating, activateUser } = useActivateUser(onCloseModal);
  const { isDeactivating, deactivateUser } = useDeactivateUser(onCloseModal);
  const { isResetting, resetUserPassword } = useResetUserPassword(onCloseModal);

  if (action === 'activate') {
    onConfirm = () => activateUser(id);
  } else if (action === 'deactivate') {
    onConfirm = () => deactivateUser(id);
  } else if (action === 'resetUserPassword') {
    onConfirm = () => resetUserPassword(id);
  }

  return (
    <StyledConfirmAction>
      <p>Voulez vous vraiment confirmer ?</p>

      <div>
        <Button $variation="secondary" disabled={disabled} onClick={onCloseModal}>
          Annuler
        </Button>
        <Button $variation="danger" disabled={isActivating || isDeactivating || isResetting} onClick={onConfirm}>
          Continuer
        </Button>
      </div>
    </StyledConfirmAction>
  );
}

ConfirmAction.propTypes = {
  resourceName: PropTypes.string,
  onConfirm: PropTypes.func,
  disabled: PropTypes.bool,
  onCloseModal: PropTypes.func,
  action: PropTypes.string,
  id: PropTypes.number,
};

export default ConfirmAction;
