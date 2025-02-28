import {Schema, model, Types} from 'mongoose'

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
    total:{
        type: Number,
    }
}, {timestamps: true})

billSchema.methods.toJSON = function (){
    const {__v, _id, ...bill } = this.toObject()
    return bill
}

export default model('Bill', billSchema)

