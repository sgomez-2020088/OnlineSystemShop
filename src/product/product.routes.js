import { Router } from 'express'
import { 
    addProduct, 
    getAllProducts,
    getProductById, 
    updateProduct,
    deleteProduct, 
    getOutOfStock,
    productByName,
    productByCategory,
    getBestSell
} from '../product/product.controller.js'

import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { addProductValidator, updateProductValidator,productNameValidator, productCategoryValidator } from '../../helpers/validators.js'




const api = Router()

api.post('/add',[validateJwt,isAdmin, addProductValidator],addProduct)
api.get('/all',[validateJwt], getAllProducts)
api.get('/one',[validateJwt],getProductById)
api.put('/update',[validateJwt,isAdmin, updateProductValidator],updateProduct)
api.delete('/delete',[validateJwt, isAdmin],deleteProduct)

api.get('/stock',getOutOfStock)

api.get('/name',[validateJwt, productNameValidator], productByName) 
api.get('/category',[validateJwt, productCategoryValidator], productByCategory)
api.get('/sell',[validateJwt],getBestSell)
export default api



