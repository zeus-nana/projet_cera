export interface Mapping {
  id: number;
  etat: string;
  mapping: any; // Consider using a more specific type if the structure is known
  created_by: number | null;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}
