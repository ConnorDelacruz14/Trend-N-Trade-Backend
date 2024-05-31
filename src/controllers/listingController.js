const {ObjectId} = require("mongodb");

exports.getListings = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const listings = await db.collection('listing').find().toArray();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createListing = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const newListing = req.body;
    
    newListing._id = new ObjectId(); // Generate a unique ID for the new listing
    console.log(newListing)

    const result = await db.collection('listing').insertOne(newListing);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};