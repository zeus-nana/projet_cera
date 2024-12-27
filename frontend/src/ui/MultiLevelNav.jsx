import { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { HiMiniChevronDown, HiMiniChevronUp } from 'react-icons/hi2';
import PropTypes from 'prop-types';

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-left: ${(props) => (props.$level > 1 ? props.$level * 1 : 0)}rem;
`;

const StyledNavItem = styled.li`
  list-style: none;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: var(--color-grey-600);
  font-size: ${(props) => 1.6 - props.$level * 0.1}rem;
  font-weight: 500;
  padding: 1rem 2.4rem;
  text-decoration: none;
  transition: all 0.3s;

  @media (max-width: 1366px) {
    font-size: 1.4rem;
  }

  &:hover,
  &.active {
    color: var(--color-grey-800);
    background-color: var(--color-grey-100);
    border-radius: 12px;
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &.active svg {
    color: var(--color-brand-600);
  }
`;

const SubNavButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  color: var(--color-grey-600);
  font-size: ${(props) => 1.6 - props.$level * 0.1}rem;
  font-weight: 500;
  padding: 1rem 2.4rem;
  transition: all 0.3s;
  cursor: pointer;

  @media (max-width: 1366px) {
    font-size: 1.4rem;
  }

  &:hover {
    color: var(--color-grey-800);
    background-color: var(--color-grey-100);
    border-radius: 12px;
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg {
    color: var(--color-brand-600);
  }

  &:focus {
    outline: none;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
`;

const NavItem = ({ icon, text, to, subItems, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (subItems) {
    return (
      <StyledNavItem>
        <SubNavButton onClick={() => setIsOpen(!isOpen)} $level={level}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <IconWrapper>{icon}</IconWrapper>
            <span>{text}</span>
          </div>
          {isOpen ? <HiMiniChevronUp /> : <HiMiniChevronDown />}
        </SubNavButton>
        {isOpen && (
          <NavList $level={level + 1}>
            {subItems.map((item, index) => (
              <NavItem key={index} {...item} level={level + 1} />
            ))}
          </NavList>
        )}
      </StyledNavItem>
    );
  }

  return (
    <StyledNavItem>
      <StyledNavLink to={to} $level={level}>
        <IconWrapper>{icon}</IconWrapper>
        <span>{text}</span>
      </StyledNavLink>
    </StyledNavItem>
  );
};

NavItem.propTypes = {
  icon: PropTypes.element,
  text: PropTypes.string.isRequired,
  to: PropTypes.string,
  subItems: PropTypes.array,
  level: PropTypes.number,
};

const MainNav = ({ items }) => {
  return (
    <nav>
      <NavList $level={0}>
        {items.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </NavList>
    </nav>
  );
};

MainNav.propTypes = {
  items: PropTypes.array.isRequired,
};

export default MainNav;
