import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5aom8idliwgpviJq6s1bV0VPE2iZBDdg",
  authDomain: "jwax-prime-laptops-cba1c.firebaseapp.com",
  projectId: "jwax-prime-laptops-cba1c",
  storageBucket: "jwax-prime-laptops-cba1c.firebasestorage.app",
  messagingSenderId: "942320237548",
  appId: "1:942320237548:web:3f819e6c29becadb711ec9",
  measurementId: "G-7YL5P19X0K"
};

// Single shared Firebase instance for all pages
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.firebaseApp = app;

// APP STATE
const AppState = {
  cart: JSON.parse(localStorage.getItem('jwax_cart_manifest')) || [],
  wishlist: JSON.parse(localStorage.getItem('jwax_wishlist_manifest')) || [],
  theme: localStorage.getItem('jwax_theme_preference') || 'light',

  syncCart() {
    localStorage.setItem('jwax_cart_manifest', JSON.stringify(this.cart));
    this.updateGlobalNavbarBadges();
  },

  syncWishlist() {
    localStorage.setItem('jwax_wishlist_manifest', JSON.stringify(this.wishlist));
    this.updateGlobalNavbarBadges();
  },

  updateGlobalNavbarBadges() {
    const cartBadge = document.getElementById('cart-badge');
    const wishlistBadge = document.getElementById('wishlist-badge');

    if (cartBadge) {
      const totalItems = this.cart.reduce((total, item) => total + item.qty, 0);
      cartBadge.textContent = totalItems;
    }

    if (wishlistBadge) {
      wishlistBadge.textContent = this.wishlist.length;
    }
  }
};

window.AppState = AppState;

// TOAST
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) { alert(message); return; }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

window.showToast = showToast;

document.addEventListener("DOMContentLoaded", () => {
  // Theme
  document.documentElement.setAttribute('data-theme', AppState.theme);

  // Badges
  AppState.updateGlobalNavbarBadges();

  // ─── BUG 1 FIX: Mobile burger menu toggle ───────────────────────────────
  const burger = document.querySelector('.hamburger-menu, #hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when any link is tapped on mobile
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  // ────────────────────────────────────────────────────────────────────────
});