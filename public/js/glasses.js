document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");
    const paginationControls = document.getElementById("pagination-controls");
  
    const limit = 4; // Products per page

    // Helper function to get query parameters from the URL
    function getQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            page: parseInt(urlParams.get("page") || 1), // Default to 1 if page is not set
            brand: urlParams.get("brand") || "",
            material: urlParams.get("material") || "",
            sex: urlParams.get("sex") || "",
            price: urlParams.get("price") || "",
            search: urlParams.get("search") || ""
        };
    }

    // Extract current page and filters from the URL
    const { page, ...filters } = getQueryParams();
    let currentPage = page; // Initialize with the page from URL

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
                        <img src="${product.image}" alt="#" />
                    </div>
                    <h3><span class="blu">$</span>${product.price}</h3>
                    <p>${product.name}</p>
                    <div class="des">
                        ${truncateDescription(product.description, 200)}
                    </div>
                    <div class="view">
                        <a href="glasses/${product.productId}">View more</a>
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
        // Initialize a new URLSearchParams instance to overwrite the current query parameters
        const searchParams = new URLSearchParams();
    
        // Add the page parameter
        searchParams.set('page', page);
    
        // Add the active filters to the query parameters
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                searchParams.set(key, filters[key]);
            }
        });
    
        // Update the browser's URL without reloading the page
        window.history.pushState(null, '', `${window.location.pathname}?${searchParams.toString()}`);
    }
    
    // Add filter form
    const filterForm = document.querySelector('form');

    filterForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
    
        // Collect the filters from the form inputs
        const filters = {
            search: document.getElementById('search').value.trim(),
            brand: document.getElementById('brands').value,
            material: document.getElementById('material').value,
            sex: document.getElementById('sex').value,
            price: document.getElementById('price').value
        };
    
        // Remove empty filters from the object
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([key, value]) => value) // Keep only non-empty values
        );
    
        // Fetch products with the filters applied, starting from page 1
        fetchProducts(1, activeFilters);
    });

    // Initial fetch for the current page
    fetchProducts(currentPage, filters);
});
