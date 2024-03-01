const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const router = express.Router();
const ejs = require('ejs');
const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const port = 3000;
const igdbClientId = process.env.IGDB_CLIENT_ID;
const igdbSecretKey = process.env.IGDB_SECRET_KEY;


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure express-session middleware
app.use(session({
  secret: 'webfavorite',
  resave: true,
  saveUninitialized: true
}));


const transporter = nodemailer.createTransport({
  service: 'yandex',
  auth: {
    user: process.env.YANDEX_EMAIL,
    pass: process.env.YANDEX_PASSWORD
  }
});


// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Adjust file size limit as needed




app.set('view engine', 'ejs');
app.use(express.static('public'));

// Route for rendering the page3.ejs
app.get('/page3', async (req, res) => {
  try {
    // Replace 'YOUR_API_KEY' with your actual NASA API key
    const apiKey = 'qiEOng6N7cacoRkZeJhnNUJnbCWmbI3o703rJuOM';
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    // Fetch data from the NASA API
    const response = await axios.get(apiUrl);
    const nasaData = response.data;

    // Render the page3.ejs template and pass the NASA data to it
    res.render('page3', { nasaData });
  } catch (error) {
    console.error('Error fetching NASA data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth_demo');

// Function to format timestamp to a readable date
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// Make the formatDate function available to EJS templates
app.locals.formatDate = formatDate;


// Define PortfolioItem schema
const portfolioItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  localizationTitles: [String],
  localizationDescriptions: [String],
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
});

// Define PortfolioItem model
const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);



// Define User schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    age: Number,
    country: String,
    gender: String,
    role: { type: String, enum: ['standard', 'administrator'] },
    creationDate: { type: Date, default: Date.now }
  });
  
  // Define User model
  const User = mongoose.model('User', userSchema);
  // Insert an administrator user
const initializeAdminUser = async () => {
    const existingUser = await User.findOne({ username: 'Ilya' });
  
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('webfinal', 10);
  
      const adminUser = new User({
        username: "Ilya",
        password: hashedPassword,
        firstName: "Ilya",
        lastName: "Administrator",
        age: 99,
        country: "Kazakhstan",
        gender: "Male",
        role: "administrator"
      });
  
      await adminUser.save();
      console.log('Administrator user created.');
    } else {
      console.log('Administrator user already exists.');
    }
  };
  
  initializeAdminUser();

  
// Middleware to check if the user is an administrator
const isAdmin = async (req, res, next) => {
    try {
      if (req.session && req.session.userId) {
        const user = await User.findById(req.session.userId).exec();
  
        if (!user || user.role !== 'administrator') {
          res.redirect('/');
        } else {
          next();
        }
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
};

app.get('/page1', (req, res) => {
  res.render('page1');
});



app.get('/page2', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://numbersapi.p.rapidapi.com/random/trivia',
      params: {
        min: '10',
        max: '20',
        fragment: 'true',
        json: 'true'
      },
      headers: {
        'X-RapidAPI-Key': 'edde1bb4e9msh83ab54b38844c8dp18569ejsn2294e3b6f4b6',
        'X-RapidAPI-Host': 'numbersapi.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const randomFact = response.data;

    // Render the page2.ejs template and pass the random fact data
    res.render('page2', { randomFact });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Route for rendering the page4.ejs
app.get('/page4', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://bybit4.p.rapidapi.com/derivatives/v3/public/order-book/L2',
      params: {
        category: 'linear',
        symbol: 'BTCUSDT'
      },
      headers: {
        'X-RapidAPI-Key': 'edde1bb4e9msh83ab54b38844c8dp18569ejsn2294e3b6f4b6',
        'X-RapidAPI-Host': 'bybit4.p.rapidapi.com'
      }
    };



    app.get('/page5', (req, res) => {
      res.render('page5');
    });

    const response = await axios.request(options);
    const orderBookData = response.data;

    // Render the page4.ejs template and pass the order book data to it
    res.render('page4', { orderBookData });
  } catch (error) {
    console.error('Error fetching order book data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


// Login Page
app.get('/login', (req, res) => {
  res.render('login', { loginError: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ username });

  // Compare passwords
  if (!user) {
    res.render('login', { loginError: 'Account does not exist. You can register below.' });
  } else if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;

    if (user.role === 'administrator') {
      res.redirect('/admin'); // Redirect to the admin page for administrators
    } else {
      res.redirect('/');
    }
  } else {
    res.render('login', { loginError: 'Incorrect password. Please try again.' });
  }
});


// Registration Page
app.get('/register', (req, res) => {
  res.render('register', { registrationError: null });
});

app.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, age, country, gender } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user to the database
  const user = new User({
    username,
    password: hashedPassword,
    firstName,
    lastName,
    age,
    country,
    gender,
    role: 'standard'
  });

  try {
    await user.save();

    // Send a welcome email to the user
    const mailOptions = {
      from: process.env.YANDEX_EMAIL,
      to: username, // Use the email specified during registration
      subject: 'Welcome to Your App',
      text: 'Thank you for registering with Your App. We are excited to have you on board!'
    };

    await transporter.sendMail(mailOptions);

    res.render('login', { registrationSuccess: 'Account created successfully. You can now log in.' });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (username already exists)
      res.render('register', { registrationError: 'Username already exists. Please choose a different username.' });
    } else {
      res.render('register', { registrationError: 'Error during registration. Please try again.' });
    }
  }
});

