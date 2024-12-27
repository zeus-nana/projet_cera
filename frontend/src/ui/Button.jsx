// Button.jsx
import styled, { css } from 'styled-components';

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;

    @media (max-width: 1366px) {
      font-size: 1.08rem;
      padding: 0.36rem 0.72rem;
    }
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;

    @media (max-width: 1366px) {
      font-size: 1.26rem;
      padding: 1.08rem 1.44rem;
    }
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;

    @media (max-width: 1366px) {
      font-size: 1.44rem;
      padding: 1.08rem 2.16rem;
    }
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
  excel: css`
    color: white;
    background-color: var(--color-green-700);

    &:hover {
      background-color: var(--color-green-800);
    }
  `,
};

const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  ${(props) => sizes[props.size]}
  ${(props) => variations[props.$variation]};

  @media (max-width: 1366px) {
    border-radius: calc(var(--border-radius-sm) * 0.9);
  }
`;

Button.defaultProps = {
  $variation: 'primary',
  size: 'medium',
};

export default Button;
