const express = require('express');

const Router = express.Router();
const User = require('../../controllers/user');

// admission routes
Router.post('/user/create', User.createUser);
Router.get('/user/find/all', User.viewAllUsers);
Router.get('/user/find/:id', User.viewUserByID);
Router.delete('/user/delete/:id', User.deleteUserByID);
Router.put('/user/update/:id', User.updateUserByID);

module.exports = Router;
