'use strict'

import express from 'express' 
import morgan from 'morgan' 
import helmet from 'helmet' 
import cors from 'cors' 
import auth from '../src/auth/auth.routes.js'
import { limiter } from '../middlewares/rate.limit.js'
import categoryRoutes from '../src/category/category.routes.js'
import productRoutes from '../src/product/product.routes.js'
import userRoutes from '../src/user/user.routes.js'
import  {createDefaultAdmin} from '../configs/setUpData.js'

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app)=>{
    app.use(auth)
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/product', productRoutes)
    app.use('/v1/user', userRoutes)

}

export const initServer = async()=> {
    const app = express()

    try{
        await createDefaultAdmin()
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.log('Server init failed', err)
    }
    
}