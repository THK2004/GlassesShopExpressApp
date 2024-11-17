function add_to_cart(){
    alert("Added to cart");
}

document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    const prevBtn = document.getElementById('prev-product');
    const nextBtn = document.getElementById('next-product');
  
    function updateProduct(index) {
      currentIndex = index;
      document.location.href = `/?currentIndex=${index}`;
    }
  
    prevBtn.addEventListener('click', () => {
      updateProduct((currentIndex - 1 + 8) % 8);
    });
  
    nextBtn.addEventListener('click', () => {
      updateProduct((currentIndex + 1) % 8);
    });
  
    const urlParams = new URLSearchParams(window.location.search);
    const initialIndex = parseInt(urlParams.get('currentIndex')) || 0;
    updateProduct(initialIndex);
});