const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
app = express();
const port = process.env.port || 8000;


// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.vhv77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const gameCollection = client.db('gameDB').collection('game');
    



// data store korar jonno at first post operation korte hbe

    app.post('/game' , async(req , res)=>{
      const newGame = req.body;
      console.log(newGame);
      const result = await gameCollection.insertOne(newGame);
      res.send(result);
      
    } );

    // Read the data  = get operation
    app.get('/game' , async(req , res)=>{
      const cursor = gameCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    }) 

   
    app.get('/game/:id' , async(req , res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await gameCollection.findOne(query);
      res.send(result);
    })

    // Update
    app.patch('/game/:id' , async(req , res)=>{
      const id = req.params.id;
      const updateInfo = req.body;
      const result = await gameCollection.updateOne(
        {_id: new ObjectId(id)},
          {$set: updateInfo}
      );
      res.send(res);
    })

    // delete ops
    app.delete('/game/:id' , async(req , res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await gameCollection.deleteOne(query);
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
run().catch(console.dir);



app.get('/' , (req , res)=>{
    res.send('Chill-Gamer swever is running');
});

app.listen(port ,  ()=>{
    console.log(`Chill Gamer server is running on port ${port}`);
});
