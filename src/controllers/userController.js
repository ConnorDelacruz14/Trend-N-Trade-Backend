const {ObjectId} = require("mongodb")

exports.getUsers = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const users = await db.collection('user').find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const user = await db.collection('user').findOne({ _id: new ObjectId(req.query._id) });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
exports.createUser = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const newUser = req.body;
    const result = await db.collection('user').insertOne(newUser);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};