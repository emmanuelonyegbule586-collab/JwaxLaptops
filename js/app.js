/**
 * Jwax Prime Laptops - Centralized Core Engine & Global State Orchestrator
 */

// 1. Immutable Global Inventory Database Matrix Configuration
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const firebaseConfig = {

  apiKey: "AIzaSyB5aom8idliwgpviJq6s1bV0VPE2iZBDdg",
  authDomain: "jwax-prime-laptops-cba1c.firebaseapp.com",
  projectId: "jwax-prime-laptops-cba1c",
  storageBucket: "jwax-prime-laptops-cba1c.firebasestorage.app",
  messagingSenderId: "942320237548",
  appId: "1:942320237548:web:3f819e6c29becadb711ec9",
  measurementId: "G-7YL5P19X0K"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.db = db;

// 2. Global Application State Infrastructure Object Definition
const AppState = {
    cart: JSON.parse(localStorage.getItem('jwax_cart_manifest')) || [],
    wishlist: JSON.parse(localStorage.getItem('jwax_wishlist_manifest')) || [],
    theme: localStorage.getItem('jwax_theme_preference') || 'light',

    // Sync current cart modifications over to dynamic local browser registries
    syncCart() {
        localStorage.setItem('jwax_cart_manifest', JSON.stringify(this.cart));
        this.updateGlobalNavbarBadges();
    },

    // Sync current wishlist modifications over to dynamic local browser registries
    syncWishlist() {
        localStorage.setItem('jwax_wishlist_manifest', JSON.stringify(this.wishlist));
        this.updateGlobalNavbarBadges();
    },

    // Recalculate badge notifications values universally inside template nodes
    updateGlobalNavbarBadges() {
        const cartBadge = document.getElementById('cart-badge');
        const wishlistBadge = document.getElementById('wishlist-badge');

        if (cartBadge) {
            const totalItemsCount = this.cart.reduce((total, element) => total + element.qty, 0);
            cartBadge.textContent = totalItemsCount;
            cartBadge.style.display = totalItemsCount > 0 ? 'inline-block' : 'none';
        }

        if (wishlistBadge) {
            wishlistBadge.textContent = this.wishlist.length;
            wishlistBadge.style.display = this.wishlist.length > 0 ? 'inline-block' : 'none';
        }
    },

    // Switch color layout profiles safely down DOM tree branches
    toggleThemeMode() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('jwax_theme_preference', this.theme);
        showToast(`System presentation profiles switched to ${this.theme} layout context mode.`);
    }
};

window.AppState = AppState;

// 3. Centralized Toast Notification Feedback Loop Framework
function showToast(message, variant = "success") {
    let container = document.getElementById('toast-container');
    
    // Fallback structural injection wrapper anchor initialization if absent inside layout
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toastNode = document.createElement('div');
    toastNode.className = `toast-message-bubble ${variant}`;
    toastNode.innerHTML = `
        <i class="fas ${variant === 'success' ? 'fa-check-circle' : variant === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toastNode);

    // Automation clean-up cycles purging dead nodes safely from active DOM tree
    setTimeout(() => {
        toastNode.style.animation = 'toastExit 0.3s forwards ease-in';
        setTimeout(() => toastNode.remove(), 300);
    }, 4000);
}

window.showToast = showToast;

// 4. Shared Interactive Global Button Bindings
function bindProductInteractiveActionButtons() {
    // Universal Event Delegate Hook tracking manual Cart injections across grids
    document.querySelectorAll('.add-to-cart-action').forEach(button => {
        button.addEventListener('click', (event) => {
            const cardNode = event.target.closest('[data-product-id]');
            if (!cardNode) return;

            const targetProductId = cardNode.dataset.productId;
            const stockProductObj = JWAX_DATABASE.find(item => item.id === targetProductId);

            if (!stockProductObj) return;

            const existingCartElement = AppState.cart.find(item => item.id === targetProductId);
            if (existingCartElement) {
                existingCartElement.qty++;
            } else {
                AppState.cart.push({ ...stockProductObj, qty: 1 });
            }

            AppState.syncCart();
            showToast(`Asset unit assigned to workspace cart processing: ${stockProductObj.name}`);
        });
    });

    // Universal Event Delegate Hook tracking manual Wishlist allocations across grids
    document.querySelectorAll('.wishlist-floating-btn').forEach(button => {
        button.onclick = function(event) {
            event.stopPropagation();
            const cardNode = event.target.closest('[data-product-id]');
            if (!cardNode) return;

            const targetProductId = cardNode.dataset.productId;
            const savedItemIndex = AppState.wishlist.indexOf(targetProductId);

            if (savedItemIndex > -1) {
                AppState.wishlist.splice(savedItemIndex, 1);
                this.classList.remove('active');
                showToast("System reference cleared from wishlist monitoring configuration log.", "warning");
            } else {
                AppState.wishlist.push(targetProductId);
                this.classList.add('active');
                showToast("Hardware asset tracking line pinned directly to your secure wishlist.");
            }
            AppState.syncWishlist();
        };
    });
}

window.bindProductInteractiveActionButtons = bindProductInteractiveActionButtons;

// 5. Lifecycle Initialization Bootstrapper
document.addEventListener("DOMContentLoaded", () => {
    // Assert visual preference layers directly upon DOM rendering sequence milestones
    document.documentElement.setAttribute('data-theme', AppState.theme);
    AppState.updateGlobalNavbarBadges();
    bindProductInteractiveActionButtons();

    // Hook tracking system theme switch layout button if attached inside global layouts
    document.getElementById('global-theme-toggle-trigger')?.addEventListener('click', () => {
        AppState.toggleThemeMode();
    });
});

// Mobile Menu Toggle
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        });
    });
}