import { Router } from 'express'
import { getCart, addCart} from '../cart/cart.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { checkStock } from '../../middlewares/stock.js'

const api = Router()


api.post('/add', [validateJwt, checkStock], addCart) 
api.get('/get', [validateJwt], getCart)
export default api
