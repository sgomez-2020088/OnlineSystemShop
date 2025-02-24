import {Schema, model, Types} from 'mongoose'

const userSchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        maxLength: [40, `Can't be overcome 40 characters`]
    },
    surname:{
        type: String,
        required: [true, 'Surname is required'],
        maxLength: [40, `Can't be overcome 40 characters`]
    },
    username:{
        type: String,
        required: [true, 'Username is required'],
        maxLength: [30,'Cannot be ovecome 30 characters']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be 8 characters'],
        maxLength: [100, `Can't be overcome 100 characters`],
    },
    role:{
        type: String,
        required: [true, 'Role is required'],
        uppercase: true, 
        enum: ['ADMIN', 'CLIENT']
    },
    phone:{
        type: String,
        required: [true, 'Phone is required'],
        maxLength: [13, `Can't be overcame 13 numers`],
        minLength: [8, `Phone must be 8 characters`]
    },
    address:{
        type: String,
        required: [true, 'address is required'],
        maxLength: [50, `Can't be overcome 50 characters`],
    },
    status:{
        type: Boolean,
        required: [true, 'Status is required'],
        default: true
    }
})

userSchema.methods.toJSON = function (){
    const {__v, password, _id, ...user } = this.toObject()
    return user
}

export default model('User', userSchema)