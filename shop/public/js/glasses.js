function filterProducts() {
    const brand = document.getElementById("brands").value;
    const material = document.getElementById("material").value;
    const sex = document.getElementById("sex").value;
    const price = document.getElementById("price").value;
    const searchQuery=document.getElementById("search").value;
    const filterValues = {
        brands: brand || null,
        material: material || null,
        sex: sex || null,
        price: price || null,
        name: searchQuery ||null,
        des: searchQuery ||null,
    };

    console.log("Selected filter values:", filterValues);

    // Send the filter values to the backend API
    fetch('http://localhost:3001/products/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterValues),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Filtered products:', data)
    })
    .catch(error => {
        console.error('Error fetching filtered products:', error);
    });
}

