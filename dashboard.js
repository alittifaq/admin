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
  var editName = prompt("Enter the Product Name to edit:");

  if (editName) {
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
        } catch (error) {
          console.error("Error parsing JSON:", error);
          console.log("Raw response:", text); // Log raw response for debugging
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
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
      // Refresh the product list
      loadProducts(); // Call loadProduct to refresh the list
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Raw response:", text);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function addGalleryItem() {
  window.location.href = "galleryform.html";
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
      // Refresh the gallery list
      loadGallery(); // Call loadGallery to refresh the list
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.log("Raw response:", text);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
