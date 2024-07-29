const express = require('express');
const mongoose = require('mongoose');
const UserModel = require("../../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');

app.use(express.json())
app.use(cors())
async function hashPass(password) {
  const res = await bcrypt.hash(password, 10);
  return res;
}
const login_page = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).send('User does not exist');
      }
  
      const validatePassword = await bcrypt.compare(password, user.password);
      if (!validatePassword) {
        return res.status(400).json({ msg: 'Invalid password' });
      }
  
      const token = jwt.sign(
        { user: { id: user._id, name: user.name } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
      );
  
      return res.json({ msg: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      return res.status(500).json({ msg: 'Server error' });
    }
  };



  
  const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
    
    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  };

const register_page =  async (req,res) => {
    const {name, email, password} = req.body;
  
    console.log(req.body);
  
    const name_body = req.body.name;
    const email_body = req.body.email;
    const password_body = req.body.password;
  
    if(!name || !password) {
      return res.status(400).json({msg: "Please enter all fields"});
    }
    const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
              return res.status(400).json({message:'Email is already used'});
          }
    
    const hashedPassword = await hashPass(password);
  
    const newUser = await UserModel.create({
      name: name_body,
      email: email_body,
      password: hashedPassword,
    });
    newUser.save()
  
    console.log(newUser);
  
    const data = {
      password: hashedPassword,
    };
    console.log(data);
  
    //const existingUser = User.findOne({email: email_body});
    return res.json("Registration successful");
  };

module.exports = {
    login_page,
    register_page,
    authenticateToken
}