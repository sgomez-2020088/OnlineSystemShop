import { Router } from 'express'
import { addCategory,getAll, updateCategory,deleteCategory } from './category.controller.js'
import { addCategoryValidator, updateCategoryValidator} from '../../helpers/validators.js'
import { isAdmin,validateJwt } from '../../middlewares/validate.jwt.js'


const api = Router()

api.post('/add',
    [
        validateJwt,
        isAdmin,
        addCategoryValidator
    ]
    ,addCategory)

api.get('/all',[validateJwt],getAll)
api.put('/update',
    [
        validateJwt,
        isAdmin,
        updateCategoryValidator
    ],
    updateCategory)

api.delete('/delete',
    [
        validateJwt,
        isAdmin
    ],
    deleteCategory)

export default api


