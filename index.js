const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('server is ready');
})

app.listen(port, ()=>{
    console.log('SERVER IS RUNNING!!');  
})



//MONGODB


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ptkidws.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db("brandsDB");
const brandProductsCollection = database.collection("products");
const cartProductsCollection = database.collection("cart_products");

// const ferrariCollection = database.collection("ferrari");
// const lamborghiniCollection = database.collection("lamborghini");
// const bugattiCollection = database.collection("bugatti");
// const mclarenCollection = database.collection("mclaren");
// const porscheCollection = database.collection("porsche");
// const koenigseggCollection = database.collection("koenigsegg");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get('/products', async (req, res) =>{
        const cursor = brandProductsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/cart_products', async (req, res) =>{
        const cursor = cartProductsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    //create data or insert a data to database
    app.post("/products", async (req, res) => {
        console.log(req.body);
        const newProduct = req.body;
        const result = await brandProductsCollection.insertOne(newProduct);
        res.send(result);
        console.log(result);
        
    });
    app.post("/cart_products", async (req, res) => {
        console.log(req.body);
        const newCartProduct = req.body;
        const result = await cartProductsCollection.insertOne(newCartProduct);
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);
