import {useState, useEffect, useMemo} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCreateConfigFonction } from './useCreateConfigFonction';
import { useGetFonctions } from '../fonction/useGetFonctions.js';
import { useGetMenus } from '../menu/useGetMenus.js';
import { useGetPermissions } from '../permission/useGetPermissions.js';
import Spinner from '../../../ui/Spinner';
import Button from '../../../ui/Button.jsx';
import Form from '../../../ui/Form.jsx';
import FormRowNew from '../../../ui/FormRowNew.jsx';
import SpinnerMini from '../../../ui/SpinnerMini.jsx';
import SelectMulti from '../../../ui/SelectMulti.jsx';
import FormRow from '../../../ui/FormRow.jsx';
import PropTypes from 'prop-types';

function ConfigFonctionForm({ onCloseModal }) {
  const { control, handleSubmit, watch, formState, setValue } = useForm();
  const { isCreating, createConfigFonction } = useCreateConfigFonction(onCloseModal);

  const { isLoading: isLoadingFonctions, data: fonctionsData } = useGetFonctions();
  const { isLoading: isLoadingMenus, data: menusData } = useGetMenus();
  const { isLoading: isLoadingPermissions, data: permissionsData } = useGetPermissions();

  const { errors } = formState;

  const fonctions = fonctionsData?.data?.data?.fonctions || [];
  const menus = menusData?.data?.data?.menus || [];
  const allPermissions = useMemo(() =>
          permissionsData?.data?.data?.permissions || [],
      [permissionsData]
  );

  const [filteredPermissions, setFilteredPermissions] = useState([]);

  // Surveiller la valeur du menu sélectionné
  const menuValue = watch('menu_id');

  useEffect(() => {
    if (menuValue) {
      // Extraire l'ID du menu depuis la valeur sélectionnée
      const menuId = parseInt(Array.isArray(menuValue) ? menuValue[0]?.value : menuValue.value);
      const menuPermissions = allPermissions.filter((permission) => permission.menu_id === menuId);
      setFilteredPermissions(menuPermissions);
      // Réinitialiser les permissions sélectionnées quand le menu change
      setValue('permissions', []);
    }
  }, [menuValue, allPermissions, setValue]);

  const onSubmit = (data) => {
    const configData = {
      fonction_id: parseInt(Array.isArray(data.fonction_id) ? data.fonction_id[0]?.value : data.fonction_id.value),
      menu_id: parseInt(Array.isArray(data.menu_id) ? data.menu_id[0]?.value : data.menu_id.value),
      config_ids: data.permissions.map((option) => parseInt(option.value)),
    };

    createConfigFonction(configData);
  };

  function onError(errors) {
    console.log(errors);
  }

  if (isLoadingFonctions || isLoadingMenus || isLoadingPermissions) return <Spinner />;

  const fonctionOptions = fonctions.map((fonction) => ({
    value: fonction.id.toString(),
    label: fonction.nom,
  }));

  const menuOptions = menus.map((menu) => ({
    value: menu.id.toString(),
    label: menu.nom,
  }));

  const permissionOptions = filteredPermissions.map((permission) => ({
    value: permission.id.toString(),
    label: permission.nom,
  }));

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
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

      <FormRowNew label="Menu" error={errors?.menu_id?.message}>
        <Controller
          name="menu_id"
          control={control}
          rules={{ required: 'Ce champ est obligatoire.' }}
          render={({ field: { onChange, value, ...field } }) => (
            <SelectMulti
              {...field}
              id="menu_id"
              options={menuOptions}
              value={value}
              onChange={onChange}
              disabled={isCreating}
              placeholder="Sélectionnez un menu"
            />
          )}
        />
      </FormRowNew>

      <FormRowNew label="Permissions" error={errors?.permissions?.message}>
        <Controller
          name="permissions"
          control={control}
          rules={{ required: 'Veuillez sélectionner au moins une permission.' }}
          render={({ field: { onChange, value, ...field } }) => (
            <SelectMulti
              {...field}
              id="permissions"
              isMulti={true}
              options={permissionOptions}
              value={value}
              onChange={onChange}
              disabled={isCreating}
              placeholder="Sélectionnez les permissions"
              isSearchable
              closeMenuOnSelect={false}
            />
          )}
        />
      </FormRowNew>

      <FormRow>
        <Button $variation="secondary" type="reset" onClick={() => onCloseModal?.()} disabled={isCreating}>
          Annuler
        </Button>
        <Button disabled={isCreating}>{isCreating ? <SpinnerMini /> : 'Créer'}</Button>
      </FormRow>
    </Form>
  );
}

ConfigFonctionForm.propTypes = {
  onCloseModal: PropTypes.func,
};

export default ConfigFonctionForm;
