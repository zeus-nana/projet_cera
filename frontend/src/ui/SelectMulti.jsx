import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: '1px solid var(--color-grey-300)',
    backgroundColor: 'var(--color-grey-0)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.2rem 0.4rem',
    boxShadow: 'var(--shadow-sm)',
    fontSize: '1.4rem',
    width: '100%',
    '&:hover': {
      borderColor: 'var(--color-grey-300)',
    },
    '&:focus-within': {
      outline: 'none',
      borderColor: 'var(--color-brand-600)',
      boxShadow: '0 0 0 2px rgba(var(--color-brand-600-rgb), 0.1)',
    },
    '@media (max-width: 1366px)': {
      fontSize: '1.26rem',
      padding: '0.18rem 0.36rem',
    },
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
      padding: '0.16rem 0.32rem',
    },
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--color-grey-700)', // Même couleur que le texte normal
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'var(--color-brand-600)'
      : state.isFocused
        ? 'var(--color-grey-100)'
        : 'transparent',
    color: state.isSelected ? 'white' : 'inherit',
    '&:active': {
      backgroundColor: 'var(--color-brand-700)',
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'var(--color-grey-100)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: '1.4rem',
    color: 'var(--color-grey-700)',
    '@media (max-width: 1366px)': {
      fontSize: '1.26rem',
    },
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
    },
  }),
  multiValueRemove: (base) => ({
    ...base,
    ':hover': {
      backgroundColor: 'var(--color-grey-200)',
      color: 'var(--color-grey-800)',
    },
  }),
};

const SelectMulti = React.forwardRef(
  (
    {
      id,
      options,
      placeholder = 'Sélectionnez une',
      isMulti = false, // Optionnel, default false
      ...props
    },
    ref
  ) => {
    return (
      <Select
        id={id}
        ref={ref}
        isMulti={isMulti}
        options={options.map((option) => ({
          value: option.value,
          label: option.label.toUpperCase(),
        }))}
        styles={customStyles}
        placeholder={placeholder}
        noOptionsMessage={() => 'Aucune option disponible'}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        classNamePrefix="react-select"
        {...props}
      />
    );
  }
);

SelectMulti.propTypes = {
  id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  isMulti: PropTypes.bool,
};

SelectMulti.displayName = 'SelectMulti';

export default SelectMulti;
