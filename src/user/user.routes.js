import { Router } from 'express'
import { registerUser, editUser, deleteUser} from './user.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { addUserAdminValidator, updateUserAdminValidator } from '../../helpers/validators.js'



const api = Router()

api.post('/add',[validateJwt,addUserAdminValidator],registerUser)

api.put('/update',[validateJwt, updateUserAdminValidator],editUser)

api.delete('/delete',[validateJwt],deleteUser)

export default api


