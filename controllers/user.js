const logger = require('../config/winston');
const User = require('../models/user');
const { errorMessages, successMessages } = require('../config/messages');


async function createUser(req, res) {
    const { username, email, password, role } = req.body;

    try {
        // Check if user with same username or email exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Create a new user
        const newUser = new User({ username, email, password, role });
        await newUser.save();

        res.status(201).json({ success: 'User created successfully', data: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { createUser };


/**
 * @description View all users.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const viewAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({ success: successMessages.DATA_RETRIEVED, data: allUsers });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: errorMessages.DATABASE_ERROR });
    }
};

/**
 * @description View user data by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const viewUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            logger.info(errorMessages.USER_NOT_FOUND);
            return res.status(404).json({ error: errorMessages.USER_NOT_FOUND });
        }

        res.status(200).json({ success: successMessages.DATA_RETRIEVED, data: user });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: errorMessages.DATABASE_ERROR });
    }
};

/**
 * @description Update user data by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUserData = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: { ...updatedUserData, updatedAt: new Date() } },
            { new: true }
        );

        if (!updatedUser) {
            logger.info(errorMessages.USER_NOT_FOUND);
            return res.status(404).json({ error: errorMessages.USER_NOT_FOUND });
        }

        res.status(200).json({ success: successMessages.UPDATE_SUCCESSFUL, data: updatedUser });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: errorMessages.DATABASE_ERROR });
    }
};

/**
 * @description Delete user data by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteUserByID = async (req, res) => {
    try {
        const { id } = req.params;

        const existingUser = await User.findByIdAndDelete(id);
        if (!existingUser) {
            logger.info(errorMessages.USER_NOT_FOUND);
            return res.status(404).json({ error: errorMessages.USER_NOT_FOUND });
        }

        res.status(200).json({ success: successMessages.DELETE_SUCCESSFUL, data: existingUser });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: errorMessages.DATABASE_ERROR });
    }
};

module.exports = {
    createUser,
    viewAllUsers,
    viewUserByID,
    updateUserByID,
    deleteUserByID,
};
