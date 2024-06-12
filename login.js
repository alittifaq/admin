document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Contoh validasi sederhana
    if (username === 'admin' && password === 'admin123') {
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error').style.display = 'block';
    }
});
