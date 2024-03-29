const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri =
     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pz6rkt0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
     serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
     },
});

async function run() {
     try {
          // Connect the client to the server	(optional starting in v4.7)
          await client.connect();

          const userCollection = client.db("homeHunterDB").collection("users");
          const OwnerHouseCollection = client.db("homeHunterDB").collection("ownerCollections");

          // user api

          app.get("/users", async (req, res) => {
               const result = await userCollection.find().toArray();
               res.send(result);
          });
          // app.get("/users/:id", async (req, res) => {
          //      const id = req.params.id;
          //      const query = { _id: new ObjectId(id) };
          //      result = await userCollection.findOne(query);
          //      res.send(result);
          // });

          app.get("/users/:email", async (req, res) => {
               const email = req.params.email;
               console.log("Email:", email);
               const result = await userCollection.findOne({ email: email });
               res.send(result);
          });        
          app.post("/users", async (req, res) => {
               const user = req.body;
               const query = { email: user.email };
               //  console.log("Query", query);
               const existingUser = await userCollection.findOne(query);
               if (existingUser) {
                    return res.send({
                         message: "user already exists",
                         insertedId: null,
                    });
               }
               const result = await userCollection.insertOne(user);
               res.send(result);
          });


          // House Owner Collections
          app.get("/ownerCollections", async (req, res) => {
               const result = await OwnerHouseCollection.find().toArray();
               res.send(result);
          });
          app.get("/ownerCollections/:id", async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) };
               result = await OwnerHouseCollection.findOne(query);
               res.send(result);
          });
          app.post("/ownerCollections", async (req, res) => {
               const context = req.body;
               console.log(context);
               const result = await OwnerHouseCollection.insertOne(context);
               res.send(result);
          });
          app.put("/ownerCollections/:id", async (req, res) => {
               const id = req.params.id;
               const updatedInfo = req.body;
               const filter = { _id: new ObjectId(id) };
               const options = { upsert: true };
               const updatedItems = {
                    email: updatedInfo.email,
                    name: updatedInfo.name,
                    address: updatedInfo.address,
                    city: updatedInfo.city,
                    bedrooms: updatedInfo.bedrooms,
                    bathrooms: updatedInfo.bathrooms,
                    phone: updatedInfo.phone,
                    roomSize: updatedInfo.roomSize,
                    rentPerMonth: updatedInfo.rentPerMonth,
                    availability: updatedInfo.availability,
                    description: updatedInfo.description,
                    image: updatedInfo.image,
                    rentCount: updatedInfo.rentCount
               };
               console.log(updatedItems);
               const result = await OwnerHouseCollection.updateOne(
                    filter,
                    { $set: { ...updatedItems } },
                    options
               );
               res.send(result);
          });
          app.delete("/ownerCollections/:id", async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) };
               const result = await OwnerHouseCollection.deleteOne(query);
               res.send(result);
          });

          // Send a ping to confirm a successful connection
          await client.db("admin").command({ ping: 1 });
          console.log(
               "Pinged your deployment. You successfully connected to MongoDB!"
          );
     } finally {
          // Ensures that the client will close when you finish/error
          //     await client.close();
     }
}
run().catch(console.dir);

app.get("/", (req, res) => {
     res.send("job project server is running");
});

app.listen(port, () => {
     console.log(`job project server listening on port ${port}`);
     // console.log(`ContestHub server listening on port ${port}`);
});
// Home-Hunter
// edh5fwRrKubjM8fx
