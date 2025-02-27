import {Schema, model, Types} from 'mongoose'

const cartSchema = Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',    
        required: [true, 'User is required']
    },
    produts:[
        {
            product: {
                type: Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product is required']
            },
            quantity: {
                type: Number,
                default: 1
            },
            totalCart:{
                type: Number,
            }
        }
    ]
})

cartSchema.methods.toJSON = function (){
    const {__v, _id, ...cart } = this.toObject()
    return cart
}

export default model('Cart', cartSchema)

