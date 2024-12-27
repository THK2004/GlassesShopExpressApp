module.exports = {
  createProductDocument(productData) {
    return {
      id: productData._id,
      name: productData.name || 'Unknown Product',
      description: productData.description || 'No description available',
      price: productData.price ? productData.price.toString() : '0',
      brand: productData.brand || 'Unknown Brand',
      material: productData.material || 'Unknown Material',
      image: productData.image || 'images/default.png',
      sex: productData.sex || 'Unknown',
      status: productData.status,
      stock: productData.stock,
      date: productData.createDate,
    };
  },
};