import {Schema, model, Types} from 'mongoose'

const billSchema = Schema({
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
            price: {
                type: Number,
                required: [true, 'Price is required']
            }
        }
    ],
    total:{
        type: Number,
        required: [true, 'Total is required']
    }
})

billSchema.methods.toJSON = function (){
    const {__v, _id, ...bill } = this.toObject()
    return bill
}

export default model('Bill', billSchema)

