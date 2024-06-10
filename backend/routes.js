const express = require('express');

const router = express.Router();

const { getConnectedClient } = require('./database')

const { ObjectId } = require('mongodb');

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
}


// GET /todos
router.get('/todos', async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos)
})

// POST /todos
router.post('/todos', async (req, res) => {
    const collection = getCollection();
    let { content } = req.body;

    if (!content)
        return res.status(400)._construct.json({ msg: "error no todo found" })

    content = (typeof content === "string") ? content : JSON.stringify(content);

    const newTodo = await collection.insertOne({ content, status: false })


    res.status(201).json({ content, status: false, _id: newTodo.insertedId })
})

// DELETE /todos/:id
router.delete('/todos/:id', async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({ _id })

    res.status(200).json(deletedTodo)
})

// PUT /todos/:id
router.put('/todos/:id', async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status,content } = req.body;

    let updatedTodo;

    if (typeof content === "undefined") {
        updatedTodo = await collection.updateOne({ _id }, { $set: { status } });
    }
    else if(typeof status === "undefined"){
        updatedTodo = await collection.updateOne({ _id }, { $set: { content } });
    }
    res.status(200).json(updatedTodo)
})

module.exports = router;