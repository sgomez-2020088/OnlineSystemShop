import { Router } from 'express'
import { generateBill, getUserBills, updateBill } from '../bill/bill.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { userBillValidator } from '../../helpers/validators.js'

const api = Router()

api.get('/bill',[ validateJwt], generateBill)

api.post('/client',[validateJwt, isAdmin, userBillValidator],getUserBills)

api.put('/update', [validateJwt], updateBill)


export default api
