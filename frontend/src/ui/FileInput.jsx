import styled from 'styled-components';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FileInputWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledFileInput = styled.input`
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
`;

const StyledLabel = styled.label`
  display: inline-block;
  padding: 0.8rem 1.2rem;
  background-color: var(--color-brand-600);
  color: var(--color-brand-50);
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-brand-700);
  }
`;

const FileInfo = styled.span`
  margin-left: 1rem;
  font-size: 1.4rem;
`;

// eslint-disable-next-line react/display-name
const FileInput = React.forwardRef((props, ref) => {
  const { extensions, onChange, ...rest } = props;
  const accept = extensions && extensions.map((ext) => `.${ext}`).join(', ');
  const [fileInfo, setFileInfo] = useState('Aucun fichier selectionné');

  const handleChange = (event) => {
    const fileCount = event.target.files.length;
    if (fileCount > 0) {
      setFileInfo(`${fileCount} fichier${fileCount > 1 ? 's' : ''} sélectionné${fileCount > 1 ? 's' : ''}`);
    } else {
      setFileInfo('Aucun fichier sélectionné');
    }
    onChange && onChange(event);
  };

  return (
    <FileInputWrapper>
      <StyledLabel>
        Choisir des fichiers
        <StyledFileInput type="file" multiple accept={accept} ref={ref} onChange={handleChange} {...rest} />
      </StyledLabel>
      <FileInfo>{fileInfo}</FileInfo>
    </FileInputWrapper>
  );
});

FileInput.propTypes = {
  extensions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
};

export default FileInput;
