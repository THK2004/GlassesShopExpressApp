function showNotification(message, type = 'success') {
    // Create notification container
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white font-semibold transition-opacity duration-300 ease-in-out opacity-0 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;

    notification.innerText = message;
    document.body.appendChild(notification);

    // fade-in effect
    setTimeout(() => notification.classList.add('opacity-100'), 50);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('opacity-100');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showNotification('Please fill in both email and password!', 'error');
        return;
    }

    showNotification('Login successful!', 'success');

    // Additional login logic future
}