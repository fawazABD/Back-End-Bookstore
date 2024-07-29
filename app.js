const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Initialize dotenv to load environment variable');
const Product = require('./models/Products');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const authRoutes = require("./routes/auth/index");
const cartRoutes = require('./routes/carts/carts.js');
const productRoutes = require('./routes/products/products.js');
const {authenticateToken} = require('./controller/auth/index.controller.js');
const cors = require('cors');



app.use(express.static('public'));
app.use(cors()); // Make the NodeJS use cors - middleware shit
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/product', productRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/dashboard', authenticateToken, (req, res) => {
  res.send('This is the dashboard');
});

app.post('/Orders/', authenticateToken, async (req, res) => {
  const { placedOn, customer, payments } = req.body;

  // Validate all fields
  if (!customer.name || !customer.number || !customer.email || !customer.address || !payments.method || !payments.totalPrice || !payments.status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newOrder = new Order({
      placedOn: Date.now(), // You are overwriting placedOn, no need to extract it from req.body
      customer,
      payments,
    });

    await newOrder.save();
    res.status(200).send({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err.message);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

const CONNECTION_URL = 'mongodb+srv://blogs:mongodb@cluster0.cjxtcqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(CONNECTION_URL)
.then(()=>{    
  console.log('MONGODB CONNECTION SUCCESFUL');
})
.catch((error)=>{
  console.log(error)
})
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
