const express = require ('express');
const { login_page, register_page } = require('../../controller/auth/index.controller');
const routes = express.Router();



// Route for login page
routes.post('/login', login_page)

// Route for registration page
routes.post("/register", register_page)

module.exports = routes;