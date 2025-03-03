import { Schema, model, Types } from 'mongoose'

const billSchema = Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    cart: {
        type: Types.ObjectId,
        ref: 'Cart',
        required: [true, 'Cart is required']
    },
    products: [
        {
            product: {
                type: Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product is required']
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is required'],
                min: 1
            },
            price: {
                type: Number,
                required: [true, 'Price is required']
            }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true })

billSchema.methods.toJSON = function () {
    const { __v, _id, ...bill } = this.toObject()
    return bill
}

export default model('Bill', billSchema)
