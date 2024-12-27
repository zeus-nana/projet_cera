import styled, { css } from 'styled-components';

const Heading = styled.h1`
  line-height: 1.4;

  ${(props) =>
    props.as === 'h1' &&
    css`
      font-size: 3rem;
      font-weight: 600;

      @media (max-width: 1366px) {
        font-size: 2.7rem;
      }

      @media (max-width: 768px) {
        font-size: 2.4rem;
      }

      @media (max-width: 480px) {
        font-size: 2.1rem;
      }
    `}

  ${(props) =>
    props.as === 'h2' &&
    css`
      font-size: 2rem;
      font-weight: 500;

      @media (max-width: 1366px) {
        font-size: 1.8rem;
      }

      @media (max-width: 768px) {
        font-size: 1.6rem;
      }

      @media (max-width: 480px) {
        font-size: 1.4rem;
      }
    `}

  ${(props) =>
    props.as === 'h3' &&
    css`
      font-size: 2rem;
      font-weight: 400;

      @media (max-width: 1366px) {
        font-size: 1.8rem;
      }

      @media (max-width: 768px) {
        font-size: 1.6rem;
      }

      @media (max-width: 480px) {
        font-size: 1.4rem;
      }
    `}

  ${(props) =>
    props.as === 'h4' &&
    css`
      font-size: 1.5rem;
      font-weight: 300;
      text-align: center;

      @media (max-width: 1366px) {
        font-size: 1.4rem;
      }

      @media (max-width: 768px) {
        font-size: 1.3rem;
      }

      @media (max-width: 480px) {
        font-size: 1.2rem;
      }
    `}
`;

export default Heading;
