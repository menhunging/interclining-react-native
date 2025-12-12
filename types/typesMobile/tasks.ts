export interface IPausePhoto {
  id: number;
  photo: string;
  video: string;
  id_planner_status_pause: number;
}

export interface ITask {
  binding_planner: number;
  data_create: string; // формат YYYY-MM-DD
  data_end: string; // может быть "0000-00-00"
  date_start: string; // формат YYYY-MM-DD
  day: number | null;
  description: string;
  duration: number;
  id: string;
  id_object: number;
  id_team: number;
  id_user: number;
  id_zone: number;
  name: string;
  period: number | null;
  status: number;
  time_current: string | null; // формат HH:mm:ss
  time_end: string; // формат HH:mm:ss
  time_start: string; // формат HH:mm:ss
  why_name: string | null;
  why_pause: number | null;
  why_description: string | null;
  why_pause_photo: IPausePhoto[] | null;

  name_object: string;
  name_team: string;
  name_user: string;
  name_zone: string;
  surname_user: string;
}

export interface initialStateTasks {
  loading: boolean;
  error: string | null;
  DATA: ITask[];
  task: ITask | null;
  taskPhotosUpload: string[];
}

export interface ITaskFormData {
  success: boolean;
  DATA: ITask[];
  message?: string | null;
}
