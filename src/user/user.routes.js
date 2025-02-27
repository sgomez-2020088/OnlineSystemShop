import { Router } from 'express'
import { registerUser, editUser, deleteUser,editClient, deleteClient} from './user.controller.js'
import { validateJwt,isAdmin } from '../../middlewares/validate.jwt.js'
import { addUserAdminValidator, updateUserAdminValidator, updateClientValidator } from '../../helpers/validators.js'



const api = Router()

api.post('/add',[validateJwt,isAdmin, addUserAdminValidator],registerUser)
api.put('/update',[validateJwt, isAdmin, updateUserAdminValidator],editUser)
api.delete('/delete',[validateJwt],deleteUser)

api.put('/editClient',[validateJwt, updateClientValidator],editClient)


api.delete('/deleteClient', [validateJwt], deleteClient)

export default api


