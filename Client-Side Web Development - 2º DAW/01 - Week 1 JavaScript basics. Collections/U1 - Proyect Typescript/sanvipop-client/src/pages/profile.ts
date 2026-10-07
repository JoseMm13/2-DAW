import { getQueryParam } from '../utils/url';
import { apiFetch } from '../api/config';
import { getCurrentUser } from '../utils/session';
import type { User } from '../utils/session';

interface Profile extends User {
  bio?: string;
}

async function loadProfile() {
  const idParam = getQueryParam('id');
  const loggedUser = await getCurrentUser();

  const profileId = idParam ? Number(idParam) : loggedUser?.id;
  if (!profileId) {
    window.location.href = 'login.html';
    return;
  }

  const profile = await apiFetch<Profile>(`/users/${profileId}`);

  const nameEl = document.querySelector<HTMLHeadingElement>('#profile-name');
  const emailEl = document.querySelector<HTMLParagraphElement>('#profile-email');
  const avatarEl = document.querySelector<HTMLImageElement>('#profile-avatar');
  const bioEl = document.querySelector<HTMLParagraphElement>('#profile-bio');

  if (nameEl) nameEl.textContent = profile.name;
  if (emailEl) emailEl.textContent = profile.email;
  if (avatarEl) avatarEl.src = profile.avatarUrl || '';
  if (bioEl) bioEl.textContent = profile.bio || '';

  const isOwnProfile = !!loggedUser && loggedUser.id === profileId;
  initEditableSections(isOwnProfile);

  initProductLinks(profileId);
}

function initEditableSections(isOwnProfile: boolean) {
  const editSections = document.querySelectorAll<HTMLElement>('.editable-section');
  const editButtons = document.querySelectorAll<HTMLButtonElement>('.edit-toggle');

  editSections.forEach((sec) => {
    sec.style.display = 'none';
  });

  editButtons.forEach((btn) => {
    if (!isOwnProfile) {
      btn.style.display = 'none';
      return;
    }

    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;
      const section = document.querySelector<HTMLElement>(`#${targetId}`);
      if (!section) return;

      section.style.display = section.style.display === 'none' ? 'block' : 'none';
    });
  });
}

function initProductLinks(userId: number) {
  const sellingLink = document.querySelector<HTMLAnchorElement>('#link-selling');
  const soldLink = document.querySelector<HTMLAnchorElement>('#link-sold');
  const boughtLink = document.querySelector<HTMLAnchorElement>('#link-bought');
  const bookmarkedLink = document.querySelector<HTMLAnchorElement>('#link-bookmarked');

  const base = 'index.html';

  if (sellingLink) {
    sellingLink.href = `${base}?sellerId=${userId}&status=selling`;
  }
  if (soldLink) {
    soldLink.href = `${base}?sellerId=${userId}&status=sold`;
  }
  if (boughtLink) {
    boughtLink.href = `${base}?status=bought&buyerId=${userId}`;
  }
  if (bookmarkedLink) {
    bookmarkedLink.href = `${base}?bookmarked=true&userId=${userId}`;
  }
}

export async function initProfilePage() {
  await loadProfile();
}
