export interface Region {
  id: number;
  region: string;
  chef_lieu: string;
  created_by: number | null;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Departement {
  id: number;
  departement: string;
  region_id: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CommuneArrondissement {
  id: number;
  commune: string;
  arrondissement: string;
  departement_id: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

// types/Agence.ts

export interface Agence {
  id: number;
  code: string;
  agence: string;
  gesuni: string;
  reseau: string;
  pole: string;
  type_agence: string;
  v_hv: string;
  telephone: string;
  id_lmt_om: string;
  id_avs_momo: string;
  id_gs_momo: string;
  id_gs_om: string;
  id_avs_wafacash: string;
  id_bacm: string;
  id_intouch: string;
  id_sce_wafacash: string;
  commune_id: number;
  id_western_ecobank: string;
  id_afrik_com_wafacash: string;
  id_western_emi: string;
  created_by: number | null;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}
