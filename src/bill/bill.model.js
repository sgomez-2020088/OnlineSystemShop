import { Schema, model, Types } from 'mongoose'

const billSchema = Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',    
    },
    cart: {
        type: Types.ObjectId,
        ref: 'Cart',    
        required: [true, 'Cart is required']
    },
    products: [  
        {
            product: {
                _id: Types.ObjectId, 
                name: String, 
                price: Number, 
                description: String 
            },
            quantity: Number,
            totalCart: Number
        }
    ],
    total: {
        type: Number,
    }
}, { timestamps: true })

billSchema.methods.toJSON = function () {
    const { __v, _id, ...bill } = this.toObject()
    return bill
}

export default model('Bill', billSchema)
