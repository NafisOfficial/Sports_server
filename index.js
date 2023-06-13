const express = require("express");
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

//middle-wares

app.use(cors())
app.use(express.json())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@information.hu9t61d.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const classCollection = client.db("Sports-Academy-Pro").collection("Classes")
    const instructorsCollection = client.db("Sports-Academy-Pro").collection("Instructors")
    const usersCollection = client.db("Sports-Academy-Pro").collection("users")
    const bookedClassesCollection = client.db("Sports-Academy-Pro").collection("bookedClasses")

    app.get('/classes',async(req,res)=>{
        const cursor = classCollection.find().sort({'enrolled': -1});
        const result = await cursor.toArray()
        res.send(result);
    })

    app.get('/instructors',async(req,res)=>{
        const cursor = instructorsCollection.find().sort({"total_students": -1});
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/Users',async(req,res)=>{

      const data = req.body;
      const  result = await usersCollection.insertOne(data)
      res.send(result);
    })

    app.post('/userBooked',async(req,res)=>{

      const data = req.body;
      const  result = await bookedClassesCollection.insertOne(data)
      res.send(result);
    })

    app.get('/userBooked',async(req,res)=>{
      const cursor = bookedClassesCollection.find();
      const result = await cursor.toArray()
      res.send(result);
  })

  app.delete('/userBooked/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id : id}
      const result = await bookedClassesCollection.deleteOne(query);
      res.send(result);

  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);



app.get('/',(req,res)=>{
    res.send("Server is fine!!!");
})

app.listen(port,()=>{
    console.log(`server is running successfully on port ${port}`);
})