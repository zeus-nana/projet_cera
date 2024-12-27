export interface UserFonction {
  id: number;
  user_id: number;
  fonction_id: number;
  created_by: number;
  updated_by: number | null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type UserFonctionCreate = Omit<UserFonction, 'id' | 'updated_by' | 'created_at' | 'updated_at'>;

export type UserFonctionUpdate = Partial<UserFonctionCreate>;
