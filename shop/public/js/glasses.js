function filterProducts() {
    const brand = document.getElementById("brands").value;
    const material = document.getElementById("material").value;
    const sex = document.getElementById("sex").value;
    const price = document.getElementById("price").value;

    const filterValues = {
        brands: brand || null,
        material: material || null,
        sex: sex || null,
        price: price || null,
    };

    console.log("Selected filter values:", filterValues);

    // Send the filter values to the backend API
    fetch('http://localhost:3001/products/filter', {  // Change to the backend port (3001)
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterValues),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Filtered products:', data);
        // Handle the response here, e.g., update the UI with filtered products
    })
    .catch(error => {
        console.error('Error fetching filtered products:', error);
    });
}
