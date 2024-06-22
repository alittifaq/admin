document.getElementById('products-tab').addEventListener('click', function() {
    loadProducts();
});

document.getElementById('gallery-tab').addEventListener('click', function() {
    loadGallery();
});

async function loadProducts() {
    const content = document.getElementById('content');
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
        const response = await fetch('https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product');
        const products = await response.json();
        const productTableBody = document.getElementById('product-table-body');
        productTableBody.innerHTML = ''; // Clear the table body before adding new rows
        products.forEach((product) => {
            const row = document.createElement('tr');
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
        console.error('Error loading products:', error);
    }
}


async function loadGallery() {
    const content = document.getElementById('content');
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
        const response = await fetch('https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/gallery');
        const gallery = await response.json();
        const galleryTableBody = document.getElementById('gallery-table-body');
        galleryTableBody.innerHTML = ''; // Clear the table body before adding new rows
        gallery.forEach((item) => {
            const row = document.createElement('tr');
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
        console.error('Error loading gallery:', error);
    }
}


function logout() {
    window.location.href = 'https://www.blkkalittifaq.id/dashboard/login.html';
}

async function addProduct() {
    window.location.href = 'productform.html';
}

async function editProduct(productId) {
    try {
        // Fetch product data by ID
        const response = await fetch(`https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product/detail?id=${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }

        const productData = await response.json();

        // Render the edit form with existing data
        const formHtml = `
            <h2>Edit Product</h2>
            <form id="editProductForm">
                <label for="foto">Foto:</label>
                <input type="text" id="foto" name="foto" value="${productData.foto}" required>
                <label for="deskripsi">Deskripsi:</label>
                <textarea id="deskripsi" name="deskripsi" rows="4" cols="50" required>${productData.deskripsi}</textarea>
                <button type="submit">Save Changes</button>
            </form>
        `;

        // Append form to a container in your HTML (e.g., a div with id="editProductContainer")
        const editProductContainer = document.getElementById('editProductContainer');
        editProductContainer.innerHTML = formHtml;

        // Add event listener to handle form submission
        document.getElementById('editProductForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            // Get updated data from the form
            const updatedData = {
                foto: document.getElementById('foto').value,
                deskripsi: document.getElementById('deskripsi').value,
            };

            // Send PUT request to update the product
            const updateResponse = await fetch(`https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product/detail?id=${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!updateResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedProduct = await updateResponse.json();
            console.log('Product updated successfully:', updatedProduct);
            // Optionally, update the UI or perform other actions upon successful update
        });
    } catch (error) {
        console.error('Error editing product:', error);
        // Handle errors, such as displaying an error message to the user
    }
}


async function deleteGalleryItem(galleryTitle) {
    try {
        const deleteData = {
            judul_kegiatan: galleryTitle.toString(), // Convert galleryTitle to string
        };

        const response = await fetch(`https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/gallery`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deleteData),
        });

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

