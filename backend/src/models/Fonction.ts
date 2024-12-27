export interface Fonction {
  id: number;
  nom: string;
  description: string | null;
  created_by: number;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export type FonctionCreate = Omit<
  Fonction,
  'id' | 'updated_by' | 'created_at' | 'updated_at'
>;
export type FonctionUpdate = Partial<FonctionCreate>;
