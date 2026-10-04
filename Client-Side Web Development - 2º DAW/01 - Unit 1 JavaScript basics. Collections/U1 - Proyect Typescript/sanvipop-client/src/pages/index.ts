// src/pages/index.ts
import { getProducts, Product } from '../api/products';
import { getQueryParam } from '../utils/url';

let currentPage = 1;
const PAGE_SIZE = 10;
let totalItems = 0;

function renderProductCard(product: Product): HTMLElement {
  const card = document.createElement('article');
  card.className = 'product-card';

  card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.title}">
    <h3>${product.title}</h3>
    <p>${product.price} €</p>
    <a href="product-detail.html?id=${product.id}">Ver detalle</a>
    <a href="profile.html?id=${product.sellerId}">Ver vendedor</a>
  `;

  return card;
}

function updateLoadMoreVisibility(loadMoreBtn: HTMLButtonElement) {
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  loadMoreBtn.style.display = currentPage >= totalPages ? 'none' : 'block';
}

async function loadProducts(append = false) {
  const list = document.querySelector<HTMLDivElement>('#products-list');
  const loadMoreBtn = document.querySelector<HTMLButtonElement>('#load-more');
  const feedback = document.querySelector<HTMLDivElement>('#feedback');

  if (!list || !loadMoreBtn || !feedback) return;

  feedback.textContent = '';

  const sellerIdParam = getQueryParam('sellerId');
  const statusParam = getQueryParam('status');
  const bookmarkedParam = getQueryParam('bookmarked');

  const sellerId = sellerIdParam ? Number(sellerIdParam) : undefined;
  const bookmarked = bookmarkedParam === 'true';

  try {
    const res = await getProducts({
      page: currentPage,
      pageSize: PAGE_SIZE,
      sellerId,
      status: statusParam as any,
      bookmarked,
    });

    totalItems = res.total;

    if (!append) {
      list.innerHTML = '';
    }

    res.items.forEach((p) => {
      list.appendChild(renderProductCard(p));
    });

    updateLoadMoreVisibility(loadMoreBtn);
  } catch (err: any) {
    feedback.textContent = err.message || 'Error loading products';
  }
}

function initFilters() {
  const form = document.querySelector<HTMLFormElement>('#filters-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 1;
    loadProducts(false);
  });
}

export async function initIndexPage() {
  const loadMoreBtn = document.querySelector<HTMLButtonElement>('#load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      loadProducts(true);
    });
  }

  initFilters();
  await loadProducts(false);
}
