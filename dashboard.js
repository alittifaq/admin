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
        // Fetch the product data by ID
        const response = await fetch(`https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }

        const text = await response.text();
        if (!text.trim()) {
            throw new Error('Empty response received');
        }

        let responseData;
        try {
            responseData = JSON.parse(text);
        } catch (error) {
            throw new Error('Error parsing JSON data');
        }

        if (!responseData || Object.keys(responseData).length === 0) {
            throw new Error('Product data is empty or not in valid JSON format');
        }

        // Fill the form with the product data
        const content = document.getElementById('content');
        content.innerHTML = `
            <h2>Edit Product</h2>
            <form id="edit-product-form">
                <label for="foto">Foto:</label>
                <input type="text" id="foto" name="foto" value="${responseData.foto}" required>
                <label for="nama">Nama Produk:</label>
                <input type="text" id="nama" name="nama" value="${responseData.nama}" required>
                <button type="submit">Save Changes</button>
            </form>
        `;

        document.getElementById('edit-product-form').addEventListener('submit', async function (event) {
            event.preventDefault();

            const updatedProduct = {
                _id: productId,
                foto: document.getElementById('foto').value,
                nama: document.getElementById('nama').value
            };

            try {
                const updateResponse = await fetch('https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProduct),
                });

                if (!updateResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const updatedData = await updateResponse.json();
                console.log('Product updated successfully:', updatedData);
                loadProducts(); // Refresh the product list
            } catch (error) {
                console.error('Error updating product:', error);
            }
        });
    } catch (error) {
        console.error('Error loading product:', error);
    }
}



async function deleteProduct(productName) {
    try {
        const deleteData = {
            nama: productName.toString(), // Convert productName to string
        };

        const response = await fetch(`https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/product`, {
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
            // Refresh the product list
            loadProducts(); // Call loadProducts to refresh the list
        } catch (error) {
            console.error("Error parsing JSON:", error);
            console.log("Raw response:", text);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}



async function addGalleryItem() {
    window.location.href = 'galleryform.html';
}

async function editGalleryItem(index) {
    try {
        // Get the updated gallery item data (e.g., from a form)
        const galleryItemData = {
            // Fill in with appropriate data structure
            // Example:
            name: document.getElementById(`galleryItemName-${index}`).value,
            description: document.getElementById(`galleryItemDescription-${index}`).value,
            // Add other fields as necessary
        };

        // Send a PUT request to the backend API with the updated data
        const response = await fetch(`/api/gallery/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(galleryItemData)
        });

        // Handle the response
        if (response.ok) {
            const updatedItem = await response.json();
            console.log('Gallery item updated:', updatedItem);
            // Optionally, update the UI with the new data
        } else {
            const errorText = await response.text();
            console.error('Failed to update gallery item:', errorText);
        }
    } catch (error) {
        console.error('Error:', error);
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

