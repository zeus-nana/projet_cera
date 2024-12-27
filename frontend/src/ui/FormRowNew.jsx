import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledFormRowNew = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr;
  gap: 2.4rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 1px;
  }

  &:last-child {
    padding-bottom: 1px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  @media (max-width: 1366px) {
    grid-template-columns: 20rem 1fr;
    gap: 2rem;
    padding: 1rem 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.8rem 0;
  }
`;

const LabelNew = styled.label`
  font-weight: 500;

  @media (max-width: 1366px) {
    font-size: 0.9em;
  }
`;

const InputContainerNew = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1px;
`;

const ErrorNew = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);

  @media (max-width: 1366px) {
    font-size: 1.26rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

function FormRowNew({ label, error, children }) {
  return (
    <StyledFormRowNew>
      {label && <LabelNew htmlFor={children.props.id}>{label}</LabelNew>}
      <InputContainerNew>
        {children}
        {error && <ErrorNew>{error}</ErrorNew>}
      </InputContainerNew>
    </StyledFormRowNew>
  );
}

FormRowNew.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default FormRowNew;
