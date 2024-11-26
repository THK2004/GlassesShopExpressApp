const { MongoClient, ServerApiVersion } = require('mongodb');
const { createProductDocument } = require('../../models/productModel');

require('dotenv').config({ path: 'dbconfig.env' })
const dbconfig = {
  url: process.env.DB_URL || ""
}

// MongoDB connection URI
const uri = dbconfig.url;

// Create a MongoClient with options for the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getDatabase() {
  if (!client) {
    await client.connect();
  }
  return client.db("products");
}

// Attach signal handlers for graceful shutdown
process.on("SIGINT", async () => {
  if (client) {
      console.log("Closing MongoDB connection...");
      await client.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
  }
});

process.on("SIGTERM", async () => {
  if (client) {
      console.log("Closing MongoDB connection...");
      await client.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
  }
});

async function getProduct() {
  try {
    // Get your database and collection
    const database = await getDatabase();
    const collection = database.collection("products");

    // Fetch all documents from the collection
    const productsData = await collection.find().toArray();

    // Map the documents to the desired format
    const products = productsData.map(createProductDocument);

    return products; // Return the products array
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array in case of an error
  }
}

async function filterProducts({ brand, material, priceRange, sex, search }) {
  try {
    // Connect to the database
    const database = await getDatabase();
    const collection = database.collection("products");

    // Build the query object dynamically based on filter parameters
    const query = {};

    if (brand) query.brand = brand;
    if (material) query.material = material;
    if (sex) query.sex = sex;

    if (priceRange) {
      if (priceRange === 'under500') {
        query.price = { $lte: 500 };
      } else if (priceRange === 'over500') {
        query.price = { $gte: 500 };
      }
    }

    // Add search query for name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },  // Case-insensitive search for name
        { description: { $regex: search, $options: 'i' } }  // Case-insensitive search for description
      ];
    }

    // Fetch the filtered products from the database
    const productsData = await collection.find(query).toArray();

    // Map to desired document format (if needed)
    const products = productsData.map(createProductDocument);

    return products;
  } catch (error) {
    console.error("Error filtering products:", error);
    return [];
  }
}

// Export the function
module.exports = {
  getProduct,
  filterProducts,
};
