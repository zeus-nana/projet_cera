import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledDateFilter = styled.div`
  padding: 0.8rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledInput = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem 0.8rem;
  font-size: 1.4rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 1.4rem;
`;

function DateFilter({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  return (
    <StyledDateFilter>
      <InputGroup>
        <Label htmlFor="startDate">du:</Label>
        <StyledInput type="date" id="startDate" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="endDate">au:</Label>
        <StyledInput type="date" id="endDate" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
      </InputGroup>
    </StyledDateFilter>
  );
}

DateFilter.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
};

export default DateFilter;
