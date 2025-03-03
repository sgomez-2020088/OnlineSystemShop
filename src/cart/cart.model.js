import { Schema, model, Types } from 'mongoose'

const cartSchema = Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: 'User',
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
                    required: [true, 'quantity is required'], 
                },
                price: {
                    type: Number,
                    required: [true, 'Price is required']
                }
            }
        ],
        total: {
            type: Number,
            default: 0
        }
    }
)

cartSchema.methods.toJSON = function () {
    const { __v, _id, ...cart } = this.toObject()
    return cart
}

export default model('Cart', cartSchema);
