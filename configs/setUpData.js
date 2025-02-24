import User from '../src/user/user.model.js'
import { encrypt } from '../utils/encrypt.js'


export const createDefaultAdmin = async () => {
    try {
        const adminEmail = "admin@default.com"
        const existingAdmin = await User.findOne({ email: adminEmail })

        if (!existingAdmin) {
            const hashedPassword = await encrypt("Parmas./25")
            const adminUser = new User({
                name: "Admin",
                surname: "Default",
                username: "admin",
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN",
                phone: "123456789",
                address: "Admin address",
                status: true
            })

            await adminUser.save()
        }
    } catch (err) {
        console.error(err)
    }
}
