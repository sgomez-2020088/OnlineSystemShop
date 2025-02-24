import { body } from 'express-validator' 
import { validateErrors} from './validate.errors.js'
import { exitEmailUser } from './db.validators.js'



export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('surname', 'Name cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty').notEmpty().isEmail().custom(exitEmailUser),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword().withMessage('Password must be strong').isLength({min:8}),
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    body('address', 'Address cannot be empty').notEmpty(),
    validateErrors       
]


export const loginValidator = [
    body('userData','Your information cannot be empty').notEmpty().toLowerCase(),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword().isLength({min:8}),
    validateErrors       
]

export const addCategoryValidator = [
    body('name', 'name cannot be empty').notEmpty(),
    body('description', 'Description cannot be empty').notEmpty(),
    validateErrors
]

export const updateCategoryValidator = [
    body('name', 'Name cannot be a blank').optional().notEmpty(),
    body('description', 'Description cannot be a blank').optional().notEmpty(),
    validateErrors
]

export const deleteCategoryValidator = [
    body('id','Id category is necesary').notEmpty(),
    validateErrors
]

export const addProductValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('description','Description cannot be empty').notEmpty(),
    body('price','Prace cannot be empty').notEmpty(),
    body('stock','Stock cannot be empty').notEmpty(),
    body('category','Category cannot be empty').notEmpty(),
    validateErrors
]

export const updateProductValidator = [
    body('id','You must need a valid product ID').notEmpty(),
    body('name', 'Name cannot be a blank').optional().notEmpty(),
    body('description','Description cannot be a blank').optional().notEmpty(),
    body('price','Prace cannot be a blank').optional().notEmpty(),
    body('stock','Stock cannot be a blank').optional().notEmpty(),
    body('category','Caegory cannot be a blank').optional().notEmpty(),
    validateErrors
]

export const addUserAdminValidator = [
    body('name','Name cannot be empty').notEmpty(),
    body('surname','cannot be empty').notEmpty(),
    body('email','Email cannot be emtpy').notEmpty(),
    body('email','Invalid email').isEmail().custom(exitEmailUser),
    body('password','Password cannot be empty').notEmpty(),
    body('password','Password must be strong').notEmpty().isStrongPassword().isLength({min:8}),
    body('phone','Phone cannot be empty').notEmpty().isMobilePhone().withMessage('invalid phone'),
    body('address','Address cannot be empty').notEmpty(),
    body('role', 'Role cannot be empty').notEmpty(),
    validateErrors
]

export const updateUserAdminValidator = [
    body('id','You must need a valid user ID').notEmpty(),
    body('name','Name cannot be a blank').optional().notEmpty(),
    body('surname','cannot be a blank').optional().notEmpty(),
    body('email','Email cannot be a blank').optional().notEmpty(),
    body('email','Invalid email').optional().isEmail().custom(exitEmailUser),
    body('password','Password cannot be a blank').optional().notEmpty(),
    body('password','Password must be strong').optional().notEmpty().isStrongPassword().isLength({min:8}),
    body('phone','Phone cannot be a blank').optional().notEmpty().isMobilePhone().withMessage('invalid phone'),
    body('address','Address cannot be a blank ').optional().notEmpty(),
    body('role', 'Role cannot be a blank ').optional().notEmpty(),
    validateErrors
]