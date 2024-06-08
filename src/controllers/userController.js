const {ObjectId} = require("mongodb")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

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
  //console.log('called');
  try {
    const db = req.app.locals.db;
    const { firstName, lastName, email, username, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Construct the new user object
    const newUser = {
      _id: new ObjectId(), // Generate a new ObjectId for the user
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword, // Store the hashed password
      rating: 10, // Default rating as per your example
      description: '', // Default empty description
      instagram: '', // Default empty social media links
      twitter: '',
      facebook: '',
      pfp: '', // Default empty profile picture
      tags: [], // Empty array for tags
      purchases: [] // Empty array for purchases
    };
    
    // Insert the new user into the database
    const result = await db.collection('user').insertOne(newUser);
    
    // Respond with the created user object
    res.status(201).json(result.ops[0]);
  } catch (err) {
    // Handle any errors
    res.status(400).json({ error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    console.log("called");
    const db = req.app.locals.db;
    const { email, password } = req.body;
    
    console.log(email);

    const user = await db.collection('user').findOne({ email: email });
    if (!user) {
      console.log("user not found");
      return res.status(401).json({ error: 'Invalid username or password' });
      
    }

    console.log("user found");
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("invalid password");
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    console.log(token);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.retrievePurchases = async (req, res) => {
  try {
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
    console.log(userId);
    const db = req.app.locals.db;
    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const purchases = user.purchases || [];
    if (purchases.length === 0) {
      return res.status(200).json([]);
    }

    const listings = await db.collection('listing').find({ _id: { $in: purchases.map(id => new ObjectId(id)) } }).toArray();

    const purchaseDetails = listings.map(listing => ({
      image: listing.images[0],
      name: listing.name,
      listingPrice: listing.listingPrice,
      purchaseStatus: listing.purchaseStatus
    }));

    console.log(purchaseDetails);

    res.status(200).json(purchaseDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {

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
    console.log(userId);
    const db = req.app.locals.db;
    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.updateUserProfile = async (req, res) => {
  const { username, description, tags, instagram, twitter, facebook } = req.body;

  try {
    // Find the user by their username or ID (assuming you use a token and extract the user ID)
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decodedToken.userId;
    const db = req.app.locals.db;

    // Prepare update object with only the fields that are provided in the request body
    const updateFields = {};
    if (username) updateFields.username = username;
    if (description) updateFields.description = description;
    if (tags) updateFields.tags = tags;
    if (instagram) updateFields.instagram = instagram;
    if (twitter) updateFields.twitter = twitter;
    if (facebook) updateFields.facebook = facebook;

    // Use findOneAndUpdate to update the user
    const updatedUser = await db.collection('user').findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Filter: find user by ID
      { $set: updateFields }, // Update: set the fields specified in updateFields
      { returnOriginal: false } // Options: return the updated document
    );


    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser.value });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};