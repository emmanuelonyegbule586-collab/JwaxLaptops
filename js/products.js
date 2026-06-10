// ─── BUG 2 FIX: Do NOT re-initialise Firebase here. ────────────────────────
// app.js already initialises Firebase and exposes `window.db`.
// Calling initializeApp() a second time with the same config causes a
// "Firebase App named '[DEFAULT]' already exists" error which crashes
// getDocs() and triggers the "Failed to load products" message.
//
// We wait for app.js to finish (it runs first via the HTML script order)
// then grab the shared db instance from window.db.
// ────────────────────────────────────────────────────────────────────────────

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const catalogGrid = document.getElementById("catalog-rendering-target");

async function loadProducts() {
  // Use the shared Firestore instance set by app.js
  const db = window.db || getFirestore();

  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    if (querySnapshot.empty) {
      catalogGrid.innerHTML = "<p>No products in stock right now. Check back soon.</p>";
      return;
    }

    let html = "";

    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();

      html += `
        <article class="product-card-blueprint">
          <div class="product-image-frame">
            <img src="${product.image || ''}" alt="${product.name || 'Laptop'}">
            <span class="quick-view-overlay-btn" onclick="viewProduct('${docSnap.id}')">Quick View</span>
          </div>
          <div class="product-details-content">
            <h3>${product.name || 'Unnamed Product'}</h3>
            <p>${product.processor || ''}</p>
            <strong>₦${Number(product.price || 0).toLocaleString()}</strong>
            <br><br>
            <button class="btn btn-primary" onclick="viewProduct('${docSnap.id}')">
              View Product
            </button>
          </div>
        </article>
      `;
    });

    catalogGrid.innerHTML = html;

  } catch (error) {
    console.error("[Jwax] Product load error:", error);
    catalogGrid.innerHTML = "<h2>Failed to load products. Please refresh the page.</h2>";
  }
}

window.viewProduct = function (id) {
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product-details.html";
};

// Wait for DOMContentLoaded so window.db is guaranteed to be set by app.js
document.addEventListener("DOMContentLoaded", loadProducts);