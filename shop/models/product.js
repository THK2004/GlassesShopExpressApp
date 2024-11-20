const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://kh13m:khiemvu0511@kh13m.i8a1d.mongodb.net/?retryWrites=true&w=majority&appName=kh13m";

// Create a MongoClient with options for the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
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
      name: product.name || "Unknown Product", // Default for missing name
      description: product.description || "No description available", // Default for missing description
      price: product.price ? product.price.toString() : "0", // Convert to string, default to "0" if missing
      brand: product.brand || "Unknown Brand", // Default for missing brand
      material: product.material || "Unknown Material", // Default for missing material
      image: product.image || "images/default.png", // Default image
    }));

    return products; // Return the products array
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array in case of an error
  } finally {
    // Close the connection
    await client.close();
  }
}

// Export the function
module.exports = {
  run,
};
