import { Router } from 'express'
import { addCart } from '../cart/cart.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { addCartValidator } from '../../helpers/validators.js'
import { verifyStock } from '../../middlewares/lowCut.js'

const api = Router()


api.post('/add', [validateJwt,verifyStock, addCartValidator], addCart) 

export default api
