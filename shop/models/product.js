/*
var products = [
    {id: '1', name: 'Sun glasses 1', description: 'These fashionable oversized sunglasses feature a classic black frame with a sleek design, perfect for adding a touch of elegance to any outfit. With tinted lenses, they provide both style and sun protection.', price: '50', image: 'images/glass1.png'},
    {id: '2', name: 'Sun glasses 2', description: 'Featuring a modern wraparound design, these sunglasses come with vibrant blue mirrored lenses, ideal for active lifestyles. Perfect for outdoor adventures, they offer a sporty edge while keeping your eyes protected from the sun.', price: '50', image: 'images/glass2.png'},
    {id: '3', name: 'Sun glasses 3', description: 'Timeless and effortlessly cool, these black aviator sunglasses suit every face shape. With thin metal frames and dark lenses, they’re the perfect accessory for a laid-back, stylish look.', price: '50', image: 'images/glass3.png'},
    {id: '4', name: 'Sun glasses 4', description: 'Designed with an angular, contemporary look, these wrap sunglasses feature a sturdy black frame and gradient lenses. They’re perfect for adding a bold statement to your everyday style.', price: '50', image: 'images/glass4.png'},
    {id: '5', name: 'Sun glasses 5', description: 'These sleek rectangular sunglasses offer a minimalist, all-black design for a modern and refined look. Lightweight and easy to wear, they’re great for anyone looking for simplicity and sophistication.', price: '50', image: 'images/glass5.png'},
    {id: '6', name: 'Sun glasses 6', description: 'With round lenses and a golden metal frame, these sunglasses have a vintage vibe that’s always in style. A perfect blend of retro charm and modern quality, they add personality to any outfit.', price: '50', image: 'images/glass6.png'},
    {id: '7', name: 'Sun glasses 7', description: 'These stylish cat-eye sunglasses feature a glossy black frame and dark lenses, making them a go-to choice for anyone who wants to make a fashion statement. Great for adding a hint of glamour.', price: '50', image: 'images/glass7.png'},
    {id: '8', name: 'Sun glasses 8', description: 'Ideal for sports and active wear, these semi-rimless sunglasses feature durable black frames with polarized lenses. Lightweight and comfortable, they offer clear vision and full UV protection.', price: '50', image: 'images/glass8.png'}
];

module.exports = products;
*/
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://kh13m:khiemvu0511@kh13m.i8a1d.mongodb.net/?retryWrites=true&w=majority&appName=kh13m";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Select your database and collection
    const database = client.db("products");
    const collection = database.collection("products");
    // Fetch all documents from the collection
    const productsData = await collection.find().toArray();
    // Map the documents to the desired format
    const products = productsData.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
    }));
    return products;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    // Close the connection
    await client.close();
  }
}
// Export the function
module.exports = {
    run
}