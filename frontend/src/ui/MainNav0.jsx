import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { HiOutlineBars4, HiOutlineHome, HiOutlineUsers } from "react-icons/hi2";
import SubNav from "./SubNav";
import PropTypes from "prop-types";
import { HiOutlineChartBar, HiOutlineUpload } from "react-icons/hi";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavItem = styled.li`
  list-style: none;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: var(--color-grey-600);
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1.2rem 2.4rem;
  text-decoration: none;
  transition: all 0.3s;

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

function NavItem({ icon, text, to, subItems }) {
  if (subItems) {
    return (
      <StyledNavItem>
        <SubNav mainIcon={icon} mainText={text} items={subItems} />
      </StyledNavItem>
    );
  }

  return (
    <StyledNavItem>
      <StyledNavLink to={to}>
        {icon}
        <span>{text}</span>
      </StyledNavLink>
    </StyledNavItem>
  );
}

NavItem.propTypes = {
  icon: PropTypes.element,
  text: PropTypes.string.isRequired,
  to: PropTypes.string,
  subItems: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      icon: PropTypes.element,
      text: PropTypes.string.isRequired,
    }),
  ),
};

function MainNav0() {
  const navItems = [
    { icon: <HiOutlineHome />, text: "Accueil", to: "/" },
    { icon: <HiOutlineChartBar />, text: "Dashboard", to: "/dashboard" },
    { icon: <HiOutlineUpload />, text: "Chargement", to: "/chargement" },
    { icon: <HiOutlineUsers />, text: "Utilisateurs", to: "/users" },
    {
      icon: <HiOutlineBars4 />,
      text: "Reporting",
      subItems: [
        {
          to: "/reporting/transactions",
          text: "Globale",
        },
        {
          to: "/reporting/transactions-agrege",
          text: "Agrégées",
        },
      ],
    },
  ];

  return (
    <nav>
      <NavList>
        {navItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </NavList>
    </nav>
  );
}

export default MainNav0;
