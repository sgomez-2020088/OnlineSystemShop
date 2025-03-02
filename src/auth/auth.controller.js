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
        let { userData, password } = req.body

        let user = await User.findOne({
            
            $or: [
                { email: userData },
                { username: userData }
            ]
        })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        let passwordMatch = await checkPassword(user.password, password)

        if (passwordMatch) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                role: user.role
            }

            let token = await generateJwt(loggedUser)
            return res.send({ success: true, message: `Welcome again ${user.name}`, loggedUser, token })
        }

        return res.status(400).send({ message: 'Wrong password' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'General error'})
    }
};
