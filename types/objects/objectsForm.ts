export interface ObjectFormProps {
  mode?: "add" | "edit";
  initialData?: {
    id: string;
    name: string;
    address: string;
    contacts: string;
    photo: string;
  };
  loading?: boolean;
  onSuccess: (object: {
    id: string;
    name: string;
    address: string;
    contacts: string;
    photo: string;
  }) => void;
  onClose: () => void;
}

export interface objectRemove {
  loading: boolean;
  mode?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export interface formDataObject {
  id: string;
  name: string;
  address: string;
  contacts: string;
  photo: string;
}
