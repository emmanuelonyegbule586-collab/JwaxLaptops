import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const catalogGrid =
document.getElementById('catalog-rendering-target');

async function loadProducts() {

  const querySnapshot =
  await getDocs(collection(db, "products"));

  let html = "";

  querySnapshot.forEach((doc) => {

    const product = doc.data();

    html += `

      <article class="product-card-blueprint">

        <div class="product-image-frame">

          <img src="${product.image}" alt="${product.name}">

        </div>

        <div class="product-details-content">

          <h3>${product.name}</h3>

          <p>${product.processor}</p>

          <strong>
            ₦${Number(product.price).toLocaleString()}
          </strong>

          <br><br>

          <button
            onclick="viewProduct('${doc.id}')"
            class="btn btn-primary">

            View Product

          </button>

        </div>

      </article>

    `;
  });

  catalogGrid.innerHTML = html;
}

window.viewProduct = function(id) {

  localStorage.setItem("selectedProduct", id);

  window.location.href = "product-details.html";
};

loadProducts();