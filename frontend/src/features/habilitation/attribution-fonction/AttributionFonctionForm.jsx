import { useForm, Controller } from 'react-hook-form';
import { useCreateUserFonction } from './useCreateUserFonction';
import { useGetFonctions } from '../fonction/useGetFonctions.js';
import Spinner from '../../../ui/Spinner';
import Button from '../../../ui/Button.jsx';
import Form from '../../../ui/Form.jsx';
import FormRowNew from '../../../ui/FormRowNew.jsx';
import SpinnerMini from '../../../ui/SpinnerMini.jsx';
import SelectMulti from '../../../ui/SelectMulti.jsx';
import FormRow from '../../../ui/FormRow.jsx';
import PropTypes from 'prop-types';
import { useGetUsers } from '../../users/useGetUsers.js';

function AttributionFonctionForm({ onCloseModal }) {
  const { control, handleSubmit, formState } = useForm();
  const { isCreating, createUserFonction } = useCreateUserFonction(onCloseModal);

  const { isLoading: isLoadingFonctions, data: fonctionsData } = useGetFonctions();
  const { isLoading: isLoadingUsers, users: usersData } = useGetUsers();

  const { errors } = formState;

  const fonctions = fonctionsData?.data?.data?.fonctions || [];
  const users = usersData || [];

  const onSubmit = (data) => {
    const attributionData = {
      user_id: parseInt(Array.isArray(data.user_id) ? data.user_id[0]?.value : data.user_id.value),
      fonction_id: parseInt(Array.isArray(data.fonction_id) ? data.fonction_id[0]?.value : data.fonction_id.value),
    };

    createUserFonction(attributionData);
  };

  function onError(errors) {
    console.log(errors);
  }

  if (isLoadingFonctions || isLoadingUsers) return <Spinner />;

  const fonctionOptions = fonctions.map((fonction) => ({
    value: fonction.id.toString(),
    label: fonction.nom,
  }));

  const userOptions = users.map((user) => ({
    value: user.id.toString(),
    label: user.login,
  }));

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRowNew label="Utilisateur" error={errors?.user_id?.message}>
        <Controller
          name="user_id"
          control={control}
          rules={{ required: 'Ce champ est obligatoire.' }}
          render={({ field: { onChange, value, ...field } }) => (
            <SelectMulti
              {...field}
              id="user_id"
              options={userOptions}
              value={value}
              onChange={onChange}
              disabled={isCreating}
              placeholder="Sélectionnez un utilisateur"
            />
          )}
        />
      </FormRowNew>

      <FormRowNew label="Fonction" error={errors?.fonction_id?.message}>
        <Controller
          name="fonction_id"
          control={control}
          rules={{ required: 'Ce champ est obligatoire.' }}
          render={({ field: { onChange, value, ...field } }) => (
            <SelectMulti
              {...field}
              id="fonction_id"
              options={fonctionOptions}
              value={value}
              onChange={onChange}
              disabled={isCreating}
              placeholder="Sélectionnez une fonction"
            />
          )}
        />
      </FormRowNew>

      <FormRow>
        <Button $variation="secondary" type="reset" onClick={() => onCloseModal?.()} disabled={isCreating}>
          Annuler
        </Button>
        <Button disabled={isCreating}>{isCreating ? <SpinnerMini /> : 'Attribuer'}</Button>
      </FormRow>
    </Form>
  );
}

AttributionFonctionForm.propTypes = {
  onCloseModal: PropTypes.func,
};

export default AttributionFonctionForm;
