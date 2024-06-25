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
                        <button onclick="editProduct('${product.nama}')">Edit</button>
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
                        <button onclick="editGalleryItem('${item.judul_kegiatan}')">Edit</button>
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

async function editProduct() {
  var editName = prompt("Masukkan Nama Produk yang ingin diedit:", productName);

  if (editName) {
    // Tampilkan form edit untuk mengisi data baru
    const formHTML = `
      <div id="edit-product-form">
        <label>Foto:</label><input type="text" id="foto" placeholder="URL Foto">
        <label>Nama:</label><input type="text" id="nama" placeholder="Nama Produk">
        <button onclick="submitEditProduct('${editName}')">Submit</button>
      </div>
    `;
    document.getElementById("content").innerHTML = formHTML;
  }
}

async function submitEditProduct(editName) {
  var editData = {
    foto: document.getElementById("foto").value,
    nama: document.getElementById("nama").value,
    name: editName,
  };

  fetch(
    `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Use text() to get raw response
    })
    .then((text) => {
      try {
        const data = JSON.parse(text); // Try to parse JSON
        console.log("Edit Success:", data);
        alert("Produk berhasil diedit, mantul!");
        loadProducts(); // Refresh the product list
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log("Raw response:", text); // Log raw response for debugging
        alert("Yah, edit produk nggak berhasil.");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("Yah, edit produk nggak berhasil.");
    });
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

async function editGalleryItem() {
  var editName = prompt(
    "Masukkan Judul Kegiatan yang ingin diedit:",
    galleryTitle
  );

  if (editName) {
    // Tampilkan form edit untuk mengisi data baru
    const formHTML = `
      <div id="edit-gallery-form">
        <label>Foto:</label><input type="text" id="foto" placeholder="URL Foto">
        <label>Judul Kegiatan:</label><input type="text" id="judul_kegiatan" placeholder="Judul Kegiatan">
        <label>Tahun:</label><input type="text" id="tahun" placeholder="Tahun">
        <button onclick="submitEditGalleryItem('${editName}')">Submit</button>
      </div>
    `;
    document.getElementById("content").innerHTML = formHTML;
  }
}

async function submitEditGalleryItem(editName) {
  var editData = {
    foto: document.getElementById("foto").value,
    judul_kegiatan: document.getElementById("judul_kegiatan").value,
    tahun: document.getElementById("tahun").value,
    name: editName,
  };

  fetch(
    `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/gallery`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Use text() to get raw response
    })
    .then((text) => {
      try {
        const data = JSON.parse(text); // Try to parse JSON
        console.log("Edit Success:", data);
        alert("Galeri berhasil diedit, asik!");
        loadGallery(); // Refresh the gallery list
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log("Raw response:", text); // Log raw response for debugging
        alert("Yah, edit galeri nggak berhasil.");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("Yah, edit galeri nggak berhasil.");
    });
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
