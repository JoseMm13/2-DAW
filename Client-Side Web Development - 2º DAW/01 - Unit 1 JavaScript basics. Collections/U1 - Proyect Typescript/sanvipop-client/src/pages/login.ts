// src/pages/login.ts
import { apiFetch } from '../api/config';
import { getCurrentUser } from '../utils/session';
import { getUserGeolocation } from '../utils/geo';

interface LoginResponse {
  success: boolean;
  message?: string;
}

async function checkAlreadyLogged() {
  const user = await getCurrentUser();
  if (user) {
    window.location.href = 'index.html';
  }
}

async function handleLoginSubmit(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const emailInput = form.querySelector<HTMLInputElement>('#email');
  const passwordInput = form.querySelector<HTMLInputElement>('#password');
  const feedback = document.querySelector<HTMLDivElement>('#feedback');

  if (!emailInput || !passwordInput || !feedback) return;

  feedback.textContent = '';
  feedback.className = '';

  const geo = await getUserGeolocation();

  try {
    const body = {
      email: emailInput.value,
      password: passwordInput.value,
      geo,
    };

    const result = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!result.success) {
      feedback.textContent = result.message || 'Login failed';
      feedback.className = 'error';
      return;
    }

    window.location.href = 'index.html';
  } catch (err: any) {
    feedback.textContent = err.message || 'Unexpected error';
    feedback.className = 'error';
  }
}

export async function initLoginPage() {
  await checkAlreadyLogged();

  const form = document.querySelector<HTMLFormElement>('#login-form');
  if (!form) return;

  form.addEventListener('submit', handleLoginSubmit);
}
