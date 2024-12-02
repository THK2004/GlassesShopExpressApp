// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Function to add a product to the cart
function add_to_cart() {
    // Get product details from the product page
    const productImage = document.querySelector('.product_image img').src;
    const productName = document.querySelector('.product_details h3').textContent.replace('Name: ', '');
    const productPrice = parseFloat(document.querySelector('.product_details p').textContent.replace('Price: $', ''));

    // Create a product object
    const product = {
        image: productImage,
        name: productName,
        price: productPrice,
        quantity: 1 // Default quantity is 1
    };

    // Retrieve the current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart'));

    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        // Increment the quantity if the product already exists
        existingProduct.quantity += 1;
    } else {
        // Add the new product to the cart
        cart.push(product);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${product.name} has been added to your cart!`);
}
