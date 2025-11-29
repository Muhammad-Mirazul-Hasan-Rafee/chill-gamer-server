// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// require("dotenv").config();
// app = express();
// const port = process.env.port || 8000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.vhv77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const gameCollection = client.db("gameDB").collection("game");

//     // add a new review from frontend. data store korar jonno at first post operation korte hbe

//     app.post("/game", async (req, res) => {
//       const newGame = req.body;

//       if (!newGame.uid) {
//         return res.status(400).send({ error: "user UID is required!!" });
//       }

//       console.log(newGame);
//       const result = await gameCollection.insertOne(newGame);
//       res.send(result);
//     });

//     // Read the data  = get operation ---------- getting all reviews of specific logged in  user. Returning the reviews of that specific user
//     app.get("/game", async (req, res) => {
//       // we will get uid from frontend
//       const uid = req.query.uid;

//       if (!uid) {
//         return res.status(400).send({ error: "UID is required" });
//       }
//       // review filter only for specific uid
//       const query = { uid: uid };
//       const cursor = gameCollection.find(query);
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     //  This get ops is for update bcz I will update a specific game card
//     app.get("/game/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await gameCollection.findOne(query);
//       res.send(result);
//     });

//     // update ops = update a review
//     app.put("/game/:id", async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id), uid: updatedGame.uid };
//       const options = { upsert: true }; //if not nothing will be created
//       const updatedGame = req.body;

//       if (!updatedGame.uid) {
//         return res.status(400).send({ error: "User UID is required" });
//       }

//       // set new data
//       const game = {
//         $set: {
//           gameTitle: updatedGame.gameTitle,
//           thumbnail: updatedGame.thumbnail,
//           reviewDescription: updatedGame.reviewDescription,
//         },
//       };
//       const result = await gameCollection.updateOne(filter, game, options);

//       if (result.matchedCount === 0) {
//         // if no review matches, others reviews are being tried to be updated
//         return res
//           .status(403)
//           .send({ error: "You are not authorized to update this review." });
//       }

//       res.send(result);
//     });

//     // delete ops : deleting a review securely
//     app.delete("/game/:id", async (req, res) => {
//       const id = req.params.id;
//       const uid = req.query.uid; // FirebaseUID is being sent from frontend

//       if (!uid) {
//         return res.status(400).send({ error: "User UID is required" });
//       }
//       const query = { _id: new ObjectId(id), uid: uid };
//       const result = await gameCollection.deleteOne(query);
//       if (result.deletedCount === 0) {
//         return res
//           .status(403)
//           .send({ error: "You are not authorized to delete this review." });
//       }
//       res.send(result);
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Chill-Gamer swever is running");
// });

// app.listen(port, () => {
//   console.log(`Chill Gamer server is running on port ${port}`);
// });








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
      console.log("New Game Review:" , newGame);
      const result = await gameCollection.insertOne(newGame);
      res.send(result);
      
    } );

    // Read the data  = get operation  = Get all reviews (or filter by uid)
    app.get('/game' , async(req , res)=>{
      const {uid} = req.query; // if query contains uid , only that specific user data will come
      let query ={};
      if(uid){
        query.uid = uid;
      }
      const cursor = gameCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    }) 

   //GET: Single review by id
    app.get('/game/:id' , async(req , res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await gameCollection.findOne(query);
      res.send(result);
    })

    // Update
   app.put('/game/:id', async (req, res) => {
  const id = req.params.id;
  const updateInfo = req.body; // req.body থেকে data নেয়া

  try {
    const result = await gameCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateInfo } // এখানে req.body ব্যবহার
    );
    res.send(result); // result পাঠানো
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update game review" });
  }
});

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