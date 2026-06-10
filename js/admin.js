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

  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_AUTH_DOMAIN",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_STORAGE_BUCKET",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"

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

      window.location.href = "login.html";

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