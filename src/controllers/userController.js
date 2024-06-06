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
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    console.log(token);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};