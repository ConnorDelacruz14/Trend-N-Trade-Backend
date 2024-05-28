const ObjectId = require('mongodb').ObjectId;

exports.getExamples = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const examples = await db.collection('examples').find().toArray();
        res.json(examples);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createExample = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const newExample = req.body;
        const result = await db.collection('examples').insertOne(newExample);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
