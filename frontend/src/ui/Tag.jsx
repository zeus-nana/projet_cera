import styled from 'styled-components';

const Tag = styled.span`
  display: inline-block;
  width: fit-content;
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  /* Make these dynamic, based on the received prop */
  color: var(--color-${(props) => props.type}-700);
  background-color: var(--color-${(props) => props.type}-100);

  @media (max-width: 1366px) {
    font-size: 1rem;
    padding: 0.36rem 1.08rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.32rem 0.96rem;
  }
`;

export default Tag;
