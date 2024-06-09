const express = require('express');

const Router = express.Router();

// can access following routes
Router.use(require('./product'));
Router.use(require('./cart'));
Router.use(require('./user'));


module.exports = Router;
