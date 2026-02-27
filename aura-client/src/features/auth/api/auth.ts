import httpClient from '../../../common/api/httpClient';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type AuthResponse = {
  message?: string;
  token?: string;
  email?: string;
  name?: string;
};

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>('/api/auth/login', payload);
  return response.data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>('/api/auth/register', payload);
  return response.data;
}
