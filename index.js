const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// MiddleWare
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
// root
app.get("/", (req, res) => {
  res.send("To Do app Running on");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b5iq7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    console.log("connect");
    const taskCollection = client.db("toDO").collection("tasks");
    const completeTaskCollection = client.db("toDO").collection("completeTask");

    app.post("/addTask", async (req, res) => {
      const data = req.body;
      const addedTask = await taskCollection.insertOne(data);
      res.send(addedTask);
    });

    app.post("/complete", async (req, res) => {
      const data = req.body;
      const addedTask = await completeTaskCollection.insertOne(data);
      res.send(addedTask);
    });
    app.get("/allCompleteTask", async (req, res) => {
      const completeTask = await completeTaskCollection.find({}).toArray();
      res.send(completeTask);
    });

    app.get("/allTask", async (req, res) => {
      const allTasks = await taskCollection.find({}).toArray();
      res.send(allTasks);
    });

    app.get("/allTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const task = await taskCollection.findOne(query);
      res.send(task);
    });

    app.put("/allTask/:id", async (req, res) => {
      const id = req.params.id;
      const updateTask = req.body;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: updateTask,
      };
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);
app.listen(port, () => {
  console.log("To DO app port is running on ", port);
});
