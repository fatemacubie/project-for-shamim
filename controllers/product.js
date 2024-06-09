const logger = require('../config/winston');
const Product = require('../models/product');
const { errorMessages, successMessages } = require('../config/messages');
// Controller function to handle the creation of a product
const addProduct = async (req, res) => {
    try {

        const productData = req.body;

        // Check if image is included in request
        if (!req.file) {
            console.log("Image file is required");
            return res.status(400).json({ error: "Image file is required" });
        }

        // Creating a new Product instance
        const newProduct = new Product({
            ...productData,
            image: req.file.path // Assuming multer middleware is used for file upload
        });

        // Validate against the model
        await newProduct.validate();

        // Saving the product to the database
        const savedProduct = await newProduct.save();

        // Sending a success response
        res.status(201).json({ success: successMessages.PRODUCT_ADDED, data: savedProduct });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Bad Request: Validation error
            const validationErrors = Object.keys(error.errors).map((key) => `'${key}'`);
            logger.error(`Validation errors: ${validationErrors.join(', ')} - required`);
            return res.status(400).json({ error: `Input errors: ${validationErrors.join(', ')} - required` });
        } else {
            // Internal Server Error: Database error
            logger.error(error.message);
            res.status(500).json({ error: errorMessages.DATABASE_ERROR });
        }
    }
};

/**
 * @description View all products.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const viewAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.status(200).json({ success: successMessages.DATA_RETRIEVED, data: allProducts });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: errorMessages.DATABASE_ERROR });
    }
};

/**
 * @description View product data by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const viewProductByID = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            logger.info(errorMessages.PRODUCT_NOT_FOUND);
            return res.status(404).json({ error: errorMessages.PRODUCT_NOT_FOUND });
        }

        res.status(200).json({ success: successMessages.DATA_RETRIEVED, data: product });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: errorMessages.DATABASE_ERROR });
    }
};

/**
 * @description Update product data by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateProductByID = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProductData = req.body;

        // Check if image is included in request
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: { ...updatedProductData, image: req.file.path, updatedAt: new Date() } },
            { new: true }
        );

        if (!updatedProduct) {
            logger.info(errorMessages.PRODUCT_NOT_FOUND);
            return res.status(404).json({ error: errorMessages.PRODUCT_NOT_FOUND });
        }

        res.status(200).json({ success: successMessages.UPDATE_SUCCESSFUL, data: updatedProduct });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: errorMessages.DATABASE_ERROR });
    }
};


/**
 * @description Delete product data by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteProductByID = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await Product.findByIdAndDelete(id);
        if (!existingProduct) {
            logger.info(errorMessages.PRODUCT_NOT_FOUND);
            return res.status(404).json({ error: errorMessages.PRODUCT_NOT_FOUND });
        }

        res.status(200).json({ success: successMessages.DELETE_SUCCESSFUL, data: existingProduct });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: errorMessages.DATABASE_ERROR });
    }
};

module.exports = {
    addProduct,
    viewAllProducts,
    viewProductByID,
    updateProductByID,
    deleteProductByID,
};
