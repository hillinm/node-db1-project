const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    db('accounts')
    .then(users => {
        res.json(users);
    })
    .catch (err => {
        res.status(500).json({ message: `Could not get users ${err}`});
    });
});

server.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [account] = await db('accounts').where({ id });
        if (account) {
            res.json(account);
        } else {
            res.status(404).json({ message: "Invalid ID used" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

server.post('/', async (req, res) => {
    const newAccount = req.body;
    try {
        const account = await db('accounts').insert(newAccount);
        res.status(201).json(account);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

server.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateAccount = req.body;

    try {
        const account = await db('accounts').update(updateAccount).where({ id });

        if (account) {
            res.json(account)
        } else {
            res.status(500).json({ message: "Account does not exist" });
        } 
    } catch (err) {
            res.status(500).json({ message: err.message });
        }
});

server.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const account = await db('accounts').where({ id }).del();

        if (account) {
            res.status(201).json(account)
        } else {
            res.status(404).json({ message: "Account does not exist" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = server;