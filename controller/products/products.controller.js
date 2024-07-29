const mongoose = require('mongoose');
const express = require('express');
const routes = express.Router();
const {authenticateToken} = require('../../controller/auth/index.controller.js');
const  Product = require('../../models/Products.js');
const jwt = require('jsonwebtoken');
const app = express();



const create_product = async (req, res) => {
    const { name, price, category, brand, image, description } = req.body;
  
    if (!name || !price || !category || !brand || !description || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Create a new product
      const newProduct = new Product({
        name,
        price,
        category,
        brand,
        description,
        image,
  
      });
      // Save the product to the database
      const savedProduct = await newProduct.save();
      
      return res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


const update_product =  async (req, res) => {
    try{
      const { Id } = req.params; // Extract productId from URL params
      const { name, description, price, category, brand, image, ratings } = req.body;
      
       const updatedProduct = await Product.findByIdAndUpdate(
        Id,
        { name, description, price, category, brand, image, ratings },
        { new: true }
      );
   if (!updatedProduct) {
    return res.status(404).send.json({ message: "product not found" });
   }
   return res.status(200).json({ message: updatedProduct});
  
    }catch(err) {
      res.status(400).json({ error: err.message });
    }
  };

  const delete_product= async (req, res) => {
    const {Id} = req.params; // Correctly destructuring the id
    console.log(Id);

    try {
        const productDeleted = await Product.findOneAndDelete(Id);
        if (!productDeleted) {
            return res.status(404).send({ msg: 'Product not found' });
        }
        console.log(productDeleted);
        res.send({ msg: 'Product Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Server error' });
    }
};

module.exports = {
    create_product,
    update_product,
    delete_product
} 
  