const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart');

// Cart routes
router.post('/cart/add', cartController.addToCart);
router.post('/cart/remove/:userId/:productId', cartController.removeFromCart);
router.get('/cart/view/:userId', cartController.viewCart);
router.post('/cart/submit/:userId', cartController.submitCart);

module.exports = router;
