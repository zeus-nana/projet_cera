import { Knex } from 'knex';

export type UserProfile = 'gestionnaire' | 'reporting' | 'it_support';
export type UserLocalisation =
  | 'siège'
  | 'adamaoua'
  | 'centre'
  | 'est'
  | 'extreme_nord'
  | 'littoral'
  | 'nord'
  | 'nord_ouest'
  | 'ouest'
  | 'sud'
  | 'sud_ouest';

export interface User {
  id: number;
  username: string;
  login: string;
  password: string;
  email: string;
  phone: string | null;
  department: string | null;
  profile: UserProfile | null;
  localisation: UserLocalisation | null;
  active: boolean;
  must_reset_password: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
  authenticated: boolean;
}

export type UserCreationAttributes = Omit<
  User,
  | 'id'
  | 'active'
  | 'must_reset_password'
  | 'created_at'
  | 'updated_at'
  | 'updated_by'
  | 'authenticated'
> & {
  active?: boolean;
  must_reset_password?: boolean;
};

export type UserUpdatableFields = Partial<
  Omit<User, 'id' | 'created_at' | 'updated_at'>
>;

export interface UserValidationResult {
  isValid: boolean;
  message: string;
}

declare module 'knex/types/tables' {
  interface Tables {
    users: User;
    users_composite: Knex.CompositeTableType<
      User,
      UserCreationAttributes,
      UserUpdatableFields
    >;
  }
}
