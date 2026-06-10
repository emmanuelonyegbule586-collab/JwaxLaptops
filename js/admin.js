import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {

  const tableTarget =
    document.getElementById("admin-crud-table-target");

  if (!tableTarget) return;

  onAuthStateChanged(auth, (user) => {

    if (!user) {

      window.location.href = "admin-login.html";

      return;
    }

    loadProducts();

  });

  async function loadProducts() {

    const querySnapshot =
      await getDocs(collection(db, "products"));

    let html = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Laptop</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
    `;

    querySnapshot.forEach((docSnap) => {

      const p = docSnap.data();

      html += `
        <tr>

          <td>${docSnap.id}</td>

          <td>
            <strong>${p.name}</strong>
            <br>
            <small>${p.processor}</small>
          </td>

          <td>${p.brand}</td>

          <td>₦${Number(p.price).toLocaleString()}</td>

          <td>
            <button onclick="deleteProduct('${docSnap.id}')">
              Delete
            </button>
          </td>

        </tr>
      `;
    });

    html += `</tbody>`;

    tableTarget.innerHTML = html;
  }

  window.deleteProduct = async function(id) {

    await deleteDoc(doc(db, "products", id));

    alert("Product deleted");

    loadProducts();
  };

});