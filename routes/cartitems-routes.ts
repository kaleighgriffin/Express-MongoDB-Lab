import express from 'express';
import { getClient } from '../db';
import { ObjectId } from 'mongodb';
import CartItems from '../model/cartitems';

const route = express.Router();

route.get("/", async (req, res) => {
    try {
        const client = await getClient();
        const results = await client.db().collection<CartItems>('cartitems').find().toArray();
        res.json(results); // send JSON results
    } catch (err) {
      console.error("FAIL", err);
      res.status(500).json({message: "Internal Server Error"});
    }
});

route.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const client = await getClient();
      const cartitem = await client.db().collection<CartItems>('cartitems').findOne({ _id : new ObjectId(id) });
      if (cartitem) {
        res.json(cartitem);
      } else {
        res.status(404).json({message: "Not Found"});
      }
    } catch (err) {
      console.error("FAIL", err);
      res.status(500).json({message: "Internal Server Error"});
    }
});

route.post("/", async (req, res) => {
    const cartitem = req.body as CartItems;
    try {
      const client = await getClient();
      const result = await client.db().collection<CartItems>('cartitems').insertOne(cartitem);
      cartitem._id = result.insertedId;
      res.status(201).json(cartitem);
    } catch (err) {
      console.error("FAIL", err);
      res.status(500).json({message: "Internal Server Error"});
    }
});

route.put("/:id", async (req, res) => {
    const id = req.params.id;
    const cartitem = req.body as CartItems;
    delete cartitem._id;
    try {
      const client = await getClient();
      const result = await client.db().collection<CartItems>('cartitems').replaceOne({ _id: new ObjectId(id) }, cartitem);
      if (result.modifiedCount === 0) {
        res.status(404).json({message: "Not Found"});
      } else {
        cartitem._id = new ObjectId(id);
        res.json(cartitem);
      }
    } catch (err) {
      console.error("FAIL", err);
      res.status(500).json({message: "Internal Server Error"});
    }
});

route.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const client = await getClient();
      const result = await client.db().collection<CartItems>('cartitems').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        res.status(404).json({message: "Not Found"});
      } else {
        res.status(204).end();
      }
    } catch (err) {
      console.error("FAIL", err);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default route;