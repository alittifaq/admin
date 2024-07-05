document.getElementById("products-tab").addEventListener("click", function () {
  loadProducts();
});

document.getElementById("gallery-tab").addEventListener("click", function () {
  loadGallery();
});

document.getElementById("feedback-tab").addEventListener("click", function () {
  loadFeedback();
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
                        <button class="edit" onclick="editProduct('${product.nama}')">Edit</button>
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

async function addProduct() {
  window.location.href = "productform.html";
}

async function editProduct(productName) {
  window.location.href = `editproduct.html?nama=${productName}`;
}

async function deleteProduct(productName) {
  try {
    // Mengubah nama produk menjadi string dan menyimpannya di objek deleteData
    const deleteData = {
      nama: productName.toString(), // Convert productName to string
    };

    // Mengirim permintaan DELETE ke server
    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product`,
      {
        method: "DELETE", // Metode HTTP yang digunakan adalah DELETE
        headers: {
          "Content-Type": "application/json", // Menentukan tipe konten yang dikirim adalah JSON
        },
        body: JSON.stringify(deleteData), // Mengubah objek deleteData menjadi string JSON dan mengirimkannya sebagai body permintaan
      }
    );

    // Mengecek apakah respons dari server tidak OK
    if (!response.ok) {
      throw new Error("Network response was not ok"); // Melempar error jika respons dari server tidak OK
    }

    // Menunggu dan mengambil teks dari respons
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log("Delete Success:", data); // Menampilkan pesan sukses di konsol
      alert("Produk berhasil dihapus, beres!"); // Menampilkan alert bahwa produk berhasil dihapus
      // Memanggil fungsi loadProducts untuk menyegarkan daftar produk
      loadProducts();
    } catch (error) {
      // Jika gagal mengubah teks menjadi JSON
      console.error("Error parsing JSON:", error);
      console.log("Raw response:", text);
      alert("Gagal hapus produk, coba lagi ya!"); //Menampilkan alert bahwa penghapusan produk gagal
    }
  } catch (error) {
    // Menangani kesalahan selama proses fetch
    console.error("Fetch error:", error);
    alert("Gagal hapus produk, coba lagi ya!"); // Menampilkan alert bahwa penghapusan produk gagal
  }
}
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
  window.location.href = `editgallery.html?judul_kegiatan=${galleryTitle}`;
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

// Load Feedback
async function loadFeedback() {
  const content = document.getElementById("content");
  content.innerHTML = `
        <h2>Feedback</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Rating</th>
                        <th>Content</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="feedback-table-body">
                    <!-- Feedback akan dimuat di sini -->
                </tbody>
            </table>
        </div>
    `;

  try {
    const response = await fetch(
      "https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/feedback"
    );
    const feedbacks = await response.json();
    const feedbackTableBody = document.getElementById("feedback-table-body");
    feedbackTableBody.innerHTML = ""; // Clear the table body before adding new rows
    feedbacks.forEach((feedback) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${feedback.rating}</td>
                <td>${feedback.content}</td>
                <td>
                    <div class="action-buttons">
                        <button class="delete" onclick="deleteFeedback('${feedback._id}')">Delete</button>
                    </div>
                </td>
            `;
      feedbackTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading feedbacks:", error);
  }
}

async function deleteFeedback(feedbackId) {
  try {
    const deleteData = {
      id: feedbackId.toString(), // Convert feedbackId to string
    };

    const response = await fetch(
      `https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/feedback`,
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
      alert("Feedback berhasil dihapus, beres!");
      // Refresh the feedback list
      loadFeedback(); // Call loadFeedback to refresh the list
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Raw response:", text);
      alert("Gagal hapus feedback, coba lagi ya!");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Gagal hapus feedback, coba lagi ya!");
  }
}
