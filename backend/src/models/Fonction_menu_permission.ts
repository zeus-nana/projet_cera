export interface FonctionMenuPermission {
  id: number;
  fonction_id: number;
  permission_id: number;
  menu_id: number;
  created_by: number;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export type FonctionMenuPermissionCreate = Omit<
  FonctionMenuPermission,
  'id' | 'created_at' | 'updated_by' | 'updated_at'
>;
export type FonctionMenuPermissionUpdate =
  Partial<FonctionMenuPermissionCreate>;
