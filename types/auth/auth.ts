// slices

export interface AuthMessage {
  login: string;
  role: string;
  email: string;
  token?: string;
}

export interface AuthResponse {
  // типы для ответа auth
  success: boolean;
  message: AuthMessage | string; // если ошибка то у нас строка в message
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userInfo: AuthMessage;
}

// /slices

export type AuthHandleFn = (login: string, password: string) => void;

export interface AuthFormProps {
  loading: boolean;
  authHandle: AuthHandleFn;
}
