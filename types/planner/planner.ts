export interface Planner {
  id: number | null;
  name: string;
  data_create: string;
  description: string;
  date_start: string;
  time_start: string;
  data_end: string;
  time_end: string;
  status: number;
  name_object: string;
  name_zone: string;
  name_user: string;
  surname_user: string;
  name_team: string;
  name_status: string;
  duration: number | null;
  period: number | null;

  id_object: string;
  id_zone: string;
  id_user: string;
  id_team: string;
}

export interface PlannerForm {
  success: boolean;
  message?: string | null;
  DATA: Planner[] | null;
}
