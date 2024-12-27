import styled, { css } from 'styled-components';

const Form = styled.form`
  ${(props) =>
    props.type !== 'modal' &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: 20px;
    `}

  ${(props) =>
    props.type === 'modal' &&
    css`
      width: 60rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

export default Form;
