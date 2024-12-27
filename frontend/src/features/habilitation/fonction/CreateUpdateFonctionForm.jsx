import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useCreateUpdateFonction } from './useCreateUpdateFonction.js';
import FormRow from '../../../ui/FormRow.jsx';
import Input from '../../../ui/Input.jsx';
import Textarea from '../../../ui/Textarea.jsx';
import Button from '../../../ui/Button.jsx';
import SpinnerMini from '../../../ui/SpinnerMini.jsx';
import Form from '../../../ui/Form.jsx';
import FormRowNew from '../../../ui/FormRowNew.jsx';

function CreateUpdateFonctionForm({ onCloseModal, fonctionToEdit = {} }) {
  const { id: fonctionId, ...editValues } = fonctionToEdit;
  const isEditing = Boolean(fonctionId);

  const { register, handleSubmit, formState } = useForm({
    defaultValues: isEditing ? editValues : {},
  });

  const { errors } = formState;

  const { isCreatingOrUpdating, createUpdateFonction } = useCreateUpdateFonction(onCloseModal);

  function onSubmit(data) {
    createUpdateFonction(isEditing ? { id: fonctionId, ...data } : data);
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRowNew label="Nom" error={errors?.nom?.message}>
        <Input
          type="text"
          id="nom"
          disabled={isCreatingOrUpdating}
          {...register('nom', {
            required: 'Ce champ est obligatoire.',
          })}
        />
      </FormRowNew>

      <FormRowNew label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isCreatingOrUpdating}
          {...register('description', {
            required: 'Ce champ est obligatoire.',
          })}
        />
      </FormRowNew>

      <FormRow>
        <Button $variation="secondary" type="reset" onClick={() => onCloseModal?.()} disabled={isCreatingOrUpdating}>
          Annuler
        </Button>
        <Button disabled={isCreatingOrUpdating}>{isCreatingOrUpdating ? <SpinnerMini /> : isEditing ? 'Mettre à jour' : 'Créer'}</Button>
      </FormRow>
    </Form>
  );
}

CreateUpdateFonctionForm.propTypes = {
  onCloseModal: PropTypes.func,
  fonctionToEdit: PropTypes.object,
};

export default CreateUpdateFonctionForm;
