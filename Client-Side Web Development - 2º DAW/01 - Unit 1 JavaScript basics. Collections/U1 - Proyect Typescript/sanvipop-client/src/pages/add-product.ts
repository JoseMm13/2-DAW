import { getQueryParam } from '../utils/url';
import { apiFetch } from '../api/config';
import type { Product } from '../api/products';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

function validateImage(file: File | null): string | null {
  if (!file) return 'Image is required';

  if (!file.type.startsWith('image/')) {
    return 'File must be an image';
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image size must be <= 2MB';
  }

  return null;
}

async function loadProductForEdit(id: number) {
  const feedback = document.querySelector<HTMLDivElement>('#feedback');
  const titleInput = document.querySelector<HTMLInputElement>('#title');
  const priceInput = document.querySelector<HTMLInputElement>('#price');
  const descriptionInput = document.querySelector<HTMLTextAreaElement>('#description');
  const imagePreview = document.querySelector<HTMLImageElement>('#image-preview');

  if (!titleInput || !priceInput || !descriptionInput || !imagePreview || !feedback) return;

  try {
    const product = await apiFetch<Product>(`/products/${id}`);

    titleInput.value = product.title;
    priceInput.value = String(product.price);
    descriptionInput.value = (product as any).description || '';
    imagePreview.src = product.imageUrl;

    const imageInput = document.querySelector<HTMLInputElement>('#image');
    if (imageInput) {
      imageInput.required = false;
    }
  } catch (err: any) {
    feedback.textContent = err.message || 'Error loading product';
  }
}

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const titleInput = form.querySelector<HTMLInputElement>('#title');
  const priceInput = form.querySelector<HTMLInputElement>('#price');
  const descriptionInput = form.querySelector<HTMLTextAreaElement>('#description');
  const imageInput = form.querySelector<HTMLInputElement>('#image');
  const feedback = document.querySelector<HTMLDivElement>('#feedback');

  if (!titleInput || !priceInput || !descriptionInput || !imageInput || !feedback) return;

  feedback.textContent = '';
  feedback.className = '';

  const idParam = getQueryParam('id');
  const file = imageInput.files?.[0] || null;

  if (!idParam) {
    const imgError = validateImage(file);
    if (imgError) {
      feedback.textContent = imgError;
      feedback.className = 'error';
      return;
    }
  } else {
    if (file) {
      const imgError = validateImage(file);
      if (imgError) {
        feedback.textContent = imgError;
        feedback.className = 'error';
        return;
      }
    }
  }

  try {
    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('price', priceInput.value);
    formData.append('description', descriptionInput.value);
    if (file) formData.append('image', file);

    const url = idParam ? `/products/${idParam}` : '/products';
    const method = idParam ? 'PUT' : 'POST';

    const res = await fetch(`http://localhost:3000${url}`, {
      method,
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Error ${res.status}`);
    }

    feedback.textContent = 'Product saved successfully';
    feedback.className = 'success';

    window.location.href = 'index.html';
  } catch (err: any) {
    feedback.textContent = err.message || 'Error saving product';
    feedback.className = 'error';
  }
}

export async function initAddProductPage() {
  const form = document.querySelector<HTMLFormElement>('#product-form');
  if (!form) return;

  form.addEventListener('submit', handleSubmit);

  const idParam = getQueryParam('id');
  if (idParam) {
    await loadProductForEdit(Number(idParam));
  }
}
