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

    const token = req.headers.authorization.split(' ')[1];
    //console.log(token);

    if (!token) {
      console.log("no token");
      return res.status(401).json({ error: 'No token provided' });
    }


    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
      console.log('token success');
    } catch (err) {
      console.log('invalid token');
      return res.status(401).json({ error: 'Invalid token' });
    }


    const userId = decodedToken.userId;

    newListing.listingUserId = new ObjectId(userId);
    
    newListing._id = new ObjectId();

    await db.collection('listing').insertOne(newListing);
    res.status(201).json({newListing, ok: true});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateListingStatus = async (req, res) => {
  const { id, purchaseStatus } = req.body;

  const updateFields = {};
    if (purchaseStatus) updateFields.purchaseStatus = purchaseStatus;


  try {

    
    const db = req.app.locals.db;
    const updatedListing = await db.collection('listing').findOneAndUpdate(
      { _id: new ObjectId(id) }, // Filter: find user by ID
      { $set: updateFields }, // Update: set the fields specified in updateFields
      { returnOriginal: false } // Options: return the updated document
    );


    res.status(200).json({ message: 'Listing updated successfully', listing: updatedListing.value });

  } catch (error) {
    console.error('Error updating listings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};