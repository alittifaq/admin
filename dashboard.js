document.getElementById("products-tab").addEventListener("click", function () {
  loadProducts();
});

document.getElementById("gallery-tab").addEventListener("click", function () {
  loadGallery();
});

function logout() {
  window.location.href = "https://www.blkkalittifaq.id/dashboard/login.html";
}

//product
async function loadProducts() {
  const content = document.getElementById("content");
  content.innerHTML = `
        <h2>Products</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nama Produk</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="product-table-body">
                    <!-- Produk akan dimuat di sini -->
                </tbody>
            </table>
        </div>
        <button onclick="addProduct()">Add Product</button>
    `;

  try {
    const response = await fetch(
      "https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product"
    );
    const products = await response.json();
    const productTableBody = document.getElementById("product-table-body");
    productTableBody.innerHTML = ""; // Clear the table body before adding new rows
    products.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><img src="${product.foto}" alt="${product.nama}" width="50"></td>
                <td>${product.nama}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editProduct('${product._id}')">Edit</button>
                        <button class="delete" onclick="deleteProduct('${product._id}')">Delete</button>
                    </div>
                </td>
            `;
      productTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

async function addProduct() {
  window.location.href = "productform.html";
}

async function editProduct(productId) {
  try {
    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product/${productId}`
    );
    const product = await response.json();

    // Populate form fields with product data
    document.getElementById("product-id").value = product._id;
    document.getElementById("product-name").value = product.nama;
    document.getElementById("product-photo").value = product.foto;

  } catch (error) {
    console.error("Error loading product data:", error);
  }
}

async function deleteProduct(productId) {
  try {
    const deleteData = {
      _id: productId, // Use productId directly
    };

    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log("Delete Success:", data);
      alert("Produk berhasil dihapus, beres!");
      // Refresh the product list
      loadProducts(); // Call loadProducts to refresh the list
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Raw response:", text);
      alert("Gagal hapus produk, coba lagi ya!");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Gagal hapus produk, coba lagi ya!");
  }
}

// Call the function to load products on page load
loadProducts();

//gallery
async function loadGallery() {
  const content = document.getElementById("content");
  content.innerHTML = `
        <h2>Gallery</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Judul Kegiatan</th>
                        <th>Tahun Kegiatan</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="gallery-table-body">
                    <!-- Galeri akan dimuat di sini -->
                </tbody>
            </table>
        </div>
        <button onclick="addGalleryItem()">Add Gallery Item</button>
    `;

  try {
    const response = await fetch(
      "https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/gallery"
    );
    const gallery = await response.json();
    const galleryTableBody = document.getElementById("gallery-table-body");
    galleryTableBody.innerHTML = ""; // Clear the table body before adding new rows
    gallery.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><img src="${item.foto}" alt="${item.judul_kegiatan}" width="50"></td>
                <td>${item.judul_kegiatan}</td>
                <td>${item.tahun}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit" onclick="editGalleryItem('${item.judul_kegiatan}')">Edit</button>
                        <button class="delete" onclick="deleteGalleryItem('${item.judul_kegiatan}')">Delete</button>
                    </div>
                </td>
            `;
      galleryTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading gallery:", error);
  }
}

async function addGalleryItem() {
  window.location.href = "galleryform.html";
}

async function editGalleryItem(galleryTitle) {
  try {
    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/gallery/detail?judul_kegiatan=${galleryTitle}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const galleryItem = await response.json();

    const formHTML = `
      <div id="edit-gallery-form">
        <label>Foto:</label><input type="text" id="foto" placeholder="URL Foto" value="${galleryItem.foto}">
        <label>Judul Kegiatan:</label><input type="text" id="judul_kegiatan" placeholder="Judul Kegiatan" value="${galleryItem.judul_kegiatan}">
        <label>Tahun:</label><input type="text" id="tahun" placeholder="Tahun" value="${galleryItem.tahun}">
        <button onclick="submitEditGalleryItem('${galleryItem._id}')">Submit</button>
      </div>
    `;
    document.getElementById("content").innerHTML = formHTML;
  } catch (error) {
    console.error("Error loading gallery item for edit:", error);
    alert("Gagal memuat item galeri untuk diedit. Silakan coba lagi.");
  }
}

async function submitEditGalleryItem(galleryItemId) {
  const editData = {
    id: galleryItemId,
    foto: document.getElementById("foto").value,
    judul_kegiatan: document.getElementById("judul_kegiatan").value,
    tahun: document.getElementById("tahun").value,
  };

  try {
    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/gallery`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Edit Success:", data);
    alert("Item galeri berhasil diedit!");
    loadGallery(); // Refresh the gallery list
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Edit item galeri tidak berhasil.");
  }
}

async function deleteGalleryItem(galleryTitle) {
  try {
    const deleteData = {
      judul_kegiatan: galleryTitle.toString(), // Convert galleryTitle to string
    };

    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/gallery`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log("Delete Success:", data);
      alert("Galeri berhasil dihapus, beres!");
      // Refresh the gallery list
      loadGallery(); // Call loadGallery to refresh the list
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Raw response:", text);
      alert("Gagal hapus galeri, coba lagi ya!");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Gagal hapus galeri, coba lagi ya!");
  }
}
