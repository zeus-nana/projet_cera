import styled from 'styled-components';

const ButtonIcon = styled.button`
  background: none;
  border: none;
  padding: 0.6rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-brand-600);
  }

  @media (max-width: 1366px) {
    padding: 0.5rem;

    & svg {
      width: 2rem;
      height: 2rem;
    }
  }

  @media (max-width: 768px) {
    padding: 0.4rem;

    & svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }

  @media (hover: none) {
    &:hover {
      background-color: transparent;
    }

    &:active {
      background-color: var(--color-grey-100);
    }
  }
`;

export default ButtonIcon;
