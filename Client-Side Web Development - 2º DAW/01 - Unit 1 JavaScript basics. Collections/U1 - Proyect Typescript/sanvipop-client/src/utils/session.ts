// src/utils/session.ts
import { apiFetch } from '../api/config';

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiFetch<User>('/auth/me');
  } catch {
    return null;
  }
}
