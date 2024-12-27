import styled from 'styled-components';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../constants.js';

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }

  @media (max-width: 1366px) {
    font-size: 1.26rem;
    margin-left: 0.72rem;
  }

  @media (max-width: 768px) {
    text-align: center;
    margin-left: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;

  @media (max-width: 1366px) {
    gap: 0.54rem;
  }
`;

const PaginationButton = styled.button`
  background-color: ${(props) => (props.active ? ' var(--color-brand-600)' : 'var(--color-grey-50)')};
  color: ${(props) => (props.active ? ' var(--color-brand-50)' : 'inherit')};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }

  @media (max-width: 1366px) {
    font-size: 1.26rem;
    padding: 0.54rem 1.08rem;
    gap: 0.36rem;

    &:has(span:last-child) {
      padding-left: 0.36rem;
    }

    &:has(span:first-child) {
      padding-right: 0.36rem;
    }

    & svg {
      height: 1.62rem;
      width: 1.62rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0.5rem 1rem;

    & span {
      display: none;
    }

    &:has(span:last-child),
    &:has(span:first-child) {
      padding: 0.5rem;
    }
  }
`;

function Pagination({ count, currentPage, pageCount }) {
  const [searchParams, setSearchParams] = useSearchParams();

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set('page', next);
    setSearchParams(searchParams);
  }

  function previousPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set('page', prev);
    setSearchParams(searchParams);
  }

  if (pageCount <= 1) {
    return null;
  }

  return (
    <StyledPagination>
      <P>
        Affichage de <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> à <span>{currentPage === pageCount ? count : currentPage * PAGE_SIZE}</span> sur{' '}
        <span>{count}</span>
      </P>
      <Buttons>
        <PaginationButton onClick={previousPage} disabled={currentPage === 1}>
          <HiChevronLeft /> <span>Précédent</span>
        </PaginationButton>
        <PaginationButton onClick={nextPage} disabled={currentPage === pageCount}>
          <span>Suivant</span> <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
};

export default Pagination;
