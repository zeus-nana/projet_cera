import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledFormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.2rem 0;

  @media (max-width: 1366px) {
    gap: 0.36rem;
    padding: 1.08rem 0;
  }

  @media (max-width: 768px) {
    gap: 0.32rem;
    padding: 0.96rem 0;
  }
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 1.4rem;

  @media (max-width: 1366px) {
    font-size: 1.26rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);

  @media (max-width: 1366px) {
    font-size: 1.26rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

function FormRowVertical({ label, error, children }) {
  return (
    <StyledFormRow>
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

FormRowVertical.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node,
};

export default FormRowVertical;
