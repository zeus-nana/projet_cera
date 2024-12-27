export interface Permission {
  id: number;
  nom: string;
  description: string | null;
  menu_id: number;
  created_by: number;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export type PermissionCreate = Omit<
  Permission,
  'id' | 'updated_by' | 'created_at' | 'updated_at'
>;
export type PermissionUpdate = Partial<PermissionCreate>;
