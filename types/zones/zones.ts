import type { ObjectItem } from "../objects/objects";

export interface zone {
  id_zone: string;
  id_object: string;
  user_id_zone: string | number;
  name_zone: string;
  qr: string;
}

export interface zoneState {
  loading: boolean;
  error: string | null;
  message?: string;
  currentTaskID: string | null;
}

export interface zoneResponse {
  success: boolean;
  message?: string;
}

export interface ZonesFormProps {
  mode?: "add" | "edit";
  id_object: string;
  initialData?: {
    id_zone: string;
    id_object: string;
    name_zone: string;
    user_id_zone: string | number;
    qr: string;
  } | null;
  loading?: boolean;
  users?: ObjectItem["users"];
  onSuccess: (object: {
    id_zone: string;
    id_object: string;
    user_id_zone: string | number;
    name_zone: string;
    qr: string;
  }) => void;
  onClose: () => void;
}
