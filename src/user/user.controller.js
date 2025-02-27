'use strict'
import User from './user.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'

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
        const userId = req.body.id
        const data = req.body

        const userToEdit = await User.findById(userId)
        if (!userToEdit) return res.status(404).send({ message: 'User not found', success: false })

        
        if (userToEdit.role === 'ADMIN' && data.role === 'CLIENT') 
            return res.status(403).send({ message: 'Cannot downgrade an ADMIN to CLIENT', success: false })
        

        const updateUser = await User.findByIdAndUpdate(userId, data, { new: true })
        return res.send({ message: 'User updated successfully', user: updateUser, success: true })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.body.id

        const userToDelete = await User.findById(id)
        if (!userToDelete) return res.status(404).send({ message: 'User not found', success: false })

        if (userToDelete.role === 'ADMIN') return res.status(403).send({ message: 'Cannot delete an ADMIN', success: false })
        
        await User.findByIdAndUpdate(id, { status: false })
        return res.send({ message: 'User deleted successfully', success: true })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}

export const editClient = async (req, res) => {
    try {
        const userId = req.user.id
        const { oldPass, newPassword, ...data } = req.body

        const user = await User.findById(userId)
        if (!user) return res.status(404).send({ message: 'Client not found', success: false })

        if (newPassword) {
            if (!oldPass) return res.status(400).send({ message: 'Old password is required to change password', success: false })
            
            const isMatch = await checkPassword(user.password, oldPass)
            if (!isMatch) return res.status(400).send({ message: 'Incorrect password', success: false })

            user.password = await encrypt(newPassword)
        }

        Object.assign(user, data)

        await user.save()
        return res.send({ message: 'Client updated successfully',user, success: true })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}

export const deleteClient = async (req, res) =>{
    try {
        const { password } = req.body  
        const userId = req.user.id  

        const user = await User.findById(userId)
        if (!user) return res.status(404).send({ message: 'Client not found', success: false })

        if (!password) return res.status(400).send({ message: 'Password is required to delete account', success: false })

        const isMatch = await checkPassword(user.password, password)
        if (!isMatch) return res.status(400).send({ message: 'Incorrect password', success: false })

        const deletedUser = await User.findByIdAndUpdate(userId, { status: false }, { new: true })
        
        return res.send({ message: 'Account deleted successfully', success: true, user: deletedUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', success: false })
    }
}