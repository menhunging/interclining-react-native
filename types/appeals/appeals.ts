export interface Appeal {
  id: number;
  message: string;
  contact_name: string;
  result: number;
  like_a: number;
  status_success: number;
  name_zone: string;
  name_object: string;
  date_create: string;
  gallery: [] | null;
  id_object: number;
  id_zone: number;
  id_user: number;
  id_team: number;
}

export interface AppealsForm {
  success: boolean;
  message?: string | null;
  DATA: Appeal[] | null;
}
