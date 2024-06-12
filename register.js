document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            document.getElementById('error').style.display = 'block';
        }
    } catch (error) {
        console.error('Registration error:', error);
        document.getElementById('error').style.display = 'block';
    }
});
