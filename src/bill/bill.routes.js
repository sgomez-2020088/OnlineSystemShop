import { Router } from 'express'
import { generateBill, getUserBill, updateBill, getHistoryUser} from '../bill/bill.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { userBillValidator } from '../../helpers/validators.js'
import { billData, updateStock, UserBills,formatUserBill,userHistoryBill,formatHistoryBill } from '../../middlewares/lowCut.js'


const api = Router()

api.get('/bill',[ validateJwt,billData,updateStock], generateBill)

api.post('/client',[validateJwt, isAdmin, userBillValidator, UserBills, formatUserBill], getUserBill)

api.put('/update',[validateJwt, isAdmin],updateBill)

api.get('/history',[validateJwt, userHistoryBill, formatHistoryBill], getHistoryUser)






export default api
