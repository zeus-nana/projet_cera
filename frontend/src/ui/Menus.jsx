import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-200);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }

  @media (max-width: 1366px) {
    padding: 0.36rem;
    transform: translateX(0.72rem);

    & svg {
      width: 2.16rem;
      height: 2.16rem;
    }
  }
`;

const StyledList = styled.ul`
  position: fixed;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;

  @media (max-width: 1366px) {
    border-radius: calc(var(--border-radius-md) * 0.9);
  }
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-200);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  @media (max-width: 1366px) {
    padding: 1.08rem 2.16rem;
    font-size: 1.26rem;
    gap: 1.44rem;

    & svg {
      width: 1.44rem;
      height: 1.44rem;
    }
  }
`;

const MenusContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState('');
  const [position, setPosition] = useState(null);

  const close = () => setOpenId('');
  const open = setOpenId;

  return <MenusContext.Provider value={{ openId, close, open, position, setPosition }}>{children}</MenusContext.Provider>;
}

Menus.propTypes = {
  children: PropTypes.node.isRequired,
};

function Toggle({ id, children, icon = <HiEllipsisVertical /> }) {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(e) {
    e.stopPropagation();

    const rect = e.target.closest('button').getBoundingClientRect();
    setPosition({
      // eslint-disable-next-line no-undef
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    openId === '' || openId !== id ? open(id) : close();
  }

  return <StyledToggle onClick={handleClick}>{children || icon}</StyledToggle>;
}

Toggle.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.node,
};

function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close, false);

  if (openId !== id) return null;

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    // eslint-disable-next-line no-undef
    document.body
  );
}

List.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
};

function Button({ children, icon, onClick, disabled }) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    if (!disabled) {
      onClick?.();
      close();
    }
  }

  return (
    <li>
      <StyledButton onClick={handleClick} disabled={disabled}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
