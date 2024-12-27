import styled from 'styled-components';

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  font-size: 1.4rem;

  @media (max-width: 1366px) {
    font-size: 1.26rem;
    padding: 0.72rem 1.08rem;
    border-radius: calc(var(--border-radius-sm) * 0.9);
  }
`;

export default Input;
