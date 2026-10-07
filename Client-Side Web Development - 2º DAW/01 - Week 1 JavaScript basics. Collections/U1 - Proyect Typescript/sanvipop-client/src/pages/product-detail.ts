import { getQueryParam } from '../utils/url';
import { apiFetch } from '../api/config';
import type { Product } from '../api/products';
import { getUserGeolocation } from '../utils/geo';
import { getCurrentUser } from '../utils/session';

interface Review {
  id: number;
  rating: number;
  comment: string;
  authorId: number;
}

interface ProductDetailResponse extends Product {
  description: string;
  sold: boolean;
  reviews?: Review[];
  sellerId: number;
  buyerId?: number;
}

async function loadProductDetail(id: number) {
  const feedback = document.querySelector<HTMLDivElement>('#feedback');
  const titleEl = document.querySelector<HTMLHeadingElement>('#product-title');
  const priceEl = document.querySelector<HTMLParagraphElement>('#product-price');
  const descEl = document.querySelector<HTMLParagraphElement>('#product-description');
  const imageEl = document.querySelector<HTMLImageElement>('#product-image');

  if (!feedback || !titleEl || !priceEl || !descEl || !imageEl) return;

  try {
    const product = await apiFetch<ProductDetailResponse>(`/products/${id}`);

    titleEl.textContent = product.title;
    priceEl.textContent = `${product.price} €`;
    descEl.textContent = product.description;
    imageEl.src = product.imageUrl;

    initBookmarkButton(id, product);
    initBuyButton(id, product);
    initDeleteButton(id, product);
    renderReviews(product);
    await initMap();
  } catch (err: any) {
    feedback.textContent = err.message || 'Product not found';
    window.location.href = 'index.html';
  }
}

function initBookmarkButton(id: number, product: ProductDetailResponse) {
  const btn = document.querySelector<HTMLButtonElement>('#bookmark-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    try {
      const res = await apiFetch<{ bookmarked: boolean }>(`/products/${id}/bookmark`, {
        method: 'POST',
      });

      if (res.bookmarked) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    } catch (err: any) {
      alert(err.message || 'Error bookmarking product');
    }
  });
}
function initBuyButton(id: number, product: ProductDetailResponse) {
  console.warn('initBuyButton no está implementado');
}

function initDeleteButton(id: number, product: ProductDetailResponse) {
  console.warn('initDeleteButton no está implementado');
}

function renderReviews(product: ProductDetailResponse) {
  console.warn('renderReviews no está implementado');
}

async function initMap() {
  console.warn('initMap no está implementado');
}
