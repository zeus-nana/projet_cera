import PropTypes from 'prop-types';
import { useCreateUpdateEtat } from './useEtat.js';
import FormRowNew from '../../../ui/FormRowNew.jsx';
import Input from '../../../ui/Input.jsx';
import FormRow from '../../../ui/FormRow.jsx';
import Button from '../../../ui/Button.jsx';
import SpinnerMini from '../../../ui/SpinnerMini.jsx';
import Form from '../../../ui/Form.jsx';
import { useForm } from 'react-hook-form';

function CreateUpdateEtatForm({ onCloseModal, etatToEdit = {} }) {
  const { id: etatId, ...editValues } = etatToEdit;
  const isEditing = Boolean(etatId);

  const { register, handleSubmit, formState } = useForm({
    defaultValues: isEditing ? editValues : {},
  });

  const { errors } = formState;

  const { isCreatingOrUpdating, createUpdateEtat } = useCreateUpdateEtat(onCloseModal);

  function onSubmit(data) {
    createUpdateEtat(isEditing ? { id: etatId, ...data } : data);
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRowNew label="État :" error={errors?.etat?.message}>
        <Input
          type="text"
          id="etat"
          disabled={isCreatingOrUpdating}
          {...register('etat', {
            required: 'Ce champ est obligatoire.',
          })}
        />
      </FormRowNew>

      <FormRow>
        <Button $variation="secondary" type="reset" onClick={() => onCloseModal?.()} disabled={isCreatingOrUpdating}>
          Annuler
        </Button>
        <Button disabled={isCreatingOrUpdating}>
          {isCreatingOrUpdating ? <SpinnerMini /> : isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </FormRow>
    </Form>
  );
}

CreateUpdateEtatForm.propTypes = {
  onCloseModal: PropTypes.func,
  etatToEdit: PropTypes.object,
};

export default CreateUpdateEtatForm;
