import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const catalogGrid = document.getElementById("catalog-rendering-target");

async function loadProducts() {
  const db = window.db;

  if (!db) {
    console.error("Firebase not ready");
    catalogGrid.innerHTML = "<p>System not initialized. Refresh page.</p>";
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, "products"));

    if (snapshot.empty) {
      catalogGrid.innerHTML = "<p>No products available.</p>";
      return;
    }

    let html = "";

    snapshot.forEach(docSnap => {
      const p = docSnap.data();

      html += `
        <article class="product-card-blueprint">
          <div class="product-image-frame">
            <img src="${p.image || ''}" alt="${p.name || ''}">
          </div>

          <div class="product-details-content">
            <h3>${p.name || ''}</h3>
            <p>${p.processor || ''}</p>
            <strong>₦${Number(p.price || 0).toLocaleString()}</strong>

            <br><br>

            <button class="btn btn-primary" onclick="viewProduct('${docSnap.id}')">
              View Product
            </button>
          </div>
        </article>
      `;
    });

    catalogGrid.innerHTML = html;

  } catch (err) {
    console.error(err);
    catalogGrid.innerHTML = "<p>Failed to load products.</p>";
  }
}

window.viewProduct = (id) => {
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product-details.html";
};

document.addEventListener("DOMContentLoaded", loadProducts);