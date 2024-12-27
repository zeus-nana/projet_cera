import PropTypes from 'prop-types';
import FormRow from '../../ui/FormRow';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput.jsx';
import styled from 'styled-components';
import { useUploadFile } from './useUploadFile.js';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Form = styled.form`
  width: 50rem;
  overflow: hidden;
  font-size: 1.4rem;
`;

// const StyledHeader = styled.header`
//   display: flex;
//   gap: 1rem;
//   padding-bottom: 3rem;
//   font-size: 2.5rem;
//   font-weight: 600;
//   text-align: center;
//   line-height: 1.4;
// `;

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB en octets
const TOTAL_MAX_SIZE = 20 * 1024 * 1024; // 20 MB en octets

function UploadFileForm({ onCloseModal }) {
  const [files, setFiles] = useState([]);
  const { uploadingFiles, isUploading } = useUploadFile(() => {
    onCloseModal?.();
    // Vous pouvez ajouter d'autres actions ici si nécessaire
  });

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length > MAX_FILES) {
      toast.error(`Vous ne pouvez pas télécharger plus de ${MAX_FILES} fichiers à la fois.`);
      return;
    }

    let totalSize = 0;
    const validFiles = selectedFiles.filter((file) => {
      totalSize += file.size;
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Le fichier "${file.name}" dépasse la taille maximale autorisée de 5 MB.`);
        return false;
      }
      return true;
    });

    if (totalSize > TOTAL_MAX_SIZE) {
      toast.error(`La taille totale des fichiers dépasse la limite de 20 MB.`);
      return;
    }

    setFiles(validFiles);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (files.length > 0) {
      uploadingFiles(files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Form type={onCloseModal ? 'modal' : 'default'} onSubmit={handleSubmit}>
      <FileInput
        type="file"
        extensions={['csv', 'xls', 'xlsx']}
        onChange={handleFileChange}
        multiple // Permet la sélection de plusieurs fichiers
      />

      {files.length > 0 && (
        <div>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} - {formatFileSize(file.size)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <FormRow>
        <Button $variation="secondary" type="button" onClick={() => onCloseModal?.()} disabled={isUploading}>
          Annuler
        </Button>
        <Button size="medium" type="submit" disabled={isUploading || files.length === 0}>
          {isUploading ? 'Chargement en cours...' : 'Charger'}
        </Button>
      </FormRow>
    </Form>
  );
}

UploadFileForm.propTypes = {
  onCloseModal: PropTypes.func,
};

export default UploadFileForm;
