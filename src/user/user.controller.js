'use strict'
import User from './user.model.js'
import { encrypt } from '../../utils/encrypt.js'

export const registerUser = async (req, res) => {
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        await user.save()
        return res.send({ message: `User registered successfully, can log in with email: ${user.email}`, success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error registering user', err, success:false })
    }
}

export const editUser = async (req, res) => {
    try {
        const userId =req.body.id
        const data = req.body
        const updateUser = await User.findByIdAndUpdate(userId, data, {new: true})
        if(!updateUser) return res.status(404).send({message: 'User not found', success: false})
            return res.send({message: ' User updated succesfully ', user: updateUser, success: true})
        
    } catch (err) {
        console.error (err)
        return res.status(500).send({message: 'General error', success: false})
    }
}

export const deleteUser = async ( req, res ) => {
    try {
        const id = req.body.id
    
        const deletedUser = await User.findByIdAndUpdate(id, {status: false})
        if(!deletedUser) return res.status(404).send({message: ' User not found', success: false})
            

        return res.send({message: 'User deleted successfully', success: true})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error', success: false})
    }
}

