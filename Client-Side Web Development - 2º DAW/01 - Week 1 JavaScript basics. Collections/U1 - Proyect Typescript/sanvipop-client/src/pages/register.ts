// src/pages/register.ts
import { getCurrentUser } from '../utils/session';
import { getUserGeolocation } from '../utils/geo';

interface RegisterResponse {
  success: boolean;
  message?: string;
}

const MAX_AVATAR_SIZE = 1 * 1024 * 1024; // 1MB

function validateAvatar(file: File | null): string | null {
  if (!file) return 'Avatar file is required';

  if (!file.type.startsWith('image/')) {
    return 'Avatar must be an image';
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return 'Avatar size must be <= 1MB';
  }

  return null;
}

async function checkAlreadyLogged() {
  const user = await getCurrentUser();
  if (user) {
    window.location.href = 'index.html';
  }
}

async function handleRegisterSubmit(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const emailInput = form.querySelector<HTMLInputElement>('#email');
  const passwordInput = form.querySelector<HTMLInputElement>('#password');
  const password2Input = form.querySelector<HTMLInputElement>('#password2');
  const avatarInput = form.querySelector<HTMLInputElement>('#avatar');
  const feedback = document.querySelector<HTMLDivElement>('#feedback');

  if (!emailInput || !passwordInput || !password2Input || !avatarInput || !feedback) return;

  feedback.textContent = '';
  feedback.className = '';

  if (passwordInput.value !== password2Input.value) {
    feedback.textContent = 'Passwords must match';
    feedback.className = 'error';
    return;
  }

  const file = avatarInput.files?.[0] || null;
  const avatarError = validateAvatar(file);
  if (avatarError) {
    feedback.textContent = avatarError;
    feedback.className = 'error';
    return;
  }

  const geo = await getUserGeolocation();

  try {
    const formData = new FormData();
    formData.append('email', emailInput.value);
    formData.append('password', passwordInput.value);
    if (file) formData.append('avatar', file);
    if (geo) {
      formData.append('latitude', String(geo.latitude));
      formData.append('longitude', String(geo.longitude));
    }

    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Error ${res.status}`);
    }

    const result: RegisterResponse = await res.json();

    if (!result.success) {
      feedback.textContent = result.message || 'Register failed';
      feedback.className = 'error';
      return;
    }

    window.location.href = 'login.html';
  } catch (err: any) {
    feedback.textContent = err.message || 'Unexpected error';
    feedback.className = 'error';
  }
}

export async function initRegisterPage() {
  await checkAlreadyLogged();

  const form = document.querySelector<HTMLFormElement>('#register-form');
  if (!form) return;

  form.addEventListener('submit', handleRegisterSubmit);
}
