import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useCreateUpdateMenu } from './useCreateUpdateMenu.js';
import FormRow from '../../../ui/FormRow.jsx';
import Input from '../../../ui/Input.jsx';
import Textarea from '../../../ui/Textarea.jsx';
import Button from '../../../ui/Button.jsx';
import SpinnerMini from '../../../ui/SpinnerMini.jsx';
import Form from '../../../ui/Form.jsx';
import FormRowNew from '../../../ui/FormRowNew.jsx';

function CreateUpdateMenuForm({ onCloseModal, menuToEdit = {} }) {
  const { id: menuId, ...editValues } = menuToEdit;
  const isEditing = Boolean(menuId);

  const { register, handleSubmit, formState } = useForm({
    defaultValues: isEditing ? editValues : {},
  });

  const { errors } = formState;

  const { isCreatingOrUpdating, createUpdateMenu } = useCreateUpdateMenu(onCloseModal);

  function onSubmit(data) {
    createUpdateMenu(isEditing ? { id: menuId, ...data } : data);
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

CreateUpdateMenuForm.propTypes = {
  onCloseModal: PropTypes.func,
  menuToEdit: PropTypes.object,
};

export default CreateUpdateMenuForm;
