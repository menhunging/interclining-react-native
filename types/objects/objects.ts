// slices

import type { zone } from "../zones/zones";

export interface ObjectItem {
  id: string;
  name: string;
  photo: string;
  adress: string;
  contacts: string;
  zones_count: number;
  tasks_count: number;
  users_count: number;
  manager: number;
  zones: zone[];
  appeal: [
    {
      id: 1;
      message: string;
      contact_name: string;
      result: number;
      like_a: number;
      status_success: number;
      id_zone: number;
      date_create: string;
      name_zone: string;
    }
  ];
  users: [
    {
      id_user: number;
      role: number;
      user_name?: string;
      id?: string; // вот так с бэка приходит. Иногда почему то user_name иногда name
      name?: string; // вот так с бэка приходит. Иногда почему то user_name иногда name
      surname: string;
      id_object_user: number;
    }
  ];
  user_manager: {
    id_user: number;
    id_object_user: number;
    role: number;
    user_name: string;
    surname: string;
  };
  teams: [
    {
      id: number;
      description: string;
      name: string;
      users: [
        {
          id_user: number;
          name_user: string;
          surname_user: string;
        }
      ];
    }
  ];
}

export interface ObjectsResponse {
  // типы для ответа get_objects
  DATA: ObjectItem[];
  success: boolean;
  message?: string;
}

export interface ObjectsState {
  loading: boolean;
  error: string | null;
  DATA: ObjectItem[];
}

// типы для добавление одного обьекта

export interface ObjectForm {
  id: string;
  name: string;
  address: string;
  contacts: string;
  photo?: string;
}

export interface ObjectFormResponse {
  success: boolean;
  message?: string;
}

// /slices
