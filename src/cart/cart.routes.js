import { Router } from 'express'
import { getCart, addCart} from '../cart/cart.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { checkStock } from '../../middlewares/stock.js'
import { addCartValidator } from '../../helpers/validators.js'

const api = Router()


api.post('/add', [validateJwt, checkStock, addCartValidator], addCart) 
api.get('/get', [validateJwt], getCart)
export default api
