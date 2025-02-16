import { Router } from 'express'
import { addProduct, getAllProducts,getProductById, updateProduct,deleteProduct, getOutOfStock} from '../product/product.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { addProductValidator, updateProductValidator } from '../../helpers/validators.js'




const api = Router()

api.post('/add',[validateJwt,isAdmin, addProductValidator],addProduct)
api.get('/all',[validateJwt], getAllProducts)
api.get('/one',[validateJwt],getProductById)
api.put('/update',[validateJwt,isAdmin, updateProductValidator],updateProduct)
api.delete('/delete',[validateJwt],deleteProduct)

api.get('/stock',getOutOfStock)

export default api



