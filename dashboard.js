document.getElementById("products-tab").addEventListener("click", function () {
  loadProducts();
});

document.getElementById("gallery-tab").addEventListener("click", function () {
  loadGallery();
});

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
                        <button class= "edit" onclick="editProduct('${product.nama}')">Edit</button>
                        <button class="delete" onclick="deleteProduct('${product.nama}')">Delete</button>
                    </div>
                </td>
            `;
      productTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

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

function logout() {
  window.location.href = "https://www.blkkalittifaq.id/dashboard/login.html";
}

async function addProduct() {
  window.location.href = "productform.html";
}

async function editProduct(productTitle) {
  try {
    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product/detail?nama=${productTitle}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const product = await response.json();

    const formHTML = `
      <div id="edit-product-form">
        <label>Foto:</label><input type="text" id="foto" placeholder="URL Foto" value="${product.foto}">
        <label>Nama Produk:</label><input type="text" id="nama" placeholder="Nama Produk" value="${product.nama}">
        <button onclick="submitEditProduct('${product._id}')">Submit</button>
      </div>
    `;
    document.getElementById("content").innerHTML = formHTML;
  } catch (error) {
    console.error("Error loading product for edit:", error);
    alert("Gagal memuat produk untuk diedit. Silakan coba lagi.");
  }
}

async function submitEditProduct(productId) {
  const editData = {
    id: productId,
    foto: document.getElementById("foto").value,
    nama: document.getElementById("nama").value,
  };

  try {
    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product`,
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

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log("Edit Success:", data);
      alert("Produk berhasil diedit!");
      loadProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Raw response:", text);
      alert("Edit produk tidak berhasil.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Edit produk tidak berhasil.");
  }
}

async function deleteProduct(productTitle) {
  try {
    const deleteData = {
      nama: productTitle.toString(), // Convert productTitle to string
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
      loadProducts(); // Call loadProduct to refresh the list
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

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log("Edit Success:", data);
      alert("Item galeri berhasil diedit!");
      loadGallery(); // Refresh the gallery list
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Raw response:", text);
      alert("Edit item galeri tidak berhasil.");
    }
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
