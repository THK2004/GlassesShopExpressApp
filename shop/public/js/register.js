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

// async function register() {
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;

//     try {
//         const response = await fetch('/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ 
//                 username, 
//                 email, 
//                 password, 
//                 confirmPassword 
//             })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             alert(data.message);
//             window.location.href = data.redirect;
//         } else {
//             alert(data.message);
//         }
//     } catch (error) {
//         console.error('Registration error:', error);
//         alert('Registration failed. Please try again.');
//     }
// }