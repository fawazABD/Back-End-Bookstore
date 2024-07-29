const mongoose = require('mongoose');
const express = require('express');
const routes = express.Router();
const {authenticateToken} = require('../../controller/auth/index.controller.js');
const  Product = require('../../models/Products.js');
const jwt = require('jsonwebtoken');
const app = express();
const { create_product, update_product, delete_product } = require('../../controller/products/products.controller.js');





routes.post('/created-products', authenticateToken, create_product)
routes.put('/products/:Id', authenticateToken, update_product)

routes.delete('/delete-product/:id', authenticateToken, delete_product)

module.exports = routes;
  