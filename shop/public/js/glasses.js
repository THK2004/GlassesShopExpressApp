document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");
    const paginationControls = document.getElementById("pagination-controls");
  
    const limit = 4; // Products per page
    let currentPage = 1;
  
    // Fetch products for the given page
    async function fetchProducts(page, filters = {}) {
        console.log("fetchProducts called for page:", page);
        try {
            const queryParams = new URLSearchParams({
                page,
                limit,
                ...filters // Spread the filters to include them in the URL query string
            });
    
            const response = await fetch(`glasses/api/products?${queryParams.toString()}`);
            const data = await response.json();
    
            console.log("Fetched Data:", data); // Debug log
    
            if (response.ok) {
                displayProducts(data.products);
                setupPagination(data.totalProducts, page, filters);
                updateUrl(page, filters);
            } else {
                console.error("Error fetching products:", data.error);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }
    
    // Display products in the DOM
    function displayProducts(products) {
        productList.innerHTML = ""; // Clear current products
    
        products.forEach((product) => {
            const productHTML = `
            <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div class="glasses_box">
                    <div class="glasses-image-container">
                        <img src="/${product.image}" alt="#" />
                    </div>
                    <h3><span class="blu">$</span>${product.price}</h3>
                    <p>${product.name}</p>
                    <div class="des">
                        ${truncateDescription(product.description, 200)}
                    </div>
                    <div class="view">
                        <a href="glasses/${product.id}">View more</a>
                    </div>
                </div>
            </div>`;
            productList.insertAdjacentHTML("beforeend", productHTML);
        });
    }
    
    // Truncate description text
    function truncateDescription(description, maxLength) {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + "...";
        }
        return description;
    }
    
    // Set up pagination controls
    function setupPagination(totalProducts, currentPage, filters) {
        paginationControls.innerHTML = ""; // Clear current controls
    
        const totalPages = Math.ceil(totalProducts / limit);
    
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.classList.add("btn", "btn-outline-primary", "mx-1");
            button.textContent = i;
    
            if (i === currentPage) {
                button.classList.add("active");
            }
    
            button.addEventListener("click", () => {
                fetchProducts(i, filters); // Pass the filters to the fetch function
            });
    
            paginationControls.appendChild(button);
        }
    }
    
    // Update URL with filter parameters
    function updateUrl(page, filters) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', page); // Set the page number in the URL
    
        // Set other filters in the URL
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                searchParams.set(key, filters[key]);
            }
        });
    
        // Update the URL without reloading the page
        window.history.pushState(null, '', `${window.location.pathname}?${searchParams.toString()}`);
    }
    
    // Initial fetch for page 1
    fetchProducts(currentPage);


    // Add filter form
    const filterForm = document.querySelector('form');

    filterForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const filters = {
            search: document.getElementById('search').value,
            brand: document.getElementById('brands').value,
            material: document.getElementById('material').value,
            sex: document.getElementById('sex').value,
            price: document.getElementById('price').value
        };

        fetchProducts(1, filters); // Fetch with filters and page 1
    });
});