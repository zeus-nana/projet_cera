import { cloneElement, createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';
import PropTypes from 'prop-types';

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  transition: all 0.5s;
`;

const ModalHeader = styled.div`
  background-color: var(--color-brand-600);
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
  color: var(--color-grey-0);
  padding: 1.2rem 2.4rem;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalContent = styled.div`
  padding: 3.2rem 4rem;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-brand-700);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-0);
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = setOpenName;

  return <ModalContext.Provider value={{ openName, close, open }}>{children}</ModalContext.Provider>;
}

Modal.propTypes = {
  children: PropTypes.node,
};

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

Open.propTypes = {
  children: PropTypes.node.isRequired,
  opens: PropTypes.string.isRequired,
};

function Window({ children, name, title }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <ModalHeader>
          <span>{title}</span>
          <Button onClick={close}>
            <HiXMark />
          </Button>
        </ModalHeader>
        <ModalContent>{cloneElement(children, { onCloseModal: close })}</ModalContent>
      </StyledModal>
    </Overlay>,
    // eslint-disable-next-line no-undef
    document.body
  );
}

Window.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