// Home Page
app.get('/', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId); // Retrieve user information
    const portfolioItems = await PortfolioItem.find();

    // Extract all images from portfolioItems
    const allImages = portfolioItems.flatMap(item => item.images);

    res.render('home', { user, allImages, portfolioItems }); // Pass 'user' and 'allImages' to the template
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
});

// Admin Page
app.get('/admin', isAdmin, async (req, res) => {
  try {
    const portfolioItems = await PortfolioItem.find();

    // Send a notification to the administrator
    const adminMailOptions = {
      from: process.env.YANDEX_EMAIL,
      to: 'uzer8440@gmail.com', // Replace with the actual administrator's email
      subject: 'Admin Login Notification',
      text: 'Someone has entered the administrator\'s page.'
    };

    await transporter.sendMail(adminMailOptions);

    res.render('admin', { portfolioItems });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
// Add Portfolio Item
app.post('/addPortfolioItem', isAdmin, upload.array('images', 5), async (req, res) => {
  const { name, description, localizationTitles, localizationDescriptions } = req.body;

  // Check if images were included in the upload
  const images = req.files ? req.files.map(file => (file.buffer ? file.buffer.toString('base64') : '')) : [];

  // Create a new PortfolioItem instance and populate it with the received data
  const portfolioItem = new PortfolioItem({
    name,
    description,
    images: images.filter(image => image !== ''), // Filter out empty strings
    localizationTitles: localizationTitles ? localizationTitles.split(',').map(title => title.trim()) : [],
    localizationDescriptions: localizationDescriptions ? localizationDescriptions.split(',').map(desc => desc.trim()) : []
  });

  try {
    // Save the portfolioItem to the database
    await portfolioItem.save();
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Edit Portfolio Item
app.post('/editPortfolioItem/:id', isAdmin, upload.array('newImages', 5), async (req, res) => {
  const { name, description } = req.body;
  const itemId = req.params.id;

  try {
    const portfolioItem = await PortfolioItem.findById(itemId);
    if (!portfolioItem) {
      res.status(404).send('Portfolio Item not found');
      return;
    }

    // Check if newImages were included in the update
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => (file.buffer ? file.buffer.toString('base64') : ''));
      portfolioItem.images = newImages.filter(image => image !== ''); // Filter out empty strings
    }

    // Update other fields
    portfolioItem.name = name;
    portfolioItem.description = description;
    portfolioItem.timestamps.updatedAt = Date.now();

    await portfolioItem.save();
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete Portfolio Item
app.post('/deletePortfolioItem/:id', isAdmin, async (req, res) => {
  const itemId = req.params.id;

  try {
    await PortfolioItem.findByIdAndDelete(itemId);
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
