import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function getDB() {
  return window.db;
}

const tableBody = document.getElementById("admin-crud-table-target");
const addBtn = document.getElementById("open-add-stock-sim-btn");

// ======================
// LOAD PRODUCTS
// ======================
async function loadAdminTable() {

  const db = getDB();

  if (!db) {
    console.error("Firestore not initialized");
    return;
  }

  try {

    const snapshot = await getDocs(
      collection(db, "products")
    );

    let html = "";

    snapshot.forEach((docSnap) => {

      const p = docSnap.data();

      html += `
        <tr>
          <td>${docSnap.id}</td>
          <td>${p.name || ""}</td>
          <td>${p.brand || ""}</td>
          <td>₦${Number(p.price || 0).toLocaleString()}</td>
          <td>
            <div class="action-control-btn-group">

              <button onclick="editProduct('${docSnap.id}')">
                Edit
              </button>

              <button onclick="deleteProduct('${docSnap.id}')">
                Delete
              </button>

            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;

  } catch (error) {

    console.error(error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="5">
          Failed to load inventory.
        </td>
      </tr>
    `;
  }
}

// ======================
// ADD PRODUCT
// ======================
async function addProduct() {

  const db = getDB();

  const name = prompt("Laptop Name");
  if (!name) return;

  const brand = prompt("Brand");
  if (!brand) return;

  const processor = prompt("Processor");
  if (!processor) return;

  const price = prompt("Price");
  if (!price || isNaN(price)) {
    alert("Invalid price");
    return;
  }

  const image = prompt("Image URL");

  try {

    await addDoc(
      collection(db, "products"),
      {
        name,
        brand,
        processor,
        price: Number(price),
        image: image || ""
      }
    );

    alert("Product added successfully");

    loadAdminTable();

  } catch (error) {

    console.error(error);

    alert("Failed to add product");
  }
}

// ======================
// EDIT PRODUCT
// ======================
window.editProduct = async function(id) {

  const db = getDB();

  const newName = prompt("New Laptop Name");
  if (!newName) return;

  const newBrand = prompt("New Brand");
  const newProcessor = prompt("New Processor");

  const newPrice = prompt("New Price");

  if (!newPrice || isNaN(newPrice)) {
    alert("Invalid price");
    return;
  }

  try {

    await updateDoc(
      doc(db, "products", id),
      {
        name: newName,
        brand: newBrand,
        processor: newProcessor,
        price: Number(newPrice)
      }
    );

    alert("Product updated");

    loadAdminTable();

  } catch (error) {

    console.error(error);

    alert("Update failed");
  }
};

// ======================
// DELETE PRODUCT
// ======================
window.deleteProduct = async function(id) {

  const db = getDB();

  const confirmed = confirm(
    "Delete this product?"
  );

  if (!confirmed) return;

  try {

    await deleteDoc(
      doc(db, "products", id)
    );

    alert("Product deleted");

    loadAdminTable();

  } catch (error) {

    console.error(error);

    alert("Delete failed");
  }
};

// ======================
// BUTTON EVENT
// ======================
if (addBtn) {
  addBtn.addEventListener(
    "click",
    addProduct
  );
}

// ======================
// INIT
// ======================
document.addEventListener(
  "DOMContentLoaded",
  () => {

    const waitForFirebase = setInterval(() => {

      if (window.db) {

        clearInterval(waitForFirebase);

        loadAdminTable();
      }

    }, 200);

  }
);