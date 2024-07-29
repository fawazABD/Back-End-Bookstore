const express = require('express');
const routes =express.Router();
const Cart = require('../../models/Cart');
const {addCart,deleteCart,emptyCart} = require('../../controller/carts/carts.controller');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
  
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  };
routes.post('/cart/add', authenticateToken, addCart);
  
  
routes.delete('/cart/:productId', authenticateToken, deleteCart);
  
routes.delete('/cart/', authenticateToken, emptyCart);


module.exports = routes;