const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    totalPrice: Number,
    name: String,
    description: String,
    size: String // Size field added
});

const cartSubmissionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    cartItems: [cartItemSchema], // Embedded cart item schema
    submissionDate: { type: Date, default: Date.now },
    totalAmount: Number
});

// Populate the cartItems field with full product details
cartSubmissionSchema.virtual('populatedCartItems', {
    ref: 'Product',
    localField: 'cartItems.product',
    foreignField: '_id',
    justOne: false,
});

const CartSubmission = mongoose.model('CartSubmission', cartSubmissionSchema);

module.exports = CartSubmission;
