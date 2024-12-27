import styled, { css } from 'styled-components';

const Row = styled.div`
  display: flex;

  ${(props) =>
    props.type === 'horizontal' &&
    css`
      justify-content: space-between;
      align-items: center;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 1.6rem;
      }
    `}

  ${(props) =>
    props.type === 'vertical' &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `};

  @media (max-width: 1366px) {
    gap: 1.44rem;
  }

  @media (max-width: 480px) {
    gap: 1.2rem;
  }
`;

Row.defaultProps = {
  type: 'vertical',
};

export default Row;
