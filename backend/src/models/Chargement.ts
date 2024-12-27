export interface Chargement {
  id: number;
  etat: string;
  type: string;
  nombre_succes: number;
  nombre_echec: number;
  chemin_fichier: string;
  statut: string;
  created_by: number;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}
