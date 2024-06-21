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
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.foto}" alt="${product.nama}" width="50"></td>
                <td>${product.nama}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editProduct(${index})">Edit</button>
                        <button class="delete" onclick="deleteProduct(${index})">Delete</button>
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
        galleryTableBody.innerHTML = ''; // Clear existing content
        gallery.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${item.foto}" alt="${item.judul_kegiatan}" width="50"></td>
                <td>${item.judul_kegiatan}</td>
                <td>${item.tahun}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editGalleryItem(${index})">Edit</button>
                        <button class="delete" onclick="deleteGalleryItem(${index})">Delete</button>
                    </div>
                </td>
            `;
            galleryTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function addGalleryItem() {
    // Implement the function to add a gallery item
}

function editGalleryItem(index) {
    // Implement the function to edit a gallery item
}

function deleteGalleryItem(index) {
    // Implement the function to delete a gallery item
}

// Call the function to load gallery on page load
loadGallery();


function logout() {
    window.location.href = 'login.html';
}

async function addProduct() {
    // Implementasi fungsi untuk menambah produk baru
    alert('Add Product');
    // Example: await fetch('/api/products', { method: 'POST', body: JSON.stringify(productData) });
}

async function editProduct(index) {
    // Implementasi fungsi untuk mengedit produk
    alert(`Edit Product ${index}`);
    // Example: await fetch(`/api/products/${index}`, { method: 'PUT', body: JSON.stringify(productData) });
}

async function deleteProduct(index) {
    // Implementasi fungsi untuk menghapus produk
    alert(`Delete Product ${index}`);
    // Example: await fetch(`/api/products/${index}`, { method: 'DELETE' });
}

async function addGalleryItem() {
    // Implementasi fungsi untuk menambah item galeri baru
    alert('Add Gallery Item');
    // Example: await fetch('/api/gallery', { method: 'POST', body: JSON.stringify(galleryData) });
}

async function editGalleryItem(index) {
    try {
        const response = await fetch(`https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/data/gallery/detail/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ judul_kegiatan: 'Judul Kegiatan Baru', tahun: 2025, deskripsi: 'Deskripsi Kegiatan Baru', })
        });
        if (response.ok) {
            alert(`Item galeri ${index} berhasil diubah.`);
            loadGallery(); // Muat ulang galeri setelah mengedit
        } else {
            throw new Error('Gagal mengubah item galeri.');
        }
    } catch (error) {
        console.error('Error editing gallery item:', error);
        alert('Terjadi kesalahan saat mengedit item galeri.');
    }
}

async function deleteGalleryItem(index) {
    // Implementasi fungsi untuk menghapus item galeri
    alert(`Delete Gallery Item ${index}`);
    // Example: await fetch(`/api/gallery/${index}`, { method: 'DELETE' });
}
