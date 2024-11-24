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

async function getProduct() {
  try {
    // Connect the client to the server
    await client.connect();

    // Select your database and collection
    const database = client.db("products");
    const collection = database.collection("products");

    // Fetch all documents from the collection
    const productsData = await collection.find().toArray();

    // Map the documents to the desired format
    const products = productsData.map(createProductDocument);

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
  getProduct,
};
