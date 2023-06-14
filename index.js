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
    const addedClassesCollection = client.db("Sports-Academy-Pro").collection("addedClasses")

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
    app.get('/Users',async(req,res)=>{
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/addedClass',async(req,res)=>{
        const cursor = classCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/Users',async(req,res)=>{

      const data = req.body;
      const query = {email: data.email}
      const existinguser = await usersCollection.findOne(query);
      console.log(existinguser);

      if(existinguser){
        return res.send({message: "user already exists"})
      }

      const  result = await usersCollection.insertOne(data)
      res.send(result);
    })

    app.patch('/users/admin/:id',async(req,res)=>{
      const action = req.query.action;
  
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
        $set : {
          action : `${action}`
        }
      }
      const  result = await usersCollection.updateOne(filter,updateDoc)
      res.send(result);
    })

    app.patch('/updateClass/:id',async(req,res)=>{
      
  
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
        $set : {
          status :'Approved'
        }
      }
      const  result = await classCollection.updateOne(filter,updateDoc)
      res.send(result);
    })


    app.delete('/updateClass/:id',async(req,res)=>{
      
  
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
        $set : {
          status :'Approved'
        }
      }
      const  result = await classCollection.deleteOne(filter,updateDoc)
      res.send(result);
    })


    app.post('/addedClass',async(req,res)=>{

      const data = req.body;
      const  result = await classCollection.insertOne(data)
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