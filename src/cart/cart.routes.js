import { Router } from 'express'
import { addCart, updateCart} from '../cart/cart.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { addCartValidator } from '../../helpers/validators.js'
import { verifyStock } from '../../middlewares/lowCut.js'

const api = Router()


api.post('/add', [validateJwt,verifyStock, addCartValidator], addCart) 
api.put('/update', [validateJwt], updateCart)
export default api
