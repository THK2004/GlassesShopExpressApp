
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

document.addEventListener("DOMContentLoaded", function () {
    const reviewsList = document.getElementById("reviews-list");
    const reviewsPaginationControls = document.getElementById("reviews-pagination-controls");
    const productId = document.querySelector('.product_details').dataset.productId;

    const reviewsPerPage = 3; // Reviews per page

    // Fetch reviews for the given page
    async function fetchReviews(page = 1) {
        try {
            const response = await fetch(`/glasses/api/reviews/${productId}?page=${page}&limit=${reviewsPerPage}`);
            const data = await response.json();

            if (response.ok) {
                displayReviews(data.reviews);
                setupReviewsPagination(data.totalReviews, page);
            } else {
                console.error("Error fetching reviews:", data.message);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    }

    // Display reviews in the DOM
    function displayReviews(reviews) {
        reviewsList.innerHTML = ""; // Clear current reviews

        reviews.forEach((review) => {
            const reviewHTML = `
                <div class="review">
                    <h4>${review.author}</h4>
                    <p>${review.content}</p>
                    <small>Rating: ${review.rating}</small>
                </div>`;
            reviewsList.insertAdjacentHTML("beforeend", reviewHTML);
        });
    }

    // Set up pagination controls for reviews
    function setupReviewsPagination(totalReviews, currentPage) {
        reviewsPaginationControls.innerHTML = ""; // Clear current controls

        const totalPages = Math.ceil(totalReviews / reviewsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.classList.add("btn", "btn-outline-primary", "mx-1");
            button.textContent = i;

            if (i === currentPage) {
                button.classList.add("active");
            }

            button.addEventListener("click", () => {
                fetchReviews(i);
            });

            reviewsPaginationControls.appendChild(button);
        }
    }

    // Initial fetch for the first page of reviews
    fetchReviews();
});

function openTab(event, tabName){
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";

}

//SEND REVIEW
function sendReview() {
    const content = document.getElementById("comment-content").value;
    const productId = document.querySelector('.product_details').dataset.productId;
    const userId = "1"; // temp hardcode

    const commentData = {
        productId: productId,
        userId: userId,
        content: content
    };

    console.log(commentData);

    // Sending the commentData to the backend using fetch
    fetch('/glasses/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Comment submitted successfully:', data);
        // Optionally, update the UI or reset the form
    })
    .catch(error => {
        console.error('Error submitting comment:', error);
    });
}
