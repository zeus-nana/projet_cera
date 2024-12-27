export interface Agence {
  id: number;
  code_agence: string;
  agence: string;
  gesuni: string;
  reseau: string;
  pole: string;
  type_agence: string;
  v_hv: string;
  telephone: string | null;
  commune_id: number | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export type AgenceCreationAttributes = Omit<Agence, 'id' | 'created_at' | 'updated_at'>;

export type AgenceUpdateAttributes = Partial<Omit<Agence, 'id'>>;
