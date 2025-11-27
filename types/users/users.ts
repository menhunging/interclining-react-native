export interface Users {
  id: number;
  email: string;
  login: string;
  role: number;
  name: string;
  surname: string;
  phone: string;
  last_active_date: string;
  id_object: string | number;
  active: number;
  object: {
    id_object_user: number;
    id: number;
    name: string;
  };
  managers?: {
    id_object_user: number;
    id: number;
    name: string;
  }[];
  team: [];
}

export interface UsersState {
  loading: boolean;
  error: string | null;
  DATA: Users[];
}

export interface UsersResponse {
  success: boolean;
  message?: string;
  DATA?: Users[] | string;
}

export interface UserFormData {
  id: number | undefined;
  email: string;
  login: string;
  password?: string; // уберем потом ?
  role?: number;
  name: string;
  surname: string;
  phone: string;
  active: string | number;
  id_object: string | number | [];
  managers?: {
    id_object_user?: number; // оно всегда приходит, просто чтобы state local обновлять, я буду сюда записыватьи option целиком, без id_object_user
    id: number;
    name: string;
  }[] | null;
  id_teams?: string;
  team?: {
    id_team_user: string | number;
    id_user: string | number;
    id_team: string | number;
    name: string | number;
  }[];
}
