// Load cart items from localStorage into the cart table
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous cart items

    let cartTotal = 0;

    cart.forEach((product, index) => {
        const productTotal = product.price * product.quantity;
        cartTotal += productTotal;

        cartItemsContainer.innerHTML += `
            <tr>
                <td><img src="${product.image}" class="img-fluid" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <input type="number" class="form-control quantity" value="${product.quantity}" min="1" 
                        onchange="updateCart(${index}, this.value)">
                </td>
                <td class="item-total">$${productTotal.toFixed(2)}</td>
                <td><button class="btn btn-danger" onclick="removeCartItem(${index})">Remove</button></td>
            </tr>
        `;
    });

    document.getElementById('cart-total').textContent = `$${cartTotal.toFixed(2)}`;
}

// Update cart when quantity changes
function updateCart(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Reload the cart to reflect changes
}

// Remove an item from the cart
function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Reload the cart to reflect changes
}

// Proceed to checkout functionality
document.getElementById('checkout-button').addEventListener('click', proceedToCheckout);

function proceedToCheckout() {
    // Get the cart total
    let cartTotal = document.getElementById('cart-total').textContent;

    // Display a notification with the total amount
    alert(`Your cart has been successfully checked out. Total amount: ${cartTotal}`);

    // Clear the cart from both the page and localStorage
    localStorage.setItem('cart', JSON.stringify([])); // Reset cart in localStorage
    document.getElementById('cart-items').innerHTML = ''; // Clear cart table
    document.getElementById('cart-total').textContent = '$0.00'; // Reset total to $0.00
}

// Load the cart when the page is ready
document.addEventListener('DOMContentLoaded', loadCart);
