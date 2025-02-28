import { Router } from 'express'
import { generateBill, getUserBills } from '../bill/bill.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'

const api = Router()

// Confirmar compra y generar factura
api.get('/bill',[ validateJwt], generateBill)

api.post('/client',[validateJwt, isAdmin],getUserBills)


export default api
