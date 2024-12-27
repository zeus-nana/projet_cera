import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { useCreateUpdateListe } from './useListeToUse.js';
import FormRow from '../../../ui/FormRow';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import SpinnerMini from '../../../ui/SpinnerMini';
import Form from '../../../ui/Form';
import FormRowNew from '../../../ui/FormRowNew';
import SelectMulti from '../../../ui/SelectMulti.jsx';
import { useGetCleListes } from '../cle-liste/useCleListe.js';

function CreateUpdateListeToUseForm({ onCloseModal, listeToEdit = {} }) {
  const { id: listeId, ...editValues } = listeToEdit;
  const isEditing = Boolean(listeId);

  const { register, handleSubmit, formState, control } = useForm({
    defaultValues: isEditing ? editValues : {},
  });

  const { errors } = formState;

  const { isCreatingOrUpdating, createUpdateListe } = useCreateUpdateListe(onCloseModal);
  const { cleListes, isLoading: isLoadingCleListes } = useGetCleListes();

  const cleListeOptions =
    cleListes?.map((cle) => ({
      value: cle.id.toString(),
      label: cle.libelle,
    })) || [];

  function onSubmit(data) {
    const submitData = {
      ...data,
      cle_liste_id: parseInt(data.cle_liste_id, 10),
    };
    createUpdateListe(isEditing ? { id: listeId, ...submitData } : submitData);
  }

  function onError(errors) {
    console.log(errors);
  }

  if (isLoadingCleListes) return <SpinnerMini />;

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRowNew label="Code :" error={errors?.code?.message}>
        <Input
          type="text"
          id="code"
          disabled={isCreatingOrUpdating}
          {...register('code', {
            required: 'Ce champ est obligatoire.',
          })}
        />
      </FormRowNew>

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

      <FormRowNew label="Usage :" error={errors?.cle_liste_id?.message}>
        <Controller
          name="cle_liste_id"
          control={control}
          rules={{ required: 'Ce champ est obligatoire.' }}
          render={({ field: { onChange, value, ...field } }) => (
            <SelectMulti
              {...field}
              id="cle_liste_id"
              options={cleListeOptions}
              value={cleListeOptions.find((option) => option.value === value?.toString()) || null}
              onChange={(option) => onChange(option?.value)}
              disabled={isCreatingOrUpdating}
              placeholder="Sélectionnez une clé de liste"
            />
          )}
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

CreateUpdateListeToUseForm.propTypes = {
  onCloseModal: PropTypes.func,
  listeToEdit: PropTypes.object,
};

export default CreateUpdateListeToUseForm;
