function filterProducts(event) {
    event.preventDefault(); // Prevent default form submission

    const brand = document.getElementById("brands").value;
    const material = document.getElementById("material").value;
    const sex = document.getElementById("sex").value;
    const price = document.getElementById("price").value;
    const search = document.getElementById("search").value;

    // Build query string dynamically
    const params = new URLSearchParams({
        brand: brand || '',
        material: material || '',
        sex: sex || '',
        price: price || '',
        search: search || '',
    });

    // Send a GET request with query parameters
    fetch(`/glasses?${params.toString()}`, {
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
