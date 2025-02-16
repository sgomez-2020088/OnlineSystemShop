import {Schema, model, Types} from 'mongoose'

const categorySchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        maxLength: [40, `Can't be overcome 40 characters`]
    },
    description:{
        type: String,
        required: [true, 'Description is required'],
        maxLength: [70, `Can't be overcome 70 characters`]
    }
})

categorySchema.methods.toJSON = function (){
    const {__v, _id, ...category } = this.toObject()
    return category
}

export default model('Category', categorySchema)

