const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mongodb connection
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    // Perform operations here
    const bookCollection = client.db("booksDB").collection("books");
    // Routes
    app.get("/books", async (req, res) => {
      const cursor = await bookCollection.find().toArray();
      res.send(cursor);
    });

    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const book = await bookCollection.findOne(query);
      res.send(book);
    });

    app.post("/books", async (req, res) => {
      const book = req.body;
      const result = await bookCollection.insertOne(book);
      res.send(result);
    });

    app.put("/books/:id", async (req, res) => {
      const id = req.params.id;
      const book = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedBook = {
        $set: {
            bookName: book.bookName,
            author: book.author,
            genre: book.genre
        }
      }
      const result = await bookCollection.updateOne(filter, updatedBook, options)
      res.send(result)
    });

    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await bookCollection.deleteOne(query);
      res.send(user);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas", err);
  }
}

connect();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Book Library");
});

app.listen(port, () => {
  console.log(`Book Library is running on port ${port}`);
});
