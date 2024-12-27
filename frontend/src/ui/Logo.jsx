import styled from 'styled-components';

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 7rem;
  width: auto;

  @media (max-width: 1366px) {
    height: 6.3rem;
  }
`;

function Logo() {
  const src = '/logo-cera.svg';

  return (
    <StyledLogo>
      <Img src={src} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
