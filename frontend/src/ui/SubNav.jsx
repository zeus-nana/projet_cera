import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { HiMiniChevronDown, HiMiniChevronUp } from "react-icons/hi2";

const SubNavContainer = styled.div`
  width: 100%;
`;

const SubNavButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  color: var(--color-grey-600);
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1.2rem 2.4rem;
  transition: all 0.3s;
  cursor: pointer;

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

const SubNavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-left: 2.4rem;
`;

const StyledSubNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1rem;

    color: var(--color-grey-600);
    font-size: 1.4rem;
    font-weight: 500;
    padding: 0.8rem 1.6rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-100);
    border-radius: 8px;
  }

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

function SubNav({ mainIcon, mainText, items }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SubNavContainer>
      <SubNavButton onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          {mainIcon}
          <span>{mainText}</span>
        </div>
        {isOpen ? <HiMiniChevronUp /> : <HiMiniChevronDown />}
      </SubNavButton>
      {isOpen && (
        <SubNavList>
          {items.map((item) => (
            <li key={item.to}>
              <StyledSubNavLink to={item.to}>
                {item.icon}
                <span>{item.text}</span>
              </StyledSubNavLink>
            </li>
          ))}
        </SubNavList>
      )}
    </SubNavContainer>
  );
}

SubNav.propTypes = {
  mainIcon: PropTypes.node,
  mainText: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      icon: PropTypes.node,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SubNav;
