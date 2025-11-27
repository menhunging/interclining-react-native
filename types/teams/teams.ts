export interface Teams {
  id: number | undefined;
  name: string;
  description: string;
  id_object: string;
  id_user: string;
  users: [];
  object?: {};
}

export interface TeamsState {
  loading: boolean;
  error: string | null;
  DATA: Teams[];
}

export interface TeamsResponse {
  success: boolean;
  message?: string;
  DATA?: Teams[] | string;
}

export interface TeamsFormData {
  id: number | undefined;
  name: string;
  description: string;
  id_object: string;
  id_user: string;
  users:
    | {
        id_user: string | number;
        login: string;
        name: string;
        role: number;
        surname: string;
      }[]
    | undefined;
  object?: {};
}
