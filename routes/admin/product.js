const express = require('express');
const multer = require('multer'); // Import multer
const Product = require('../../controllers/product');

const Router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Define the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Define the filename
  }
});

const upload = multer({ storage: storage });

// Routes
Router.post('/product/create', upload.single('image'), Product.addProduct); // Handle file upload in this route handler
Router.get('/product/find/all', Product.viewAllProducts);
Router.get('/product/find/:id', Product.viewProductByID);
Router.delete('/product/delete/:id', Product.deleteProductByID);
Router.put('/product/update/:id', upload.single('image'), Product.updateProductByID); // Handle file upload in this route handler

module.exports = Router;
