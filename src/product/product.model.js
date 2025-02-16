import {Schema, model, Types} from 'mongoose'
import Category from '../category/category.model.js'

const productSchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        maxLength: [40, `Can't be overcome 40 characters`]
    },
    description:{
        type: String,
        required: [true, 'Description is required'],
        maxLength: [70, `Can't be overcome 70 characters`]
    },
    price:{
        type: Number,
        required: [true, 'Price is required']
    },
    stock:{
        type: Number,
        required: [true, 'Stock is required']
    },
    category:{
        type: Types.ObjectId,
        ref: Category,
        required: [true, 'Category is required']
    },
    status:{
        type: Boolean,
        required: [true, 'Status is required'],
        default: true
    }
})

productSchema.methods.toJSON = function (){
    const {__v, _id, ...product } = this.toObject()
    return product
}

export default model('Product', productSchema)