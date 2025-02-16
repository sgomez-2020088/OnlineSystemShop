import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const registerUser = async (req, res) => {
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        user.role = 'CLIENT'
        await user.save()
        return res.send({ message: `User registered successfully, can log in with email: ${user.email}`, success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error registering user', err, success:false })
    }
}


export const login = async (req, res) => {
    try {
        let { email, password } = req.body


        let users = await User.findOne({
             email,
             status: {$ne: false} 
            }) 
        
        if (users && await checkPassword(users.password, password)) {
            let loggedUsers = {
                uid: users._id,
                name: users.name,
                username: users.email,
                role: users.role
            }

            let token = await generateJwt(loggedUsers)
            return res.send({
                message: `Welcome ${users.name}`,
                loggedUsers,
                token
            })
        }

        return res.status(400).send({ message: `Wrong email or password`, success: false })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error with login function', success: false })
    }
}
