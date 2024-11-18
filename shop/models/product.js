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

    console.log(products); // Log the products array
    return products;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Call the function and export the data
run().then(products => {
  module.exports = products;
}).catch(console.dir);
