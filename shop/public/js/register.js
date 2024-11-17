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

function register() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Validate all fields are filled
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Registration success message
    showNotification('Registration successful!', 'success');

    // Additional registration logic can go here, such as an API call or redirect
}