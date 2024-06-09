const logger = require('../config/winston');
const User = require('../models/user');
const Product = require('../models/product');
const CartSubmission = require('../models/order');

const { errorMessages, successMessages } = require('../config/messages');

async function addToCart(req, res) {
    const { userId, productId, quantity } = req.body;

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }

        // Add product to cart
        const cartItem = { 
            product: productId, 
            quantity: quantity,
            totalPrice: quantity * product.price, // Calculate total price
            name: product.name, // Store product name
            description: product.description // Store product description
        };
        user.cart.push(cartItem);
        await user.save();

        res.status(200).json({ success: 'Product added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function removeFromCart(req, res) {
    const { userId, productId } = req.params;

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Remove product from cart
        user.cart = user.cart.filter(item => {
            return item.product.toString() !== productId;
        });
        await user.save();

        res.status(200).json({ success: 'Product removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function viewCart(req, res) {
    const { userId } = req.params;

    try {
        // Check if user exists
        const user = await User.findById(userId).populate('cart.product');
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        res.status(200).json(user.cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function submitCart(req, res) {
    const { userId } = req.params;

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Populate cart items with full product details
        const populatedUser = await User.findById(userId).populate('cart.product');
        if (!populatedUser) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Calculate total amount
        let totalAmount = 0;
        for (const item of populatedUser.cart) {
            totalAmount += item.product.price * item.quantity;
        }

        // Create an array to store cart items with full details
        const cartItems = populatedUser.cart.map(item => {
            return {
                product: item.product._id,
                quantity: item.quantity,
                totalPrice: item.quantity * item.product.price, // Calculate total price
                name: item.product.name,
                description: item.product.description,
                size: item.product.size // Include size
            };
        });

        // Store cart submission with populated cart items including product details
        const submission = new CartSubmission({
            userId: populatedUser._id,
            cartItems: cartItems,
            totalAmount: totalAmount // Assign totalAmount
        });
        await submission.save();

        // Clear user's cart after submission
        user.cart = [];
        await user.save();

        res.status(200).json({ success: 'Cart submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    addToCart,
    removeFromCart,
    viewCart,
    submitCart,
};
