import PropTypes from 'prop-types';
import { useCreateUpdateCleListe } from './useCleListe.js';
import FormRowNew from '../../../ui/FormRowNew.jsx';
import Input from '../../../ui/Input.jsx';
import FormRow from '../../../ui/FormRow.jsx';
import Button from '../../../ui/Button.jsx';
import SpinnerMini from '../../../ui/SpinnerMini.jsx';
import Form from '../../../ui/Form.jsx';
import { useForm } from 'react-hook-form';

function CreateUpdateCleListeForm({ onCloseModal, cleListeToEdit = {} }) {
  const { id: cleListeId, ...editValues } = cleListeToEdit;
  const isEditing = Boolean(cleListeId);

  const { register, handleSubmit, formState } = useForm({
    defaultValues: isEditing ? editValues : {},
  });

  const { errors } = formState;

  const { isCreatingOrUpdating, createUpdateCleListe } = useCreateUpdateCleListe(onCloseModal);

  function onSubmit(data) {
    createUpdateCleListe(isEditing ? { id: cleListeId, ...data } : data);
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRowNew label="Libellé :" error={errors?.libelle?.message}>
        <Input
          type="text"
          id="libelle"
          disabled={isCreatingOrUpdating}
          {...register('libelle', {
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

CreateUpdateCleListeForm.propTypes = {
  onCloseModal: PropTypes.func,
  cleListeToEdit: PropTypes.object,
};

export default CreateUpdateCleListeForm;
