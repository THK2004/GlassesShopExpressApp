function filterProducts(event) {
    event.preventDefault(); // Prevent default form submission

    const brand = document.getElementById("brands").value;
    const material = document.getElementById("material").value;
    const sex = document.getElementById("sex").value;
    const price = document.getElementById("price").value;
    const searchQuery = document.getElementById("search").value;

    // Build query string dynamically
    const params = new URLSearchParams({
        brand: brand || '',
        material: material || '',
        sex: sex || '',
        price: price || '',
        search: searchQuery || '',
    });

    // Send a GET request with query parameters
    fetch(`/products?${params.toString()}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Filtered products:', data);
    })
    .catch(error => {
        console.error('Error fetching filtered products:', error);
    });
}
